/**
 * Status Calculator Service
 * Automatically calculates status for activities, components, sub-programs, and modules
 * based on time progress and indicator achievement
 */

class StatusCalculatorService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Calculate status for a single activity
     * @param {number} activityId - Activity ID
     * @returns {Promise<object>} - Calculated status information
     */
    async calculateActivityStatus(activityId) {
        // Get activity details
        const activity = await this.db.queryOne(
            `SELECT * FROM activities WHERE id = ? AND deleted_at IS NULL`,
            [activityId]
        );

        if (!activity) {
            throw new Error(`Activity ${activityId} not found`);
        }

        // If manually overridden, return manual status
        if (activity.status_override) {
            return {
                activityId,
                status: activity.manual_status || activity.status,
                progress: activity.progress_percentage || 0,
                isOverridden: true,
                calculationType: 'manual'
            };
        }

        // If completed or cancelled, keep that status
        if (activity.status === 'completed' || activity.status === 'cancelled') {
            return {
                activityId,
                status: activity.status,
                progress: activity.status === 'completed' ? 100 : activity.progress_percentage || 0,
                isOverridden: false,
                calculationType: 'final'
            };
        }

        const now = new Date();
        const startDate = activity.start_date ? new Date(activity.start_date) : null;
        const endDate = activity.end_date ? new Date(activity.end_date) : null;

        // If not started yet
        if (startDate && now < startDate) {
            return {
                activityId,
                status: 'not-started',
                progress: 0,
                isOverridden: false,
                calculationType: 'auto',
                details: 'Activity has not started yet'
            };
        }

        // Calculate time-based progress
        let timeProgress = 0;
        if (startDate && endDate && startDate < endDate) {
            const totalDuration = endDate - startDate;
            const elapsed = now - startDate;
            timeProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        }

        // Get indicators for this activity
        const indicators = await this.db.query(
            `SELECT * FROM me_indicators
             WHERE activity_id = ? AND deleted_at IS NULL AND is_active = 1`,
            [activityId]
        );

        // Calculate indicator-based progress
        let indicatorProgress = 0;
        let hasIndicators = indicators.length > 0;

        if (hasIndicators) {
            const achievementSum = indicators.reduce((sum, ind) => {
                return sum + (ind.achievement_percentage || 0);
            }, 0);
            indicatorProgress = achievementSum / indicators.length;
        }

        // Combined progress (40% time, 60% indicators if available)
        const actualProgress = hasIndicators
            ? (timeProgress * 0.4) + (indicatorProgress * 0.6)
            : timeProgress;

        // Expected progress (where we should be based on time)
        const expectedProgress = timeProgress;

        // Variance (positive = ahead, negative = behind)
        const variance = actualProgress - expectedProgress;

        // Determine status based on variance
        let calculatedStatus;
        let statusReason;

        if (variance >= 0) {
            calculatedStatus = 'on-track';
            statusReason = `Activity is on track (${variance.toFixed(1)}% ahead/on schedule)`;
        } else if (variance >= -10) {
            calculatedStatus = 'at-risk';
            statusReason = `Activity is slightly behind schedule (${Math.abs(variance).toFixed(1)}% behind)`;
        } else if (variance >= -25) {
            calculatedStatus = 'delayed';
            statusReason = `Activity is significantly behind schedule (${Math.abs(variance).toFixed(1)}% behind)`;
        } else {
            calculatedStatus = 'off-track';
            statusReason = `Activity is critically behind schedule (${Math.abs(variance).toFixed(1)}% behind)`;
        }

        // Check for high risk indicators
        const risks = await this.db.query(
            `SELECT * FROM activity_risks
             WHERE activity_id = ? AND status IN ('identified', 'active')
             AND risk_level IN ('high', 'critical')`,
            [activityId]
        );

        if (risks.length > 0 && calculatedStatus === 'on-track') {
            calculatedStatus = 'at-risk';
            statusReason += ' (High risk identified)';
        }

        return {
            activityId,
            status: calculatedStatus,
            progress: Math.round(actualProgress * 100) / 100,
            timeProgress: Math.round(timeProgress * 100) / 100,
            indicatorProgress: Math.round(indicatorProgress * 100) / 100,
            expectedProgress: Math.round(expectedProgress * 100) / 100,
            variance: Math.round(variance * 100) / 100,
            isOverridden: false,
            calculationType: hasIndicators ? 'time+indicators' : 'time-only',
            statusReason,
            indicatorCount: indicators.length,
            riskCount: risks.length
        };
    }

    /**
     * Update activity status in database
     * @param {number} activityId - Activity ID
     * @param {boolean} recordHistory - Whether to record in status_history
     * @returns {Promise<object>} - Update result
     */
    async updateActivityStatus(activityId, recordHistory = true) {
        const calculated = await this.calculateActivityStatus(activityId);

        // Get current status for history
        const current = await this.db.queryOne(
            'SELECT status, progress_percentage FROM activities WHERE id = ?',
            [activityId]
        );

        // Update activity
        await this.db.query(
            `UPDATE activities
             SET auto_status = ?,
                 status = IF(status_override = 1, status, ?),
                 progress_percentage = ?,
                 status_reason = ?,
                 last_status_update = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                calculated.status || null,
                calculated.status || null,
                calculated.progress || 0,
                calculated.statusReason || null,
                activityId
            ]
        );

        // Record status history
        if (recordHistory && current && current.status !== calculated.status) {
            await this.db.query(
                `INSERT INTO status_history
                 (entity_type, entity_id, old_status, new_status, old_progress, new_progress,
                  change_type, change_reason, override_applied)
                 VALUES ('activity', ?, ?, ?, ?, ?, 'auto', ?, 0)`,
                [
                    activityId,
                    current.status || null,
                    calculated.status || null,
                    current.progress_percentage || 0,
                    calculated.progress || 0,
                    calculated.statusReason || null
                ]
            );
        }

        return calculated;
    }

    /**
     * Calculate component status by rolling up activity statuses
     * @param {number} componentId - Component ID
     * @returns {Promise<object>} - Calculated status
     */
    async calculateComponentStatus(componentId) {
        const component = await this.db.queryOne(
            'SELECT * FROM project_components WHERE id = ? AND deleted_at IS NULL',
            [componentId]
        );

        if (!component) {
            throw new Error(`Component ${componentId} not found`);
        }

        // If manually overridden, return manual status
        if (component.status_override) {
            return {
                componentId,
                status: component.manual_status || component.overall_status,
                progress: component.progress_percentage || 0,
                isOverridden: true
            };
        }

        // Get all activities for this component
        const activities = await this.db.query(
            'SELECT id, status, progress_percentage, auto_status FROM activities WHERE component_id = ? AND deleted_at IS NULL',
            [componentId]
        );

        if (activities.length === 0) {
            return {
                componentId,
                status: 'not-started',
                progress: 0,
                activityCount: 0
            };
        }

        // Count activities by status
        const statusCounts = {
            'off-track': 0,
            'delayed': 0,
            'at-risk': 0,
            'on-track': 0,
            'in-progress': 0,
            'completed': 0,
            'not-started': 0,
            'cancelled': 0
        };

        let totalProgress = 0;

        activities.forEach(act => {
            const status = act.auto_status || act.status;
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            totalProgress += act.progress_percentage || 0;
        });

        const avgProgress = totalProgress / activities.length;

        // Determine overall status (worst status takes precedence)
        let overallStatus;
        let statusReason;

        if (statusCounts['off-track'] > 0) {
            overallStatus = 'off-track';
            statusReason = `${statusCounts['off-track']} activities are off-track`;
        } else if (statusCounts['delayed'] > 0) {
            overallStatus = 'delayed';
            statusReason = `${statusCounts['delayed']} activities are delayed`;
        } else if (statusCounts['at-risk'] > 0) {
            overallStatus = 'at-risk';
            statusReason = `${statusCounts['at-risk']} activities are at-risk`;
        } else if (statusCounts['completed'] === activities.length) {
            overallStatus = 'completed';
            statusReason = 'All activities completed';
        } else if (statusCounts['on-track'] > 0 || statusCounts['in-progress'] > 0) {
            overallStatus = 'on-track';
            statusReason = `${statusCounts['on-track'] + statusCounts['in-progress']} activities in progress`;
        } else {
            overallStatus = 'not-started';
            statusReason = 'No activities started';
        }

        return {
            componentId,
            status: overallStatus,
            progress: Math.round(avgProgress * 100) / 100,
            activityCount: activities.length,
            statusCounts,
            statusReason
        };
    }

    /**
     * Update component status in database
     * @param {number} componentId - Component ID
     * @param {boolean} recordHistory - Whether to record history
     * @returns {Promise<object>} - Update result
     */
    async updateComponentStatus(componentId, recordHistory = true) {
        const calculated = await this.calculateComponentStatus(componentId);

        // Get current status
        const current = await this.db.queryOne(
            'SELECT overall_status, progress_percentage FROM project_components WHERE id = ?',
            [componentId]
        );

        // Update component
        await this.db.query(
            `UPDATE project_components
             SET auto_status = ?,
                 overall_status = IF(status_override = 1, overall_status, ?),
                 progress_percentage = ?,
                 last_status_update = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                calculated.status || null,
                calculated.status || null,
                calculated.progress || 0,
                componentId
            ]
        );

        // Record history
        if (recordHistory && current && current.overall_status !== calculated.status) {
            await this.db.query(
                `INSERT INTO status_history
                 (entity_type, entity_id, old_status, new_status, old_progress, new_progress,
                  change_type, change_reason)
                 VALUES ('component', ?, ?, ?, ?, ?, 'auto', ?)`,
                [
                    componentId,
                    current.overall_status || null,
                    calculated.status || null,
                    current.progress_percentage || 0,
                    calculated.progress || 0,
                    calculated.statusReason || null
                ]
            );
        }

        return calculated;
    }

    /**
     * Calculate sub-program status by rolling up component statuses
     * @param {number} subProgramId - Sub-program ID
     * @returns {Promise<object>} - Calculated status
     */
    async calculateSubProgramStatus(subProgramId) {
        const subProgram = await this.db.queryOne(
            'SELECT * FROM sub_programs WHERE id = ? AND deleted_at IS NULL',
            [subProgramId]
        );

        if (!subProgram) {
            throw new Error(`Sub-program ${subProgramId} not found`);
        }

        if (subProgram.status_override) {
            return {
                subProgramId,
                status: subProgram.manual_status || subProgram.overall_status,
                progress: subProgram.progress_percentage || 0,
                isOverridden: true
            };
        }

        // Get all components
        const components = await this.db.query(
            'SELECT id, overall_status, progress_percentage, auto_status FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL',
            [subProgramId]
        );

        if (components.length === 0) {
            return {
                subProgramId,
                status: 'not-started',
                progress: 0,
                componentCount: 0
            };
        }

        // Rollup logic same as components
        const statusCounts = {};
        let totalProgress = 0;

        components.forEach(comp => {
            const status = comp.auto_status || comp.overall_status;
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            totalProgress += comp.progress_percentage || 0;
        });

        const avgProgress = totalProgress / components.length;

        // Determine status (worst takes precedence)
        let overallStatus = 'not-started';
        if (statusCounts['off-track']) overallStatus = 'off-track';
        else if (statusCounts['delayed']) overallStatus = 'delayed';
        else if (statusCounts['at-risk']) overallStatus = 'at-risk';
        else if (statusCounts['completed'] === components.length) overallStatus = 'completed';
        else if (statusCounts['on-track'] || statusCounts['in-progress']) overallStatus = 'on-track';

        return {
            subProgramId,
            status: overallStatus,
            progress: Math.round(avgProgress * 100) / 100,
            componentCount: components.length,
            statusCounts
        };
    }

    /**
     * Update sub-program status
     * @param {number} subProgramId - Sub-program ID
     * @returns {Promise<object>} - Update result
     */
    async updateSubProgramStatus(subProgramId) {
        const calculated = await this.calculateSubProgramStatus(subProgramId);

        await this.db.query(
            `UPDATE sub_programs
             SET auto_status = ?,
                 overall_status = IF(status_override = 1, overall_status, ?),
                 progress_percentage = ?,
                 last_status_update = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                calculated.status || null,
                calculated.status || null,
                calculated.progress || 0,
                subProgramId
            ]
        );

        return calculated;
    }

    /**
     * Recalculate all statuses for a module (cascade from activities up)
     * @param {number} moduleId - Module ID
     * @returns {Promise<object>} - Summary of updates
     */
    async recalculateModuleStatuses(moduleId) {
        const summary = {
            moduleId,
            activitiesUpdated: 0,
            componentsUpdated: 0,
            subProgramsUpdated: 0
        };

        // Get all sub-programs for this module
        const subPrograms = await this.db.query(
            'SELECT id FROM sub_programs WHERE module_id = ? AND deleted_at IS NULL',
            [moduleId]
        );

        for (const subProgram of subPrograms) {
            // Get all components
            const components = await this.db.query(
                'SELECT id FROM project_components WHERE sub_program_id = ? AND deleted_at IS NULL',
                [subProgram.id]
            );

            for (const component of components) {
                // Get all activities
                const activities = await this.db.query(
                    'SELECT id FROM activities WHERE component_id = ? AND deleted_at IS NULL',
                    [component.id]
                );

                // Update each activity
                for (const activity of activities) {
                    await this.updateActivityStatus(activity.id);
                    summary.activitiesUpdated++;
                }

                // Update component (rollup from activities)
                await this.updateComponentStatus(component.id);
                summary.componentsUpdated++;
            }

            // Update sub-program (rollup from components)
            await this.updateSubProgramStatus(subProgram.id);
            summary.subProgramsUpdated++;
        }

        return summary;
    }

    /**
     * Cascade status update from activity to parent component and sub-program
     * @param {number} activityId - Activity ID
     * @returns {Promise<object>} - Summary of what was updated
     */
    async cascadeActivityStatusUpdate(activityId) {
        const summary = {
            activityUpdated: false,
            componentUpdated: false,
            subProgramUpdated: false
        };

        try {
            // Update activity status
            await this.updateActivityStatus(activityId, true);
            summary.activityUpdated = true;

            // Get activity's component
            const activity = await this.db.queryOne(
                'SELECT component_id FROM activities WHERE id = ? AND deleted_at IS NULL',
                [activityId]
            );

            if (activity && activity.component_id) {
                // Update component status (rollup from all activities)
                await this.updateComponentStatus(activity.component_id, true);
                summary.componentUpdated = true;

                // Get component's sub-program
                const component = await this.db.queryOne(
                    'SELECT sub_program_id FROM project_components WHERE id = ? AND deleted_at IS NULL',
                    [activity.component_id]
                );

                if (component && component.sub_program_id) {
                    // Update sub-program status (rollup from all components)
                    await this.updateSubProgramStatus(component.sub_program_id);
                    summary.subProgramUpdated = true;
                }
            }
        } catch (error) {
            console.error(`Error cascading status update for activity ${activityId}:`, error.message);
            throw error;
        }

        return summary;
    }

    /**
     * Recalculate all statuses system-wide
     * @returns {Promise<object>} - Summary
     */
    async recalculateAllStatuses() {
        const modules = await this.db.query(
            'SELECT id FROM program_modules WHERE deleted_at IS NULL'
        );

        const summary = {
            modulesProcessed: 0,
            totalActivities: 0,
            totalComponents: 0,
            totalSubPrograms: 0
        };

        for (const module of modules) {
            const result = await this.recalculateModuleStatuses(module.id);
            summary.modulesProcessed++;
            summary.totalActivities += result.activitiesUpdated;
            summary.totalComponents += result.componentsUpdated;
            summary.totalSubPrograms += result.subProgramsUpdated;
        }

        return summary;
    }
}

module.exports = StatusCalculatorService;
