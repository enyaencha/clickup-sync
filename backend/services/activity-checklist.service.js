/**
 * Activity Checklist Service
 * Manages activity implementation checklists
 */

const db = require('../core/database/connection');

class ActivityChecklistService {
    /**
     * Get all checklist items for an activity
     */
    async getByActivityId(activityId) {
        const sql = `
            SELECT * FROM activity_checklists
            WHERE activity_id = ?
            ORDER BY orderindex ASC, id ASC
        `;
        return await db.query(sql, [activityId]);
    }

    /**
     * Get checklist completion status for an activity
     */
    async getCompletionStatus(activityId) {
        const sql = `
            SELECT
                COUNT(*) as total_items,
                SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed_items
            FROM activity_checklists
            WHERE activity_id = ?
        `;
        const result = await db.queryOne(sql, [activityId]);

        if (!result || result.total_items === 0) {
            return {
                total: 0,
                completed: 0,
                percentage: 0,
                all_completed: false
            };
        }

        const percentage = Math.round((result.completed_items / result.total_items) * 100);

        return {
            total: result.total_items,
            completed: result.completed_items,
            percentage: percentage,
            all_completed: result.completed_items === result.total_items
        };
    }

    /**
     * Create a new checklist item
     */
    async create(checklistData) {
        const sql = `
            INSERT INTO activity_checklists (
                activity_id, item_name, orderindex, is_completed,
                sync_status, clickup_checklist_id, clickup_checklist_item_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            checklistData.activity_id,
            checklistData.item_name,
            checklistData.orderindex || 0,
            checklistData.is_completed || 0,
            'pending',
            checklistData.clickup_checklist_id || null,
            checklistData.clickup_checklist_item_id || null
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    /**
     * Update checklist item
     */
    async update(id, checklistData) {
        const fields = [];
        const params = [];

        const allowedFields = [
            'item_name', 'orderindex', 'is_completed',
            'completed_at', 'completed_by', 'sync_status'
        ];

        allowedFields.forEach(field => {
            if (checklistData[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(checklistData[field]);
            }
        });

        if (fields.length === 0) {
            return false;
        }

        params.push(id);

        const sql = `UPDATE activity_checklists SET ${fields.join(', ')} WHERE id = ?`;
        const result = await db.query(sql, params);
        return result.affectedRows > 0;
    }

    /**
     * Toggle checklist item completion
     */
    async toggleComplete(id, userId = null) {
        // First get current status
        const item = await db.queryOne('SELECT is_completed FROM activity_checklists WHERE id = ?', [id]);
        if (!item) {
            throw new Error('Checklist item not found');
        }

        const newStatus = item.is_completed ? 0 : 1;
        const updates = {
            is_completed: newStatus,
            completed_at: newStatus ? new Date() : null,
            completed_by: newStatus ? userId : null
        };

        return await this.update(id, updates);
    }

    /**
     * Delete checklist item
     */
    async delete(id) {
        const sql = 'DELETE FROM activity_checklists WHERE id = ?';
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Delete all checklist items for an activity
     */
    async deleteByActivityId(activityId) {
        const sql = 'DELETE FROM activity_checklists WHERE activity_id = ?';
        const result = await db.query(sql, [activityId]);
        return result.affectedRows > 0;
    }

    /**
     * Bulk create checklist items
     */
    async bulkCreate(activityId, items) {
        if (!items || items.length === 0) {
            return [];
        }

        const createdIds = [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const id = await this.create({
                activity_id: activityId,
                item_name: item.item_name || item.name || item,
                orderindex: item.orderindex !== undefined ? item.orderindex : i,
                is_completed: item.is_completed || 0
            });
            createdIds.push(id);
        }

        return createdIds;
    }

    /**
     * Reorder checklist items
     */
    async reorder(activityId, itemIds) {
        // itemIds is an array of IDs in the new order
        for (let i = 0; i < itemIds.length; i++) {
            await this.update(itemIds[i], { orderindex: i });
        }
        return true;
    }

    /**
     * Check if activity has any incomplete checklist items
     */
    async hasIncompleteItems(activityId) {
        const sql = `
            SELECT COUNT(*) as incomplete_count
            FROM activity_checklists
            WHERE activity_id = ? AND is_completed = 0
        `;
        const result = await db.queryOne(sql, [activityId]);
        return result && result.incomplete_count > 0;
    }
}

module.exports = new ActivityChecklistService();
