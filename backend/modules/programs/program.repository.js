/**
 * Program Repository
 * Data access layer for programs
 */

const db = require('../../core/database/connection');
const logger = require('../../core/utils/logger');

class ProgramRepository {
    /**
     * Find all programs
     */
    async findAll(filters = {}) {
        let sql = `
            SELECT * FROM programs
            WHERE deleted_at IS NULL
        `;
        const params = [];

        // Apply filters
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
     * Count programs
     */
    async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM programs WHERE deleted_at IS NULL';
        const params = [];

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        const result = await db.queryOne(sql, params);
        return result ? result.total : 0;
    }

    /**
     * Find program by ID
     */
    async findById(id) {
        const sql = 'SELECT * FROM programs WHERE id = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [id]);
    }

    /**
     * Find program by code
     */
    async findByCode(code) {
        const sql = 'SELECT * FROM programs WHERE code = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [code]);
    }

    /**
     * Find program by ClickUp Space ID
     */
    async findByClickUpSpaceId(spaceId) {
        const sql = 'SELECT * FROM programs WHERE clickup_space_id = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [spaceId]);
    }

    /**
     * Create new program
     */
    async create(programData) {
        const sql = `
            INSERT INTO programs (
                name, code, icon, description, start_date, end_date,
                budget, status, manager_id, manager_name, manager_email,
                country, region, district, clickup_space_id,
                sync_status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            programData.name,
            programData.code,
            programData.icon || null,
            programData.description || null,
            programData.start_date,
            programData.end_date || null,
            programData.budget || null,
            programData.status || 'planning',
            programData.manager_id || null,
            programData.manager_name || null,
            programData.manager_email || null,
            programData.country || null,
            programData.region || null,
            programData.district || null,
            programData.clickup_space_id || null,
            'pending',
            programData.created_by || null
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    /**
     * Update program
     */
    async update(id, programData) {
        const fields = [];
        const params = [];

        // Build dynamic update query
        const allowedFields = [
            'name', 'icon', 'description', 'start_date', 'end_date', 'budget',
            'status', 'manager_id', 'manager_name', 'manager_email',
            'country', 'region', 'district', 'clickup_space_id', 'sync_status'
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

        const sql = `UPDATE programs SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
        const result = await db.query(sql, params);
        return result.affectedRows > 0;
    }

    /**
     * Soft delete program
     */
    async delete(id) {
        const sql = 'UPDATE programs SET deleted_at = NOW() WHERE id = ?';
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    /**
     * Get program statistics
     */
    async getStats(id) {
        const sql = `
            SELECT
                p.id,
                p.name,
                p.budget,
                COUNT(DISTINCT pr.id) as total_projects,
                COUNT(DISTINCT a.id) as total_activities,
                COUNT(DISTINCT t.id) as total_tasks,
                SUM(pr.budget) as total_project_budget,
                AVG(pr.progress_percentage) as avg_progress
            FROM programs p
            LEFT JOIN projects pr ON p.id = pr.program_id AND pr.deleted_at IS NULL
            LEFT JOIN activities a ON pr.id = a.project_id AND a.deleted_at IS NULL
            LEFT JOIN tasks t ON a.id = t.activity_id AND t.deleted_at IS NULL
            WHERE p.id = ? AND p.deleted_at IS NULL
            GROUP BY p.id
        `;

        return await db.queryOne(sql, [id]);
    }

    /**
     * Get program with projects
     */
    async findWithProjects(id) {
        const program = await this.findById(id);
        if (!program) return null;

        const projects = await db.query(
            'SELECT * FROM projects WHERE program_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
            [id]
        );

        return {
            ...program,
            projects
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
     * Get programs pending sync
     */
    async findPendingSync() {
        const sql = `
            SELECT * FROM programs
            WHERE sync_status = 'pending' AND deleted_at IS NULL
            ORDER BY created_at ASC
        `;
        return await db.query(sql);
    }
}

module.exports = new ProgramRepository();
