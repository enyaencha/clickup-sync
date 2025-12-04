/**
 * Means of Verification Service
 * Manages evidence sources and verification methods for logframe
 */

const logger = require('../core/utils/logger');

class MeansOfVerificationService {
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

    async createVerification(data) {
        try {
            const result = await this.db.query(`
                INSERT INTO means_of_verification (
                    entity_type, entity_id, verification_method, description,
                    evidence_type, document_name, document_path, document_date,
                    verification_status, verified_by, verified_date, verification_notes,
                    collection_frequency, responsible_person, notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.entity_type,
                data.entity_id,
                data.verification_method,
                this.sanitizeValue(data.description),
                data.evidence_type,
                this.sanitizeValue(data.document_name),
                this.sanitizeValue(data.document_path),
                this.sanitizeValue(data.document_date),
                this.sanitizeValue(data.verification_status, 'pending'),
                this.sanitizeValue(data.verified_by),
                this.sanitizeValue(data.verified_date),
                this.sanitizeValue(data.verification_notes),
                this.sanitizeValue(data.collection_frequency, 'monthly'),
                this.sanitizeValue(data.responsible_person),
                this.sanitizeValue(data.notes),
                this.sanitizeValue(data.created_by)
            ]);

            const verificationId = result.insertId;
            logger.info(`Created verification ${verificationId} for ${data.entity_type} ${data.entity_id}`);

            return verificationId;
        } catch (error) {
            logger.error('Error creating verification:', error);
            throw error;
        }
    }

    // ==============================================
    // READ
    // ==============================================

    async getVerificationById(id) {
        try {
            const verifications = await this.db.query(`
                SELECT * FROM means_of_verification
                WHERE id = ? AND deleted_at IS NULL
            `, [id]);

            return verifications.length > 0 ? verifications[0] : null;
        } catch (error) {
            logger.error(`Error fetching verification ${id}:`, error);
            throw error;
        }
    }

    async getVerificationsByEntity(entityType, entityId) {
        try {
            const verifications = await this.db.query(`
                SELECT * FROM means_of_verification
                WHERE entity_type = ? AND entity_id = ? AND deleted_at IS NULL
                ORDER BY created_at DESC
            `, [entityType, entityId]);

            return verifications;
        } catch (error) {
            logger.error(`Error fetching verifications for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getAllVerifications(filters = {}) {
        try {
            let query = `
                SELECT mov.*,
                    CASE mov.entity_type
                        WHEN 'module' THEN (SELECT name FROM program_modules WHERE id = mov.entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = mov.entity_id)
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = mov.entity_id)
                        WHEN 'activity' THEN (SELECT name FROM activities WHERE id = mov.entity_id)
                        WHEN 'indicator' THEN (SELECT name FROM me_indicators WHERE id = mov.entity_id)
                    END as entity_name
                FROM means_of_verification mov
                WHERE mov.deleted_at IS NULL
            `;

            const params = [];

            if (filters.entity_type) {
                query += ' AND mov.entity_type = ?';
                params.push(filters.entity_type);
            }

            if (filters.evidence_type) {
                query += ' AND mov.evidence_type = ?';
                params.push(filters.evidence_type);
            }

            if (filters.verification_status) {
                query += ' AND mov.verification_status = ?';
                params.push(filters.verification_status);
            }

            query += ' ORDER BY mov.created_at DESC';

            const verifications = await this.db.query(query, params);
            return verifications;
        } catch (error) {
            logger.error('Error fetching all verifications:', error);
            throw error;
        }
    }

    async getVerificationsByStatus(status) {
        try {
            const verifications = await this.db.query(`
                SELECT * FROM means_of_verification
                WHERE verification_status = ? AND deleted_at IS NULL
                ORDER BY created_at DESC
            `, [status]);

            return verifications;
        } catch (error) {
            logger.error(`Error fetching verifications by status ${status}:`, error);
            throw error;
        }
    }

    // ==============================================
    // UPDATE
    // ==============================================

    async updateVerification(id, data) {
        try {
            const updates = [];
            const params = [];

            const fields = [
                'verification_method', 'description', 'evidence_type',
                'document_name', 'document_path', 'document_date',
                'verification_status', 'verified_by', 'verified_date',
                'verification_notes', 'collection_frequency',
                'responsible_person', 'notes'
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
                UPDATE means_of_verification
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = ?
            `, params);

            logger.info(`Updated verification ${id}`);
            return id;
        } catch (error) {
            logger.error(`Error updating verification ${id}:`, error);
            throw error;
        }
    }

    async verifyEvidence(id, verifiedBy, verificationNotes = null) {
        try {
            await this.db.query(`
                UPDATE means_of_verification
                SET verification_status = 'verified',
                    verified_by = ?,
                    verified_date = NOW(),
                    verification_notes = ?,
                    updated_at = NOW()
                WHERE id = ?
            `, [verifiedBy, verificationNotes, id]);

            logger.info(`Verified evidence ${id} by user ${verifiedBy}`);
            return true;
        } catch (error) {
            logger.error(`Error verifying evidence ${id}:`, error);
            throw error;
        }
    }

    async rejectEvidence(id, verifiedBy, verificationNotes) {
        try {
            await this.db.query(`
                UPDATE means_of_verification
                SET verification_status = 'rejected',
                    verified_by = ?,
                    verified_date = NOW(),
                    verification_notes = ?,
                    updated_at = NOW()
                WHERE id = ?
            `, [verifiedBy, verificationNotes, id]);

            logger.info(`Rejected evidence ${id} by user ${verifiedBy}`);
            return true;
        } catch (error) {
            logger.error(`Error rejecting evidence ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // DELETE (Soft Delete)
    // ==============================================

    async deleteVerification(id) {
        try {
            await this.db.query(`
                UPDATE means_of_verification
                SET deleted_at = NOW()
                WHERE id = ?
            `, [id]);

            logger.info(`Soft deleted verification ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting verification ${id}:`, error);
            throw error;
        }
    }

    async restoreVerification(id) {
        try {
            await this.db.query(`
                UPDATE means_of_verification
                SET deleted_at = NULL
                WHERE id = ?
            `, [id]);

            logger.info(`Restored verification ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error restoring verification ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // STATISTICS
    // ==============================================

    async getVerificationStatistics(entityType, entityId, user = null) {
        try {
            let userFilter = '';
            const params = [entityType, entityId];

            if (user && !user.is_system_admin) {
                userFilter = ' AND (created_by = ? OR owned_by = ?)';
                params.push(user.id, user.id);
            }

            const stats = await this.db.query(`
                SELECT
                    COUNT(*) as total_verifications,
                    COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified,
                    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending,
                    COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected,
                    COUNT(CASE WHEN verification_status = 'needs-update' THEN 1 END) as needs_update,
                    COUNT(CASE WHEN evidence_type = 'document' THEN 1 END) as documents,
                    COUNT(CASE WHEN evidence_type = 'photo' THEN 1 END) as photos,
                    COUNT(CASE WHEN evidence_type = 'survey' THEN 1 END) as surveys,
                    COUNT(CASE WHEN evidence_type = 'report' THEN 1 END) as reports
                FROM means_of_verification
                WHERE entity_type = ? AND entity_id = ?${userFilter} AND deleted_at IS NULL
            `, params);

            return stats[0];
        } catch (error) {
            logger.error('Error getting verification statistics:', error);
            throw error;
        }
    }
}

module.exports = MeansOfVerificationService;
