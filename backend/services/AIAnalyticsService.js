const db = require('../core/database/connection');

class AIAnalyticsService {
  // ==================== PREDICTIVE ANALYTICS ====================

  /**
   * Predict budget burn rate and forecast when budget will be exhausted
   */
  async predictBudgetBurnRate(moduleId, options = {}) {
    const { forecastDays = 90 } = options;

    // Get historical spending data
    const query = `
      SELECT
        DATE_FORMAT(a.start_date, '%Y-%m-%d') as date,
        SUM(COALESCE(ae.amount, 0)) as daily_spending,
        SUM(COALESCE(a.budget_allocated, 0)) as daily_budget
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.start_date >= DATE_SUB(CURDATE(), INTERVAL 180 DAY)
      GROUP BY DATE_FORMAT(a.start_date, '%Y-%m-%d')
      ORDER BY date
    `;

    const historicalData = await db.query(query, [moduleId]);

    if (historicalData.length < 5) {
      return {
        error: 'Insufficient data for prediction',
        message: 'Need at least 5 days of historical data'
      };
    }

    // Calculate spending statistics
    const totalSpent = historicalData.reduce((sum, row) => sum + parseFloat(row.daily_spending), 0);
    const avgDailySpending = totalSpent / historicalData.length;
    const maxDailySpending = Math.max(...historicalData.map(row => parseFloat(row.daily_spending)));
    const minDailySpending = Math.min(...historicalData.map(row => parseFloat(row.daily_spending)));

    // Simple moving average for trend
    const recentData = historicalData.slice(-30); // Last 30 days
    const recentAvg = recentData.reduce((sum, row) => sum + parseFloat(row.daily_spending), 0) / recentData.length;

    // Calculate variance to determine spending volatility
    const variance = historicalData.reduce((sum, row) => {
      const diff = parseFloat(row.daily_spending) - avgDailySpending;
      return sum + (diff * diff);
    }, 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);

    // Get current budget status
    const budgetData = await db.query(`
      SELECT
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        SUM(COALESCE(ae.amount, 0)) as total_spent
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE pm.id = ? AND a.deleted_at IS NULL
    `, [moduleId]);

    const budget = budgetData[0];
    const remainingBudget = budget.total_budget - budget.total_spent;

    // Forecast future spending
    const forecast = [];
    let cumulativeSpending = parseFloat(budget.total_spent);

    for (let day = 1; day <= forecastDays; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);

      // Use weighted average (70% recent, 30% overall)
      const predictedSpending = (recentAvg * 0.7) + (avgDailySpending * 0.3);
      cumulativeSpending += predictedSpending;

      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted_daily_spending: predictedSpending.toFixed(2),
        cumulative_spending: cumulativeSpending.toFixed(2),
        remaining_budget: (budget.total_budget - cumulativeSpending).toFixed(2),
        budget_exhausted: cumulativeSpending >= budget.total_budget
      });

      if (cumulativeSpending >= budget.total_budget) {
        break; // Budget exhausted
      }
    }

    // Calculate when budget will be exhausted
    let daysUntilExhaustion = remainingBudget / recentAvg;
    let exhaustionDate = null;

    // Handle edge cases
    if (!isFinite(daysUntilExhaustion) || daysUntilExhaustion < 0 || recentAvg === 0) {
      daysUntilExhaustion = null;
      exhaustionDate = null;
    } else {
      exhaustionDate = new Date();
      exhaustionDate.setDate(exhaustionDate.getDate() + Math.ceil(daysUntilExhaustion));
    }

    return {
      current_status: {
        total_budget: parseFloat(budget.total_budget).toFixed(2),
        total_spent: parseFloat(budget.total_spent).toFixed(2),
        remaining_budget: remainingBudget.toFixed(2),
        utilization_percentage: ((budget.total_spent / budget.total_budget) * 100).toFixed(2)
      },
      spending_statistics: {
        avg_daily_spending: avgDailySpending.toFixed(2),
        recent_avg_daily_spending: recentAvg.toFixed(2),
        max_daily_spending: maxDailySpending.toFixed(2),
        min_daily_spending: minDailySpending.toFixed(2),
        spending_volatility: stdDev.toFixed(2),
        trend: recentAvg > avgDailySpending ? 'increasing' : 'decreasing'
      },
      predictions: {
        days_until_budget_exhaustion: daysUntilExhaustion !== null ? Math.ceil(daysUntilExhaustion) : null,
        estimated_exhaustion_date: exhaustionDate ? exhaustionDate.toISOString().split('T')[0] : null,
        forecast_period_days: forecastDays,
        forecast: forecast
      },
      recommendations: this.generateBudgetRecommendations(budget, avgDailySpending, recentAvg, stdDev)
    };
  }

  /**
   * Predict activity completion based on historical patterns
   */
  async predictActivityCompletion(componentId) {
    // Get historical activity completion data
    const query = `
      SELECT
        a.id,
        a.name,
        a.status,
        a.start_date,
        a.end_date,
        a.duration_hours,
        DATEDIFF(a.updated_at, a.created_at) as actual_duration,
        COUNT(DISTINCT ac.id) as total_checklist_items,
        COUNT(DISTINCT CASE WHEN ac.is_completed = 1 THEN ac.id END) as completed_checklist_items,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        a.budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as total_spent
      FROM activities a
      LEFT JOIN activity_checklists ac ON a.id = ac.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE a.component_id = ? AND a.deleted_at IS NULL
      GROUP BY a.id
      ORDER BY a.start_date DESC
    `;

    const activities = await db.query(query, [componentId]);

    if (activities.length === 0) {
      return {
        error: 'No activities found for this component'
      };
    }

    const completedActivities = activities.filter(a => a.status === 'completed');
    const ongoingActivities = activities.filter(a => a.status === 'ongoing');

    if (completedActivities.length < 3) {
      return {
        error: 'Insufficient historical data',
        message: 'Need at least 3 completed activities for prediction'
      };
    }

    // Calculate completion statistics
    const avgCompletionTime = completedActivities.reduce((sum, a) => sum + a.actual_duration, 0) / completedActivities.length;
    const avgChecklistCompletion = completedActivities.reduce((sum, a) => {
      return sum + (a.total_checklist_items > 0 ? (a.completed_checklist_items / a.total_checklist_items) : 0);
    }, 0) / completedActivities.length;

    // Predict completion for ongoing activities
    const predictions = ongoingActivities.map(activity => {
      const checklistProgress = activity.total_checklist_items > 0
        ? (activity.completed_checklist_items / activity.total_checklist_items)
        : 0;

      const budgetProgress = activity.budget_allocated > 0
        ? (activity.total_spent / activity.budget_allocated)
        : 0;

      const daysSinceStart = activity.start_date
        ? Math.floor((Date.now() - new Date(activity.start_date)) / (1000 * 60 * 60 * 24))
        : 0;
      const totalDuration = (activity.start_date && activity.end_date)
        ? Math.floor((new Date(activity.end_date) - new Date(activity.start_date)) / (1000 * 60 * 60 * 24))
        : 0;
      const timeProgress = totalDuration > 0 ? (daysSinceStart / totalDuration) : 0;

      // Weighted completion score
      const completionScore = (checklistProgress * 0.4) + (budgetProgress * 0.3) + (timeProgress * 0.3);

      // Estimate remaining days
      const estimatedRemainingDays = avgCompletionTime * (1 - completionScore);
      const estimatedCompletionDate = new Date();
      estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + Math.ceil(estimatedRemainingDays));

      // Risk assessment
      let riskLevel = 'low';
      if (timeProgress > 0.8 && completionScore < 0.5) {
        riskLevel = 'high';
      } else if (timeProgress > 0.6 && completionScore < 0.7) {
        riskLevel = 'medium';
      }

      return {
        activity_id: activity.id,
        activity_name: activity.name,
        current_completion_percentage: (completionScore * 100).toFixed(2),
        checklist_progress: (checklistProgress * 100).toFixed(2),
        budget_progress: (budgetProgress * 100).toFixed(2),
        time_progress: (timeProgress * 100).toFixed(2),
        estimated_completion_date: estimatedCompletionDate.toISOString().split('T')[0],
        estimated_remaining_days: Math.ceil(estimatedRemainingDays),
        risk_level: riskLevel,
        recommendations: this.generateActivityRecommendations(activity, completionScore, timeProgress)
      };
    });

    return {
      component_statistics: {
        total_activities: activities.length,
        completed_activities: completedActivities.length,
        ongoing_activities: ongoingActivities.length,
        avg_completion_time_days: avgCompletionTime.toFixed(1),
        avg_checklist_completion: (avgChecklistCompletion * 100).toFixed(2)
      },
      predictions: predictions
    };
  }

  /**
   * Predict beneficiary reach based on trends
   */
  async predictBeneficiaryReach(moduleId, options = {}) {
    const { forecastMonths = 6 } = options;

    // Get historical beneficiary data by month
    const query = `
      SELECT
        DATE_FORMAT(a.start_date, '%Y-%m') as month,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        COUNT(DISTINCT a.id) as activity_count
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(a.start_date, '%Y-%m')
      ORDER BY month
    `;

    const historicalData = await db.query(query, [moduleId]);

    if (historicalData.length < 3) {
      return {
        error: 'Insufficient data for prediction',
        message: 'Need at least 3 months of historical data'
      };
    }

    // Calculate linear regression
    const n = historicalData.length;
    const months = historicalData.map((_, i) => i);
    const beneficiaryCounts = historicalData.map(row => parseInt(row.beneficiary_count));

    const sumX = months.reduce((sum, x) => sum + x, 0);
    const sumY = beneficiaryCounts.reduce((sum, y) => sum + y, 0);
    const sumXY = months.reduce((sum, x, i) => sum + (x * beneficiaryCounts[i]), 0);
    const sumX2 = months.reduce((sum, x) => sum + (x * x), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast
    const forecast = [];
    for (let i = 1; i <= forecastMonths; i++) {
      const monthIndex = n + i - 1;
      const predictedBeneficiaries = Math.round(slope * monthIndex + intercept);

      const date = new Date();
      date.setMonth(date.getMonth() + i);
      const monthStr = date.toISOString().slice(0, 7);

      forecast.push({
        month: monthStr,
        predicted_beneficiaries: Math.max(0, predictedBeneficiaries),
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
      });
    }

    const avgMonthlyBeneficiaries = sumY / n;
    const totalPredicted = forecast.reduce((sum, f) => sum + f.predicted_beneficiaries, 0);

    return {
      historical_data: historicalData,
      statistics: {
        avg_monthly_beneficiaries: Math.round(avgMonthlyBeneficiaries),
        growth_rate_per_month: slope.toFixed(2),
        trend: slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
      },
      forecast: forecast,
      summary: {
        total_predicted_beneficiaries: totalPredicted,
        forecast_period_months: forecastMonths
      }
    };
  }

  // ==================== ANOMALY DETECTION ====================

  /**
   * Detect anomalies in spending patterns
   */
  async detectSpendingAnomalies(moduleId) {
    const query = `
      SELECT
        a.id,
        a.name as activity_name,
        a.start_date,
        a.budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        sp.name as subprogram_name,
        pc.name as component_name
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.start_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      GROUP BY a.id
      HAVING total_spent > 0
    `;

    const activities = await db.query(query, [moduleId]);

    if (activities.length < 10) {
      return {
        error: 'Insufficient data for anomaly detection',
        message: 'Need at least 10 activities with spending data'
      };
    }

    // Calculate statistics
    const spending = activities.map(a => parseFloat(a.total_spent));
    const avgSpending = spending.reduce((sum, s) => sum + s, 0) / spending.length;

    const variance = spending.reduce((sum, s) => sum + Math.pow(s - avgSpending, 2), 0) / spending.length;
    const stdDev = Math.sqrt(variance);

    // Calculate cost per beneficiary statistics
    const costPerBeneficiary = activities
      .filter(a => a.beneficiary_count > 0)
      .map(a => parseFloat(a.total_spent) / a.beneficiary_count);

    const avgCostPerBeneficiary = costPerBeneficiary.length > 0
      ? costPerBeneficiary.reduce((sum, c) => sum + c, 0) / costPerBeneficiary.length
      : 0;

    // Detect anomalies (using 2 standard deviations)
    const anomalies = activities
      .map(activity => {
        const spent = parseFloat(activity.total_spent);
        const zScore = (spent - avgSpending) / stdDev;
        const isAnomaly = Math.abs(zScore) > 2; // 2 standard deviations

        const costPerBen = activity.beneficiary_count > 0
          ? spent / activity.beneficiary_count
          : 0;

        const budgetVariance = activity.budget_allocated > 0
          ? ((spent - activity.budget_allocated) / activity.budget_allocated) * 100
          : 0;

        let anomalyType = [];
        if (spent > avgSpending + (2 * stdDev)) {
          anomalyType.push('unusually_high_spending');
        }
        if (budgetVariance > 50) {
          anomalyType.push('significant_budget_overrun');
        }
        if (costPerBen > avgCostPerBeneficiary * 2 && activity.beneficiary_count > 0) {
          anomalyType.push('high_cost_per_beneficiary');
        }
        if (spent < avgSpending - (2 * stdDev) && spent > 0) {
          anomalyType.push('unusually_low_spending');
        }

        return {
          ...activity,
          z_score: zScore.toFixed(2),
          is_anomaly: isAnomaly || anomalyType.length > 0,
          anomaly_types: anomalyType,
          cost_per_beneficiary: costPerBen.toFixed(2),
          budget_variance_percentage: budgetVariance.toFixed(2),
          severity: Math.abs(zScore) > 3 ? 'high' : Math.abs(zScore) > 2 ? 'medium' : 'low'
        };
      })
      .filter(a => a.is_anomaly)
      .sort((a, b) => Math.abs(parseFloat(b.z_score)) - Math.abs(parseFloat(a.z_score)));

    return {
      statistics: {
        total_activities: activities.length,
        avg_spending: avgSpending.toFixed(2),
        std_deviation: stdDev.toFixed(2),
        avg_cost_per_beneficiary: avgCostPerBeneficiary.toFixed(2)
      },
      anomalies: anomalies,
      anomaly_count: anomalies.length,
      anomaly_percentage: ((anomalies.length / activities.length) * 100).toFixed(2)
    };
  }

  /**
   * Detect data quality issues
   */
  async detectDataQualityIssues(moduleId) {
    const issues = [];

    // Check for activities without beneficiaries
    const activitiesWithoutBeneficiaries = await db.query(`
      SELECT a.id, a.name, a.start_date
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ?
        AND a.deleted_at IS NULL
        AND a.status != 'cancelled'
        AND NOT EXISTS (
          SELECT 1 FROM activity_beneficiaries ab WHERE ab.activity_id = a.id
        )
      LIMIT 20
    `, [moduleId]);

    if (activitiesWithoutBeneficiaries.length > 0) {
      issues.push({
        issue_type: 'missing_beneficiaries',
        severity: 'high',
        count: activitiesWithoutBeneficiaries.length,
        description: 'Activities without beneficiary data',
        samples: activitiesWithoutBeneficiaries.slice(0, 5)
      });
    }

    // Check for activities without location
    const activitiesWithoutLocation = await db.query(`
      SELECT a.id, a.name, a.start_date
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ?
        AND a.deleted_at IS NULL
        AND a.location_id IS NULL
      LIMIT 20
    `, [moduleId]);

    if (activitiesWithoutLocation.length > 0) {
      issues.push({
        issue_type: 'missing_location',
        severity: 'medium',
        count: activitiesWithoutLocation.length,
        description: 'Activities without location information',
        samples: activitiesWithoutLocation.slice(0, 5)
      });
    }

    // Check for activities without evidence/attachments
    const activitiesWithoutEvidence = await db.query(`
      SELECT a.id, a.name, a.start_date
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ?
        AND a.deleted_at IS NULL
        AND a.status = 'completed'
        AND NOT EXISTS (
          SELECT 1 FROM attachments att
          WHERE att.entity_id = a.id AND att.entity_type = 'activity'
        )
      LIMIT 20
    `, [moduleId]);

    if (activitiesWithoutEvidence.length > 0) {
      issues.push({
        issue_type: 'missing_evidence',
        severity: 'high',
        count: activitiesWithoutEvidence.length,
        description: 'Completed activities without evidence/attachments',
        samples: activitiesWithoutEvidence.slice(0, 5)
      });
    }

    // Check for budget inconsistencies
    const budgetInconsistencies = await db.query(`
      SELECT a.id, a.name, a.budget_allocated, SUM(ae.amount) as total_spent
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ?
        AND a.deleted_at IS NULL
      GROUP BY a.id
      HAVING total_spent > (a.budget_allocated * 1.5)
      LIMIT 20
    `, [moduleId]);

    if (budgetInconsistencies.length > 0) {
      issues.push({
        issue_type: 'budget_overrun',
        severity: 'high',
        count: budgetInconsistencies.length,
        description: 'Activities with spending >150% of allocated budget',
        samples: budgetInconsistencies.slice(0, 5)
      });
    }

    return {
      total_issues: issues.reduce((sum, i) => sum + i.count, 0),
      issue_categories: issues.length,
      issues: issues
    };
  }

  // ==================== SMART INSIGHTS ====================

  /**
   * Generate smart insights from data
   */
  async generateSmartInsights(moduleId) {
    const insights = [];

    // Performance insights
    const performanceData = await db.query(`
      SELECT
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed,
        COUNT(DISTINCT CASE WHEN a.status = 'ongoing' THEN a.id END) as ongoing,
        AVG(DATEDIFF(a.updated_at, a.created_at)) as avg_completion_time
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `, [moduleId]);

    const perf = performanceData[0];
    const completionRate = (perf.completed / perf.total_activities) * 100;

    if (completionRate > 80) {
      insights.push({
        type: 'performance',
        category: 'positive',
        title: 'High Activity Completion Rate',
        description: `${completionRate.toFixed(1)}% of activities are completed, which is excellent.`,
        metric: completionRate.toFixed(1),
        recommendation: 'Maintain current project management practices and share best practices across teams.'
      });
    } else if (completionRate < 50) {
      insights.push({
        type: 'performance',
        category: 'warning',
        title: 'Low Activity Completion Rate',
        description: `Only ${completionRate.toFixed(1)}% of activities are completed.`,
        metric: completionRate.toFixed(1),
        recommendation: 'Review ongoing activities for blockers and consider resource reallocation.'
      });
    }

    // Budget insights
    const budgetData = await db.query(`
      SELECT
        SUM(a.budget_allocated) as total_budget,
        SUM(ae.amount) as total_spent
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `, [moduleId]);

    const budget = budgetData[0];
    const budgetUtilization = (budget.total_spent / budget.total_budget) * 100;

    if (budgetUtilization > 90) {
      insights.push({
        type: 'financial',
        category: 'alert',
        title: 'Budget Nearly Exhausted',
        description: `${budgetUtilization.toFixed(1)}% of budget has been utilized.`,
        metric: budgetUtilization.toFixed(1),
        recommendation: 'Prioritize critical activities and consider requesting additional funding.'
      });
    } else if (budgetUtilization < 30 && perf.total_activities > 10) {
      insights.push({
        type: 'financial',
        category: 'info',
        title: 'Low Budget Utilization',
        description: `Only ${budgetUtilization.toFixed(1)}% of budget has been used.`,
        metric: budgetUtilization.toFixed(1),
        recommendation: 'Accelerate activity implementation or reallocate funds to high-impact areas.'
      });
    }

    // Beneficiary reach insights
    const beneficiaryData = await db.query(`
      SELECT
        COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries,
        COUNT(DISTINCT a.id) as total_activities
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `, [moduleId]);

    const beneficiaries = beneficiaryData[0];
    const avgBeneficiariesPerActivity = beneficiaries.total_beneficiaries / beneficiaries.total_activities;

    insights.push({
      type: 'impact',
      category: 'info',
      title: 'Beneficiary Reach',
      description: `Reaching ${beneficiaries.total_beneficiaries} unique beneficiaries across ${beneficiaries.total_activities} activities.`,
      metric: avgBeneficiariesPerActivity.toFixed(1),
      recommendation: avgBeneficiariesPerActivity < 10
        ? 'Consider activities with broader reach to maximize impact.'
        : 'Good beneficiary reach per activity.'
    });

    return insights;
  }

  // ==================== HELPER METHODS ====================

  generateBudgetRecommendations(budget, avgSpending, recentAvg, stdDev) {
    const recommendations = [];
    const utilizationRate = (budget.total_spent / budget.total_budget) * 100;

    if (recentAvg > avgSpending * 1.2) {
      recommendations.push('Spending rate is increasing. Monitor closely to avoid budget overrun.');
    }

    if (stdDev > avgSpending * 0.5) {
      recommendations.push('High spending volatility detected. Establish more consistent spending patterns.');
    }

    if (utilizationRate > 75) {
      recommendations.push('Budget utilization is high. Start planning for next funding cycle.');
    }

    if (utilizationRate < 25 && budget.total_activities > 10) {
      recommendations.push('Budget utilization is low. Accelerate activity implementation.');
    }

    return recommendations;
  }

  generateActivityRecommendations(activity, completionScore, timeProgress) {
    const recommendations = [];

    if (timeProgress > 0.75 && completionScore < 0.5) {
      recommendations.push('Activity is significantly behind schedule. Consider additional resources or timeline extension.');
    }

    if (activity.total_spent > activity.budget_allocated * 1.1) {
      recommendations.push('Activity is over budget. Review expenses and adjust spending.');
    }

    if (activity.total_checklist_items > 0 && activity.completed_checklist_items === 0) {
      recommendations.push('No checklist items completed. Review activity progress with team.');
    }

    if (activity.beneficiary_count === 0) {
      recommendations.push('No beneficiaries registered. Update beneficiary information.');
    }

    return recommendations;
  }

  // ==================== ADVANCED ANALYTICS ====================

  /**
   * Comprehensive Performance Scoring System
   */
  async calculatePerformanceScore(moduleId) {
    const scores = {};

    // 1. BUDGET EFFICIENCY SCORE (0-100)
    const budgetQuery = `
      SELECT
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_activities
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `;
    const budgetData = (await db.query(budgetQuery, [moduleId]))[0];

    const budgetUtilization = budgetData.total_budget > 0
      ? (budgetData.total_spent / budgetData.total_budget) * 100
      : 0;
    const optimalUtilization = 75; // Target 75% utilization
    scores.budget_efficiency = Math.max(0, 100 - Math.abs(budgetUtilization - optimalUtilization) * 2);

    // 2. ACTIVITY COMPLETION SCORE (0-100)
    scores.completion_rate = budgetData.total_activities > 0
      ? (budgetData.completed_activities / budgetData.total_activities) * 100
      : 0;

    // 3. TIMELINE ADHERENCE SCORE (0-100)
    const timelineQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN a.end_date >= CURDATE() OR a.status = 'completed' THEN 1 END) as on_time
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL AND a.end_date IS NOT NULL
    `;
    const timelineData = (await db.query(timelineQuery, [moduleId]))[0];
    scores.timeline_adherence = timelineData.total > 0
      ? (timelineData.on_time / timelineData.total) * 100
      : 0;

    // 4. BENEFICIARY IMPACT SCORE (0-100)
    const impactQuery = `
      SELECT
        COUNT(DISTINCT ab.beneficiary_id) as unique_beneficiaries,
        COUNT(DISTINCT a.id) as activities_with_beneficiaries,
        COUNT(DISTINCT CASE WHEN b.vulnerability_category IS NOT NULL THEN b.id END) as vulnerable_beneficiaries
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN beneficiaries b ON ab.beneficiary_id = b.id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `;
    const impactData = (await db.query(impactQuery, [moduleId]))[0];

    const avgBeneficiariesPerActivity = impactData.activities_with_beneficiaries > 0
      ? impactData.unique_beneficiaries / impactData.activities_with_beneficiaries
      : 0;
    const vulnerablePercentage = impactData.unique_beneficiaries > 0
      ? (impactData.vulnerable_beneficiaries / impactData.unique_beneficiaries) * 100
      : 0;

    scores.beneficiary_reach = Math.min(100, (avgBeneficiariesPerActivity / 20) * 100); // 20+ beneficiaries = 100
    scores.vulnerable_targeting = vulnerablePercentage; // Higher = better targeting

    // 5. DATA QUALITY SCORE (0-100)
    const qualityQuery = `
      SELECT
        COUNT(*) as total_activities,
        COUNT(CASE WHEN a.budget_allocated > 0 THEN 1 END) as with_budget,
        COUNT(CASE WHEN a.start_date IS NOT NULL THEN 1 END) as with_start_date,
        COUNT(CASE WHEN a.end_date IS NOT NULL THEN 1 END) as with_end_date,
        COUNT(CASE WHEN a.description IS NOT NULL AND LENGTH(a.description) > 50 THEN 1 END) as with_description
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `;
    const qualityData = (await db.query(qualityQuery, [moduleId]))[0];

    if (qualityData.total_activities > 0) {
      const qualityMetrics = [
        qualityData.with_budget / qualityData.total_activities,
        qualityData.with_start_date / qualityData.total_activities,
        qualityData.with_end_date / qualityData.total_activities,
        qualityData.with_description / qualityData.total_activities
      ];
      scores.data_quality = (qualityMetrics.reduce((sum, m) => sum + m, 0) / qualityMetrics.length) * 100;
    } else {
      scores.data_quality = 0;
    }

    // 6. RESOURCE UTILIZATION SCORE (0-100)
    const resourceQuery = `
      SELECT
        COUNT(DISTINCT a.id) as total_activities,
        SUM(COALESCE(a.duration_hours, 0)) as total_hours,
        COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries,
        SUM(COALESCE(ae.amount, 0)) as total_spent
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL
    `;
    const resourceData = (await db.query(resourceQuery, [moduleId]))[0];

    const costPerBeneficiary = resourceData.total_beneficiaries > 0
      ? resourceData.total_spent / resourceData.total_beneficiaries
      : 0;
    // Lower cost per beneficiary = higher score (inverse relationship)
    scores.cost_efficiency = costPerBeneficiary > 0
      ? Math.min(100, (5000 / costPerBeneficiary) * 100) // 5000 KES as benchmark
      : 0;

    // 7. OVERALL PERFORMANCE SCORE (weighted average)
    scores.overall_performance = (
      scores.budget_efficiency * 0.20 +
      scores.completion_rate * 0.20 +
      scores.timeline_adherence * 0.15 +
      scores.beneficiary_reach * 0.15 +
      scores.vulnerable_targeting * 0.10 +
      scores.data_quality * 0.10 +
      scores.cost_efficiency * 0.10
    );

    // Add performance rating
    scores.rating = this.getPerformanceRating(scores.overall_performance);
    scores.insights = this.generatePerformanceInsights(scores);

    return scores;
  }

  getPerformanceRating(score) {
    if (score >= 90) return { level: 'Excellent', color: 'success', description: 'Outstanding performance across all metrics' };
    if (score >= 75) return { level: 'Good', color: 'success', description: 'Strong performance with room for minor improvements' };
    if (score >= 60) return { level: 'Satisfactory', color: 'warning', description: 'Adequate performance, several areas need attention' };
    if (score >= 45) return { level: 'Needs Improvement', color: 'warning', description: 'Performance is below expectations' };
    return { level: 'Critical', color: 'error', description: 'Urgent intervention required' };
  }

  generatePerformanceInsights(scores) {
    const insights = [];

    if (scores.budget_efficiency < 60) {
      insights.push({
        area: 'Budget Management',
        concern: 'Budget utilization is not optimal',
        action: 'Review spending patterns and adjust allocation to achieve 70-80% utilization'
      });
    }

    if (scores.completion_rate < 70) {
      insights.push({
        area: 'Activity Completion',
        concern: `Only ${scores.completion_rate.toFixed(1)}% of activities completed`,
        action: 'Identify bottlenecks and provide additional support to activity teams'
      });
    }

    if (scores.timeline_adherence < 75) {
      insights.push({
        area: 'Timeline Management',
        concern: 'Many activities are behind schedule',
        action: 'Review project timelines and resource allocation for delayed activities'
      });
    }

    if (scores.beneficiary_reach < 50) {
      insights.push({
        area: 'Beneficiary Reach',
        concern: 'Low average beneficiaries per activity',
        action: 'Design activities with broader reach or increase community mobilization efforts'
      });
    }

    if (scores.data_quality < 70) {
      insights.push({
        area: 'Data Quality',
        concern: 'Incomplete activity information',
        action: 'Implement data validation checks and train staff on proper documentation'
      });
    }

    return insights;
  }

  /**
   * Advanced Trend Analysis with Seasonality Detection
   */
  async analyzeTrends(moduleId, options = {}) {
    const { months = 12 } = options;

    // Get monthly aggregated data
    const trendsQuery = `
      SELECT
        DATE_FORMAT(a.start_date, '%Y-%m') as month,
        COUNT(DISTINCT a.id) as activity_count,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_count,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        SUM(COALESCE(a.budget_allocated, 0)) as budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as amount_spent
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ?
        AND a.deleted_at IS NULL
        AND a.start_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(a.start_date, '%Y-%m')
      ORDER BY month
    `;

    const trendsData = await db.query(trendsQuery, [moduleId, months]);

    if (trendsData.length < 3) {
      return { error: 'Insufficient data for trend analysis', message: 'Need at least 3 months of data' };
    }

    // Calculate trends using linear regression
    const metrics = {
      activities: this.calculateTrend(trendsData, 'activity_count'),
      completions: this.calculateTrend(trendsData, 'completed_count'),
      beneficiaries: this.calculateTrend(trendsData, 'beneficiary_count'),
      spending: this.calculateTrend(trendsData, 'amount_spent')
    };

    // Detect seasonality (simple approach: compare quarters)
    const seasonality = this.detectSeasonality(trendsData);

    // Growth rates
    const growth = this.calculateGrowthRates(trendsData);

    return {
      historical_data: trendsData,
      trends: metrics,
      seasonality: seasonality,
      growth_rates: growth,
      predictions: this.generateTrendPredictions(metrics, 3), // 3-month forecast
      insights: this.generateTrendInsights(metrics, seasonality, growth)
    };
  }

  calculateTrend(data, metric) {
    const n = data.length;
    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data.map(d => parseFloat(d[metric]) || 0);

    // Linear regression: y = mx + b
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared for trend strength
    const yMean = sumY / n;
    const ssTotal = yValues.reduce((sum, y) => sum + Math.pow(y - yMean, 2), 0);
    const ssPredictions = yValues.map((y, i) => slope * i + intercept);
    const ssResidual = yValues.reduce((sum, y, i) => sum + Math.pow(y - ssPredictions[i], 2), 0);
    const rSquared = 1 - (ssResidual / ssTotal);

    return {
      slope: slope,
      intercept: intercept,
      r_squared: rSquared,
      direction: slope > 0.01 ? 'increasing' : slope < -0.01 ? 'decreasing' : 'stable',
      strength: rSquared > 0.7 ? 'strong' : rSquared > 0.4 ? 'moderate' : 'weak',
      current_value: yValues[yValues.length - 1],
      average_value: yMean
    };
  }

  detectSeasonality(data) {
    if (data.length < 12) {
      return { detected: false, message: 'Need 12+ months for seasonality detection' };
    }

    // Group by month of year
    const monthlyAverages = {};
    data.forEach(d => {
      const monthNum = new Date(d.month + '-01').getMonth();
      if (!monthlyAverages[monthNum]) {
        monthlyAverages[monthNum] = { sum: 0, count: 0 };
      }
      monthlyAverages[monthNum].sum += parseFloat(d.activity_count);
      monthlyAverages[monthNum].count++;
    });

    // Calculate average for each month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const seasonalPattern = Object.keys(monthlyAverages).map(month => ({
      month: monthNames[month],
      average: monthlyAverages[month].sum / monthlyAverages[month].count
    }));

    // Detect peaks and troughs
    const values = seasonalPattern.map(p => p.average);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const detected = Math.sqrt(variance) > mean * 0.3; // 30% variation

    return {
      detected: detected,
      pattern: seasonalPattern,
      peak_months: seasonalPattern.filter(p => p.average > mean * 1.2).map(p => p.month),
      low_months: seasonalPattern.filter(p => p.average < mean * 0.8).map(p => p.month)
    };
  }

  calculateGrowthRates(data) {
    if (data.length < 2) return {};

    const getGrowth = (metric) => {
      const latest = parseFloat(data[data.length - 1][metric]) || 0;
      const previous = parseFloat(data[data.length - 2][metric]) || 0;
      return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
    };

    return {
      month_over_month: {
        activities: getGrowth('activity_count'),
        beneficiaries: getGrowth('beneficiary_count'),
        spending: getGrowth('amount_spent')
      },
      quarter_over_quarter: this.calculateQuarterlyGrowth(data),
      year_over_year: data.length >= 12 ? this.calculateYearlyGrowth(data) : null
    };
  }

  calculateQuarterlyGrowth(data) {
    if (data.length < 6) return null;

    const lastQuarter = data.slice(-3);
    const previousQuarter = data.slice(-6, -3);

    const sumMetric = (arr, metric) => arr.reduce((sum, d) => sum + (parseFloat(d[metric]) || 0), 0);

    const metrics = ['activity_count', 'beneficiary_count', 'amount_spent'];
    const growth = {};

    metrics.forEach(metric => {
      const current = sumMetric(lastQuarter, metric);
      const previous = sumMetric(previousQuarter, metric);
      growth[metric] = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    });

    return growth;
  }

  calculateYearlyGrowth(data) {
    const latest = data[data.length - 1];
    const yearAgo = data[data.length - 12];

    const metrics = ['activity_count', 'beneficiary_count', 'amount_spent'];
    const growth = {};

    metrics.forEach(metric => {
      const current = parseFloat(latest[metric]) || 0;
      const previous = parseFloat(yearAgo[metric]) || 0;
      growth[metric] = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    });

    return growth;
  }

  generateTrendPredictions(trends, months) {
    const predictions = {};

    Object.keys(trends).forEach(metric => {
      const trend = trends[metric];
      const forecast = [];

      for (let i = 1; i <= months; i++) {
        const predicted = trend.slope * (trend.current_value + i) + trend.intercept;
        forecast.push({
          month: `+${i}`,
          predicted_value: Math.max(0, predicted.toFixed(2)),
          confidence: trend.strength
        });
      }

      predictions[metric] = forecast;
    });

    return predictions;
  }

  generateTrendInsights(trends, seasonality, growth) {
    const insights = [];

    // Activity trend insights
    if (trends.activities.direction === 'decreasing' && trends.activities.strength !== 'weak') {
      insights.push({
        category: 'warning',
        title: 'Declining Activity Volume',
        description: `Activity implementation is ${trends.activities.direction} with ${trends.activities.strength} trend`,
        recommendation: 'Investigate causes of decline and develop intervention plan'
      });
    }

    // Beneficiary trend insights
    if (trends.beneficiaries.direction === 'increasing') {
      insights.push({
        category: 'positive',
        title: 'Growing Beneficiary Reach',
        description: `Beneficiary numbers showing ${trends.beneficiaries.strength} upward trend`,
        recommendation: 'Maintain current outreach strategies and consider scaling successful approaches'
      });
    }

    // Spending trend insights
    if (trends.spending.direction === 'increasing' && growth.month_over_month.spending > 20) {
      insights.push({
        category: 'alert',
        title: 'Rapid Spending Increase',
        description: `Monthly spending increased by ${growth.month_over_month.spending.toFixed(1)}%`,
        recommendation: 'Review budget execution and ensure spending aligns with planned activities'
      });
    }

    // Seasonality insights
    if (seasonality.detected) {
      insights.push({
        category: 'info',
        title: 'Seasonal Patterns Detected',
        description: `Peak activity in: ${seasonality.peak_months.join(', ')}`,
        recommendation: 'Plan resource allocation based on seasonal activity patterns'
      });
    }

    return insights;
  }

  /**
   * Resource Allocation Optimization
   */
  async optimizeResourceAllocation(moduleId) {
    // Analyze efficiency of different components
    const componentsQuery = `
      SELECT
        pc.id,
        pc.name as component_name,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_activities,
        COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries,
        SUM(COALESCE(a.budget_allocated, 0)) as budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as amount_spent,
        AVG(DATEDIFF(a.updated_at, a.created_at)) as avg_completion_time
      FROM project_components pc
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenditures ae ON a.id = ae.activity_id
      WHERE sp.module_id = ?
      GROUP BY pc.id, pc.name
      HAVING total_activities > 0
    `;

    const components = await db.query(componentsQuery, [moduleId]);

    // Calculate efficiency metrics for each component
    const analyzed = components.map(comp => {
      const completionRate = comp.total_activities > 0
        ? (comp.completed_activities / comp.total_activities) * 100
        : 0;

      const costPerBeneficiary = comp.total_beneficiaries > 0
        ? comp.amount_spent / comp.total_beneficiaries
        : 0;

      const budgetUtilization = comp.budget_allocated > 0
        ? (comp.amount_spent / comp.budget_allocated) * 100
        : 0;

      const beneficiaryReach = comp.total_activities > 0
        ? comp.total_beneficiaries / comp.total_activities
        : 0;

      // Efficiency score (0-100)
      const efficiencyScore = (
        (completionRate * 0.3) +
        (Math.min(100, (50 / (costPerBeneficiary || 1)) * 100) * 0.3) + // Lower cost = higher score
        (Math.max(0, 100 - Math.abs(budgetUtilization - 75) * 2) * 0.2) + // Target 75% utilization
        (Math.min(100, (beneficiaryReach / 20) * 100) * 0.2) // 20+ beneficiaries = max score
      );

      return {
        ...comp,
        metrics: {
          completion_rate: completionRate.toFixed(1),
          cost_per_beneficiary: costPerBeneficiary.toFixed(2),
          budget_utilization: budgetUtilization.toFixed(1),
          beneficiary_reach: beneficiaryReach.toFixed(1),
          efficiency_score: efficiencyScore.toFixed(1)
        },
        recommendation: this.getComponentRecommendation(efficiencyScore, completionRate, budgetUtilization)
      };
    });

    // Sort by efficiency
    analyzed.sort((a, b) => parseFloat(b.metrics.efficiency_score) - parseFloat(a.metrics.efficiency_score));

    return {
      components: analyzed,
      summary: {
        high_performers: analyzed.filter(c => parseFloat(c.metrics.efficiency_score) >= 75).length,
        need_improvement: analyzed.filter(c => parseFloat(c.metrics.efficiency_score) < 60).length,
        total_components: analyzed.length
      },
      recommendations: this.generateAllocationRecommendations(analyzed)
    };
  }

  getComponentRecommendation(efficiency, completion, utilization) {
    if (efficiency >= 80) {
      return { status: 'Excellent', action: 'Consider increasing budget allocation to scale impact', priority: 'low' };
    } else if (efficiency >= 65) {
      return { status: 'Good', action: 'Maintain current resource levels', priority: 'low' };
    } else if (efficiency >= 50) {
      if (completion < 50) {
        return { status: 'Needs Support', action: 'Provide technical assistance to improve completion rate', priority: 'medium' };
      } else if (utilization < 50) {
        return { status: 'Under-resourced', action: 'Increase budget allocation or reduce scope', priority: 'medium' };
      }
      return { status: 'Moderate', action: 'Review implementation strategy', priority: 'medium' };
    } else {
      return { status: 'Critical', action: 'Urgent intervention needed - consider restructuring or reallocating resources', priority: 'high' };
    }
  }

  generateAllocationRecommendations(components) {
    const recommendations = [];

    // Identify over-budgeted low performers
    const lowPerformersHighBudget = components.filter(c =>
      parseFloat(c.metrics.efficiency_score) < 50 &&
      parseFloat(c.metrics.budget_utilization) > 80
    );

    if (lowPerformersHighBudget.length > 0) {
      recommendations.push({
        type: 'reallocation',
        title: 'Reallocate from Low Performers',
        components: lowPerformersHighBudget.map(c => c.component_name),
        description: 'These components have high budget allocation but low efficiency',
        action: 'Consider reallocating funds to high-performing components'
      });
    }

    // Identify high performers with low budget
    const highPerformersLowBudget = components.filter(c =>
      parseFloat(c.metrics.efficiency_score) >= 75 &&
      parseFloat(c.metrics.budget_utilization) > 90
    );

    if (highPerformersLowBudget.length > 0) {
      recommendations.push({
        type: 'investment',
        title: 'Invest in High Performers',
        components: highPerformersLowBudget.map(c => c.component_name),
        description: 'These components show excellent efficiency and full budget utilization',
        action: 'Consider increasing budget allocation to maximize impact'
      });
    }

    // Identify stagnant components
    const stagnant = components.filter(c =>
      parseFloat(c.metrics.completion_rate) < 30
    );

    if (stagnant.length > 0) {
      recommendations.push({
        type: 'intervention',
        title: 'Address Stagnant Components',
        components: stagnant.map(c => c.component_name),
        description: 'These components have very low completion rates',
        action: 'Conduct root cause analysis and provide targeted support'
      });
    }

    return recommendations;
  }

  /**
   * Impact Prediction Model
   */
  async predictImpact(moduleId, options = {}) {
    const { proposedBudget, proposedActivities } = options;

    // Get historical impact data
    const historicalQuery = `
      SELECT
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries,
        COUNT(DISTINCT CASE WHEN b.vulnerability_category IS NOT NULL THEN b.id END) as vulnerable_beneficiaries
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN beneficiaries b ON ab.beneficiary_id = b.id
      WHERE sp.module_id = ? AND a.deleted_at IS NULL AND a.status = 'completed'
    `;

    const historical = (await db.query(historicalQuery, [moduleId]))[0];

    if (!historical || historical.total_activities === 0) {
      return { error: 'Insufficient historical data for impact prediction' };
    }

    // Calculate historical ratios
    const budgetPerActivity = historical.total_budget / historical.total_activities;
    const beneficiariesPerActivity = historical.total_beneficiaries / historical.total_activities;
    const beneficiariesPerBudget = historical.total_beneficiaries / historical.total_budget;
    const vulnerablePercentage = (historical.vulnerable_beneficiaries / historical.total_beneficiaries) * 100;

    // Predict based on proposed inputs
    let predictions = {};

    if (proposedBudget) {
      predictions.from_budget = {
        predicted_activities: Math.round(proposedBudget / budgetPerActivity),
        predicted_beneficiaries: Math.round(proposedBudget * beneficiariesPerBudget),
        predicted_vulnerable: Math.round((proposedBudget * beneficiariesPerBudget) * (vulnerablePercentage / 100)),
        confidence: 'moderate'
      };
    }

    if (proposedActivities) {
      predictions.from_activities = {
        required_budget: Math.round(proposedActivities * budgetPerActivity),
        predicted_beneficiaries: Math.round(proposedActivities * beneficiariesPerActivity),
        predicted_vulnerable: Math.round((proposedActivities * beneficiariesPerActivity) * (vulnerablePercentage / 100)),
        confidence: 'moderate'
      };
    }

    return {
      historical_performance: {
        activities_completed: historical.total_activities,
        total_beneficiaries: historical.total_beneficiaries,
        vulnerable_reached: historical.vulnerable_beneficiaries,
        budget_utilized: historical.total_budget
      },
      efficiency_metrics: {
        budget_per_activity: budgetPerActivity.toFixed(2),
        beneficiaries_per_activity: beneficiariesPerActivity.toFixed(1),
        cost_per_beneficiary: (historical.total_budget / historical.total_beneficiaries).toFixed(2),
        vulnerable_targeting_rate: vulnerablePercentage.toFixed(1)
      },
      predictions: predictions,
      recommendations: this.generateImpactRecommendations(historical, predictions)
    };
  }

  generateImpactRecommendations(historical, predictions) {
    const recommendations = [];

    const costPerBeneficiary = historical.total_budget / historical.total_beneficiaries;

    if (costPerBeneficiary > 5000) {
      recommendations.push({
        area: 'Cost Efficiency',
        finding: `Current cost per beneficiary (${costPerBeneficiary.toFixed(2)} KES) is high`,
        suggestion: 'Explore group-based interventions or community approaches to reduce unit costs'
      });
    }

    const vulnerableRate = (historical.vulnerable_beneficiaries / historical.total_beneficiaries) * 100;
    if (vulnerableRate < 40) {
      recommendations.push({
        area: 'Vulnerable Targeting',
        finding: `Only ${vulnerableRate.toFixed(1)}% of beneficiaries are from vulnerable groups`,
        suggestion: 'Strengthen targeting mechanisms to prioritize vulnerable populations'
      });
    }

    if (predictions.from_budget) {
      recommendations.push({
        area: 'Budget Planning',
        finding: `Proposed budget could reach approximately ${predictions.from_budget.predicted_beneficiaries} beneficiaries`,
        suggestion: 'Ensure adequate support systems are in place for scaled implementation'
      });
    }

    return recommendations;
  }
}

module.exports = new AIAnalyticsService();
