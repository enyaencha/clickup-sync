/**
 * Project Repository
 * Data access layer for projects
 */

const db = require('../../core/database/connection');

class ProjectRepository {
    async findAll(filters = {}) {
        let sql = 'SELECT * FROM projects WHERE deleted_at IS NULL';
        const params = [];

        if (filters.program_id) {
            sql += ' AND program_id = ?';
            params.push(filters.program_id);
        }

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        sql += ' ORDER BY created_at DESC';

        if (filters.limit) {
            sql += ' LIMIT ? OFFSET ?';
            params.push(parseInt(filters.limit), parseInt(filters.offset || 0));
        }

        return await db.query(sql, params);
    }

    async count(filters = {}) {
        let sql = 'SELECT COUNT(*) as total FROM projects WHERE deleted_at IS NULL';
        const params = [];

        if (filters.program_id) {
            sql += ' AND program_id = ?';
            params.push(filters.program_id);
        }

        if (filters.status) {
            sql += ' AND status = ?';
            params.push(filters.status);
        }

        const result = await db.queryOne(sql, params);
        return result ? result.total : 0;
    }

    async findById(id) {
        const sql = 'SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [id]);
    }

    async findByCode(code) {
        const sql = 'SELECT * FROM projects WHERE code = ? AND deleted_at IS NULL';
        return await db.queryOne(sql, [code]);
    }

    async create(projectData) {
        const sql = `
            INSERT INTO projects (
                program_id, name, code, description, start_date, end_date,
                budget, status, priority, manager_id, manager_name,
                target_beneficiaries, location_details, clickup_folder_id,
                sync_status, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            projectData.program_id,
            projectData.name,
            projectData.code,
            projectData.description || null,
            projectData.start_date,
            projectData.end_date,
            projectData.budget || null,
            projectData.status || 'planning',
            projectData.priority || 'medium',
            projectData.manager_id || null,
            projectData.manager_name || null,
            projectData.target_beneficiaries || null,
            JSON.stringify(projectData.location_details || {}),
            projectData.clickup_folder_id || null,
            'pending',
            projectData.created_by || null
        ];

        const result = await db.query(sql, params);
        return result.insertId;
    }

    async update(id, projectData) {
        const fields = [];
        const params = [];

        const allowedFields = [
            'name', 'description', 'start_date', 'end_date', 'budget',
            'actual_cost', 'status', 'priority', 'progress_percentage',
            'manager_id', 'manager_name', 'target_beneficiaries',
            'actual_beneficiaries', 'location_details', 'clickup_folder_id',
            'sync_status'
        ];

        allowedFields.forEach(field => {
            if (projectData[field] !== undefined) {
                if (field === 'location_details' && typeof projectData[field] === 'object') {
                    fields.push(`${field} = ?`);
                    params.push(JSON.stringify(projectData[field]));
                } else {
                    fields.push(`${field} = ?`);
                    params.push(projectData[field]);
                }
            }
        });

        if (fields.length === 0) return false;

        params.push(id);
        const sql = `UPDATE projects SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`;
        const result = await db.query(sql, params);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const sql = 'UPDATE projects SET deleted_at = NOW() WHERE id = ?';
        const result = await db.query(sql, [id]);
        return result.affectedRows > 0;
    }

    async getProgress(id) {
        const sql = `
            SELECT
                p.*,
                COUNT(DISTINCT a.id) as total_activities,
                COUNT(DISTINCT t.id) as total_tasks,
                SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
                AVG(a.progress_percentage) as avg_activity_progress
            FROM projects p
            LEFT JOIN activities a ON p.id = a.project_id AND a.deleted_at IS NULL
            LEFT JOIN tasks t ON a.id = t.activity_id AND t.deleted_at IS NULL
            WHERE p.id = ? AND p.deleted_at IS NULL
            GROUP BY p.id
        `;
        return await db.queryOne(sql, [id]);
    }

    async findWithActivities(id) {
        const project = await this.findById(id);
        if (!project) return null;

        const activities = await db.query(
            'SELECT * FROM activities WHERE project_id = ? AND deleted_at IS NULL ORDER BY created_at DESC',
            [id]
        );

        return { ...project, activities };
    }

    async updateSyncStatus(id, status, clickupFolderId = null) {
        const updates = {
            sync_status: status,
            last_synced_at: new Date()
        };

        if (clickupFolderId) {
            updates.clickup_folder_id = clickupFolderId;
        }

        return await this.update(id, updates);
    }

    async findPendingSync() {
        const sql = 'SELECT * FROM projects WHERE sync_status = \'pending\' AND deleted_at IS NULL ORDER BY created_at ASC';
        return await db.query(sql);
    }
}

module.exports = new ProjectRepository();
