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
        // Accept images, documents, PDFs
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt|csv/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
        }
    }
});

module.exports = (attachmentsService) => {
    // ==============================================
    // CREATE - Upload file
    // ==============================================

    router.post('/upload', upload.single('file'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            const { entity_type, entity_id, attachment_type, description } = req.body;

            if (!entity_type || !entity_id) {
                // Delete uploaded file if required params missing
                fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    error: 'entity_type and entity_id are required'
                });
            }

            // Create attachment record in database
            const attachmentId = await attachmentsService.createAttachment({
                entity_type,
                entity_id: parseInt(entity_id),
                file_name: req.file.originalname,
                file_path: `/uploads/${req.file.filename}`,
                file_type: req.file.mimetype,
                file_size: req.file.size,
                attachment_type: attachment_type || 'document',
                description: description || null,
                uploaded_by: req.user?.id || 1 // TODO: Get from auth
            });

            res.json({
                success: true,
                id: attachmentId,
                file: {
                    name: req.file.originalname,
                    path: `/uploads/${req.file.filename}`,
                    size: req.file.size,
                    type: req.file.mimetype
                },
                message: 'File uploaded successfully'
            });
        } catch (error) {
            // Clean up file if database insert fails
            if (req.file) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
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
