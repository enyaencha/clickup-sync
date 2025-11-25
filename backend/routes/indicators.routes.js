/**
 * Indicators API Routes
 * Routes for managing SMART indicators in the logframe
 */

const express = require('express');
const router = express.Router();

module.exports = (indicatorsService) => {
    // ==============================================
    // CREATE
    // ==============================================

    /**
     * Create a new indicator
     * POST /api/indicators
     */
    router.post('/', async (req, res) => {
        try {
            const id = await indicatorsService.createIndicator(req.body);
            res.json({
                success: true,
                id,
                message: 'Indicator created successfully'
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

    /**
     * Get all indicators with optional filters
     * GET /api/indicators?type=output&status=on-track&is_active=1
     */
    router.get('/', async (req, res) => {
        try {
            const filters = {
                type: req.query.type,
                status: req.query.status,
                is_active: req.query.is_active !== undefined ? parseInt(req.query.is_active) : undefined
            };

            const indicators = await indicatorsService.getAllIndicators(filters);
            res.json({
                success: true,
                data: indicators,
                count: indicators.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get indicator by ID
     * GET /api/indicators/:id
     */
    router.get('/:id', async (req, res) => {
        try {
            const indicator = await indicatorsService.getIndicatorById(req.params.id);
            if (!indicator) {
                return res.status(404).json({
                    success: false,
                    error: 'Indicator not found'
                });
            }
            res.json({
                success: true,
                data: indicator
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get indicators by entity
     * GET /api/indicators/entity/:type/:id
     * Examples:
     *   /api/indicators/entity/module/1
     *   /api/indicators/entity/activity/123
     */
    router.get('/entity/:type/:id', async (req, res) => {
        try {
            const indicators = await indicatorsService.getIndicatorsByEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: indicators,
                count: indicators.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get indicators by type
     * GET /api/indicators/type/:type
     * Types: impact, outcome, output, process
     */
    router.get('/type/:type', async (req, res) => {
        try {
            const indicators = await indicatorsService.getIndicatorsByType(req.params.type);
            res.json({
                success: true,
                data: indicators,
                count: indicators.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get indicator statistics for an entity
     * GET /api/indicators/statistics/:type/:id
     */
    router.get('/statistics/:type/:id', async (req, res) => {
        try {
            const stats = await indicatorsService.getIndicatorStatistics(
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

    /**
     * Update indicator
     * PUT /api/indicators/:id
     */
    router.put('/:id', async (req, res) => {
        try {
            await indicatorsService.updateIndicator(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Indicator updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Update indicator current value
     * PATCH /api/indicators/:id/value
     */
    router.patch('/:id/value', async (req, res) => {
        try {
            await indicatorsService.updateCurrentValue(
                req.params.id,
                req.body.value,
                req.body.measurement_date
            );
            res.json({
                success: true,
                message: 'Current value updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Recalculate achievement for indicator
     * POST /api/indicators/:id/calculate
     */
    router.post('/:id/calculate', async (req, res) => {
        try {
            const result = await indicatorsService.calculateAchievement(req.params.id);
            res.json({
                success: true,
                data: result,
                message: 'Achievement calculated successfully'
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

    /**
     * Soft delete indicator
     * DELETE /api/indicators/:id
     */
    router.delete('/:id', async (req, res) => {
        try {
            await indicatorsService.deleteIndicator(req.params.id);
            res.json({
                success: true,
                message: 'Indicator deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Restore soft-deleted indicator
     * POST /api/indicators/:id/restore
     */
    router.post('/:id/restore', async (req, res) => {
        try {
            await indicatorsService.restoreIndicator(req.params.id);
            res.json({
                success: true,
                message: 'Indicator restored successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // MEASUREMENTS (me_results)
    // ==============================================

    /**
     * Add measurement for indicator
     * POST /api/indicators/:id/measurements
     */
    router.post('/:id/measurements', async (req, res) => {
        try {
            const measurementId = await indicatorsService.addMeasurement(
                req.params.id,
                req.body
            );
            res.json({
                success: true,
                id: measurementId,
                message: 'Measurement added successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Get measurements for indicator
     * GET /api/indicators/:id/measurements?limit=10
     */
    router.get('/:id/measurements', async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const measurements = await indicatorsService.getMeasurements(
                req.params.id,
                limit
            );
            res.json({
                success: true,
                data: measurements,
                count: measurements.length
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
