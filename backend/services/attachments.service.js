/**
 * Attachments Service
 * Manages file attachments for verification evidence
 */

const logger = require('../core/utils/logger');
const fs = require('fs').promises;
const path = require('path');

class AttachmentsService {
    constructor(db) {
        this.db = db;
        this.uploadsDir = path.join(__dirname, '../../uploads');
    }

    // Ensure uploads directory exists
    async ensureUploadsDir() {
        try {
            await fs.mkdir(this.uploadsDir, { recursive: true });
            logger.info('Uploads directory ready:', this.uploadsDir);
        } catch (error) {
            logger.error('Error creating uploads directory:', error);
            throw error;
        }
    }

    // ==============================================
    // CREATE
    // ==============================================

    async createAttachment(data) {
        try {
            const result = await this.db.query(`
                INSERT INTO attachments (
                    entity_type, entity_id, file_name, file_path,
                    file_url, file_type, file_size, attachment_type,
                    description, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.entity_type,
                data.entity_id,
                data.file_name,
                data.file_path || null,
                data.file_url || null,
                data.file_type || null,
                data.file_size || null,
                data.attachment_type || 'other',
                data.description || null,
                data.created_by || null
            ]);

            const attachmentId = result.insertId;
            logger.info(`Created attachment ${attachmentId} for ${data.entity_type} ${data.entity_id}`);

            return attachmentId;
        } catch (error) {
            logger.error('Error creating attachment:', error);
            throw error;
        }
    }

    // ==============================================
    // READ
    // ==============================================

    async getAttachmentById(id) {
        try {
            const attachments = await this.db.query(`
                SELECT * FROM attachments
                WHERE id = ? AND deleted_at IS NULL
            `, [id]);

            return attachments.length > 0 ? attachments[0] : null;
        } catch (error) {
            logger.error(`Error fetching attachment ${id}:`, error);
            throw error;
        }
    }

    async getAttachmentsByEntity(entityType, entityId) {
        try {
            const attachments = await this.db.query(`
                SELECT * FROM attachments
                WHERE entity_type = ? AND entity_id = ? AND deleted_at IS NULL
                ORDER BY created_at DESC
            `, [entityType, entityId]);

            return attachments;
        } catch (error) {
            logger.error(`Error fetching attachments for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    // ==============================================
    // UPDATE
    // ==============================================

    async updateAttachment(id, data) {
        try {
            const updates = [];
            const params = [];

            const fields = ['file_name', 'file_path', 'file_url', 'file_type',
                          'file_size', 'attachment_type', 'description'];

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
                UPDATE attachments
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = ?
            `, params);

            logger.info(`Updated attachment ${id}`);
            return id;
        } catch (error) {
            logger.error(`Error updating attachment ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // DELETE (Soft Delete)
    // ==============================================

    async deleteAttachment(id) {
        try {
            // Get file path before deleting
            const attachment = await this.getAttachmentById(id);

            if (!attachment) {
                throw new Error('Attachment not found');
            }

            // Soft delete in database
            await this.db.query(`
                UPDATE attachments
                SET deleted_at = NOW()
                WHERE id = ?
            `, [id]);

            // Optionally delete physical file (comment out to keep files)
            if (attachment.file_path) {
                try {
                    const fullPath = path.join(this.uploadsDir, path.basename(attachment.file_path));
                    await fs.unlink(fullPath);
                    logger.info(`Deleted file: ${fullPath}`);
                } catch (fileError) {
                    logger.warn(`Could not delete file: ${fileError.message}`);
                }
            }

            logger.info(`Soft deleted attachment ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting attachment ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // STATISTICS
    // ==============================================

    async getAttachmentStatistics(entityType, entityId) {
        try {
            const stats = await this.db.query(`
                SELECT
                    COUNT(*) as total_attachments,
                    SUM(file_size) as total_size,
                    COUNT(CASE WHEN attachment_type = 'photo' THEN 1 END) as photos,
                    COUNT(CASE WHEN attachment_type = 'document' THEN 1 END) as documents,
                    COUNT(CASE WHEN attachment_type = 'report' THEN 1 END) as reports
                FROM attachments
                WHERE entity_type = ? AND entity_id = ? AND deleted_at IS NULL
            `, [entityType, entityId]);

            return stats[0];
        } catch (error) {
            logger.error('Error getting attachment statistics:', error);
            throw error;
        }
    }
}

module.exports = AttachmentsService;
