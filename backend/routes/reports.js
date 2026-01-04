const express = require('express');
const router = express.Router();
const ReportsService = require('../services/ReportsService');
const AIAnalyticsService = require('../services/AIAnalyticsService');

// Note: Authentication middleware is applied at the app level in server-me.js

// ==================== STANDARD REPORTS ====================

/**
 * GET /api/reports/program-performance
 * Get program performance report
 */
router.get('/program-performance', async (req, res) => {
  try {
    const { moduleId, startDate, endDate, status } = req.query;

    const report = await ReportsService.getProgramPerformanceReport({
      moduleId,
      startDate,
      endDate,
      status
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating program performance report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate program performance report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/activity-completion
 * Get activity completion report
 */
router.get('/activity-completion', async (req, res) => {
  try {
    const { moduleId, componentId, startDate, endDate } = req.query;

    const report = await ReportsService.getActivityCompletionReport({
      moduleId,
      componentId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating activity completion report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate activity completion report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/financial
 * Get financial report
 */
router.get('/financial', async (req, res) => {
  try {
    const { moduleId, startDate, endDate, groupBy } = req.query;

    const report = await ReportsService.getFinancialReport({
      moduleId,
      startDate,
      endDate,
      groupBy
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating financial report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate financial report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/spending-trends
 * Get spending trends over time
 */
router.get('/spending-trends', async (req, res) => {
  try {
    const { moduleId, startDate, endDate, interval } = req.query;

    const report = await ReportsService.getSpendingTrends({
      moduleId,
      startDate,
      endDate,
      interval
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating spending trends report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate spending trends report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/expense-categories
 * Get expense category breakdown
 */
router.get('/expense-categories', async (req, res) => {
  try {
    const { moduleId, startDate, endDate } = req.query;

    const report = await ReportsService.getExpenseCategoryBreakdown({
      moduleId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating expense category report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate expense category report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/beneficiaries
 * Get beneficiary report
 */
router.get('/beneficiaries', async (req, res) => {
  try {
    const { moduleId, locationType, locationId, startDate, endDate } = req.query;

    const report = await ReportsService.getBeneficiaryReport({
      moduleId,
      locationType,
      locationId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating beneficiary report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate beneficiary report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/geographic-distribution
 * Get geographic distribution report
 */
router.get('/geographic-distribution', async (req, res) => {
  try {
    const { moduleId, locationType } = req.query;

    const report = await ReportsService.getGeographicDistribution({
      moduleId,
      locationType
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating geographic distribution report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate geographic distribution report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/indicator-achievement
 * Get indicator achievement report
 */
router.get('/indicator-achievement', async (req, res) => {
  try {
    const { moduleId, goalId, startDate, endDate } = req.query;

    const report = await ReportsService.getIndicatorAchievementReport({
      moduleId,
      goalId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating indicator achievement report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate indicator achievement report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/time-utilization
 * Get time utilization report
 */
router.get('/time-utilization', async (req, res) => {
  try {
    const { moduleId, userId, startDate, endDate } = req.query;

    const report = await ReportsService.getTimeUtilizationReport({
      moduleId,
      userId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating time utilization report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate time utilization report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/resource-utilization
 * Get resource utilization report
 */
router.get('/resource-utilization', async (req, res) => {
  try {
    const { moduleId } = req.query;

    const report = await ReportsService.getResourceUtilizationReport({
      moduleId
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating resource utilization report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resource utilization report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/risk
 * Get risk report
 */
router.get('/risk', async (req, res) => {
  try {
    const { moduleId, riskLevel } = req.query;

    const report = await ReportsService.getRiskReport({
      moduleId,
      riskLevel
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating risk report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate risk report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/data-quality
 * Get data quality report
 */
router.get('/data-quality', async (req, res) => {
  try {
    const { moduleId } = req.query;

    const report = await ReportsService.getDataQualityReport({
      moduleId
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating data quality report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate data quality report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/sync-status
 * Get sync status report
 */
router.get('/sync-status', async (req, res) => {
  try {
    const report = await ReportsService.getSyncStatusReport();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating sync status report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate sync status report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/executive-summary
 * Get executive summary
 */
router.get('/executive-summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const report = await ReportsService.getExecutiveSummary({
      startDate,
      endDate
    });

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating executive summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate executive summary',
      error: error.message
    });
  }
});

// ==================== AI-POWERED ANALYTICS ====================

/**
 * GET /api/reports/ai/predict-budget-burn
 * Predict budget burn rate and forecast
 */
router.get('/ai/predict-budget-burn', async (req, res) => {
  try {
    const { moduleId, forecastDays } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const prediction = await AIAnalyticsService.predictBudgetBurnRate(
      parseInt(moduleId),
      { forecastDays: forecastDays ? parseInt(forecastDays) : 90 }
    );

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error predicting budget burn rate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict budget burn rate',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/predict-activity-completion
 * Predict activity completion
 */
router.get('/ai/predict-activity-completion', async (req, res) => {
  try {
    const { componentId } = req.query;

    if (!componentId) {
      return res.status(400).json({
        success: false,
        message: 'componentId is required'
      });
    }

    const prediction = await AIAnalyticsService.predictActivityCompletion(
      parseInt(componentId)
    );

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error predicting activity completion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict activity completion',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/predict-beneficiary-reach
 * Predict beneficiary reach
 */
router.get('/ai/predict-beneficiary-reach', async (req, res) => {
  try {
    const { moduleId, forecastMonths } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const prediction = await AIAnalyticsService.predictBeneficiaryReach(
      parseInt(moduleId),
      { forecastMonths: forecastMonths ? parseInt(forecastMonths) : 6 }
    );

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error predicting beneficiary reach:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict beneficiary reach',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/detect-spending-anomalies
 * Detect spending anomalies
 */
router.get('/ai/detect-spending-anomalies', async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const anomalies = await AIAnalyticsService.detectSpendingAnomalies(
      parseInt(moduleId)
    );

    res.json({
      success: true,
      data: anomalies
    });
  } catch (error) {
    console.error('Error detecting spending anomalies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect spending anomalies',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/detect-data-quality-issues
 * Detect data quality issues
 */
router.get('/ai/detect-data-quality-issues', async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const issues = await AIAnalyticsService.detectDataQualityIssues(
      parseInt(moduleId)
    );

    res.json({
      success: true,
      data: issues
    });
  } catch (error) {
    console.error('Error detecting data quality issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect data quality issues',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/smart-insights
 * Generate smart insights
 */
router.get('/ai/smart-insights', async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const insights = await AIAnalyticsService.generateSmartInsights(
      parseInt(moduleId)
    );

    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error generating smart insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate smart insights',
      error: error.message
    });
  }
});

// ==================== ADVANCED ANALYTICS ENDPOINTS ====================

/**
 * GET /api/reports/ai/performance-score
 * Get comprehensive performance scoring
 */
router.get('/ai/performance-score', async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const scores = await AIAnalyticsService.calculatePerformanceScore(parseInt(moduleId));

    res.json({
      success: true,
      data: scores
    });
  } catch (error) {
    console.error('Error calculating performance score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate performance score',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/trend-analysis
 * Advanced trend analysis with seasonality detection
 */
router.get('/ai/trend-analysis', async (req, res) => {
  try {
    const { moduleId, months } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const analysis = await AIAnalyticsService.analyzeTrends(
      parseInt(moduleId),
      { months: months ? parseInt(months) : 12 }
    );

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze trends',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/resource-optimization
 * Resource allocation optimization recommendations
 */
router.get('/ai/resource-optimization', async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const optimization = await AIAnalyticsService.optimizeResourceAllocation(parseInt(moduleId));

    res.json({
      success: true,
      data: optimization
    });
  } catch (error) {
    console.error('Error optimizing resource allocation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize resource allocation',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/ai/impact-prediction
 * Predict impact based on proposed budget or activities
 */
router.get('/ai/impact-prediction', async (req, res) => {
  try {
    const { moduleId, proposedBudget, proposedActivities } = req.query;

    if (!moduleId) {
      return res.status(400).json({
        success: false,
        message: 'moduleId is required'
      });
    }

    const options = {};
    if (proposedBudget) options.proposedBudget = parseFloat(proposedBudget);
    if (proposedActivities) options.proposedActivities = parseInt(proposedActivities);

    const prediction = await AIAnalyticsService.predictImpact(parseInt(moduleId), options);

    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Error predicting impact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict impact',
      error: error.message
    });
  }
});

module.exports = router;
