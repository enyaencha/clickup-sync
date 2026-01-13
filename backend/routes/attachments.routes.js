/**
 * Attachments API Routes
 * Routes for managing file attachments
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    fileFilter: function (req, file, cb) {
        // Accept images, documents, PDFs, and videos
        const allowedExtensions = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|csv|mp4|mov|avi|mkv|webm/;
        const allowedMimeTypes = /image\/|video\/|application\/pdf|application\/msword|application\/vnd|text\//;
        const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedMimeTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, documents, and videos are allowed.'));
        }
    }
});

module.exports = (attachmentsService) => {
    // ==============================================
    // CREATE - Upload file
    // ==============================================

    router.post('/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 10 }]), async (req, res) => {
        try {
            const files = [];
            if (req.files?.file?.length) {
                files.push(...req.files.file);
            }
            if (req.files?.files?.length) {
                files.push(...req.files.files);
            }

            if (files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            const { entity_type, entity_id, attachment_type, description } = req.body;

            if (!entity_type || !entity_id) {
                // Delete uploaded files if required params missing
                files.forEach((file) => {
                    try {
                        fs.unlinkSync(file.path);
                    } catch (e) {
                        // Ignore cleanup errors
                    }
                });
                return res.status(400).json({
                    success: false,
                    error: 'entity_type and entity_id are required'
                });
            }

            // Create attachment records in database
            const attachments = [];
            for (const file of files) {
                const attachmentId = await attachmentsService.createAttachment({
                    entity_type,
                    entity_id: parseInt(entity_id),
                    file_name: file.originalname,
                    file_path: `/uploads/${file.filename}`,
                    file_type: file.mimetype,
                    file_size: file.size,
                    attachment_type: attachment_type || 'document',
                    description: description || null,
                    uploaded_by: req.user?.id || 1 // TODO: Get from auth
                });
                attachments.push({
                    id: attachmentId,
                    name: file.originalname,
                    path: `/uploads/${file.filename}`,
                    size: file.size,
                    type: file.mimetype
                });
            }

            res.json({
                success: true,
                attachments,
                message: 'Files uploaded successfully'
            });
        } catch (error) {
            // Clean up files if database insert fails
            const files = [];
            if (req.files?.file?.length) {
                files.push(...req.files.file);
            }
            if (req.files?.files?.length) {
                files.push(...req.files.files);
            }
            files.forEach((file) => {
                try {
                    fs.unlinkSync(file.path);
                } catch (e) {
                    // Ignore cleanup errors
                }
            });
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // READ
    // ==============================================

    router.get('/', async (req, res) => {
        try {
            const { entity_type, entity_id } = req.query;

            if (!entity_type || !entity_id) {
                return res.status(400).json({
                    success: false,
                    error: 'entity_type and entity_id are required'
                });
            }

            const attachments = await attachmentsService.getAttachmentsByEntity(
                entity_type,
                entity_id
            );

            res.json({
                success: true,
                data: attachments,
                count: attachments.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const attachment = await attachmentsService.getAttachmentById(req.params.id);

            if (!attachment) {
                return res.status(404).json({
                    success: false,
                    error: 'Attachment not found'
                });
            }

            res.json({
                success: true,
                data: attachment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/statistics/:type/:id', async (req, res) => {
        try {
            const stats = await attachmentsService.getAttachmentStatistics(
                req.params.type,
                req.params.id
            );

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // UPDATE
    // ==============================================

    router.put('/:id', async (req, res) => {
        try {
            await attachmentsService.updateAttachment(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Attachment updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // DELETE
    // ==============================================

    router.delete('/:id', async (req, res) => {
        try {
            await attachmentsService.deleteAttachment(req.params.id);

            res.json({
                success: true,
                message: 'Attachment deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
