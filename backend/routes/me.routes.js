/**
 * M&E API Routes
 */

const express = require('express');
const router = express.Router();
const checklistService = require('../services/activity-checklist.service');
const SettingsService = require('../services/settings.service');

module.exports = (meService) => {
    const settingsService = new SettingsService();
    // ==============================================
    // PROGRAM MODULES
    // ==============================================

    router.get('/programs', async (req, res) => {
        try {
            const programs = await meService.getProgramModules();
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
            const subPrograms = moduleId
                ? await meService.getSubProgramsWithProgress(moduleId)
                : await meService.getSubPrograms(moduleId);
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
            const components = subProgramId
                ? await meService.getComponentsWithProgress(subProgramId)
                : await meService.getProjectComponents(subProgramId);
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

    // ==============================================
    // ACTIVITIES
    // ==============================================

    router.get('/activities', async (req, res) => {
        try {
            const filters = {
                component_id: req.query.component_id,
                status: req.query.status,
                approval_status: req.query.approval_status,
                from_date: req.query.from_date,
                to_date: req.query.to_date,
                limit: req.query.limit
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

    router.post('/activities', async (req, res) => {
        try {
            const id = await meService.createActivity(req.body);
            res.json({ success: true, id, message: 'Activity created and queued for sync to ClickUp' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/activities/:id', async (req, res) => {
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

            await meService.updateActivity(req.params.id, req.body);
            res.json({ success: true, message: 'Activity updated and queued for sync to ClickUp' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.delete('/activities/:id', async (req, res) => {
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
            res.json({ success: true, id, message: 'Indicator created and queued for sync' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });

    router.put('/indicators/:id/progress', async (req, res) => {
        try {
            await meService.updateIndicatorProgress(req.params.id, req.body);
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
            const data = await meService.getOverallStatistics();
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
