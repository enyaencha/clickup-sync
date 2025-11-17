/**
 * ClickUp Push Service
 * Pushes data FROM local database TO ClickUp
 */

const axios = require('axios');
const logger = require('../core/utils/logger');

class ClickUpPushService {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.baseURL = 'https://api.clickup.com/api/v2';
        this.rateLimitDelay = 1000; // 1 second between requests
        this.lastRequestTime = 0;
    }

    /**
     * Make API request with rate limiting
     */
    async makeRequest(method, endpoint, data = null) {
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve =>
                setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
            );
        }

        const config = {
            method,
            url: `${this.baseURL}${endpoint}`,
            headers: {
                'Authorization': this.apiToken,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        };

        if (data) {
            config.data = data;
        }

        this.lastRequestTime = Date.now();

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            logger.error('ClickUp API Error:', {
                endpoint,
                status: error.response?.status,
                message: error.response?.data?.err || error.message
            });
            throw error;
        }
    }

    // ==============================================
    // SPACE OPERATIONS (Program Modules)
    // ==============================================

    /**
     * Create a Space (Program Module) in ClickUp
     */
    async createSpace(teamId, spaceData) {
        const payload = {
            name: spaceData.name,
            features: {
                due_dates: { enabled: true },
                time_tracking: { enabled: true },
                tags: { enabled: true },
                time_estimates: { enabled: true },
                checklists: { enabled: true },
                custom_fields: { enabled: true },
                remap_dependencies: { enabled: false },
                dependency_warning: { enabled: true },
                portfolios: { enabled: false }
            }
        };

        if (spaceData.color) {
            payload.color = spaceData.color;
        }

        const result = await this.makeRequest('POST', `/team/${teamId}/space`, payload);
        logger.info(`Created Space: ${spaceData.name}`, { clickup_id: result.id });
        return result;
    }

    /**
     * Update a Space
     */
    async updateSpace(spaceId, spaceData) {
        const payload = {
            name: spaceData.name
        };

        if (spaceData.color) {
            payload.color = spaceData.color;
        }

        const result = await this.makeRequest('PUT', `/space/${spaceId}`, payload);
        logger.info(`Updated Space: ${spaceData.name}`, { clickup_id: spaceId });
        return result;
    }

    // ==============================================
    // FOLDER OPERATIONS (Sub-Programs)
    // ==============================================

    /**
     * Create a Folder (Sub-Program) in ClickUp
     */
    async createFolder(spaceId, folderData) {
        const payload = {
            name: folderData.name
        };

        const result = await this.makeRequest('POST', `/space/${spaceId}/folder`, payload);
        logger.info(`Created Folder: ${folderData.name}`, { clickup_id: result.id });
        return result;
    }

    /**
     * Update a Folder
     */
    async updateFolder(folderId, folderData) {
        const payload = {
            name: folderData.name
        };

        const result = await this.makeRequest('PUT', `/folder/${folderId}`, payload);
        logger.info(`Updated Folder: ${folderData.name}`, { clickup_id: folderId });
        return result;
    }

    // ==============================================
    // LIST OPERATIONS (Project Components)
    // ==============================================

    /**
     * Create a List (Project Component) in ClickUp
     */
    async createList(parentId, listData, isFolder = false) {
        const endpoint = isFolder ? `/folder/${parentId}/list` : `/space/${parentId}/list`;

        const payload = {
            name: listData.name,
            content: listData.description || '',
            due_date: listData.due_date || null,
            due_date_time: listData.due_date_time || false,
            priority: listData.priority || null,
            status: listData.status || null
        };

        const result = await this.makeRequest('POST', endpoint, payload);
        logger.info(`Created List: ${listData.name}`, { clickup_id: result.id });
        return result;
    }

    /**
     * Update a List
     */
    async updateList(listId, listData) {
        const payload = {
            name: listData.name,
            content: listData.description || ''
        };

        if (listData.priority) payload.priority = listData.priority;
        if (listData.due_date) payload.due_date = listData.due_date;

        const result = await this.makeRequest('PUT', `/list/${listId}`, payload);
        logger.info(`Updated List: ${listData.name}`, { clickup_id: listId });
        return result;
    }

    // ==============================================
    // TASK OPERATIONS (Activities)
    // ==============================================

    /**
     * Create a Task (Activity) in ClickUp
     */
    async createTask(listId, taskData) {
        const payload = {
            name: taskData.name,
            description: taskData.description || '',
            status: taskData.clickup_status || 'to do',
            priority: this.mapPriority(taskData.priority),
            due_date: taskData.end_date ? new Date(taskData.end_date).getTime() : null,
            due_date_time: !!taskData.end_date,
            start_date: taskData.start_date ? new Date(taskData.start_date).getTime() : null,
            start_date_time: !!taskData.start_date,
            notify_all: false
        };

        // Add custom fields if provided
        if (taskData.custom_fields) {
            payload.custom_fields = taskData.custom_fields;
        }

        // Add assignees if provided
        if (taskData.assignees) {
            payload.assignees = taskData.assignees;
        }

        // Add tags if provided
        if (taskData.tags) {
            payload.tags = taskData.tags;
        }

        const result = await this.makeRequest('POST', `/list/${listId}/task`, payload);
        logger.info(`Created Task: ${taskData.name}`, { clickup_id: result.id });
        return result;
    }

    /**
     * Update a Task
     */
    async updateTask(taskId, taskData) {
        const payload = {
            name: taskData.name,
            description: taskData.description || ''
        };

        if (taskData.clickup_status) payload.status = taskData.clickup_status;
        if (taskData.priority) payload.priority = this.mapPriority(taskData.priority);
        if (taskData.end_date) {
            payload.due_date = new Date(taskData.end_date).getTime();
            payload.due_date_time = true;
        }
        if (taskData.start_date) {
            payload.start_date = new Date(taskData.start_date).getTime();
            payload.start_date_time = true;
        }

        const result = await this.makeRequest('PUT', `/task/${taskId}`, payload);
        logger.info(`Updated Task: ${taskData.name}`, { clickup_id: taskId });
        return result;
    }

    /**
     * Add a Subtask
     */
    async createSubtask(parentTaskId, subtaskData) {
        const payload = {
            name: subtaskData.name,
            description: subtaskData.description || '',
            status: subtaskData.status === 'completed' ? 'complete' : 'to do'
        };

        if (subtaskData.assigned_to) {
            payload.assignees = [subtaskData.assigned_to];
        }

        if (subtaskData.due_date) {
            payload.due_date = new Date(subtaskData.due_date).getTime();
        }

        const result = await this.makeRequest('POST', `/task/${parentTaskId}/subtask`, payload);
        logger.info(`Created Subtask: ${subtaskData.name}`);
        return result;
    }

    // ==============================================
    // CHECKLIST OPERATIONS
    // ==============================================

    /**
     * Create a Checklist on a Task
     */
    async createChecklist(taskId, checklistName) {
        const payload = {
            name: checklistName
        };

        const result = await this.makeRequest('POST', `/task/${taskId}/checklist`, payload);
        return result;
    }

    /**
     * Add Checklist Item
     */
    async addChecklistItem(checklistId, itemData) {
        const payload = {
            name: itemData.item_name,
            assignee: itemData.assigned_to || null
        };

        const result = await this.makeRequest('POST', `/checklist/${checklistId}/checklist_item`, payload);
        return result;
    }

    /**
     * Update Checklist Item (mark as completed)
     */
    async updateChecklistItem(checklistId, checklistItemId, isCompleted) {
        const payload = {
            resolved: isCompleted
        };

        const result = await this.makeRequest('PUT', `/checklist/${checklistId}/checklist_item/${checklistItemId}`, payload);
        return result;
    }

    // ==============================================
    // GOAL OPERATIONS
    // ==============================================

    /**
     * Create a Goal in ClickUp
     */
    async createGoal(teamId, goalData) {
        const payload = {
            name: goalData.name,
            description: goalData.description || '',
            due_date: goalData.target_date ? new Date(goalData.target_date).getTime() : null,
            color: goalData.color || '#32a852'
        };

        const result = await this.makeRequest('POST', `/team/${teamId}/goal`, payload);
        logger.info(`Created Goal: ${goalData.name}`, { clickup_id: result.goal.id });
        return result.goal;
    }

    /**
     * Update a Goal
     */
    async updateGoal(goalId, goalData) {
        const payload = {
            name: goalData.name,
            description: goalData.description || ''
        };

        if (goalData.target_date) {
            payload.due_date = new Date(goalData.target_date).getTime();
        }

        if (goalData.color) {
            payload.color = goalData.color;
        }

        const result = await this.makeRequest('PUT', `/goal/${goalId}`, payload);
        logger.info(`Updated Goal: ${goalData.name}`, { clickup_id: goalId });
        return result.goal;
    }

    /**
     * Create a Key Result/Target for a Goal
     */
    async createKeyResult(goalId, targetData) {
        let payload;

        // Different payload based on indicator type
        switch (targetData.indicator_type) {
            case 'numeric':
                payload = {
                    name: targetData.name,
                    type: 'number',
                    unit: targetData.unit || '',
                    key_result_type: 'target_number'
                };
                if (targetData.target_value) {
                    payload.steps_end = targetData.target_value;
                }
                if (targetData.current_value !== undefined) {
                    payload.steps_current = targetData.current_value;
                }
                break;

            case 'financial':
                payload = {
                    name: targetData.name,
                    type: 'currency',
                    unit: targetData.currency || 'KES',
                    key_result_type: 'target_currency'
                };
                if (targetData.target_amount) {
                    payload.steps_end = targetData.target_amount;
                }
                if (targetData.current_amount !== undefined) {
                    payload.steps_current = targetData.current_amount;
                }
                break;

            case 'binary':
                payload = {
                    name: targetData.name,
                    type: 'boolean',
                    key_result_type: 'target_boolean',
                    steps_current: targetData.is_completed ? 1 : 0,
                    steps_end: 1
                };
                break;

            case 'activity_linked':
                payload = {
                    name: targetData.name,
                    type: 'task',
                    key_result_type: 'target_task_list',
                    task_ids: targetData.linked_task_ids || []
                };
                break;

            default:
                throw new Error(`Unknown indicator type: ${targetData.indicator_type}`);
        }

        const result = await this.makeRequest('POST', `/goal/${goalId}/key_result`, payload);
        logger.info(`Created Key Result: ${targetData.name}`, { goal_id: goalId });
        return result.key_result;
    }

    /**
     * Update a Key Result
     */
    async updateKeyResult(keyResultId, updates) {
        const payload = {};

        if (updates.name) payload.name = updates.name;
        if (updates.current_value !== undefined) payload.steps_current = updates.current_value;
        if (updates.current_amount !== undefined) payload.steps_current = updates.current_amount;
        if (updates.is_completed !== undefined) payload.steps_current = updates.is_completed ? 1 : 0;

        const result = await this.makeRequest('PUT', `/key_result/${keyResultId}`, payload);
        return result.key_result;
    }

    // ==============================================
    // COMMENT OPERATIONS
    // ==============================================

    /**
     * Add a Comment to a Task
     */
    async createComment(taskId, commentData) {
        const payload = {
            comment_text: commentData.comment_text
        };

        if (commentData.notify_all) {
            payload.notify_all = true;
        }

        const result = await this.makeRequest('POST', `/task/${taskId}/comment`, payload);
        logger.info('Created comment on task', { task_id: taskId });
        return result;
    }

    /**
     * Update a Comment
     */
    async updateComment(commentId, commentText) {
        const payload = {
            comment_text: commentText
        };

        const result = await this.makeRequest('PUT', `/comment/${commentId}`, payload);
        return result;
    }

    // ==============================================
    // ATTACHMENT OPERATIONS
    // ==============================================

    /**
     * Upload an Attachment to a Task
     */
    async uploadAttachment(taskId, filePath, fileName) {
        const FormData = require('form-data');
        const fs = require('fs');

        const form = new FormData();
        form.append('attachment', fs.createReadStream(filePath), fileName);

        const config = {
            method: 'POST',
            url: `${this.baseURL}/task/${taskId}/attachment`,
            headers: {
                'Authorization': this.apiToken,
                ...form.getHeaders()
            },
            data: form,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        };

        const response = await axios(config);
        logger.info('Uploaded attachment', { task_id: taskId, file: fileName });
        return response.data;
    }

    // ==============================================
    // TIME TRACKING OPERATIONS
    // ==============================================

    /**
     * Create a Time Entry
     */
    async createTimeEntry(teamId, timeData) {
        const payload = {
            description: timeData.description || '',
            time: timeData.hours_spent * 3600000, // Convert hours to milliseconds
            start: timeData.entry_date ? new Date(timeData.entry_date).getTime() : Date.now(),
            billable: false
        };

        if (timeData.clickup_task_id) {
            payload.tid = timeData.clickup_task_id;
        }

        const result = await this.makeRequest('POST', `/team/${teamId}/time_entries`, payload);
        logger.info('Created time entry', { hours: timeData.hours_spent });
        return result.data;
    }

    // ==============================================
    // HELPER METHODS
    // ==============================================

    /**
     * Map local priority to ClickUp priority
     */
    mapPriority(priority) {
        const priorityMap = {
            'urgent': 1,
            'high': 2,
            'normal': 3,
            'low': 4
        };
        return priorityMap[priority] || 3;
    }

    /**
     * Delete an entity (generic)
     */
    async deleteEntity(entityType, entityId) {
        const endpoints = {
            'space': `/space/${entityId}`,
            'folder': `/folder/${entityId}`,
            'list': `/list/${entityId}`,
            'task': `/task/${entityId}`,
            'goal': `/goal/${entityId}`
        };

        const endpoint = endpoints[entityType];
        if (!endpoint) {
            throw new Error(`Unknown entity type: ${entityType}`);
        }

        const result = await this.makeRequest('DELETE', endpoint);
        logger.info(`Deleted ${entityType}`, { id: entityId });
        return result;
    }
}

module.exports = ClickUpPushService;
