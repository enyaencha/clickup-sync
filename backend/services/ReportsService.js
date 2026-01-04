const db = require('../core/database/connection');

class ReportsService {
  // ==================== PROGRAM PERFORMANCE REPORTS ====================

  async getProgramPerformanceReport(filters = {}) {
    const { moduleId, startDate, endDate, status } = filters;

    let query = `
      SELECT
        pm.id as module_id,
        pm.name as module_name,
        pm.clickup_space_id,
        COUNT(DISTINCT sp.id) as total_subprograms,
        COUNT(DISTINCT pc.id) as total_components,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'ongoing' THEN a.id END) as ongoing_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'planned' THEN a.id END) as planned_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) as cancelled_activities,
        COUNT(DISTINCT ab.beneficiary_id) as total_beneficiaries,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        AVG(CASE
          WHEN a.status = 'completed' THEN 100
          WHEN a.status = 'ongoing' THEN 50
          WHEN a.status = 'planned' THEN 0
          ELSE 0
        END) as completion_percentage,
        COUNT(DISTINCT CASE WHEN a.risk_level = 'high' THEN a.id END) as high_risk_activities,
        COUNT(DISTINCT CASE WHEN a.risk_level = 'medium' THEN a.id END) as medium_risk_activities
      FROM program_modules pm
      LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
      LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
      LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      WHERE pm.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    if (status) {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    query += ` GROUP BY pm.id, pm.name, pm.clickup_space_id ORDER BY pm.name`;

    const results = await db.query(query, params);

    // Calculate budget utilization and variance
    results.forEach(row => {
      row.budget_utilization = row.total_budget > 0
        ? ((row.total_spent / row.total_budget) * 100).toFixed(2)
        : 0;
      row.budget_remaining = row.total_budget - row.total_spent;
      row.completion_percentage = parseFloat(row.completion_percentage).toFixed(2);
    });

    return results;
  }

  async getActivityCompletionReport(filters = {}) {
    const { moduleId, componentId, startDate, endDate } = filters;

    let query = `
      SELECT
        pm.name as module_name,
        sp.name as subprogram_name,
        pc.name as component_name,
        a.id,
        a.name as activity_name,
        a.activity_date,
        a.duration,
        a.status,
        a.approval_status,
        a.risk_level,
        a.budget_allocated,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT ac.id) as total_checklist_items,
        COUNT(DISTINCT CASE WHEN ac.is_checked = 1 THEN ac.id END) as completed_checklist_items,
        COUNT(DISTINCT att.id) as attachment_count,
        SUM(COALESCE(te.hours, 0)) as total_hours,
        l.name as location_name,
        DATEDIFF(CURDATE(), a.activity_date) as days_since_activity
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN activity_checklists ac ON a.id = ac.activity_id
      LEFT JOIN attachments att ON a.id = att.entity_id AND att.entity_type = 'activity'
      LEFT JOIN time_entries te ON a.id = te.activity_id
      LEFT JOIN locations l ON a.location_id = l.id
      WHERE a.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (componentId) {
      query += ` AND pc.id = ?`;
      params.push(componentId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY a.id ORDER BY a.activity_date DESC`;

    const results = await db.query(query, params);

    // Calculate checklist completion percentage
    results.forEach(row => {
      row.checklist_completion = row.total_checklist_items > 0
        ? ((row.completed_checklist_items / row.total_checklist_items) * 100).toFixed(2)
        : 0;
      row.budget_variance = row.budget_allocated - row.total_spent;
      row.budget_variance_percentage = row.budget_allocated > 0
        ? (((row.total_spent - row.budget_allocated) / row.budget_allocated) * 100).toFixed(2)
        : 0;
    });

    return results;
  }

  // ==================== FINANCIAL REPORTS ====================

  async getFinancialReport(filters = {}) {
    const { moduleId, startDate, endDate, groupBy = 'module' } = filters;

    let query = `
      SELECT
        pm.id as module_id,
        pm.name as module_name,
        sp.id as subprogram_id,
        sp.name as subprogram_name,
        pc.id as component_id,
        pc.name as component_name,
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT a.id) as activity_count,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        AVG(COALESCE(ae.amount, 0)) as avg_expense_per_activity
      FROM program_modules pm
      LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
      LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
      LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE pm.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    if (groupBy === 'module') {
      query += ` GROUP BY pm.id, pm.name ORDER BY pm.name`;
    } else if (groupBy === 'subprogram') {
      query += ` GROUP BY sp.id, sp.name, pm.id, pm.name ORDER BY pm.name, sp.name`;
    } else if (groupBy === 'component') {
      query += ` GROUP BY pc.id, pc.name, sp.id, sp.name, pm.id, pm.name ORDER BY pm.name, sp.name, pc.name`;
    }

    const results = await db.query(query, params);

    // Calculate financial metrics
    results.forEach(row => {
      row.budget_remaining = row.total_budget - row.total_spent;
      row.budget_utilization = row.total_budget > 0
        ? ((row.total_spent / row.total_budget) * 100).toFixed(2)
        : 0;
      row.cost_per_beneficiary = row.beneficiary_count > 0
        ? (row.total_spent / row.beneficiary_count).toFixed(2)
        : 0;
      row.variance = row.total_budget - row.total_spent;
      row.variance_percentage = row.total_budget > 0
        ? (((row.total_spent - row.total_budget) / row.total_budget) * 100).toFixed(2)
        : 0;
    });

    return results;
  }

  async getSpendingTrends(filters = {}) {
    const { moduleId, startDate, endDate, interval = 'month' } = filters;

    const dateFormat = interval === 'month' ? '%Y-%m' : interval === 'quarter' ? '%Y-Q%q' : '%Y-%m-%d';

    let query = `
      SELECT
        DATE_FORMAT(a.activity_date, ?) as period,
        pm.name as module_name,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT a.id) as activity_count,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        AVG(COALESCE(ae.amount, 0)) as avg_spending
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      WHERE a.deleted_at IS NULL
    `;

    const params = [dateFormat];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY period, pm.name ORDER BY period, pm.name`;

    const results = await db.query(query, params);
    return results;
  }

  async getExpenseCategoryBreakdown(filters = {}) {
    const { moduleId, startDate, endDate } = filters;

    let query = `
      SELECT
        ae.expense_category,
        pm.name as module_name,
        COUNT(DISTINCT ae.id) as transaction_count,
        SUM(ae.amount) as total_amount,
        AVG(ae.amount) as avg_amount,
        MIN(ae.amount) as min_amount,
        MAX(ae.amount) as max_amount
      FROM activity_expenses ae
      JOIN activities a ON ae.activity_id = a.id
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      WHERE a.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY ae.expense_category, pm.name ORDER BY total_amount DESC`;

    const results = await db.query(query, params);
    return results;
  }

  // ==================== BENEFICIARY REPORTS ====================

  async getBeneficiaryReport(filters = {}) {
    const { moduleId, locationType, locationId, startDate, endDate } = filters;

    let query = `
      SELECT
        pm.name as module_name,
        COUNT(DISTINCT b.id) as total_beneficiaries,
        COUNT(DISTINCT CASE WHEN b.gender = 'male' THEN b.id END) as male_count,
        COUNT(DISTINCT CASE WHEN b.gender = 'female' THEN b.id END) as female_count,
        COUNT(DISTINCT CASE WHEN b.gender = 'other' THEN b.id END) as other_gender_count,
        COUNT(DISTINCT CASE WHEN b.is_vulnerable = 1 THEN b.id END) as vulnerable_count,
        COUNT(DISTINCT CASE WHEN b.beneficiary_type = 'individual' THEN b.id END) as individual_count,
        COUNT(DISTINCT CASE WHEN b.beneficiary_type = 'household' THEN b.id END) as household_count,
        COUNT(DISTINCT CASE WHEN b.beneficiary_type = 'group' THEN b.id END) as group_count,
        COUNT(DISTINCT CASE WHEN b.beneficiary_type = 'organization' THEN b.id END) as organization_count,
        AVG(YEAR(CURDATE()) - YEAR(b.date_of_birth)) as avg_age,
        COUNT(DISTINCT ab.activity_id) as activities_participated,
        l.name as location_name,
        l.type as location_type
      FROM beneficiaries b
      LEFT JOIN activity_beneficiaries ab ON b.id = ab.beneficiary_id
      LEFT JOIN activities a ON ab.activity_id = a.id AND a.deleted_at IS NULL
      LEFT JOIN project_components pc ON a.component_id = pc.id
      LEFT JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN locations l ON b.location_id = l.id
      WHERE b.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (locationId) {
      query += ` AND b.location_id = ?`;
      params.push(locationId);
    }

    if (startDate) {
      query += ` AND a.activity_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND a.activity_date <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY pm.name, l.id, l.name, l.type ORDER BY pm.name`;

    const results = await db.query(query, params);

    // Calculate percentages
    results.forEach(row => {
      row.male_percentage = row.total_beneficiaries > 0
        ? ((row.male_count / row.total_beneficiaries) * 100).toFixed(2)
        : 0;
      row.female_percentage = row.total_beneficiaries > 0
        ? ((row.female_count / row.total_beneficiaries) * 100).toFixed(2)
        : 0;
      row.vulnerable_percentage = row.total_beneficiaries > 0
        ? ((row.vulnerable_count / row.total_beneficiaries) * 100).toFixed(2)
        : 0;
      row.avg_age = row.avg_age ? parseFloat(row.avg_age).toFixed(1) : null;
    });

    return results;
  }

  async getGeographicDistribution(filters = {}) {
    const { moduleId, locationType = 'county' } = filters;

    let query = `
      SELECT
        l.id as location_id,
        l.name as location_name,
        l.type as location_type,
        COUNT(DISTINCT a.id) as activity_count,
        COUNT(DISTINCT b.id) as beneficiary_count,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_activities
      FROM locations l
      LEFT JOIN activities a ON l.id = a.location_id AND a.deleted_at IS NULL
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN beneficiaries b ON ab.beneficiary_id = b.id AND b.deleted_at IS NULL
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN project_components pc ON a.component_id = pc.id
      LEFT JOIN sub_programs sp ON pc.sub_program_id = sp.id
      LEFT JOIN program_modules pm ON sp.module_id = pm.id
      WHERE 1=1
    `;

    const params = [];

    if (locationType) {
      query += ` AND l.type = ?`;
      params.push(locationType);
    }

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    query += ` GROUP BY l.id, l.name, l.type ORDER BY activity_count DESC, beneficiary_count DESC`;

    const results = await db.query(query, params);
    return results;
  }

  // ==================== INDICATOR ACHIEVEMENT REPORTS ====================

  async getIndicatorAchievementReport(filters = {}) {
    const { moduleId, goalId, startDate, endDate } = filters;

    // Query both strategic goal indicators AND M&E indicators
    let query = `
      SELECT
        'strategic_goal' as source,
        i.id as indicator_id,
        i.name as indicator_name,
        i.indicator_type as indicator_type,
        NULL as baseline_value,
        i.target_value,
        i.current_value,
        i.unit,
        NULL as collection_frequency,
        NULL as data_source,
        sg.id as goal_id,
        sg.name as goal_name,
        pm.name as module_name,
        CASE
          WHEN i.indicator_type = 'binary' THEN
            CASE WHEN i.is_completed = 1 THEN 100 ELSE 0 END
          WHEN i.indicator_type = 'activity_linked' THEN
            CASE WHEN i.linked_activities_count > 0 THEN
              ((i.completed_activities_count / i.linked_activities_count) * 100)
            ELSE 0 END
          WHEN i.target_value > 0 THEN
            ((i.current_value / i.target_value) * 100)
          ELSE 0
        END as achievement_percentage,
        i.linked_activities_count as linked_activities
      FROM indicators i
      LEFT JOIN strategic_goals sg ON i.goal_id = sg.id
      LEFT JOIN program_modules pm ON sg.module_id = pm.id
      WHERE i.is_active = 1
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (goalId) {
      query += ` AND sg.id = ?`;
      params.push(goalId);
    }

    query += `
      UNION ALL
      SELECT
        'me_indicator' as source,
        i.id as indicator_id,
        i.name as indicator_name,
        i.type as indicator_type,
        i.baseline_value,
        i.target_value,
        i.current_value,
        i.unit_of_measure as unit,
        i.collection_frequency,
        i.data_source,
        NULL as goal_id,
        NULL as goal_name,
        pm.name as module_name,
        i.achievement_percentage,
        NULL as linked_activities
      FROM me_indicators i
      LEFT JOIN program_modules pm ON i.module_id = pm.id
      WHERE i.deleted_at IS NULL AND i.is_active = 1
    `;

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    query += ` ORDER BY achievement_percentage DESC`;

    const results = await db.query(query, params);

    // Calculate status and variance
    results.forEach(row => {
      row.achievement_percentage = parseFloat(row.achievement_percentage || 0).toFixed(2);
      row.variance = (row.target_value || 0) - (row.current_value || 0);
      row.status = row.achievement_percentage >= 100 ? 'achieved' :
                   row.achievement_percentage >= 75 ? 'on-track' :
                   row.achievement_percentage >= 50 ? 'at-risk' : 'off-track';
    });

    return results;
  }

  // ==================== TIME & RESOURCE REPORTS ====================

  async getTimeUtilizationReport(filters = {}) {
    const { moduleId, userId, startDate, endDate } = filters;

    let query = `
      SELECT
        u.id as user_id,
        u.username,
        u.email,
        pm.name as module_name,
        COUNT(DISTINCT te.id) as total_entries,
        SUM(te.hours) as total_hours,
        COUNT(DISTINCT te.activity_id) as activities_count,
        AVG(te.hours) as avg_hours_per_entry,
        te.user_type,
        DATE_FORMAT(MIN(te.entry_date), '%Y-%m-%d') as first_entry,
        DATE_FORMAT(MAX(te.entry_date), '%Y-%m-%d') as last_entry
      FROM time_entries te
      JOIN users u ON te.user_id = u.id
      JOIN activities a ON te.activity_id = a.id
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      WHERE a.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (userId) {
      query += ` AND u.id = ?`;
      params.push(userId);
    }

    if (startDate) {
      query += ` AND te.entry_date >= ?`;
      params.push(startDate);
    }

    if (endDate) {
      query += ` AND te.entry_date <= ?`;
      params.push(endDate);
    }

    query += ` GROUP BY u.id, pm.id, te.user_type ORDER BY total_hours DESC`;

    const results = await db.query(query, params);
    return results;
  }

  async getResourceUtilizationReport(filters = {}) {
    const { moduleId } = filters;

    let query = `
      SELECT
        r.id as resource_id,
        r.name as resource_name,
        r.type as resource_type,
        r.quantity as total_quantity,
        r.unit,
        r.status,
        COUNT(DISTINCT rr.id) as total_requests,
        COUNT(DISTINCT CASE WHEN rr.status = 'approved' THEN rr.id END) as approved_requests,
        COUNT(DISTINCT CASE WHEN rr.status = 'pending' THEN rr.id END) as pending_requests,
        COUNT(DISTINCT CASE WHEN rr.status = 'rejected' THEN rr.id END) as rejected_requests,
        SUM(CASE WHEN rr.status = 'approved' THEN rr.quantity ELSE 0 END) as allocated_quantity
      FROM finance_resources r
      LEFT JOIN resource_requests rr ON r.id = rr.resource_id
      WHERE r.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND r.module_id = ?`;
      params.push(moduleId);
    }

    query += ` GROUP BY r.id ORDER BY r.name`;

    const results = await db.query(query, params);

    // Calculate utilization
    results.forEach(row => {
      row.available_quantity = row.total_quantity - (row.allocated_quantity || 0);
      row.utilization_percentage = row.total_quantity > 0
        ? ((row.allocated_quantity / row.total_quantity) * 100).toFixed(2)
        : 0;
    });

    return results;
  }

  // ==================== RISK & STATUS REPORTS ====================

  async getRiskReport(filters = {}) {
    const { moduleId, riskLevel } = filters;

    let query = `
      SELECT
        a.id as activity_id,
        a.name as activity_name,
        a.status,
        a.risk_level,
        a.activity_date,
        a.duration,
        pm.name as module_name,
        sp.name as subprogram_name,
        pc.name as component_name,
        a.budget_allocated,
        SUM(COALESCE(ae.amount, 0)) as total_spent,
        COUNT(DISTINCT ab.beneficiary_id) as beneficiary_count,
        DATEDIFF(DATE_ADD(a.activity_date, INTERVAL a.duration DAY), CURDATE()) as days_remaining,
        COUNT(DISTINCT ac.id) as total_checklist_items,
        COUNT(DISTINCT CASE WHEN ac.is_checked = 1 THEN ac.id END) as completed_checklist_items
      FROM activities a
      JOIN project_components pc ON a.component_id = pc.id
      JOIN sub_programs sp ON pc.sub_program_id = sp.id
      JOIN program_modules pm ON sp.module_id = pm.id
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN activity_checklists ac ON a.id = ac.activity_id
      WHERE a.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    if (riskLevel) {
      query += ` AND a.risk_level = ?`;
      params.push(riskLevel);
    } else {
      query += ` AND a.risk_level IN ('high', 'medium')`;
    }

    query += ` GROUP BY a.id ORDER BY
      FIELD(a.risk_level, 'high', 'medium', 'low'),
      a.activity_date`;

    const results = await db.query(query, params);

    // Calculate risk indicators
    results.forEach(row => {
      row.budget_variance = row.budget_allocated - row.total_spent;
      row.budget_overrun = row.total_spent > row.budget_allocated;
      row.checklist_completion = row.total_checklist_items > 0
        ? ((row.completed_checklist_items / row.total_checklist_items) * 100).toFixed(2)
        : 0;
      row.is_delayed = row.days_remaining < 0;
    });

    return results;
  }

  // ==================== DATA QUALITY REPORTS ====================

  async getDataQualityReport(filters = {}) {
    const { moduleId } = filters;

    // Activities with missing data
    let query = `
      SELECT
        pm.name as module_name,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.location_id IS NULL THEN a.id END) as missing_location,
        COUNT(DISTINCT CASE WHEN a.budget_allocated IS NULL OR a.budget_allocated = 0 THEN a.id END) as missing_budget,
        COUNT(DISTINCT CASE WHEN ab.beneficiary_id IS NULL THEN a.id END) as missing_beneficiaries,
        COUNT(DISTINCT CASE WHEN att.id IS NULL THEN a.id END) as missing_attachments,
        COUNT(DISTINCT CASE WHEN te.id IS NULL THEN a.id END) as missing_time_entries
      FROM program_modules pm
      LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
      LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
      LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN attachments att ON a.id = att.entity_id AND att.entity_type = 'activity'
      LEFT JOIN time_entries te ON a.id = te.activity_id
      WHERE pm.deleted_at IS NULL
    `;

    const params = [];

    if (moduleId) {
      query += ` AND pm.id = ?`;
      params.push(moduleId);
    }

    query += ` GROUP BY pm.id, pm.name`;

    const results = await db.query(query, params);

    // Calculate data completeness percentages
    results.forEach(row => {
      const total = row.total_activities || 1;
      row.location_completeness = ((1 - row.missing_location / total) * 100).toFixed(2);
      row.budget_completeness = ((1 - row.missing_budget / total) * 100).toFixed(2);
      row.beneficiary_completeness = ((1 - row.missing_beneficiaries / total) * 100).toFixed(2);
      row.attachment_completeness = ((1 - row.missing_attachments / total) * 100).toFixed(2);
      row.time_entry_completeness = ((1 - row.missing_time_entries / total) * 100).toFixed(2);
      row.overall_completeness = (
        (parseFloat(row.location_completeness) +
         parseFloat(row.budget_completeness) +
         parseFloat(row.beneficiary_completeness) +
         parseFloat(row.attachment_completeness) +
         parseFloat(row.time_entry_completeness)) / 5
      ).toFixed(2);
    });

    return results;
  }

  async getSyncStatusReport() {
    const query = `
      SELECT
        DATE_FORMAT(created_at, '%Y-%m-%d') as sync_date,
        operation,
        entity_type,
        COUNT(*) as total_operations,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
      FROM sync_log
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY sync_date, operation, entity_type
      ORDER BY sync_date DESC, operation, entity_type
    `;

    const results = await db.query(query);

    // Calculate success rates
    results.forEach(row => {
      row.success_rate = row.total_operations > 0
        ? ((row.successful / row.total_operations) * 100).toFixed(2)
        : 0;
    });

    return results;
  }

  // ==================== SUMMARY & OVERVIEW REPORTS ====================

  async getExecutiveSummary(filters = {}) {
    const { startDate, endDate } = filters;

    const dateFilter = [];
    const params = [];

    if (startDate) {
      dateFilter.push('a.activity_date >= ?');
      params.push(startDate);
    }

    if (endDate) {
      dateFilter.push('a.activity_date <= ?');
      params.push(endDate);
    }

    const dateCondition = dateFilter.length > 0
      ? `AND ${dateFilter.join(' AND ')}`
      : '';

    // Overall statistics
    const overallQuery = `
      SELECT
        COUNT(DISTINCT pm.id) as total_modules,
        COUNT(DISTINCT sp.id) as total_subprograms,
        COUNT(DISTINCT pc.id) as total_components,
        COUNT(DISTINCT a.id) as total_activities,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_activities,
        COUNT(DISTINCT b.id) as total_beneficiaries,
        SUM(COALESCE(a.budget_allocated, 0)) as total_budget,
        SUM(COALESCE(ae.amount, 0)) as total_spent
      FROM program_modules pm
      LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
      LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
      LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL ${dateCondition}
      LEFT JOIN activity_beneficiaries ab ON a.id = ab.activity_id
      LEFT JOIN beneficiaries b ON ab.beneficiary_id = b.id AND b.deleted_at IS NULL
      LEFT JOIN activity_expenses ae ON a.id = ae.activity_id
      WHERE pm.deleted_at IS NULL
    `;

    const overallResults = await db.query(overallQuery, params);
    const summary = overallResults[0];

    // Count strategic goals separately
    const goalsQuery = `
      SELECT COUNT(*) as total_goals
      FROM strategic_goals
      WHERE is_active = 1
    `;
    const goalsResult = await db.query(goalsQuery);
    summary.total_goals = goalsResult[0].total_goals;

    // Count indicators separately (strategic goal indicators + ME indicators)
    const indicatorsQuery = `
      SELECT
        (SELECT COUNT(*) FROM indicators WHERE is_active = 1) +
        (SELECT COUNT(*) FROM me_indicators WHERE deleted_at IS NULL AND is_active = 1) as total_indicators
    `;
    const indicatorsResult = await db.query(indicatorsQuery);
    summary.total_indicators = indicatorsResult[0].total_indicators;

    // Calculate key metrics
    summary.completion_rate = summary.total_activities > 0
      ? ((summary.completed_activities / summary.total_activities) * 100).toFixed(2)
      : 0;
    summary.budget_utilization = summary.total_budget > 0
      ? ((summary.total_spent / summary.total_budget) * 100).toFixed(2)
      : 0;
    summary.budget_remaining = summary.total_budget - summary.total_spent;

    return summary;
  }
}

module.exports = new ReportsService();
