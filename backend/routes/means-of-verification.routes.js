/**
 * Means of Verification API Routes
 * Routes for managing evidence sources and verification methods
 */

const express = require('express');
const router = express.Router();

module.exports = (movService) => {
    // ==============================================
    // CREATE
    // ==============================================

    router.post('/', async (req, res) => {
        try {
            const id = await movService.createVerification(req.body);
            res.json({
                success: true,
                id,
                message: 'Verification method created successfully'
            });
        } catch (error) {
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
            const filters = {
                entity_type: req.query.entity_type,
                evidence_type: req.query.evidence_type,
                verification_status: req.query.verification_status
            };

            const verifications = await movService.getAllVerifications(filters);
            res.json({
                success: true,
                data: verifications,
                count: verifications.length
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
            const verification = await movService.getVerificationById(req.params.id);
            if (!verification) {
                return res.status(404).json({
                    success: false,
                    error: 'Verification not found'
                });
            }
            res.json({
                success: true,
                data: verification
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/entity/:type/:id', async (req, res) => {
        try {
            const verifications = await movService.getVerificationsByEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: verifications,
                count: verifications.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/status/:status', async (req, res) => {
        try {
            const verifications = await movService.getVerificationsByStatus(req.params.status);
            res.json({
                success: true,
                data: verifications,
                count: verifications.length
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
            const stats = await movService.getVerificationStatistics(
                req.params.type,
                req.params.id,
                req.user
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
            await movService.updateVerification(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Verification updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/:id/verify', async (req, res) => {
        try {
            await movService.verifyEvidence(
                req.params.id,
                req.body.verified_by,
                req.body.verification_notes
            );
            res.json({
                success: true,
                message: 'Evidence verified successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/:id/reject', async (req, res) => {
        try {
            await movService.rejectEvidence(
                req.params.id,
                req.body.verified_by,
                req.body.verification_notes
            );
            res.json({
                success: true,
                message: 'Evidence rejected'
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
            await movService.deleteVerification(req.params.id);
            res.json({
                success: true,
                message: 'Verification deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/:id/restore', async (req, res) => {
        try {
            await movService.restoreVerification(req.params.id);
            res.json({
                success: true,
                message: 'Verification restored successfully'
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
