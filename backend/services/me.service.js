/**
 * M&E Service
 * Core business logic for M&E entities
 */

const logger = require('../core/utils/logger');

class MEService {
    constructor(db) {
        this.db = db;
    }

    // ==============================================
    // PROGRAM MODULES
    // ==============================================

    async createProgramModule(data) {
        const result = await this.db.query(`
            INSERT INTO program_modules (
                organization_id, name, code, icon, description,
                color, budget, start_date, end_date,
                manager_name, manager_email, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.organization_id || 1,
            data.name,
            data.code,
            data.icon,
            data.description,
            data.color,
            data.budget,
            data.start_date,
            data.end_date,
            data.manager_name,
            data.manager_email,
            data.status || 'active'
        ]);

        const moduleId = result.insertId;

        // Queue for sync to ClickUp
        await this.queueForSync('program_module', moduleId, 'create');

        return moduleId;
    }

    async updateProgramModule(id, data) {
        await this.db.query(`
            UPDATE program_modules
            SET name = ?, description = ?, color = ?,
                budget = ?, manager_name = ?, manager_email = ?,
                status = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            data.name,
            data.description,
            data.color,
            data.budget,
            data.manager_name,
            data.manager_email,
            data.status,
            id
        ]);

        // Queue for sync
        await this.queueForSync('program_module', id, 'update');

        return id;
    }

    async getProgramModules(userId = null, isSystemAdmin = false) {
        let query = `
            SELECT DISTINCT pm.*
            FROM program_modules pm
        `;
        let params = [];

        // Role-based access control: Filter by user's module assignments
        if (userId && !isSystemAdmin) {
            query += `
            INNER JOIN user_module_assignments uma ON pm.id = uma.module_id
            WHERE uma.user_id = ? AND uma.can_view = TRUE AND pm.deleted_at IS NULL
            `;
            params.push(userId);
        } else {
            query += ' WHERE pm.deleted_at IS NULL';
        }

        query += ' ORDER BY pm.code';

        const modules = await this.db.query(query, params);
        return modules;
    }

    // ==============================================
    // SUB-PROGRAMS
    // ==============================================

    async createSubProgram(data) {
        const result = await this.db.query(`
            INSERT INTO sub_programs (
                module_id, name, code, description,
                budget, start_date, end_date,
                target_beneficiaries, location,
                manager_name, status, priority
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.module_id,
            data.name,
            data.code,
            data.description,
            data.budget,
            data.start_date,
            data.end_date,
            data.target_beneficiaries,
            JSON.stringify(data.location || {}),
            data.manager_name,
            data.status || 'active',
            data.priority || 'medium'
        ]);

        const subProgramId = result.insertId;
        await this.queueForSync('sub_program', subProgramId, 'create');

        return subProgramId;
    }

    async updateSubProgram(id, data) {
        await this.db.query(`
            UPDATE sub_programs
            SET name = ?, description = ?, budget = ?,
                status = ?, priority = ?, progress_percentage = ?,
                actual_beneficiaries = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            data.name,
            data.description,
            data.budget,
            data.status,
            data.priority,
            data.progress_percentage,
            data.actual_beneficiaries,
            id
        ]);

        await this.queueForSync('sub_program', id, 'update');
        return id;
    }

    async getSubPrograms(moduleId = null, userId = null, isSystemAdmin = false) {
        let query = `
            SELECT DISTINCT sp.*
            FROM sub_programs sp
        `;
        let params = [];

        // Role-based access control: Filter by user's module assignments
        if (userId && !isSystemAdmin) {
            query += `
            INNER JOIN user_module_assignments uma ON sp.module_id = uma.module_id
            WHERE uma.user_id = ? AND uma.can_view = TRUE AND sp.deleted_at IS NULL
            `;
            params.push(userId);
        } else {
            query += ' WHERE sp.deleted_at IS NULL';
        }

        if (moduleId) {
            query += ' AND sp.module_id = ?';
            params.push(moduleId);
        }

        query += ' ORDER BY sp.code';

        const subPrograms = await this.db.query(query, params);
        return subPrograms;
    }

    // ==============================================
    // PROJECT COMPONENTS
    // ==============================================

    async createProjectComponent(data) {
        const result = await this.db.query(`
            INSERT INTO project_components (
                sub_program_id, name, code, description,
                budget, responsible_person, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            data.sub_program_id,
            data.name,
            data.code,
            data.description,
            data.budget,
            data.responsible_person,
            data.status || 'not-started'
        ]);

        const componentId = result.insertId;
        await this.queueForSync('project_component', componentId, 'create');

        return componentId;
    }

    async updateProjectComponent(id, data) {
        await this.db.query(`
            UPDATE project_components
            SET name = ?, description = ?, status = ?,
                progress_percentage = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            data.name,
            data.description,
            data.status,
            data.progress_percentage,
            id
        ]);

        await this.queueForSync('project_component', id, 'update');
        return id;
    }

    async getProjectComponents(subProgramId = null, userId = null, isSystemAdmin = false) {
        let query = `
            SELECT DISTINCT pc.*
            FROM project_components pc
            INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
        `;
        let params = [];

        // Role-based access control: Filter by user's module assignments
        if (userId && !isSystemAdmin) {
            query += `
            INNER JOIN user_module_assignments uma ON sp.module_id = uma.module_id
            WHERE uma.user_id = ? AND uma.can_view = TRUE AND pc.deleted_at IS NULL
            `;
            params.push(userId);
        } else {
            query += ' WHERE pc.deleted_at IS NULL';
        }

        if (subProgramId) {
            query += ' AND pc.sub_program_id = ?';
            params.push(subProgramId);
        }

        query += ' ORDER BY pc.code';

        const components = await this.db.query(query, params);
        return components;
    }

    // ==============================================
    // ACTIVITIES
    // ==============================================

    async createActivity(data) {
        // Helper to convert undefined to null
        const toNull = (value) => value === undefined ? null : value;

        // Look up the component to get its sub_program_id (project_id)
        const [component] = await this.db.query(`
            SELECT sub_program_id FROM project_components WHERE id = ?
        `, [data.component_id]);

        if (!component) {
            throw new Error(`Component with id ${data.component_id} not found`);
        }

        const result = await this.db.query(`
            INSERT INTO activities (
                project_id, component_id, code, name, description,
                location_id, location_details, parish, ward, county,
                activity_date, start_date, end_date, duration_hours,
                facilitators, staff_assigned,
                target_beneficiaries, beneficiary_type,
                budget_allocated, status, approval_status,
                priority, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            component.sub_program_id,
            data.component_id,
            data.code,
            data.name,
            data.description,
            toNull(data.location_id),
            toNull(data.location_details),
            toNull(data.parish),
            toNull(data.ward),
            toNull(data.county),
            toNull(data.activity_date),
            toNull(data.start_date),
            toNull(data.end_date),
            toNull(data.duration_hours),
            toNull(data.facilitators),
            toNull(data.staff_assigned),
            toNull(data.target_beneficiaries),
            toNull(data.beneficiary_type),
            toNull(data.budget_allocated),
            data.status || 'planned',
            data.approval_status || 'draft',
            data.priority || 'normal',
            toNull(data.created_by)
        ]);

        const activityId = result.insertId;
        await this.queueForSync('activity', activityId, 'create', 3); // Higher priority

        return activityId;
    }

    async updateActivity(id, data) {
        // Helper to convert undefined to null
        const toNull = (value) => value === undefined ? null : value;

        await this.db.query(`
            UPDATE activities
            SET name = ?, description = ?,
                activity_date = ?, status = ?, approval_status = ?,
                actual_beneficiaries = ?, budget_spent = ?,
                progress_percentage = ?, updated_at = NOW()
            WHERE id = ?
        `, [
            data.name,
            data.description,
            toNull(data.activity_date),
            data.status,
            data.approval_status,
            toNull(data.actual_beneficiaries),
            toNull(data.budget_spent),
            toNull(data.progress_percentage),
            id
        ]);

        await this.queueForSync('activity', id, 'update', 3);
        return id;
    }

    async updateApprovalStatus(id, approvalStatus, additionalData = {}) {
        await this.db.query(`
            UPDATE activities
            SET approval_status = ?, updated_at = NOW()
            WHERE id = ?
        `, [approvalStatus, id]);

        await this.queueForSync('activity', id, 'update', 3);
        return id;
    }

    async updateActivityStatus(id, status) {
        await this.db.query(`
            UPDATE activities
            SET status = ?, updated_at = NOW()
            WHERE id = ?
        `, [status, id]);

        await this.queueForSync('activity', id, 'update', 3);
        return id;
    }

    async deleteActivity(id) {
        // Soft delete - set deleted_at timestamp
        await this.db.query(`
            UPDATE activities
            SET deleted_at = NOW()
            WHERE id = ?
        `, [id]);

        await this.queueForSync('activity', id, 'delete', 3);
        return id;
    }

    async getActivities(filters = {}) {
        let query = `
            SELECT DISTINCT a.*,
                   pc.name AS component_name,
                   pc.id AS component_id,
                   sp.name AS sub_program_name,
                   sp.id AS sub_program_id,
                   pm.name AS module_name,
                   pm.id AS module_id
            FROM activities a
            INNER JOIN project_components pc ON a.component_id = pc.id
            INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
            INNER JOIN program_modules pm ON sp.module_id = pm.id
        `;
        let params = [];

        // Role-based access control: Filter by user's module assignments
        if (filters.userId && !filters.isSystemAdmin) {
            query += `
            INNER JOIN user_module_assignments uma ON pm.id = uma.module_id
            WHERE uma.user_id = ? AND uma.can_view = TRUE AND a.deleted_at IS NULL
            `;
            params.push(filters.userId);
        } else {
            query += ' WHERE a.deleted_at IS NULL';
        }

        // Module filter
        if (filters.module_id) {
            query += ' AND pm.id = ?';
            params.push(filters.module_id);
        }

        // Sub-program filter
        if (filters.sub_program_id) {
            query += ' AND sp.id = ?';
            params.push(filters.sub_program_id);
        }

        // Component filter
        if (filters.component_id) {
            query += ' AND a.component_id = ?';
            params.push(filters.component_id);
        }

        // Status filter
        if (filters.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }

        // Approval status filter
        if (filters.approval_status) {
            query += ' AND a.approval_status = ?';
            params.push(filters.approval_status);
        }

        // Date range filters
        if (filters.from_date) {
            query += ' AND a.activity_date >= ?';
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            query += ' AND a.activity_date <= ?';
            params.push(filters.to_date);
        }

        query += ' ORDER BY a.activity_date DESC';

        if (filters.limit) {
            query += ' LIMIT ?';
            params.push(parseInt(filters.limit));
        }

        const activities = await this.db.query(query, params);
        return activities;
    }

    async getActivityById(id) {
        const [activity] = await this.db.query(`
            SELECT a.*, pc.name AS component_name,
                   sp.name AS sub_program_name,
                   pm.name AS module_name
            FROM activities a
            INNER JOIN project_components pc ON a.component_id = pc.id
            INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
            INNER JOIN program_modules pm ON sp.module_id = pm.id
            WHERE a.id = ? AND a.deleted_at IS NULL
        `, [id]);

        return activity || null;
    }

    // ==============================================
    // PROGRESS CALCULATION
    // ==============================================

    async calculateComponentProgress(componentId) {
        // Get all activities for this component
        const activities = await this.db.query(`
            SELECT status FROM activities
            WHERE component_id = ? AND deleted_at IS NULL
        `, [componentId]);

        if (activities.length === 0) return 0;

        // Calculate progress based on status
        // completed = 100%, in-progress = 50%, others = 0%
        let totalProgress = 0;
        activities.forEach(activity => {
            if (activity.status === 'completed') {
                totalProgress += 100;
            } else if (activity.status === 'in-progress') {
                totalProgress += 50;
            }
            // not-started, blocked, cancelled = 0%
        });

        return Math.round(totalProgress / activities.length);
    }

    async calculateSubProgramProgress(subProgramId) {
        // Get all components for this sub-program
        const components = await this.db.query(`
            SELECT id FROM project_components
            WHERE sub_program_id = ? AND deleted_at IS NULL
        `, [subProgramId]);

        if (components.length === 0) return 0;

        // Calculate average progress of all components
        let totalProgress = 0;
        for (const component of components) {
            const componentProgress = await this.calculateComponentProgress(component.id);
            totalProgress += componentProgress;
        }

        return Math.round(totalProgress / components.length);
    }

    async getComponentsWithProgress(subProgramId = null) {
        const components = await this.getProjectComponents(subProgramId);

        // Add progress to each component
        for (const component of components) {
            component.progress_percentage = await this.calculateComponentProgress(component.id);
        }

        return components;
    }

    async getSubProgramsWithProgress(moduleId = null) {
        const subPrograms = await this.getSubPrograms(moduleId);

        // Add progress to each sub-program
        for (const subProgram of subPrograms) {
            subProgram.progress_percentage = await this.calculateSubProgramProgress(subProgram.id);
        }

        return subPrograms;
    }

    async getOverallStatistics(user = null, modules = null) {
        // Build module filter
        let moduleFilter = '';
        let moduleParams = [];

        if (modules && modules.length > 0) {
            const placeholders = modules.map(() => '?').join(',');
            moduleFilter = ` AND program_module_id IN (${placeholders})`;
            moduleParams = modules;
        }

        // Build user filter for activities
        let userFilter = '';
        let userParams = [];
        if (user && !user.is_system_admin) {
            userFilter = ' AND (a.created_by = ? OR a.owned_by = ?)';
            userParams = [user.id, user.id];
        }

        // Get counts for all entities
        const subProgramCount = await this.db.query(`
            SELECT COUNT(*) as count FROM sub_programs
            WHERE deleted_at IS NULL${moduleFilter}
        `, moduleParams);

        const componentCount = await this.db.query(`
            SELECT COUNT(*) as count
            FROM project_components pc
            JOIN sub_programs sp ON pc.sub_program_id = sp.id
            WHERE pc.deleted_at IS NULL${moduleFilter}
        `, moduleParams);

        const activityCount = await this.db.query(`
            SELECT COUNT(*) as count
            FROM activities a
            JOIN project_components pc ON a.component_id = pc.id
            JOIN sub_programs sp ON pc.sub_program_id = sp.id
            WHERE a.deleted_at IS NULL${moduleFilter}${userFilter}
        `, [...moduleParams, ...userParams]);

        // Get activity status breakdown
        const activityByStatus = await this.db.query(`
            SELECT a.status, COUNT(*) as count
            FROM activities a
            JOIN project_components pc ON a.component_id = pc.id
            JOIN sub_programs sp ON pc.sub_program_id = sp.id
            WHERE a.deleted_at IS NULL${moduleFilter}${userFilter}
            GROUP BY a.status
        `, [...moduleParams, ...userParams]);

        // Calculate overall progress across all activities
        const activities = await this.db.query(`
            SELECT a.status
            FROM activities a
            JOIN project_components pc ON a.component_id = pc.id
            JOIN sub_programs sp ON pc.sub_program_id = sp.id
            WHERE a.deleted_at IS NULL${moduleFilter}${userFilter}
        `, [...moduleParams, ...userParams]);

        let totalProgress = 0;
        if (activities && activities.length > 0) {
            activities.forEach(activity => {
                if (activity.status === 'completed') {
                    totalProgress += 100;
                } else if (activity.status === 'in-progress') {
                    totalProgress += 50;
                }
            });
            totalProgress = Math.round(totalProgress / activities.length);
        }

        return {
            sub_programs: subProgramCount[0]?.count || 0,
            components: componentCount[0]?.count || 0,
            activities: activityCount[0]?.count || 0,
            overall_progress: totalProgress,
            activity_by_status: activityByStatus || []
        };
    }

    async getProgramStatistics(moduleId, user = null) {
        console.log('getProgramStatistics called with moduleId:', moduleId, 'user:', user?.id);

        // Get sub-programs for this module
        const subPrograms = await this.db.query(`
            SELECT id FROM sub_programs
            WHERE program_module_id = ? AND deleted_at IS NULL
        `, [moduleId]);

        console.log('Found sub-programs:', subPrograms.length);

        if (!subPrograms || subPrograms.length === 0) {
            return {
                sub_programs: 0,
                components: 0,
                activities: 0,
                overall_progress: 0,
                activity_by_status: []
            };
        }

        const subProgramIds = subPrograms.map(sp => sp.id);
        console.log('Sub-program IDs:', subProgramIds);

        // Create placeholders for IN clause
        const subProgramPlaceholders = subProgramIds.map(() => '?').join(',');

        // Get components for these sub-programs
        const componentCount = await this.db.query(`
            SELECT COUNT(*) as count FROM project_components
            WHERE sub_program_id IN (${subProgramPlaceholders}) AND deleted_at IS NULL
        `, subProgramIds);

        console.log('Component count result:', componentCount);

        // Get component IDs
        const components = await this.db.query(`
            SELECT id FROM project_components
            WHERE sub_program_id IN (${subProgramPlaceholders}) AND deleted_at IS NULL
        `, subProgramIds);

        console.log('Found components:', components.length);

        const componentIds = components && components.length > 0 ? components.map(c => c.id) : [];
        console.log('Component IDs:', componentIds);

        let activityCount = 0;
        let activities = [];
        let activityByStatus = [];

        if (componentIds.length > 0) {
            // Create placeholders for IN clause
            const placeholders = componentIds.map(() => '?').join(',');

            // Build user filter for non-admin users
            let userFilter = '';
            let queryParams = [...componentIds];

            if (user && !user.is_system_admin) {
                userFilter = ' AND (created_by = ? OR owned_by = ?)';
                queryParams.push(user.id, user.id);
            }

            // Get activities for these components
            const actCount = await this.db.query(`
                SELECT COUNT(*) as count FROM activities
                WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
            `, queryParams);
            activityCount = actCount[0]?.count || 0;

            console.log('Activity count result:', actCount, 'extracted:', activityCount);

            // Get activity status breakdown
            activityByStatus = await this.db.query(`
                SELECT status, COUNT(*) as count
                FROM activities
                WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
                GROUP BY status
            `, queryParams);

            console.log('Activity by status:', activityByStatus);

            // Get all activities for progress calculation
            activities = await this.db.query(`
                SELECT status FROM activities
                WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
            `, queryParams);

            console.log('Activities for progress calc:', activities.length);
        }

        // Calculate overall progress for this program
        let totalProgress = 0;
        if (activities && activities.length > 0) {
            activities.forEach(activity => {
                if (activity.status === 'completed') {
                    totalProgress += 100;
                } else if (activity.status === 'in-progress') {
                    totalProgress += 50;
                }
            });
            totalProgress = Math.round(totalProgress / activities.length);
        }

        return {
            sub_programs: subPrograms.length,
            components: componentCount[0]?.count || 0,
            activities: activityCount,
            overall_progress: totalProgress,
            activity_by_status: activityByStatus || []
        };
    }

    async getSubProgramStatistics(subProgramId, user = null) {
        // Get components for this sub-program
        const components = await this.db.query(`
            SELECT id FROM project_components
            WHERE sub_program_id = ? AND deleted_at IS NULL
        `, [subProgramId]);

        if (!components || components.length === 0) {
            return {
                components: 0,
                activities: 0,
                overall_progress: 0,
                activity_by_status: []
            };
        }

        const componentIds = components.map(c => c.id);
        const placeholders = componentIds.map(() => '?').join(',');

        let activityCount = 0;
        let activities = [];
        let activityByStatus = [];

        // Build user filter for non-admin users
        let userFilter = '';
        let queryParams = [...componentIds];

        if (user && !user.is_system_admin) {
            userFilter = ' AND (created_by = ? OR owned_by = ?)';
            queryParams.push(user.id, user.id);
        }

        // Get activities for these components
        const actCount = await this.db.query(`
            SELECT COUNT(*) as count FROM activities
            WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
        `, queryParams);
        activityCount = actCount[0]?.count || 0;

        // Get activity status breakdown
        activityByStatus = await this.db.query(`
            SELECT status, COUNT(*) as count
            FROM activities
            WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
            GROUP BY status
        `, queryParams);

        // Get all activities for progress calculation
        activities = await this.db.query(`
            SELECT status FROM activities
            WHERE component_id IN (${placeholders}) AND deleted_at IS NULL${userFilter}
        `, queryParams);

        // Calculate overall progress for this sub-program
        let totalProgress = 0;
        if (activities && activities.length > 0) {
            activities.forEach(activity => {
                if (activity.status === 'completed') {
                    totalProgress += 100;
                } else if (activity.status === 'in-progress') {
                    totalProgress += 50;
                }
            });
            totalProgress = Math.round(totalProgress / activities.length);
        }

        return {
            components: components.length,
            activities: activityCount,
            overall_progress: totalProgress,
            activity_by_status: activityByStatus || []
        };
    }

    async getComponentStatistics(componentId, user = null) {
        // Build user filter for non-admin users
        let userFilter = '';
        let queryParams = [componentId];

        if (user && !user.is_system_admin) {
            userFilter = ' AND (created_by = ? OR owned_by = ?)';
            queryParams.push(user.id, user.id);
        }

        // Get activities for this component
        const activities = await this.db.query(`
            SELECT status FROM activities
            WHERE component_id = ? AND deleted_at IS NULL${userFilter}
        `, queryParams);

        if (!activities || activities.length === 0) {
            return {
                activities: 0,
                overall_progress: 0,
                activity_by_status: []
            };
        }

        // Get activity status breakdown
        const activityByStatus = await this.db.query(`
            SELECT status, COUNT(*) as count
            FROM activities
            WHERE component_id = ? AND deleted_at IS NULL${userFilter}
            GROUP BY status
        `, queryParams);

        // Calculate overall progress for this component
        let totalProgress = 0;
        activities.forEach(activity => {
            if (activity.status === 'completed') {
                totalProgress += 100;
            } else if (activity.status === 'in-progress') {
                totalProgress += 50;
            }
        });
        totalProgress = Math.round(totalProgress / activities.length);

        return {
            activities: activities.length,
            overall_progress: totalProgress,
            activity_by_status: activityByStatus || []
        };
    }

    // ==============================================
    // GOALS & INDICATORS
    // ==============================================

    async createGoal(data) {
        const result = await this.db.query(`
            INSERT INTO strategic_goals (
                category_id, name, description,
                owner_name, owner_email,
                start_date, target_date, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.category_id,
            data.name,
            data.description,
            data.owner_name,
            data.owner_email,
            data.start_date,
            data.target_date,
            data.status || 'active'
        ]);

        const goalId = result.insertId;
        await this.queueForSync('goal', goalId, 'create', 2);

        return goalId;
    }

    async updateGoal(id, data) {
        await this.db.query(`
            UPDATE strategic_goals
            SET name = ?, description = ?,
                target_date = ?, status = ?,
                updated_at = NOW()
            WHERE id = ?
        `, [
            data.name,
            data.description,
            data.target_date,
            data.status,
            id
        ]);

        await this.queueForSync('goal', id, 'update', 2);
        return id;
    }

    async createIndicator(data) {
        const result = await this.db.query(`
            INSERT INTO indicators (
                goal_id, name, description,
                indicator_type, target_value, current_value,
                unit, target_amount, current_amount,
                currency, is_completed, tracking_method
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.goal_id,
            data.name,
            data.description,
            data.indicator_type,
            data.target_value,
            data.current_value || 0,
            data.unit,
            data.target_amount,
            data.current_amount || 0,
            data.currency || 'KES',
            data.is_completed || false,
            data.tracking_method || 'manual'
        ]);

        const indicatorId = result.insertId;
        await this.queueForSync('indicator', indicatorId, 'create', 2);

        return indicatorId;
    }

    async updateIndicatorProgress(id, progress) {
        await this.db.query(`
            UPDATE indicators
            SET current_value = ?,
                current_amount = ?,
                is_completed = ?,
                progress_percentage = ?,
                updated_at = NOW()
            WHERE id = ?
        `, [
            progress.current_value,
            progress.current_amount,
            progress.is_completed,
            progress.progress_percentage,
            id
        ]);

        await this.queueForSync('indicator', id, 'update', 1); // Highest priority for progress updates
        return id;
    }

    // ==============================================
    // COMMENTS
    // ==============================================

    async addComment(data) {
        const result = await this.db.query(`
            INSERT INTO comments (
                entity_type, entity_id, comment_text,
                comment_type, user_id, user_name, user_email
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            data.entity_type,
            data.entity_id,
            data.comment_text,
            data.comment_type || 'general',
            data.user_id,
            data.user_name,
            data.user_email
        ]);

        const commentId = result.insertId;
        await this.queueForSync('comment', commentId, 'create', 4);

        return commentId;
    }

    // ==============================================
    // BENEFICIARIES
    // ==============================================

    async createBeneficiary(data) {
        const result = await this.db.query(`
            INSERT INTO beneficiaries (
                name, beneficiary_id_number, gender, age, age_group,
                beneficiary_type, location_id, parish, ward, county,
                is_vulnerable, vulnerability_category,
                phone, email, demographics
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.name,
            data.beneficiary_id_number,
            data.gender,
            data.age,
            data.age_group,
            data.beneficiary_type,
            data.location_id,
            data.parish,
            data.ward,
            data.county,
            data.is_vulnerable || false,
            JSON.stringify(data.vulnerability_category || []),
            data.phone,
            data.email,
            JSON.stringify(data.demographics || {})
        ]);

        return result.insertId;
    }

    async linkBeneficiaryToActivity(activityId, beneficiaryId, role = 'participant') {
        await this.db.query(`
            INSERT INTO activity_beneficiaries (activity_id, beneficiary_id, role)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE role = ?
        `, [activityId, beneficiaryId, role, role]);

        return true;
    }

    // ==============================================
    // REPORTS & DASHBOARDS
    // ==============================================

    async getProgramOverview() {
        const overview = await this.db.query(`
            SELECT * FROM v_program_overview
        `);
        return overview;
    }

    async getActivityDashboard(filters = {}) {
        let query = 'SELECT * FROM v_activity_dashboard WHERE 1=1';
        let params = [];

        if (filters.module_name) {
            query += ' AND module_name = ?';
            params.push(filters.module_name);
        }

        if (filters.status) {
            query += ' AND status = ?';
            params.push(filters.status);
        }

        const dashboard = await this.db.query(query, params);
        return dashboard;
    }

    async getGoalsProgress() {
        const progress = await this.db.query(`
            SELECT * FROM v_goals_progress
        `);
        return progress;
    }

    async getSyncQueueStatus() {
        const status = await this.db.query(`
            SELECT * FROM v_sync_queue_status
        `);
        return status;
    }

    // ==============================================
    // HELPER METHODS
    // ==============================================

    async queueForSync(entityType, entityId, operationType, priority = 5) {
        await this.db.query(`
            INSERT INTO sync_queue (
                operation_type, entity_type, entity_id,
                priority, status
            ) VALUES (?, ?, ?, ?, 'pending')
        `, [operationType, entityType, entityId, priority]);

        logger.info(`Queued for sync: ${operationType} ${entityType} #${entityId}`);
    }
}

module.exports = MEService;
