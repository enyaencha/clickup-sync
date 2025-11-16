/**
 * Sync Controller
 */

const syncService = require('./sync.service');
const Response = require('../../core/utils/response');
const logger = require('../../core/utils/logger');

class SyncController {
    async getStatus(req, res) {
        try {
            const stats = await syncService.getSyncStats();
            return Response.success(res, stats, 'Sync status fetched successfully');
        } catch (error) {
            logger.error('Error getting sync status:', error);
            return Response.error(res, error.message);
        }
    }

    async getPendingQueue(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const operations = await syncService.getPendingOperations(limit);
            return Response.success(res, operations, 'Pending sync operations fetched successfully');
        } catch (error) {
            logger.error('Error getting pending queue:', error);
            return Response.error(res, error.message);
        }
    }

    async triggerPull(req, res) {
        try {
            // This would trigger the sync engine to pull from ClickUp
            // For now, just return success message
            return Response.success(res, null, 'Pull sync triggered successfully');
        } catch (error) {
            logger.error('Error triggering pull sync:', error);
            return Response.error(res, error.message);
        }
    }

    async triggerPush(req, res) {
        try {
            // This would trigger the sync engine to push to ClickUp
            const pending = await syncService.getPendingOperations(100);
            return Response.success(res, {
                queued: pending.length,
                message: `${pending.length} operations queued for push`
            }, 'Push sync triggered successfully');
        } catch (error) {
            logger.error('Error triggering push sync:', error);
            return Response.error(res, error.message);
        }
    }
}

module.exports = new SyncController();
