/**
 * Sync Service
 * Handles synchronization between local database and ClickUp
 */

const db = require('../../core/database/connection');
const logger = require('../../core/utils/logger');

class SyncService {
    /**
     * Queue an operation for synchronization
     */
    async queueOperation(operationData) {
        try {
            const sql = `
                INSERT INTO sync_queue (
                    operation_type, entity_type, entity_id,
                    direction, status, priority, payload
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                operationData.operation_type,
                operationData.entity_type,
                operationData.entity_id,
                operationData.direction || 'push',
                'pending',
                operationData.priority || 5,
                JSON.stringify(operationData.payload || {})
            ];

            const result = await db.query(sql, params);
            logger.info('Operation queued for sync:', {
                id: result.insertId,
                entity_type: operationData.entity_type,
                operation_type: operationData.operation_type
            });

            return result.insertId;
        } catch (error) {
            logger.error('Error queuing sync operation:', { error: error.message });
            throw error;
        }
    }

    /**
     * Get pending sync operations
     */
    async getPendingOperations(limit = 10) {
        const sql = `
            SELECT * FROM sync_queue
            WHERE status = 'pending' AND retry_count < max_retries
            ORDER BY priority ASC, scheduled_at ASC
            LIMIT ?
        `;
        return await db.query(sql, [limit]);
    }

    /**
     * Update operation status
     */
    async updateOperationStatus(id, status, error = null) {
        const sql = `
            UPDATE sync_queue
            SET status = ?, last_error = ?, updated_at = NOW()
            WHERE id = ?
        `;
        return await db.query(sql, [status, error, id]);
    }

    /**
     * Get sync status for entity
     */
    async getEntitySyncStatus(entityType, entityId) {
        const sql = `
            SELECT * FROM sync_status
            WHERE entity_type = ? AND entity_id = ?
        `;
        return await db.queryOne(sql, [entityType, entityId]);
    }

    /**
     * Update entity sync status
     */
    async updateEntitySyncStatus(entityType, entityId, status, direction = null) {
        const existing = await this.getEntitySyncStatus(entityType, entityId);

        if (existing) {
            const sql = `
                UPDATE sync_status
                SET status = ?, last_synced_at = NOW(), last_sync_direction = ?
                WHERE entity_type = ? AND entity_id = ?
            `;
            return await db.query(sql, [status, direction, entityType, entityId]);
        } else {
            const sql = `
                INSERT INTO sync_status (entity_type, entity_id, status, last_sync_direction)
                VALUES (?, ?, ?, ?)
            `;
            return await db.query(sql, [entityType, entityId, status, direction]);
        }
    }

    /**
     * Log sync operation
     */
    async logSync(logData) {
        const sql = `
            INSERT INTO sync_log (
                operation_type, entity_type, entity_id, direction,
                status, message, error_details, sync_duration_ms,
                records_affected
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            logData.operation_type,
            logData.entity_type,
            logData.entity_id || null,
            logData.direction,
            logData.status,
            logData.message || null,
            logData.error_details || null,
            logData.sync_duration_ms || null,
            logData.records_affected || 1
        ];

        return await db.query(sql, params);
    }

    /**
     * Get sync statistics
     */
    async getSyncStats() {
        const stats = {
            pending: 0,
            syncing: 0,
            completed: 0,
            failed: 0,
            conflicts: 0
        };

        // Queue stats
        const queueStats = await db.query(`
            SELECT status, COUNT(*) as count
            FROM sync_queue
            GROUP BY status
        `);

        queueStats.forEach(stat => {
            stats[stat.status] = stat.count;
        });

        // Conflicts
        const conflictCount = await db.queryOne(`
            SELECT COUNT(*) as count
            FROM sync_conflicts
            WHERE resolution_strategy = 'pending'
        `);

        stats.conflicts = conflictCount ? conflictCount.count : 0;

        return stats;
    }

    /**
     * Record a conflict
     */
    async recordConflict(conflictData) {
        const sql = `
            INSERT INTO sync_conflicts (
                entity_type, entity_id, field_name,
                local_value, clickup_value,
                local_updated_at, clickup_updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            conflictData.entity_type,
            conflictData.entity_id,
            conflictData.field_name,
            conflictData.local_value,
            conflictData.clickup_value,
            conflictData.local_updated_at,
            conflictData.clickup_updated_at
        ];

        const result = await db.query(sql, params);
        logger.warn('Sync conflict recorded:', { conflictId: result.insertId, ...conflictData });

        return result.insertId;
    }

    /**
     * Resolve conflict
     */
    async resolveConflict(conflictId, strategy, resolvedValue = null, resolvedBy = null) {
        const sql = `
            UPDATE sync_conflicts
            SET resolution_strategy = ?, resolved_value = ?, resolved_by = ?, resolved_at = NOW()
            WHERE id = ?
        `;

        await db.query(sql, [strategy, resolvedValue, resolvedBy, conflictId]);
        logger.info('Conflict resolved:', { conflictId, strategy });

        return true;
    }
}

module.exports = new SyncService();
