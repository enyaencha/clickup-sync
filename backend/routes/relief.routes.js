/**
 * Relief Distribution API Routes
 * Endpoints for managing relief assistance distribution
 */

const express = require('express');
const router = express.Router();

module.exports = (reliefService) => {
    /**
     * GET /api/relief/distributions
     * Get all relief distributions
     */
    router.get('/distributions', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                distribution_type: req.query.distribution_type,
                county: req.query.county,
                from_date: req.query.from_date,
                to_date: req.query.to_date
            };

            const distributions = await reliefService.getDistributions(filters);

            res.json({
                success: true,
                data: distributions,
                count: distributions.length
            });
        } catch (error) {
            console.error('Error fetching relief distributions:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/relief/statistics
     * Get relief statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                from_date: req.query.from_date,
                to_date: req.query.to_date
            };

            const stats = await reliefService.getStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching relief statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/relief/distributions/:id
     * Get distribution by ID
     */
    router.get('/distributions/:id', async (req, res) => {
        try {
            const distribution = await reliefService.getDistributionById(req.params.id);

            if (!distribution) {
                return res.status(404).json({
                    success: false,
                    error: 'Distribution not found'
                });
            }

            res.json({
                success: true,
                data: distribution
            });
        } catch (error) {
            console.error('Error fetching distribution:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/relief/distributions
     * Create new distribution
     */
    router.post('/distributions', async (req, res) => {
        try {
            const distributionData = req.body;
            distributionData.distributed_by = distributionData.distributed_by || req.user.id;

            const id = await reliefService.createDistribution(distributionData);

            res.status(201).json({
                success: true,
                id,
                message: 'Relief distribution created successfully'
            });
        } catch (error) {
            console.error('Error creating distribution:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/relief/distributions/:id
     * Update distribution
     */
    router.put('/distributions/:id', async (req, res) => {
        try {
            await reliefService.updateDistribution(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Distribution updated successfully'
            });
        } catch (error) {
            console.error('Error updating distribution:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/relief/distributions/:id
     * Delete distribution
     */
    router.delete('/distributions/:id', async (req, res) => {
        try {
            await reliefService.deleteDistribution(req.params.id);

            res.json({
                success: true,
                message: 'Distribution deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting distribution:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/relief/distributions/:id/beneficiaries
     * Get beneficiaries for a distribution
     */
    router.get('/distributions/:id/beneficiaries', async (req, res) => {
        try {
            const beneficiaries = await reliefService.getDistributionBeneficiaries(req.params.id);

            res.json({
                success: true,
                data: beneficiaries,
                count: beneficiaries.length
            });
        } catch (error) {
            console.error('Error fetching distribution beneficiaries:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/relief/distributions/:id/beneficiaries
     * Add beneficiary to distribution
     */
    router.post('/distributions/:id/beneficiaries', async (req, res) => {
        try {
            const beneficiaryData = req.body;
            beneficiaryData.recorded_by = beneficiaryData.recorded_by || req.user.id;

            const id = await reliefService.addBeneficiary(req.params.id, beneficiaryData);

            res.status(201).json({
                success: true,
                id,
                message: 'Beneficiary added to distribution successfully'
            });
        } catch (error) {
            console.error('Error adding beneficiary to distribution:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
