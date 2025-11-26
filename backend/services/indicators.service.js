/**
 * Indicators Service
 * Manages SMART indicators for logframe implementation
 */

const logger = require('../core/utils/logger');

class IndicatorsService {
    constructor(db) {
        this.db = db;
    }

    // Helper function to convert undefined to null
    sanitizeValue(value, defaultValue = null) {
        if (value === undefined || value === '' || value === 'undefined') {
            return defaultValue;
        }
        return value;
    }

    // ==============================================
    // CREATE
    // ==============================================

    async createIndicator(data) {
        try {
            logger.info('=== Creating Indicator ===');
            logger.info('Received data:', JSON.stringify(data, null, 2));

            // Define all possible fields matching the exact table schema
            const fieldDefaults = {
                program_id: null,
                project_id: null,
                activity_id: null,
                module_id: null,
                sub_program_id: null,
                component_id: null,
                name: null,
                code: null,
                description: null,
                type: null,
                category: null,
                unit_of_measure: null,
                baseline_value: null,
                baseline_date: null,
                target_value: null,
                target_date: null,
                current_value: 0,
                collection_frequency: 'monthly',
                data_source: null,
                verification_method: null,
                disaggregation: null,
                status: 'not-started',
                achievement_percentage: 0,
                responsible_person: null,
                notes: null,
                clickup_custom_field_id: null,
                is_active: 1,
                last_measured_date: null,
                next_measurement_date: null
            };

            // Build clean data object - only include fields that exist in the table
            const cleanData = {};
            Object.keys(fieldDefaults).forEach(field => {
                // Use provided value or default
                let value = data.hasOwnProperty(field) ? data[field] : fieldDefaults[field];

                // Convert undefined and empty strings to null/default
                if (value === undefined || value === '' || value === 'undefined') {
                    value = fieldDefaults[field];
                }

                // Special handling for disaggregation (JSON field)
                if (field === 'disaggregation' && value && typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                cleanData[field] = value;
            });

            // Build dynamic INSERT query
            const fields = Object.keys(cleanData);
            const placeholders = fields.map(() => '?').join(', ');
            const values = fields.map(field => cleanData[field]);

            logger.info('Clean data:', JSON.stringify(cleanData, null, 2));
            logger.info('Values array:', JSON.stringify(values, null, 2));

            const sql = `
                INSERT INTO me_indicators (
                    ${fields.join(', ')},
                    created_at
                ) VALUES (${placeholders}, NOW())
            `;

            const result = await this.db.query(sql, values);

            const indicatorId = result.insertId;
            logger.info(`✅ Created indicator ${indicatorId}: ${cleanData.name}`);

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
