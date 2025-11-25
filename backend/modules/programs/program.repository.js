/**
 * Program Module Repository
 * Data access layer for program modules (Level 1 in hierarchy)
 * Maps to ClickUp Spaces
 */

const db = require('../../core/database/connection');
const logger = require('../../core/utils/logger');

class ProgramRepository {
    /**
     * Find all program modules
     */
    async findAll(filters = {}) {
        let sql = `
            SELECT * FROM program_modules
            WHERE deleted_at IS NULL
        `;
        const params = [];

        // Apply filters
        if (filters.organization_id) {
            sql += ' AND organization_id = ?';
            params.push(filters.organization_id);
        }

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        if (filters.code) {
            sql += ' AND code = ?';
            params.push(filters.code);
        }

        sql += ' ORDER BY created_at DESC';

        // Pagination - directly interpolate LIMIT/OFFSET (safe since converted to numbers)
        if (filters.limit) {
            const limit = Number(filters.limit) || 20;
            const offset = Number(filters.offset) || 0;
            sql += ` LIMIT ${limit} OFFSET ${offset}`;
        }

        return await db.query(sql, params);
    }

    /**
     * Count program modules
     */
    async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM program_modules WHERE deleted_at IS NULL';
        const params = [];

        if (filters.organization_id) {
            sql += ' AND organization_id = ?';
            params.push(filters.organization_id);
        }

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        const result = await db.queryOne(sql, params);
        return result ? result.total : 0;
    }

    /**
     * Find program module by ID
     */
    async findById(id) {
        const sql = 'SELECT * FROM program_modules WHERE id = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [id]);
    }

    /**
     * Find program module by code
     */
    async findByCode(code) {
        const sql = 'SELECT * FROM program_modules WHERE code = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [code]);
    }

    /**
     * Find program module by ClickUp Space ID
     */
    async findByClickUpSpaceId(spaceId) {
        const sql = 'SELECT * FROM program_modules WHERE clickup_space_id = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [spaceId]);
    }

    /**
     * Create new program module
     */
    async create(programData) {
        const sql = `
            INSERT INTO program_modules (
                organization_id, name, code, icon, description,
                color, clickup_space_id, budget, start_date, end_date,
                manager_name, manager_email, status, is_active,
                sync_status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            programData.organization_id || 1, // Default to organization 1
            programData.name,
            programData.code,
            programData.icon || null,
            programData.description || null,
            programData.color || null,
            programData.clickup_space_id || null,
            programData.budget || null,
            programData.start_date || null,
            programData.end_date || null,
            programData.manager_name || null,
            programData.manager_email || null,
            programData.status || 'active',
            programData.is_active !== undefined ? programData.is_active : 1,
            'pending',
            programData.created_by || null
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    /**
     * Update program module
     */
    async update(id, programData) {
        const fields = [];
        const params = [];

        // Build dynamic update query
        const allowedFields = [
            'name', 'icon', 'description', 'color', 'start_date', 'end_date',
            'budget', 'status', 'is_active', 'manager_name', 'manager_email',
            'clickup_space_id', 'sync_status'
        ];

        allowedFields.forEach(field => {
            if (programData[field] !== undefined) {
                fields.push(`${field} = ?`);
                params.push(programData[field]);
            }
        });

        if (fields.length === 0) {
            return false;
        }

        params.push(id);

        const sql = `UPDATE program_modules SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
        const result = await db.query(sql, params);
        return result.affectedRows > 0;
    }

    /**
     * Soft delete program module
     */
    async delete(id) {
        const sql = 'UPDATE program_modules SET deleted_at = NOW() WHERE id = ?';
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Get program module statistics
     */
    async getStats(id) {
        const sql = `
            SELECT
                pm.id,
                pm.name,
                pm.budget,
                COUNT(DISTINCT sp.id) as total_sub_programs,
                COUNT(DISTINCT pc.id) as total_components,
                COUNT(DISTINCT a.id) as total_activities,
                SUM(sp.budget) as total_sub_program_budget,
                AVG(sp.progress_percentage) as avg_progress
            FROM program_modules pm
            LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
            LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
            LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
            WHERE pm.id = ? AND pm.deleted_at IS NULL
            GROUP BY pm.id
        `;

        return await db.queryOne(sql, [id]);
    }

    /**
     * Get program module with sub-programs
     */
    async findWithSubPrograms(id) {
        const programModule = await this.findById(id);
        if (!programModule) return null;

        const subPrograms = await db.query(
            'SELECT * FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
            [id]
        );

        return {
            ...programModule,
            sub_programs: subPrograms
        };
    }

    /**
     * Update sync status
     */
    async updateSyncStatus(id, status, clickupSpaceId = null) {
        const updates = {
            sync_status: status,
            last_synced_at: new Date()
        };

        if (clickupSpaceId) {
            updates.clickup_space_id = clickupSpaceId;
        }

        return await this.update(id, updates);
    }

    /**
     * Get program modules pending sync
     */
    async findPendingSync() {
        const sql = `
            SELECT * FROM program_modules
            WHERE sync_status = 'pending' AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        return await db.query(sql);
    }
}

module.exports = new ProgramRepository();
