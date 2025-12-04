/**
 * GBV Case Management API Routes
 * Endpoints for managing Gender-Based Violence cases (HIGHLY RESTRICTED)
 */

const express = require('express');
const router = express.Router();

module.exports = (gbvService) => {
    /**
     * GET /api/gbv/cases
     * Get all GBV cases (restricted access)
     */
    router.get('/cases', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                case_status: req.query.case_status,
                risk_level: req.query.risk_level,
                case_worker_id: req.query.case_worker_id
            };

            const cases = await gbvService.getCases(filters, req.user);

            res.json({
                success: true,
                data: cases,
                count: cases.length
            });
        } catch (error) {
            console.error('Error fetching GBV cases:', error);
            const statusCode = error.message.includes('permission') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/gbv/statistics
     * Get GBV statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id
            };

            const stats = await gbvService.getStatistics(filters, req.user);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching GBV statistics:', error);
            const statusCode = error.message.includes('permission') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/gbv/cases/:id
     * Get case by ID (full details - highly restricted)
     */
    router.get('/cases/:id', async (req, res) => {
        try {
            const caseData = await gbvService.getCaseById(req.params.id, req.user);

            if (!caseData) {
                return res.status(404).json({
                    success: false,
                    error: 'Case not found'
                });
            }

            res.json({
                success: true,
                data: caseData
            });
        } catch (error) {
            console.error('Error fetching GBV case:', error);
            const statusCode = error.message.includes('permission') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/gbv/cases
     * Create new GBV case
     */
    router.post('/cases', async (req, res) => {
        try {
            const caseData = req.body;
            const id = await gbvService.createCase(caseData, req.user);

            res.status(201).json({
                success: true,
                id,
                message: 'GBV case created successfully'
            });
        } catch (error) {
            console.error('Error creating GBV case:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/gbv/cases/:id
     * Update GBV case
     */
    router.put('/cases/:id', async (req, res) => {
        try {
            await gbvService.updateCase(req.params.id, req.body, req.user);

            res.json({
                success: true,
                message: 'GBV case updated successfully'
            });
        } catch (error) {
            console.error('Error updating GBV case:', error);
            const statusCode = error.message.includes('permission') || error.message.includes('access denied') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/gbv/cases/:id
     * Delete GBV case (admin only)
     */
    router.delete('/cases/:id', async (req, res) => {
        try {
            await gbvService.deleteCase(req.params.id, req.user);

            res.json({
                success: true,
                message: 'GBV case deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting GBV case:', error);
            const statusCode = error.message.includes('permission') || error.message.includes('administrator') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/gbv/cases/:id/notes
     * Get case notes
     */
    router.get('/cases/:id/notes', async (req, res) => {
        try {
            const notes = await gbvService.getCaseNotes(req.params.id, req.user);

            res.json({
                success: true,
                data: notes,
                count: notes.length
            });
        } catch (error) {
            console.error('Error fetching case notes:', error);
            const statusCode = error.message.includes('permission') || error.message.includes('access denied') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/gbv/cases/:id/notes
     * Add case note
     */
    router.post('/cases/:id/notes', async (req, res) => {
        try {
            const noteData = req.body;
            const id = await gbvService.addCaseNote(req.params.id, noteData, req.user);

            res.status(201).json({
                success: true,
                id,
                message: 'Case note added successfully'
            });
        } catch (error) {
            console.error('Error adding case note:', error);
            const statusCode = error.message.includes('permission') || error.message.includes('access denied') ? 403 : 500;
            res.status(statusCode).json({ success: false, error: error.message });
        }
    });

    return router;
};
