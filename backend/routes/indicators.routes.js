/**
 * Indicators API Routes
 * Routes for managing SMART indicators in the logframe
 */

const express = require('express');
const router = express.Router();
const { checkIndicatorPermission } = require('../middleware/permissions');

module.exports = (indicatorsService) => {
    const db = indicatorsService.db;
    // ==============================================
    // CREATE
    // ==============================================

    /**
     * NEW SIMPLE CREATE - Uses exact SQL pattern from working seed script
     * POST /api/indicators/direct-create
     */
    router.post('/direct-create', async (req, res) => {
        try {
            console.log('\n🚀 NEW DIRECT CREATE ENDPOINT');
            console.log('Received body:', JSON.stringify(req.body, null, 2));

            const data = req.body;

            // Simple, direct SQL insert (exactly like seed script)
            const result = await indicatorsService.db.query(`
                INSERT INTO me_indicators (
                    program_id, project_id, activity_id,
                    module_id, sub_program_id, component_id,
                    name, code, description, type, category,
                    unit_of_measure, baseline_value, baseline_date,
                    target_value, target_date, current_value,
                    collection_frequency, data_source, verification_method,
                    disaggregation, status, achievement_percentage,
                    responsible_person, notes, clickup_custom_field_id,
                    is_active, last_measured_date, next_measurement_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.program_id || null,
                data.project_id || null,
                data.activity_id || null,
                data.module_id || null,
                data.sub_program_id || null,
                data.component_id || null,
                data.name,
                data.code,
                data.description || null,
                data.type,
                data.category || null,
                data.unit_of_measure || null,
                data.baseline_value || null,
                data.baseline_date || null,
                data.target_value || null,
                data.target_date || null,
                data.current_value || 0,
                data.collection_frequency || 'monthly',
                data.data_source || null,
                data.verification_method || null,
                null, // disaggregation
                data.status || 'not-started',
                0, // achievement_percentage - will be calculated
                data.responsible_person || null,
                data.notes || null,
                data.clickup_custom_field_id || null,
                1, // is_active
                null, // last_measured_date
                null  // next_measurement_date
            ]);

            const indicatorId = result.insertId;
            console.log(`✅ Direct create SUCCESS! ID: ${indicatorId}`);

            // Calculate achievement
            await indicatorsService.calculateAchievement(indicatorId);

            res.json({
                success: true,
                id: indicatorId,
                message: 'Indicator created successfully via direct-create'
            });
        } catch (error) {
            console.error('❌ Direct create error:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    /**
     * Create a new indicator
     * POST /api/indicators
     */
    router.post('/', checkIndicatorPermission(db, 'create'), async (req, res) => {
        try {
            console.log('\n🎯 ROUTE HANDLER: POST /api/indicators');
            console.log('Route received body:', JSON.stringify(req.body, null, 2));
            console.log('About to call indicatorsService.createIndicator()...');

            const id = await indicatorsService.createIndicator(req.body);

            console.log('✅ Route handler: createIndicator returned ID:', id);
            res.json({
                success: true,
                id,
                message: 'Indicator created successfully'
            });
        } catch (error) {
            console.error('❌ Route handler caught error:', error.message);
            console.error('Error stack:', error.stack);
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

    /**
     * Update indicator
     * PUT /api/indicators/:id
     */
    router.put('/:id', checkIndicatorPermission(db, 'edit'), async (req, res) => {
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
    router.delete('/:id', checkIndicatorPermission(db, 'delete'), async (req, res) => {
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
