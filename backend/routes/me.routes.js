/**
 * M&E API Routes
 */

const express = require('express');
const router = express.Router();
const checklistService = require('../services/activity-checklist.service');
const SettingsService = require('../services/settings.service');
const StatusCalculatorService = require('../services/status-calculator.service');
const { checkModulePermission } = require('../middleware/permissions');

module.exports = (meService) => {
    const settingsService = new SettingsService();
    const statusCalculator = new StatusCalculatorService(meService.db);
    const db = meService.db; // Get database connection from meService
    // ==============================================
    // PROGRAM MODULES
    // ==============================================

    router.get('/programs', async (req, res) => {
        try {
            const programs = await meService.getProgramModules(
                req.user?.id,
                req.user?.is_system_admin || false
            );
            res.json({ success: true, data: programs });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/programs', async (req, res) => {
        try {
            const id = await meService.createProgramModule(req.body);
            res.json({ success: true, id, message: 'Program module created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/programs/:id', async (req, res) => {
        try {
            await meService.updateProgramModule(req.params.id, req.body);
            res.json({ success: true, message: 'Program module updated and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // SUB-PROGRAMS
    // ==============================================

    router.get('/sub-programs', async (req, res) => {
        try {
            const moduleId = req.query.module_id;
            const userId = req.user?.id;
            const isSystemAdmin = req.user?.is_system_admin || false;

            // Always apply user filtering for RBAC
            const subPrograms = await meService.getSubPrograms(moduleId, userId, isSystemAdmin);
            res.json({ success: true, data: subPrograms });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/sub-programs', async (req, res) => {
        try {
            const id = await meService.createSubProgram(req.body);
            res.json({ success: true, id, message: 'Sub-program created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/sub-programs/:id', async (req, res) => {
        try {
            await meService.updateSubProgram(req.params.id, req.body);
            res.json({ success: true, message: 'Sub-program updated and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // PROJECT COMPONENTS
    // ==============================================

    router.get('/components', async (req, res) => {
        try {
            const subProgramId = req.query.sub_program_id;
            const userId = req.user?.id;
            const isSystemAdmin = req.user?.is_system_admin || false;

            // Always apply user filtering for RBAC
            const components = await meService.getProjectComponents(subProgramId, userId, isSystemAdmin);
            res.json({ success: true, data: components });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/components', async (req, res) => {
        try {
            const id = await meService.createProjectComponent(req.body);
            res.json({ success: true, id, message: 'Component created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/components/:id', async (req, res) => {
        try {
            await meService.updateProjectComponent(req.params.id, req.body);
            res.json({ success: true, message: 'Component updated and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // Get module info for a specific component (for module-specific activity forms)
    router.get('/components/:id/module', async (req, res) => {
        try {
            const componentId = req.params.id;

            const query = `
                SELECT
                    pm.id as module_id,
                    pm.name as module_name,
                    pm.code as module_code,
                    pm.icon as module_icon
                FROM project_components pc
                INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
                INNER JOIN program_modules pm ON sp.module_id = pm.id
                WHERE pc.id = ?
                LIMIT 1
            `;

            const results = await db.query(query, [componentId]);

            if (!results || results.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Component not found or not linked to a module'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });
        } catch (error) {
            console.error('Error fetching component module:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // ACTIVITIES
    // ==============================================

    router.get('/activities', async (req, res) => {
        try {
            const filters = {
                module_id: req.query.module_id,
                sub_program_id: req.query.sub_program_id,
                component_id: req.query.component_id,
                status: req.query.status,
                approval_status: req.query.approval_status,
                from_date: req.query.from_date,
                to_date: req.query.to_date,
                limit: req.query.limit,
                // Add user info for role-based filtering
                userId: req.user?.id,
                isSystemAdmin: req.user?.is_system_admin || false
            };
            const activities = await meService.getActivities(filters);
            res.json({ success: true, data: activities, count: activities.length });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/activities/:id', async (req, res) => {
        try {
            const activity = await meService.getActivityById(req.params.id);
            if (!activity) {
                return res.status(404).json({ success: false, error: 'Activity not found' });
            }
            res.json({ success: true, data: activity });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities', checkModulePermission(db, 'create'), async (req, res) => {
        try {
            // Set created_by and owned_by to current user
            req.body.created_by = req.user.id;
            req.body.owned_by = req.user.id;

            const id = await meService.createActivity(req.body);

            // Automatically calculate initial status and cascade to parents
            try {
                const result = await statusCalculator.cascadeActivityStatusUpdate(id);
                console.log(`✅ Auto-calculated status for new activity ${id} (component: ${result.componentUpdated}, subprogram: ${result.subProgramUpdated})`);
            } catch (statusError) {
                console.warn(`⚠️  Status calculation failed for new activity ${id}:`, statusError.message);
            }

            res.json({ success: true, id, message: 'Activity created and queued for sync to ClickUp' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/activities/:id', checkModulePermission(db, 'edit'), async (req, res) => {
        try {
            // Debug logging for outcome and objectives fields
            console.log('📝 Activity Update Request:', {
                id: req.params.id,
                outcome_notes: req.body.outcome_notes ? 'HAS DATA' : 'EMPTY',
                challenges_faced: req.body.challenges_faced ? 'HAS DATA' : 'EMPTY',
                lessons_learned: req.body.lessons_learned ? 'HAS DATA' : 'EMPTY',
                recommendations: req.body.recommendations ? 'HAS DATA' : 'EMPTY',
                immediate_objectives: req.body.immediate_objectives ? 'HAS DATA' : 'EMPTY',
                expected_results: req.body.expected_results ? 'HAS DATA' : 'EMPTY',
            });

            // Check checklist completion if status is being changed to "completed"
            if (req.body.status === 'completed') {
                const settings = await settingsService.getSettings();

                if (settings.require_checklist_completion_before_completion) {
                    const checklistStatus = await checklistService.getCompletionStatus(req.params.id);
                    const validation = await settingsService.canCompleteWithChecklist(checklistStatus, settings);

                    if (!validation.allowed) {
                        return res.status(400).json({
                            success: false,
                            error: validation.reason
                        });
                    }
                }
            }

            // Record who modified it
            req.body.last_modified_by = req.user.id;

            await meService.updateActivity(req.params.id, req.body);

            // Automatically recalculate status after update and cascade to parents
            try {
                const result = await statusCalculator.cascadeActivityStatusUpdate(req.params.id);
                console.log(`✅ Auto-calculated status for activity ${req.params.id} (component: ${result.componentUpdated}, subprogram: ${result.subProgramUpdated})`);
            } catch (statusError) {
                // Don't fail the update if status calculation fails
                console.warn(`⚠️  Status calculation failed for activity ${req.params.id}:`, statusError.message);
            }

            res.json({ success: true, message: 'Activity updated and queued for sync to ClickUp' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.delete('/activities/:id', checkModulePermission(db, 'delete'), async (req, res) => {
        try {
            await meService.deleteActivity(req.params.id);
            res.json({ success: true, message: 'Activity deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // APPROVAL WORKFLOW
    // ==============================================

    router.get('/approvals/pending', async (req, res) => {
        try {
            const filters = {
                approval_status: 'submitted',
                status: req.query.status,
                component_id: req.query.component_id
            };
            const activities = await meService.getActivities(filters);
            res.json({ success: true, data: activities, count: activities.length });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities/:id/status', async (req, res) => {
        try {
            // Check checklist completion if status is being changed to "completed"
            if (req.body.status === 'completed') {
                const settings = await settingsService.getSettings();

                if (settings.require_checklist_completion_before_completion) {
                    const checklistStatus = await checklistService.getCompletionStatus(req.params.id);
                    const validation = await settingsService.canCompleteWithChecklist(checklistStatus, settings);

                    if (!validation.allowed) {
                        return res.status(400).json({
                            success: false,
                            error: validation.reason
                        });
                    }
                }
            }

            await meService.updateActivityStatus(req.params.id, req.body.status);

            // Automatically recalculate status after status update and cascade to parents
            try {
                const result = await statusCalculator.cascadeActivityStatusUpdate(req.params.id);
                console.log(`✅ Auto-calculated status for activity ${req.params.id} (component: ${result.componentUpdated}, subprogram: ${result.subProgramUpdated})`);
            } catch (statusError) {
                console.warn(`⚠️  Status calculation failed for activity ${req.params.id}:`, statusError.message);
            }

            res.json({ success: true, message: 'Activity status updated' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities/:id/submit', async (req, res) => {
        try {
            // Check checklist completion if required by settings
            const settings = await settingsService.getSettings();

            if (settings.require_checklist_completion_before_submission) {
                const checklistStatus = await checklistService.getCompletionStatus(req.params.id);
                const validation = await settingsService.canSubmitWithChecklist(checklistStatus, settings);

                if (!validation.allowed) {
                    return res.status(400).json({
                        success: false,
                        error: validation.reason
                    });
                }
            }

            await meService.updateApprovalStatus(req.params.id, 'submitted');
            res.json({ success: true, message: 'Activity submitted for approval' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities/:id/approve', async (req, res) => {
        try {
            await meService.updateApprovalStatus(req.params.id, 'approved');
            res.json({ success: true, message: 'Activity approved' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities/:id/reject', async (req, res) => {
        try {
            await meService.updateApprovalStatus(req.params.id, 'rejected');
            res.json({ success: true, message: 'Activity rejected' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // GOALS & INDICATORS
    // ==============================================

    router.post('/goals', async (req, res) => {
        try {
            const id = await meService.createGoal(req.body);
            res.json({ success: true, id, message: 'Goal created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/goals/:id', async (req, res) => {
        try {
            await meService.updateGoal(req.params.id, req.body);
            res.json({ success: true, message: 'Goal updated and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/indicators', async (req, res) => {
        try {
            const id = await meService.createIndicator(req.body);

            // Recalculate activity status since adding indicators changes the calculation
            if (req.body.activity_id) {
                try {
                    const result = await statusCalculator.cascadeActivityStatusUpdate(req.body.activity_id);
                    console.log(`✅ Auto-calculated status for activity ${req.body.activity_id} after indicator creation (component: ${result.componentUpdated}, subprogram: ${result.subProgramUpdated})`);
                } catch (statusError) {
                    console.warn(`⚠️  Status calculation failed after indicator creation:`, statusError.message);
                }
            }

            res.json({ success: true, id, message: 'Indicator created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/indicators/:id/progress', async (req, res) => {
        try {
            await meService.updateIndicatorProgress(req.params.id, req.body);

            // Get the activity_id for this indicator and recalculate its status
            try {
                const indicator = await meService.db.queryOne(
                    'SELECT activity_id FROM me_indicators WHERE id = ?',
                    [req.params.id]
                );

                if (indicator && indicator.activity_id) {
                    const result = await statusCalculator.cascadeActivityStatusUpdate(indicator.activity_id);
                    console.log(`✅ Auto-calculated status for activity ${indicator.activity_id} after indicator update (component: ${result.componentUpdated}, subprogram: ${result.subProgramUpdated})`);
                }
            } catch (statusError) {
                console.warn(`⚠️  Status calculation failed after indicator update:`, statusError.message);
            }

            res.json({ success: true, message: 'Indicator progress updated and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // COMMENTS
    // ==============================================

    router.post('/comments', async (req, res) => {
        try {
            const id = await meService.addComment(req.body);
            res.json({ success: true, id, message: 'Comment added and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // BENEFICIARIES
    // ==============================================

    router.post('/beneficiaries', async (req, res) => {
        try {
            const id = await meService.createBeneficiary(req.body);
            res.json({ success: true, id, message: 'Beneficiary created' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.post('/activities/:activityId/beneficiaries/:beneficiaryId', async (req, res) => {
        try {
            const { activityId, beneficiaryId } = req.params;
            const { role } = req.body;
            await meService.linkBeneficiaryToActivity(activityId, beneficiaryId, role);
            res.json({ success: true, message: 'Beneficiary linked to activity' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==============================================
    // REPORTS & DASHBOARDS
    // ==============================================

    router.get('/dashboard/overall', async (req, res) => {
        try {
            // Accept modules query param for filtering by user's assigned modules
            const modules = req.query.modules ? req.query.modules.split(',').map(Number) : null;
            const data = await meService.getOverallStatistics(req.user, modules);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/program/:moduleId', async (req, res) => {
        try {
            const data = await meService.getProgramStatistics(req.params.moduleId, req.user);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/subprogram/:subProgramId', async (req, res) => {
        try {
            const data = await meService.getSubProgramStatistics(req.params.subProgramId, req.user);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/component/:componentId', async (req, res) => {
        try {
            const data = await meService.getComponentStatistics(req.params.componentId, req.user);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/programs', async (req, res) => {
        try {
            const data = await meService.getProgramOverview();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/activities', async (req, res) => {
        try {
            const filters = {
                module_name: req.query.module_name,
                status: req.query.status
            };
            const data = await meService.getActivityDashboard(filters);
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/goals', async (req, res) => {
        try {
            const data = await meService.getGoalsProgress();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.get('/dashboard/sync-status', async (req, res) => {
        try {
            const data = await meService.getSyncQueueStatus();
            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
