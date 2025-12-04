/**
 * Assumptions Service
 * Manages assumptions and risk tracking for logframe
 */

const logger = require('../core/utils/logger');

class AssumptionsService {
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

    async createAssumption(data) {
        try {
            // Calculate risk level from likelihood and impact
            const riskLevel = this.calculateRiskLevel(
                this.sanitizeValue(data.likelihood, 'medium'),
                this.sanitizeValue(data.impact, 'medium')
            );

            const result = await this.db.query(`
                INSERT INTO assumptions (
                    entity_type, entity_id, assumption_text, assumption_category,
                    likelihood, impact, risk_level, status, validation_date,
                    validation_notes, mitigation_strategy, mitigation_status,
                    last_reviewed_date, next_review_date, responsible_person,
                    notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.entity_type,
                data.entity_id,
                data.assumption_text,
                this.sanitizeValue(data.assumption_category),
                this.sanitizeValue(data.likelihood, 'medium'),
                this.sanitizeValue(data.impact, 'medium'),
                riskLevel,
                this.sanitizeValue(data.status, 'needs-review'),
                this.sanitizeValue(data.validation_date),
                this.sanitizeValue(data.validation_notes),
                this.sanitizeValue(data.mitigation_strategy),
                this.sanitizeValue(data.mitigation_status, 'not-started'),
                this.sanitizeValue(data.last_reviewed_date),
                this.sanitizeValue(data.next_review_date),
                this.sanitizeValue(data.responsible_person),
                this.sanitizeValue(data.notes),
                this.sanitizeValue(data.created_by)
            ]);

            const assumptionId = result.insertId;
            logger.info(`Created assumption ${assumptionId} for ${data.entity_type} ${data.entity_id}`);

            return assumptionId;
        } catch (error) {
            logger.error('Error creating assumption:', error);
            throw error;
        }
    }

    // ==============================================
    // READ
    // ==============================================

    async getAssumptionById(id) {
        try {
            const assumptions = await this.db.query(`
                SELECT * FROM assumptions
                WHERE id = ? AND deleted_at IS NULL
            `, [id]);

            return assumptions.length > 0 ? assumptions[0] : null;
        } catch (error) {
            logger.error(`Error fetching assumption ${id}:`, error);
            throw error;
        }
    }

    async getAssumptionsByEntity(entityType, entityId) {
        try {
            const assumptions = await this.db.query(`
                SELECT * FROM assumptions
                WHERE entity_type = ? AND entity_id = ? AND deleted_at IS NULL
                ORDER BY risk_level DESC, created_at DESC
            `, [entityType, entityId]);

            return assumptions;
        } catch (error) {
            logger.error(`Error fetching assumptions for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getAllAssumptions(filters = {}) {
        try {
            let query = `
                SELECT a.*,
                    CASE a.entity_type
                        WHEN 'module' THEN (SELECT name FROM program_modules WHERE id = a.entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = a.entity_id)
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = a.entity_id)
                        WHEN 'activity' THEN (SELECT name FROM activities WHERE id = a.entity_id)
                    END as entity_name
                FROM assumptions a
                WHERE a.deleted_at IS NULL
            `;

            const params = [];

            if (filters.entity_type) {
                query += ' AND a.entity_type = ?';
                params.push(filters.entity_type);
            }

            if (filters.risk_level) {
                query += ' AND a.risk_level = ?';
                params.push(filters.risk_level);
            }

            if (filters.status) {
                query += ' AND a.status = ?';
                params.push(filters.status);
            }

            if (filters.assumption_category) {
                query += ' AND a.assumption_category = ?';
                params.push(filters.assumption_category);
            }

            query += ' ORDER BY a.risk_level DESC, a.created_at DESC';

            const assumptions = await this.db.query(query, params);
            return assumptions;
        } catch (error) {
            logger.error('Error fetching all assumptions:', error);
            throw error;
        }
    }

    async getAssumptionsByRiskLevel(riskLevel) {
        try {
            const assumptions = await this.db.query(`
                SELECT * FROM assumptions
                WHERE risk_level = ? AND deleted_at IS NULL
                ORDER BY created_at DESC
            `, [riskLevel]);

            return assumptions;
        } catch (error) {
            logger.error(`Error fetching assumptions by risk level ${riskLevel}:`, error);
            throw error;
        }
    }

    async getHighRiskAssumptions() {
        try {
            const assumptions = await this.db.query(`
                SELECT * FROM assumptions
                WHERE risk_level IN ('high', 'critical')
                  AND status != 'invalid'
                  AND deleted_at IS NULL
                ORDER BY FIELD(risk_level, 'critical', 'high'), created_at DESC
            `);

            return assumptions;
        } catch (error) {
            logger.error('Error fetching high risk assumptions:', error);
            throw error;
        }
    }

    // ==============================================
    // UPDATE
    // ==============================================

    async updateAssumption(id, data) {
        try {
            const updates = [];
            const params = [];

            // Recalculate risk level if likelihood or impact changed
            if (data.likelihood || data.impact) {
                const current = await this.getAssumptionById(id);
                const likelihood = data.likelihood || current.likelihood;
                const impact = data.impact || current.impact;
                data.risk_level = this.calculateRiskLevel(likelihood, impact);
            }

            const fields = [
                'assumption_text', 'assumption_category', 'likelihood', 'impact',
                'risk_level', 'status', 'validation_date', 'validation_notes',
                'mitigation_strategy', 'mitigation_status', 'last_reviewed_date',
                'next_review_date', 'responsible_person', 'notes'
            ];

            fields.forEach(field => {
                if (data[field] !== undefined) {
                    updates.push(`${field} = ?`);
                    params.push(data[field]);
                }
            });

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(id);

            await this.db.query(`
                UPDATE assumptions
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = ?
            `, params);

            logger.info(`Updated assumption ${id}`);
            return id;
        } catch (error) {
            logger.error(`Error updating assumption ${id}:`, error);
            throw error;
        }
    }

    async validateAssumption(id, status, validationNotes = null) {
        try {
            await this.db.query(`
                UPDATE assumptions
                SET status = ?,
                    validation_date = NOW(),
                    validation_notes = ?,
                    last_reviewed_date = NOW(),
                    updated_at = NOW()
                WHERE id = ?
            `, [status, validationNotes, id]);

            logger.info(`Validated assumption ${id} with status: ${status}`);
            return true;
        } catch (error) {
            logger.error(`Error validating assumption ${id}:`, error);
            throw error;
        }
    }

    async updateMitigationStatus(id, mitigationStatus, notes = null) {
        try {
            await this.db.query(`
                UPDATE assumptions
                SET mitigation_status = ?,
                    notes = COALESCE(?, notes),
                    updated_at = NOW()
                WHERE id = ?
            `, [mitigationStatus, notes, id]);

            logger.info(`Updated mitigation status for assumption ${id}: ${mitigationStatus}`);
            return true;
        } catch (error) {
            logger.error(`Error updating mitigation status for assumption ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // DELETE (Soft Delete)
    // ==============================================

    async deleteAssumption(id) {
        try {
            await this.db.query(`
                UPDATE assumptions
                SET deleted_at = NOW()
                WHERE id = ?
            `, [id]);

            logger.info(`Soft deleted assumption ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting assumption ${id}:`, error);
            throw error;
        }
    }

    async restoreAssumption(id) {
        try {
            await this.db.query(`
                UPDATE assumptions
                SET deleted_at = NULL
                WHERE id = ?
            `, [id]);

            logger.info(`Restored assumption ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error restoring assumption ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // UTILITIES & STATISTICS
    // ==============================================

    calculateRiskLevel(likelihood, impact) {
        const riskMatrix = {
            'very-low': 1,
            'low': 2,
            'medium': 3,
            'high': 4,
            'very-high': 5
        };

        const likelihoodScore = riskMatrix[likelihood] || 3;
        const impactScore = riskMatrix[impact] || 3;
        const riskScore = likelihoodScore * impactScore;

        // Risk score ranges: 1-4: low, 5-9: medium, 10-16: high, 17-25: critical
        if (riskScore <= 4) return 'low';
        if (riskScore <= 9) return 'medium';
        if (riskScore <= 16) return 'high';
        return 'critical';
    }

    async getAssumptionStatistics(entityType, entityId, user = null) {
        try {
            let userFilter = '';
            const params = [entityType, entityId];

            if (user && !user.is_system_admin) {
                userFilter = ' AND (created_by = ? OR owned_by = ?)';
                params.push(user.id, user.id);
            }

            const stats = await this.db.query(`
                SELECT
                    COUNT(*) as total_assumptions,
                    COUNT(CASE WHEN risk_level = 'critical' THEN 1 END) as critical_risk,
                    COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk,
                    COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk,
                    COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk,
                    COUNT(CASE WHEN status = 'valid' THEN 1 END) as valid,
                    COUNT(CASE WHEN status = 'invalid' THEN 1 END) as invalid,
                    COUNT(CASE WHEN status = 'needs-review' THEN 1 END) as needs_review,
                    COUNT(CASE WHEN mitigation_status = 'implemented' THEN 1 END) as mitigations_implemented,
                    COUNT(CASE WHEN mitigation_status = 'in-progress' THEN 1 END) as mitigations_in_progress
                FROM assumptions
                WHERE entity_type = ? AND entity_id = ?${userFilter} AND deleted_at IS NULL
            `, params);

            return stats[0];
        } catch (error) {
            logger.error('Error getting assumption statistics:', error);
            throw error;
        }
    }
}

module.exports = AssumptionsService;
