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
        DATE_FORMAT(a.activity_date, '%Y-%m-%d') as date,
        SUM(COALESCE(ae.amount, 0)) as daily_spending,
        SUM(COALESCE(a.budget_allocated, 0)) as daily_budget
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.activity_date >= DATE_SUB(CURDATE(), INTERVAL 180 DAY)
      GROUP BY DATE_FORMAT(a.activity_date, '%Y-%m-%d')
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
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
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
    const daysUntilExhaustion = remainingBudget / recentAvg;
    const exhaustionDate = new Date();
    exhaustionDate.setDate(exhaustionDate.getDate() + Math.ceil(daysUntilExhaustion));

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
        days_until_budget_exhaustion: Math.ceil(daysUntilExhaustion),
        estimated_exhaustion_date: exhaustionDate.toISOString().split('T')[0],
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
        a.activity_date,
        a.duration,
        DATEDIFF(a.updated_at, a.created_at) as actual_duration,
        COUNT(DISTINCT ac.id) as total_checklist_items,
        COUNT(DISTINCT CASE WHEN ac.is_checked = 1 THEN ac.id END) as completed_checklist_items,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        a.budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as total_spent
      FROM activities a
      LEFT JOIN activity_checklists ac ON a.id = ac.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      WHERE a.component_id = ? AND a.deleted_at IS NULL
      GROUP BY a.id
      ORDER BY a.activity_date DESC
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

      const daysSinceStart = Math.floor((Date.now() - new Date(activity.activity_date)) / (1000 * 60 * 60 * 24));
      const timeProgress = activity.duration > 0 ? (daysSinceStart / activity.duration) : 0;

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
        DATE_FORMAT(a.activity_date, '%Y-%m') as month,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        COUNT(DISTINCT a.id) as activity_count
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.activity_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(a.activity_date, '%Y-%m')
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
        a.activity_date,
        a.budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        sp.name as subprogram_name,
        pc.name as component_name
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE pm.id = ?
        AND a.deleted_at IS NULL
        AND a.activity_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
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
      SELECT a.id, a.name, a.activity_date
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
      SELECT a.id, a.name, a.activity_date
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
      SELECT a.id, a.name, a.activity_date
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
      JOIN activity_expenses ae ON a.id = ae.activity_id
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
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
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
}

module.exports = new AIAnalyticsService();
