/**
 * Sync Manager
 * Processes sync queue and pushes data to ClickUp
 */

const ClickUpPushService = require('./clickup.push.service');
const logger = require('../core/utils/logger');

class SyncManager {
    constructor(db, apiToken) {
        this.db = db;
        this.clickupService = new ClickUpPushService(apiToken);
        this.isProcessing = false;
        this.batchSize = 10; // Process 10 items at a time
    }

    /**
     * Process pending items in the sync queue
     */
    async processSyncQueue() {
        if (this.isProcessing) {
            logger.info('Sync already in progress, skipping...');
            return;
        }

        this.isProcessing = true;
        const startTime = Date.now();

        try {
            logger.info('Starting sync queue processing...');

            // Get pending items ordered by priority
            const pendingItems = await this.db.query(`
                SELECT * FROM sync_queue
                WHERE status = 'pending'
                AND retry_count < max_retries
                ORDER BY priority ASC, scheduled_at ASC
                LIMIT ?
            `, [this.batchSize]);

            if (pendingItems.length === 0) {
                logger.info('No pending items in sync queue');
                this.isProcessing = false;
                return;
            }

            logger.info(`Processing ${pendingItems.length} items from sync queue`);

            // Process each item
            for (const item of pendingItems) {
                try {
                    await this.processQueueItem(item);
                } catch (error) {
                    logger.error('Error processing queue item:', {
                        item_id: item.id,
                        error: error.message
                    });
                    await this.handleItemError(item, error);
                }
            }

            const duration = Date.now() - startTime;
            logger.info(`Sync queue processing completed in ${duration}ms`);

        } catch (error) {
            logger.error('Error in sync queue processing:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Process a single queue item
     */
    async processQueueItem(item) {
        logger.info(`Processing ${item.operation_type} ${item.entity_type} #${item.entity_id}`);

        // Update status to processing
        await this.db.query(
            'UPDATE sync_queue SET status = "processing", started_at = NOW() WHERE id = ?',
            [item.id]
        );

        let result;

        switch (item.entity_type) {
            case 'program_module':
                result = await this.syncProgramModule(item);
                break;
            case 'sub_program':
                result = await this.syncSubProgram(item);
                break;
            case 'project_component':
                result = await this.syncProjectComponent(item);
                break;
            case 'activity':
                result = await this.syncActivity(item);
                break;
            case 'sub_activity':
                result = await this.syncSubActivity(item);
                break;
            case 'checklist_item':
                result = await this.syncChecklistItem(item);
                break;
            case 'goal':
                result = await this.syncGoal(item);
                break;
            case 'indicator':
                result = await this.syncIndicator(item);
                break;
            case 'comment':
                result = await this.syncComment(item);
                break;
            case 'time_entry':
                result = await this.syncTimeEntry(item);
                break;
            default:
                throw new Error(`Unknown entity type: ${item.entity_type}`);
        }

        // Mark as completed
        await this.db.query(`
            UPDATE sync_queue
            SET status = 'completed',
                completed_at = NOW(),
                clickup_response = ?,
                clickup_entity_id = ?
            WHERE id = ?
        `, [
            JSON.stringify(result),
            result.id || result.clickup_id || null,
            item.id
        ]);

        // Log successful sync
        await this.logSync(item, 'success', result);

        return result;
    }

    /**
     * Sync Program Module (Space)
     */
    async syncProgramModule(item) {
        const [module] = await this.db.query(
            'SELECT * FROM program_modules WHERE id = ?',
            [item.entity_id]
        );

        if (!module) {
            throw new Error('Program module not found');
        }

        const [org] = await this.db.query(
            'SELECT clickup_team_id FROM organizations WHERE id = ?',
            [module.organization_id]
        );

        if (!org || !org.clickup_team_id) {
            throw new Error('Organization not configured with ClickUp team ID');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createSpace(org.clickup_team_id, {
                name: module.name,
                color: module.color,
                description: module.description
            });

            // Update local record with ClickUp ID
            await this.db.query(
                'UPDATE program_modules SET clickup_space_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateSpace(module.clickup_space_id, {
                name: module.name,
                color: module.color
            });

            await this.db.query(
                'UPDATE program_modules SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );

        } else if (item.operation_type === 'delete') {
            result = await this.clickupService.deleteEntity('space', module.clickup_space_id);
        }

        return result;
    }

    /**
     * Sync Sub-Program (Folder)
     */
    async syncSubProgram(item) {
        const [subProgram] = await this.db.query(
            'SELECT sp.*, pm.clickup_space_id FROM sub_programs sp INNER JOIN program_modules pm ON sp.module_id = pm.id WHERE sp.id = ?',
            [item.entity_id]
        );

        if (!subProgram) {
            throw new Error('Sub-program not found');
        }

        if (!subProgram.clickup_space_id) {
            throw new Error('Parent program module not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createFolder(subProgram.clickup_space_id, {
                name: subProgram.name,
                description: subProgram.description
            });

            await this.db.query(
                'UPDATE sub_programs SET clickup_folder_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateFolder(subProgram.clickup_folder_id, {
                name: subProgram.name
            });

            await this.db.query(
                'UPDATE sub_programs SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );

        } else if (item.operation_type === 'delete') {
            result = await this.clickupService.deleteEntity('folder', subProgram.clickup_folder_id);
        }

        return result;
    }

    /**
     * Sync Project Component (List)
     */
    async syncProjectComponent(item) {
        const [component] = await this.db.query(`
            SELECT pc.*, sp.clickup_folder_id, sp.clickup_space_id
            FROM project_components pc
            INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
            WHERE pc.id = ?
        `, [item.entity_id]);

        if (!component) {
            throw new Error('Project component not found');
        }

        // Determine parent (folder or space)
        const parentId = component.clickup_folder_id || component.clickup_space_id;
        const isFolder = !!component.clickup_folder_id;

        if (!parentId) {
            throw new Error('Parent sub-program not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createList(parentId, {
                name: component.name,
                description: component.description,
                status: component.status
            }, isFolder);

            await this.db.query(
                'UPDATE project_components SET clickup_list_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateList(component.clickup_list_id, {
                name: component.name,
                description: component.description
            });

            await this.db.query(
                'UPDATE project_components SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );

        } else if (item.operation_type === 'delete') {
            result = await this.clickupService.deleteEntity('list', component.clickup_list_id);
        }

        return result;
    }

    /**
     * Sync Activity (Task)
     */
    async syncActivity(item) {
        const [activity] = await this.db.query(`
            SELECT a.*, pc.clickup_list_id
            FROM activities a
            INNER JOIN project_components pc ON a.component_id = pc.id
            WHERE a.id = ?
        `, [item.entity_id]);

        if (!activity) {
            throw new Error('Activity not found');
        }

        if (!activity.clickup_list_id) {
            throw new Error('Parent project component not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createTask(activity.clickup_list_id, {
                name: activity.name,
                description: activity.description,
                start_date: activity.start_date,
                end_date: activity.end_date,
                priority: activity.priority,
                clickup_status: this.mapActivityStatus(activity.status, activity.approval_status)
            });

            await this.db.query(
                'UPDATE activities SET clickup_task_id = ?, clickup_url = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, result.url, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateTask(activity.clickup_task_id, {
                name: activity.name,
                description: activity.description,
                start_date: activity.start_date,
                end_date: activity.end_date,
                priority: activity.priority,
                clickup_status: this.mapActivityStatus(activity.status, activity.approval_status)
            });

            await this.db.query(
                'UPDATE activities SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );

        } else if (item.operation_type === 'delete') {
            result = await this.clickupService.deleteEntity('task', activity.clickup_task_id);
        }

        return result;
    }

    /**
     * Sync Sub-Activity (Subtask)
     */
    async syncSubActivity(item) {
        const [subActivity] = await this.db.query(`
            SELECT sa.*, a.clickup_task_id
            FROM sub_activities sa
            INNER JOIN activities a ON sa.parent_activity_id = a.id
            WHERE sa.id = ?
        `, [item.entity_id]);

        if (!subActivity) {
            throw new Error('Sub-activity not found');
        }

        if (!subActivity.clickup_task_id) {
            throw new Error('Parent activity not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createSubtask(subActivity.clickup_task_id, {
                name: subActivity.name,
                description: subActivity.description,
                status: subActivity.status,
                due_date: subActivity.due_date
            });

            await this.db.query(
                'UPDATE sub_activities SET clickup_subtask_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateTask(subActivity.clickup_subtask_id, {
                name: subActivity.name,
                description: subActivity.description,
                clickup_status: subActivity.status === 'completed' ? 'complete' : 'to do'
            });

            await this.db.query(
                'UPDATE sub_activities SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );

        } else if (item.operation_type === 'delete') {
            result = await this.clickupService.deleteEntity('task', subActivity.clickup_subtask_id);
        }

        return result;
    }

    /**
     * Sync Checklist Item
     */
    async syncChecklistItem(item) {
        const payload = JSON.parse(item.payload);
        const { activity_id, checklist_id, items } = payload;

        const [activity] = await this.db.query(
            'SELECT clickup_task_id FROM activities WHERE id = ?',
            [activity_id]
        );

        if (!activity || !activity.clickup_task_id) {
            throw new Error('Parent activity not synced to ClickUp');
        }

        let result;

        if (!checklist_id) {
            // Create new checklist
            result = await this.clickupService.createChecklist(
                activity.clickup_task_id,
                'Activity Checklist'
            );

            // Add items
            for (const item_data of items) {
                await this.clickupService.addChecklistItem(result.checklist.id, {
                    item_name: item_data.item_name
                });
            }
        }

        return result;
    }

    /**
     * Sync Goal
     */
    async syncGoal(item) {
        const [goal] = await this.db.query(`
            SELECT g.*, o.clickup_team_id
            FROM strategic_goals g
            INNER JOIN goal_categories gc ON g.category_id = gc.id
            INNER JOIN organizations o ON gc.organization_id = o.id
            WHERE g.id = ?
        `, [item.entity_id]);

        if (!goal) {
            throw new Error('Goal not found');
        }

        if (!goal.clickup_team_id) {
            throw new Error('Organization not configured with ClickUp team ID');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createGoal(goal.clickup_team_id, {
                name: goal.name,
                description: goal.description,
                target_date: goal.target_date
            });

            await this.db.query(
                'UPDATE strategic_goals SET clickup_goal_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateGoal(goal.clickup_goal_id, {
                name: goal.name,
                description: goal.description,
                target_date: goal.target_date
            });

            await this.db.query(
                'UPDATE strategic_goals SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );
        }

        return result;
    }

    /**
     * Sync Indicator (Key Result/Target)
     */
    async syncIndicator(item) {
        const [indicator] = await this.db.query(`
            SELECT i.*, g.clickup_goal_id
            FROM indicators i
            INNER JOIN strategic_goals g ON i.goal_id = g.id
            WHERE i.id = ?
        `, [item.entity_id]);

        if (!indicator) {
            throw new Error('Indicator not found');
        }

        if (!indicator.clickup_goal_id) {
            throw new Error('Parent goal not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createKeyResult(indicator.clickup_goal_id, {
                name: indicator.name,
                indicator_type: indicator.indicator_type,
                target_value: indicator.target_value,
                current_value: indicator.current_value,
                target_amount: indicator.target_amount,
                current_amount: indicator.current_amount,
                is_completed: indicator.is_completed,
                unit: indicator.unit,
                currency: indicator.currency
            });

            await this.db.query(
                'UPDATE indicators SET clickup_target_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );

        } else if (item.operation_type === 'update') {
            result = await this.clickupService.updateKeyResult(indicator.clickup_target_id, {
                name: indicator.name,
                current_value: indicator.current_value,
                current_amount: indicator.current_amount,
                is_completed: indicator.is_completed
            });

            await this.db.query(
                'UPDATE indicators SET sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [item.entity_id]
            );
        }

        return result;
    }

    /**
     * Sync Comment
     */
    async syncComment(item) {
        const [comment] = await this.db.query(
            'SELECT * FROM comments WHERE id = ?',
            [item.entity_id]
        );

        if (!comment) {
            throw new Error('Comment not found');
        }

        // Get the clickup entity ID based on entity_type
        let clickupEntityId;
        if (comment.entity_type === 'activity') {
            const [activity] = await this.db.query(
                'SELECT clickup_task_id FROM activities WHERE id = ?',
                [comment.entity_id]
            );
            clickupEntityId = activity?.clickup_task_id;
        }

        if (!clickupEntityId) {
            throw new Error('Parent entity not synced to ClickUp');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createComment(clickupEntityId, {
                comment_text: comment.comment_text
            });

            await this.db.query(
                'UPDATE comments SET clickup_comment_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );
        }

        return result;
    }

    /**
     * Sync Time Entry
     */
    async syncTimeEntry(item) {
        const [timeEntry] = await this.db.query(`
            SELECT te.*, a.clickup_task_id, o.clickup_team_id
            FROM time_entries te
            INNER JOIN activities a ON te.activity_id = a.id
            INNER JOIN project_components pc ON a.component_id = pc.id
            INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
            INNER JOIN program_modules pm ON sp.module_id = pm.id
            INNER JOIN organizations o ON pm.organization_id = o.id
            WHERE te.id = ?
        `, [item.entity_id]);

        if (!timeEntry) {
            throw new Error('Time entry not found');
        }

        if (!timeEntry.clickup_team_id) {
            throw new Error('Organization not configured with ClickUp team ID');
        }

        let result;

        if (item.operation_type === 'create') {
            result = await this.clickupService.createTimeEntry(timeEntry.clickup_team_id, {
                description: timeEntry.description,
                hours_spent: timeEntry.hours_spent,
                entry_date: timeEntry.entry_date,
                clickup_task_id: timeEntry.clickup_task_id
            });

            await this.db.query(
                'UPDATE time_entries SET clickup_time_entry_id = ?, sync_status = "synced", last_synced_at = NOW() WHERE id = ?',
                [result.id, item.entity_id]
            );
        }

        return result;
    }

    /**
     * Handle item error
     */
    async handleItemError(item, error) {
        const retryCount = item.retry_count + 1;

        await this.db.query(`
            UPDATE sync_queue
            SET status = 'failed',
                retry_count = ?,
                last_error = ?,
                error_details = ?
            WHERE id = ?
        `, [
            retryCount,
            error.message,
            JSON.stringify({
                message: error.message,
                stack: error.stack,
                timestamp: new Date()
            }),
            item.id
        ]);

        // Log failed sync
        await this.logSync(item, 'failed', { error: error.message });
    }

    /**
     * Log sync operation
     */
    async logSync(item, status, details) {
        await this.db.query(`
            INSERT INTO sync_log (
                operation_type, entity_type, entity_id,
                direction, status, message,
                created_at
            ) VALUES (?, ?, ?, 'push', ?, ?, NOW())
        `, [
            item.operation_type,
            item.entity_type,
            item.entity_id,
            status,
            JSON.stringify(details).substring(0, 500)
        ]);
    }

    /**
     * Map activity status to ClickUp status
     */
    mapActivityStatus(status, approvalStatus) {
        if (approvalStatus === 'draft') return 'to do';
        if (approvalStatus === 'submitted') return 'under review';
        if (approvalStatus === 'approved') {
            if (status === 'completed') return 'complete';
            if (status === 'ongoing') return 'in progress';
            return 'to do';
        }
        if (approvalStatus === 'rejected') return 'rejected';
        return 'to do';
    }
}

module.exports = SyncManager;
