/**
 * Indicators Service
 * Manages SMART indicators for logframe implementation
 */

const logger = require('../core/utils/logger');

class IndicatorsService {
    constructor(db) {
        this.db = db;
    }

    // ==============================================
    // CREATE
    // ==============================================

    async createIndicator(data) {
        try {
            const result = await this.db.query(`
                INSERT INTO me_indicators (
                    program_id, project_id, activity_id,
                    module_id, sub_program_id, component_id,
                    name, code, description, type, category,
                    unit_of_measure, baseline_value, baseline_date,
                    target_value, target_date, current_value,
                    collection_frequency, data_source, verification_method,
                    disaggregation, status, achievement_percentage,
                    responsible_person, notes, clickup_custom_field_id,
                    is_active, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                data.program_id || null,
                data.project_id || null,
                data.activity_id || null,
                data.module_id || null,
                data.sub_program_id || null,
                data.component_id || null,
                data.name,
                data.code,
                data.description || null,
                data.type, // output, outcome, impact, process
                data.category || null,
                data.unit_of_measure || null,
                data.baseline_value || null,
                data.baseline_date || null,
                data.target_value,
                data.target_date || null,
                data.current_value || 0,
                data.collection_frequency || 'monthly',
                data.data_source || null,
                data.verification_method || null,
                data.disaggregation ? JSON.stringify(data.disaggregation) : null,
                data.status || 'not-started',
                data.achievement_percentage || 0,
                data.responsible_person || null,
                data.notes || null,
                data.clickup_custom_field_id || null,
                data.is_active !== undefined ? data.is_active : 1
            ]);

            const indicatorId = result.insertId;
            logger.info(`Created indicator ${indicatorId}: ${data.name}`);

            // Calculate initial achievement percentage
            await this.calculateAchievement(indicatorId);

            return indicatorId;
        } catch (error) {
            logger.error('Error creating indicator:', error);
            throw error;
        }
    }

    // ==============================================
    // READ
    // ==============================================

    async getIndicatorById(id) {
        try {
            const indicators = await this.db.query(`
                SELECT * FROM me_indicators
                WHERE id = ? AND deleted_at IS NULL
            `, [id]);

            if (indicators.length === 0) return null;

            const indicator = indicators[0];

            // Parse JSON fields
            if (indicator.disaggregation) {
                indicator.disaggregation = JSON.parse(indicator.disaggregation);
            }

            return indicator;
        } catch (error) {
            logger.error(`Error fetching indicator ${id}:`, error);
            throw error;
        }
    }

    async getIndicatorsByEntity(entityType, entityId) {
        try {
            let whereClause = '';
            const params = [];

            switch (entityType) {
                case 'module':
                    whereClause = 'module_id = ?';
                    params.push(entityId);
                    break;
                case 'sub_program':
                    whereClause = 'sub_program_id = ?';
                    params.push(entityId);
                    break;
                case 'component':
                    whereClause = 'component_id = ?';
                    params.push(entityId);
                    break;
                case 'activity':
                    whereClause = 'activity_id = ?';
                    params.push(entityId);
                    break;
                // Legacy support
                case 'program':
                    whereClause = 'program_id = ?';
                    params.push(entityId);
                    break;
                case 'project':
                    whereClause = 'project_id = ?';
                    params.push(entityId);
                    break;
                default:
                    throw new Error(`Invalid entity type: ${entityType}`);
            }

            const indicators = await this.db.query(`
                SELECT * FROM me_indicators
                WHERE ${whereClause} AND deleted_at IS NULL
                ORDER BY type, code
            `, params);

            // Parse JSON fields
            return indicators.map(ind => {
                if (ind.disaggregation) {
                    ind.disaggregation = JSON.parse(ind.disaggregation);
                }
                return ind;
            });
        } catch (error) {
            logger.error(`Error fetching indicators for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getIndicatorsByType(type) {
        try {
            const indicators = await this.db.query(`
                SELECT * FROM me_indicators
                WHERE type = ? AND deleted_at IS NULL
                ORDER BY code
            `, [type]);

            return indicators.map(ind => {
                if (ind.disaggregation) {
                    ind.disaggregation = JSON.parse(ind.disaggregation);
                }
                return ind;
            });
        } catch (error) {
            logger.error(`Error fetching indicators by type ${type}:`, error);
            throw error;
        }
    }

    async getAllIndicators(filters = {}) {
        try {
            let query = `
                SELECT i.*,
                    CASE
                        WHEN i.module_id IS NOT NULL THEN (SELECT name FROM program_modules WHERE id = i.module_id)
                        WHEN i.sub_program_id IS NOT NULL THEN (SELECT name FROM sub_programs WHERE id = i.sub_program_id)
                        WHEN i.component_id IS NOT NULL THEN (SELECT name FROM project_components WHERE id = i.component_id)
                        WHEN i.activity_id IS NOT NULL THEN (SELECT name FROM activities WHERE id = i.activity_id)
                        ELSE 'Unassigned'
                    END as entity_name
                FROM me_indicators i
                WHERE i.deleted_at IS NULL
            `;

            const params = [];

            if (filters.type) {
                query += ' AND i.type = ?';
                params.push(filters.type);
            }

            if (filters.status) {
                query += ' AND i.status = ?';
                params.push(filters.status);
            }

            if (filters.is_active !== undefined) {
                query += ' AND i.is_active = ?';
                params.push(filters.is_active);
            }

            query += ' ORDER BY i.type, i.code';

            const indicators = await this.db.query(query, params);

            return indicators.map(ind => {
                if (ind.disaggregation) {
                    ind.disaggregation = JSON.parse(ind.disaggregation);
                }
                return ind;
            });
        } catch (error) {
            logger.error('Error fetching all indicators:', error);
            throw error;
        }
    }

    // ==============================================
    // UPDATE
    // ==============================================

    async updateIndicator(id, data) {
        try {
            const updates = [];
            const params = [];

            // Build dynamic update query
            const fields = [
                'name', 'description', 'type', 'category', 'unit_of_measure',
                'baseline_value', 'baseline_date', 'target_value', 'target_date',
                'current_value', 'collection_frequency', 'data_source',
                'verification_method', 'status', 'responsible_person',
                'notes', 'is_active'
            ];

            fields.forEach(field => {
                if (data[field] !== undefined) {
                    updates.push(`${field} = ?`);
                    params.push(data[field]);
                }
            });

            // Handle JSON field
            if (data.disaggregation !== undefined) {
                updates.push('disaggregation = ?');
                params.push(JSON.stringify(data.disaggregation));
            }

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(id);

            await this.db.query(`
                UPDATE me_indicators
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = ?
            `, params);

            // Recalculate achievement if relevant fields changed
            if (data.current_value !== undefined || data.target_value !== undefined) {
                await this.calculateAchievement(id);
            }

            logger.info(`Updated indicator ${id}`);
            return id;
        } catch (error) {
            logger.error(`Error updating indicator ${id}:`, error);
            throw error;
        }
    }

    async updateCurrentValue(id, value, measurementDate = null) {
        try {
            await this.db.query(`
                UPDATE me_indicators
                SET current_value = ?,
                    last_measured_date = ?,
                    updated_at = NOW()
                WHERE id = ?
            `, [value, measurementDate || new Date(), id]);

            await this.calculateAchievement(id);

            logger.info(`Updated current value for indicator ${id}: ${value}`);
            return id;
        } catch (error) {
            logger.error(`Error updating current value for indicator ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // DELETE (Soft Delete)
    // ==============================================

    async deleteIndicator(id) {
        try {
            await this.db.query(`
                UPDATE me_indicators
                SET deleted_at = NOW()
                WHERE id = ?
            `, [id]);

            logger.info(`Soft deleted indicator ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting indicator ${id}:`, error);
            throw error;
        }
    }

    async restoreIndicator(id) {
        try {
            await this.db.query(`
                UPDATE me_indicators
                SET deleted_at = NULL
                WHERE id = ?
            `, [id]);

            logger.info(`Restored indicator ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error restoring indicator ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // CALCULATIONS & ANALYTICS
    // ==============================================

    async calculateAchievement(id) {
        try {
            const indicator = await this.getIndicatorById(id);
            if (!indicator) return;

            let achievement = 0;
            let status = 'not-started';

            if (indicator.target_value > 0) {
                achievement = (indicator.current_value / indicator.target_value) * 100;
                achievement = Math.min(achievement, 100); // Cap at 100%

                // Determine status based on achievement
                if (achievement === 0) {
                    status = 'not-started';
                } else if (achievement >= 75) {
                    status = 'on-track';
                } else if (achievement >= 50) {
                    status = 'at-risk';
                } else {
                    status = 'off-track';
                }
            }

            await this.db.query(`
                UPDATE me_indicators
                SET achievement_percentage = ?,
                    status = ?
                WHERE id = ?
            `, [achievement, status, id]);

            return { achievement, status };
        } catch (error) {
            logger.error(`Error calculating achievement for indicator ${id}:`, error);
            throw error;
        }
    }

    async getIndicatorStatistics(entityType, entityId) {
        try {
            let whereClause = '';
            const params = [];

            switch (entityType) {
                case 'module':
                    whereClause = 'module_id = ?';
                    break;
                case 'sub_program':
                    whereClause = 'sub_program_id = ?';
                    break;
                case 'component':
                    whereClause = 'component_id = ?';
                    break;
                case 'activity':
                    whereClause = 'activity_id = ?';
                    break;
                default:
                    throw new Error(`Invalid entity type: ${entityType}`);
            }

            params.push(entityId);

            const stats = await this.db.query(`
                SELECT
                    COUNT(*) as total_indicators,
                    COUNT(CASE WHEN status = 'on-track' THEN 1 END) as on_track,
                    COUNT(CASE WHEN status = 'at-risk' THEN 1 END) as at_risk,
                    COUNT(CASE WHEN status = 'off-track' THEN 1 END) as off_track,
                    COUNT(CASE WHEN status = 'not-started' THEN 1 END) as not_started,
                    AVG(achievement_percentage) as avg_achievement,
                    COUNT(CASE WHEN type = 'impact' THEN 1 END) as impact_indicators,
                    COUNT(CASE WHEN type = 'outcome' THEN 1 END) as outcome_indicators,
                    COUNT(CASE WHEN type = 'output' THEN 1 END) as output_indicators,
                    COUNT(CASE WHEN type = 'process' THEN 1 END) as process_indicators
                FROM me_indicators
                WHERE ${whereClause} AND deleted_at IS NULL
            `, params);

            return stats[0];
        } catch (error) {
            logger.error(`Error getting indicator statistics:`, error);
            throw error;
        }
    }

    // ==============================================
    // MEASUREMENTS (from me_results table)
    // ==============================================

    async addMeasurement(indicatorId, data) {
        try {
            const result = await this.db.query(`
                INSERT INTO me_results (
                    indicator_id, reporting_period_start, reporting_period_end,
                    value, disaggregation, data_collector, collection_date,
                    measurement_method, verification_status, notes, attachments
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                indicatorId,
                data.reporting_period_start,
                data.reporting_period_end,
                data.value,
                data.disaggregation ? JSON.stringify(data.disaggregation) : null,
                data.data_collector || null,
                data.collection_date || new Date(),
                data.measurement_method || null,
                data.verification_status || 'pending',
                data.notes || null,
                data.attachments ? JSON.stringify(data.attachments) : null
            ]);

            // Update indicator's current value
            await this.updateCurrentValue(indicatorId, data.value, data.collection_date);

            logger.info(`Added measurement for indicator ${indicatorId}`);
            return result.insertId;
        } catch (error) {
            logger.error(`Error adding measurement:`, error);
            throw error;
        }
    }

    async getMeasurements(indicatorId, limit = 10) {
        try {
            const measurements = await this.db.query(`
                SELECT * FROM me_results
                WHERE indicator_id = ?
                ORDER BY reporting_period_end DESC
                LIMIT ?
            `, [indicatorId, limit]);

            return measurements.map(m => {
                if (m.disaggregation) m.disaggregation = JSON.parse(m.disaggregation);
                if (m.attachments) m.attachments = JSON.parse(m.attachments);
                return m;
            });
        } catch (error) {
            logger.error(`Error getting measurements:`, error);
            throw error;
        }
    }
}

module.exports = IndicatorsService;
