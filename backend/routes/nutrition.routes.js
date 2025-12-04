/**
 * Nutrition Assessment API Routes
 * Endpoints for managing household diet diversity and nutrition monitoring
 */

const express = require('express');
const router = express.Router();

module.exports = (nutritionService) => {
    /**
     * GET /api/nutrition/assessments
     * Get all nutrition assessments
     */
    router.get('/assessments', async (req, res) => {
        try {
            const filters = {
                beneficiary_id: req.query.beneficiary_id,
                program_module_id: req.query.program_module_id,
                assessment_type: req.query.assessment_type,
                food_security_status: req.query.food_security_status,
                nutrition_status: req.query.nutrition_status,
                from_date: req.query.from_date,
                to_date: req.query.to_date
            };

            const assessments = await nutritionService.getAssessments(filters);

            res.json({
                success: true,
                data: assessments,
                count: assessments.length
            });
        } catch (error) {
            console.error('Error fetching nutrition assessments:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/nutrition/statistics
     * Get nutrition statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                from_date: req.query.from_date,
                to_date: req.query.to_date
            };

            const stats = await nutritionService.getStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching nutrition statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/nutrition/assessments/:id
     * Get assessment by ID
     */
    router.get('/assessments/:id', async (req, res) => {
        try {
            const assessment = await nutritionService.getAssessmentById(req.params.id);

            if (!assessment) {
                return res.status(404).json({
                    success: false,
                    error: 'Assessment not found'
                });
            }

            res.json({
                success: true,
                data: assessment
            });
        } catch (error) {
            console.error('Error fetching assessment:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/nutrition/assessments
     * Create new assessment
     */
    router.post('/assessments', async (req, res) => {
        try {
            const assessmentData = req.body;
            assessmentData.assessed_by = assessmentData.assessed_by || req.user.id;

            const id = await nutritionService.createAssessment(assessmentData);

            res.status(201).json({
                success: true,
                id,
                message: 'Nutrition assessment created successfully'
            });
        } catch (error) {
            console.error('Error creating assessment:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/nutrition/assessments/:id
     * Update assessment
     */
    router.put('/assessments/:id', async (req, res) => {
        try {
            await nutritionService.updateAssessment(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Assessment updated successfully'
            });
        } catch (error) {
            console.error('Error updating assessment:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/nutrition/assessments/:id
     * Delete assessment
     */
    router.delete('/assessments/:id', async (req, res) => {
        try {
            await nutritionService.deleteAssessment(req.params.id);

            res.json({
                success: true,
                message: 'Assessment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting assessment:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/nutrition/beneficiaries/:id/history
     * Get beneficiary assessment history
     */
    router.get('/beneficiaries/:id/history', async (req, res) => {
        try {
            const history = await nutritionService.getBeneficiaryHistory(req.params.id);

            res.json({
                success: true,
                data: history,
                count: history.length
            });
        } catch (error) {
            console.error('Error fetching beneficiary assessment history:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
