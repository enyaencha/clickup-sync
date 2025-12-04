/**
 * Agriculture Monitoring API Routes
 * Endpoints for managing agricultural plots and crop production
 */

const express = require('express');
const router = express.Router();

module.exports = (agricultureService) => {
    // ==================== AGRICULTURAL PLOTS ====================

    /**
     * GET /api/agriculture/plots
     * Get all agricultural plots
     */
    router.get('/plots', async (req, res) => {
        try {
            const filters = {
                beneficiary_id: req.query.beneficiary_id,
                program_module_id: req.query.program_module_id,
                county: req.query.county,
                sub_county: req.query.sub_county,
                status: req.query.status
            };

            const plots = await agricultureService.getPlots(filters);

            res.json({
                success: true,
                data: plots,
                count: plots.length
            });
        } catch (error) {
            console.error('Error fetching plots:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/agriculture/plots/:id
     * Get plot by ID
     */
    router.get('/plots/:id', async (req, res) => {
        try {
            const plot = await agricultureService.getPlotById(req.params.id);

            if (!plot) {
                return res.status(404).json({
                    success: false,
                    error: 'Plot not found'
                });
            }

            res.json({
                success: true,
                data: plot
            });
        } catch (error) {
            console.error('Error fetching plot:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/agriculture/plots
     * Create new plot
     */
    router.post('/plots', async (req, res) => {
        try {
            const plotData = req.body;
            plotData.facilitator_id = plotData.facilitator_id || req.user.id;

            const id = await agricultureService.createPlot(plotData);

            res.status(201).json({
                success: true,
                id,
                message: 'Agricultural plot created successfully'
            });
        } catch (error) {
            console.error('Error creating plot:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/agriculture/plots/:id
     * Update plot
     */
    router.put('/plots/:id', async (req, res) => {
        try {
            await agricultureService.updatePlot(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Plot updated successfully'
            });
        } catch (error) {
            console.error('Error updating plot:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/agriculture/plots/:id
     * Delete plot
     */
    router.delete('/plots/:id', async (req, res) => {
        try {
            await agricultureService.deletePlot(req.params.id);

            res.json({
                success: true,
                message: 'Plot deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting plot:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==================== CROP PRODUCTION ====================

    /**
     * GET /api/agriculture/production
     * Get crop production records
     */
    router.get('/production', async (req, res) => {
        try {
            const filters = {
                plot_id: req.query.plot_id,
                program_module_id: req.query.program_module_id,
                season: req.query.season,
                season_year: req.query.season_year,
                crop_type: req.query.crop_type
            };

            const production = await agricultureService.getProduction(filters);

            res.json({
                success: true,
                data: production,
                count: production.length
            });
        } catch (error) {
            console.error('Error fetching production records:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/agriculture/production/:id
     * Get production record by ID
     */
    router.get('/production/:id', async (req, res) => {
        try {
            const production = await agricultureService.getProductionById(req.params.id);

            if (!production) {
                return res.status(404).json({
                    success: false,
                    error: 'Production record not found'
                });
            }

            res.json({
                success: true,
                data: production
            });
        } catch (error) {
            console.error('Error fetching production record:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/agriculture/production
     * Create new production record
     */
    router.post('/production', async (req, res) => {
        try {
            const productionData = req.body;
            productionData.recorded_by = productionData.recorded_by || req.user.id;

            const id = await agricultureService.createProduction(productionData);

            res.status(201).json({
                success: true,
                id,
                message: 'Production record created successfully'
            });
        } catch (error) {
            console.error('Error creating production record:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/agriculture/production/:id
     * Update production record
     */
    router.put('/production/:id', async (req, res) => {
        try {
            await agricultureService.updateProduction(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Production record updated successfully'
            });
        } catch (error) {
            console.error('Error updating production record:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/agriculture/production/:id
     * Delete production record
     */
    router.delete('/production/:id', async (req, res) => {
        try {
            await agricultureService.deleteProduction(req.params.id);

            res.json({
                success: true,
                message: 'Production record deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting production record:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/agriculture/statistics
     * Get agriculture statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                season_year: req.query.season_year
            };

            const stats = await agricultureService.getStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching agriculture statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
