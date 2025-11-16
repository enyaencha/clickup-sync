/**
 * M&E Controller
 */

const meService = require('./me.service');
const Response = require('../../core/utils/response');
const logger = require('../../core/utils/logger');

class MEController {
    async listIndicators(req, res) {
        try {
            const filters = {
                program_id: req.query.program_id,
                project_id: req.query.project_id,
                type: req.query.type
            };

            const indicators = await meService.getAllIndicators(filters);
            return Response.success(res, indicators, 'Indicators fetched successfully');
        } catch (error) {
            logger.error('Error listing indicators:', error);
            return Response.error(res, error.message);
        }
    }

    async getIndicator(req, res) {
        try {
            const { id } = req.params;
            const indicator = await meService.getIndicatorById(id);

            if (!indicator) {
                return Response.notFound(res, 'Indicator not found');
            }

            return Response.success(res, indicator, 'Indicator fetched successfully');
        } catch (error) {
            logger.error('Error getting indicator:', error);
            return Response.error(res, error.message);
        }
    }

    async createIndicator(req, res) {
        try {
            const indicatorId = await meService.createIndicator(req.body);
            const indicator = await meService.getIndicatorById(indicatorId);
            return Response.created(res, indicator, 'Indicator created successfully');
        } catch (error) {
            logger.error('Error creating indicator:', error);
            return Response.error(res, error.message);
        }
    }

    async recordResult(req, res) {
        try {
            const resultId = await meService.recordResult(req.body);
            return Response.created(res, { id: resultId }, 'Result recorded successfully');
        } catch (error) {
            logger.error('Error recording result:', error);
            return Response.error(res, error.message);
        }
    }

    async getPerformance(req, res) {
        try {
            const { id } = req.params;
            const performance = await meService.getIndicatorPerformance(id);

            if (!performance) {
                return Response.notFound(res, 'Indicator not found');
            }

            return Response.success(res, performance, 'Indicator performance fetched successfully');
        } catch (error) {
            logger.error('Error getting indicator performance:', error);
            return Response.error(res, error.message);
        }
    }

    async getDashboard(req, res) {
        try {
            const filters = {
                program_id: req.query.program_id
            };

            const dashboard = await meService.getDashboard(filters);
            return Response.success(res, dashboard, 'M&E dashboard fetched successfully');
        } catch (error) {
            logger.error('Error getting M&E dashboard:', error);
            return Response.error(res, error.message);
        }
    }

    async generateReport(req, res) {
        try {
            const reportId = await meService.generateReport(req.body);
            return Response.created(res, { id: reportId }, 'Report generated successfully');
        } catch (error) {
            logger.error('Error generating report:', error);
            return Response.error(res, error.message);
        }
    }
}

module.exports = new MEController();
