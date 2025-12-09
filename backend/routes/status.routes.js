/**
 * Status Calculation Routes
 * API endpoints for triggering and managing automated status calculations
 */

const express = require('express');
const router = express.Router();

module.exports = (statusCalculatorService) => {
    /**
     * Recalculate status for a single activity
     * POST /api/status/activity/:activityId/recalculate
     */
    router.post('/activity/:activityId/recalculate', async (req, res) => {
        try {
            const { activityId } = req.params;
            const result = await statusCalculatorService.updateActivityStatus(parseInt(activityId));

            res.json({
                success: true,
                data: result,
                message: 'Activity status recalculated successfully'
            });
        } catch (error) {
            console.error('Error recalculating activity status:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Recalculate status for a component (and its activities)
     * POST /api/status/component/:componentId/recalculate
     */
    router.post('/component/:componentId/recalculate', async (req, res) => {
        try {
            const { componentId } = req.params;

            // First update all activities in this component
            const activities = await statusCalculatorService.db.query(
                'SELECT id FROM activities WHERE component_id = ? AND deleted_at IS NULL',
                [parseInt(componentId)]
            );

            for (const activity of activities) {
                await statusCalculatorService.updateActivityStatus(activity.id);
            }

            // Then update component status
            const result = await statusCalculatorService.updateComponentStatus(parseInt(componentId));

            res.json({
                success: true,
                data: result,
                message: `Component status recalculated (${activities.length} activities updated)`
            });
        } catch (error) {
            console.error('Error recalculating component status:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Recalculate all statuses for a module
     * POST /api/status/module/:moduleId/recalculate
     */
    router.post('/module/:moduleId/recalculate', async (req, res) => {
        try {
            const { moduleId } = req.params;
            const summary = await statusCalculatorService.recalculateModuleStatuses(parseInt(moduleId));

            res.json({
                success: true,
                data: summary,
                message: 'Module statuses recalculated successfully'
            });
        } catch (error) {
            console.error('Error recalculating module statuses:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Recalculate all statuses system-wide
     * POST /api/status/recalculate-all
     * WARNING: This can be resource-intensive for large databases
     */
    router.post('/recalculate-all', async (req, res) => {
        try {
            const summary = await statusCalculatorService.recalculateAllStatuses();

            res.json({
                success: true,
                data: summary,
                message: 'All statuses recalculated successfully'
            });
        } catch (error) {
            console.error('Error recalculating all statuses:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get status calculation details for an activity (without updating)
     * GET /api/status/activity/:activityId/preview
     */
    router.get('/activity/:activityId/preview', async (req, res) => {
        try {
            const { activityId } = req.params;
            const calculated = await statusCalculatorService.calculateActivityStatus(parseInt(activityId));

            res.json({
                success: true,
                data: calculated
            });
        } catch (error) {
            console.error('Error previewing activity status:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get status history for an entity
     * GET /api/status/history/:entityType/:entityId
     */
    router.get('/history/:entityType/:entityId', async (req, res) => {
        try {
            const { entityType, entityId } = req.params;
            const { limit = 50 } = req.query;

            const history = await statusCalculatorService.db.query(
                `SELECT * FROM status_history
                 WHERE entity_type = ? AND entity_id = ?
                 ORDER BY changed_at DESC
                 LIMIT ?`,
                [entityType, parseInt(entityId), parseInt(limit)]
            );

            res.json({
                success: true,
                data: history,
                count: history.length
            });
        } catch (error) {
            console.error('Error fetching status history:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Manually override activity status
     * POST /api/status/activity/:activityId/override
     * Body: { status, reason }
     */
    router.post('/activity/:activityId/override', async (req, res) => {
        try {
            const { activityId } = req.params;
            const { status, reason } = req.body;
            const userId = req.user?.id; // Assumes auth middleware adds user

            if (!status) {
                return res.status(400).json({
                    success: false,
                    error: 'Status is required'
                });
            }

            // Get current status for history
            const current = await statusCalculatorService.db.queryOne(
                'SELECT status, progress_percentage FROM activities WHERE id = ?',
                [parseInt(activityId)]
            );

            // Update activity with manual override
            await statusCalculatorService.db.query(
                `UPDATE activities
                 SET status = ?,
                     manual_status = ?,
                     status_override = TRUE,
                     status_reason = ?,
                     last_status_update = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [status, status, reason || 'Manual override', parseInt(activityId)]
            );

            // Record in history
            await statusCalculatorService.db.query(
                `INSERT INTO status_history
                 (entity_type, entity_id, old_status, new_status, old_progress, new_progress,
                  change_type, change_reason, override_applied, changed_by)
                 VALUES ('activity', ?, ?, ?, ?, ?, 'manual', ?, TRUE, ?)`,
                [
                    parseInt(activityId),
                    current.status,
                    status,
                    current.progress_percentage,
                    current.progress_percentage,
                    reason || 'Manual override',
                    userId
                ]
            );

            res.json({
                success: true,
                message: 'Activity status manually overridden',
                data: {
                    activityId: parseInt(activityId),
                    newStatus: status,
                    reason
                }
            });
        } catch (error) {
            console.error('Error overriding activity status:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Remove manual override and revert to auto-calculation
     * DELETE /api/status/activity/:activityId/override
     */
    router.delete('/activity/:activityId/override', async (req, res) => {
        try {
            const { activityId } = req.params;

            // Reset override flag
            await statusCalculatorService.db.query(
                `UPDATE activities
                 SET status_override = FALSE,
                     manual_status = NULL
                 WHERE id = ?`,
                [parseInt(activityId)]
            );

            // Recalculate status
            const result = await statusCalculatorService.updateActivityStatus(parseInt(activityId));

            res.json({
                success: true,
                message: 'Manual override removed, status recalculated',
                data: result
            });
        } catch (error) {
            console.error('Error removing status override:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
