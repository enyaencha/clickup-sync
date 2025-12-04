/**
 * Assumptions API Routes
 * Routes for managing assumptions and risk tracking
 */

const express = require('express');
const router = express.Router();

module.exports = (assumptionsService) => {
    // ==============================================
    // CREATE
    // ==============================================

    router.post('/', async (req, res) => {
        try {
            const id = await assumptionsService.createAssumption(req.body);
            res.json({
                success: true,
                id,
                message: 'Assumption created successfully'
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
                risk_level: req.query.risk_level,
                status: req.query.status,
                assumption_category: req.query.assumption_category
            };

            const assumptions = await assumptionsService.getAllAssumptions(filters);
            res.json({
                success: true,
                data: assumptions,
                count: assumptions.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/high-risk', async (req, res) => {
        try {
            const assumptions = await assumptionsService.getHighRiskAssumptions();
            res.json({
                success: true,
                data: assumptions,
                count: assumptions.length
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
            const assumption = await assumptionsService.getAssumptionById(req.params.id);
            if (!assumption) {
                return res.status(404).json({
                    success: false,
                    error: 'Assumption not found'
                });
            }
            res.json({
                success: true,
                data: assumption
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
            const assumptions = await assumptionsService.getAssumptionsByEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: assumptions,
                count: assumptions.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/risk-level/:level', async (req, res) => {
        try {
            const assumptions = await assumptionsService.getAssumptionsByRiskLevel(req.params.level);
            res.json({
                success: true,
                data: assumptions,
                count: assumptions.length
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
            const stats = await assumptionsService.getAssumptionStatistics(
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
            await assumptionsService.updateAssumption(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Assumption updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/:id/validate', async (req, res) => {
        try {
            await assumptionsService.validateAssumption(
                req.params.id,
                req.body.status,
                req.body.validation_notes
            );
            res.json({
                success: true,
                message: 'Assumption validated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/:id/mitigation', async (req, res) => {
        try {
            await assumptionsService.updateMitigationStatus(
                req.params.id,
                req.body.mitigation_status,
                req.body.notes
            );
            res.json({
                success: true,
                message: 'Mitigation status updated successfully'
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
            await assumptionsService.deleteAssumption(req.params.id);
            res.json({
                success: true,
                message: 'Assumption deleted successfully'
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
            await assumptionsService.restoreAssumption(req.params.id);
            res.json({
                success: true,
                message: 'Assumption restored successfully'
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
