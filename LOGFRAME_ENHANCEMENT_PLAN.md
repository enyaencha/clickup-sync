# Logframe Enhancement Plan
## Aligning Current System with Report Templates

### Executive Summary
The Excel templates provided are **REPORT TEMPLATES** that show what analysis and reporting output should look like. The current system has the basic logframe structure but is missing:
1. **Status tracking** (on-track, at-risk, off-track, etc.)
2. **Performance metrics** (actual vs. target)
3. **Risk indicators**
4. **Progress percentage**
5. **Automated status calculation** based on measurable values

---

## Current Template Structure (What We Have)

### Columns Currently Supported:
1. **Strategic Objective** - High-level program goal
2. **Intermediate Outcomes** - Mid-term achievements
3. **Outputs** - Specific deliverables
4. **Key Activities** - Tasks/processes
5. **Indicators** - Measurable metrics
6. **Means of Verification** - Evidence sources
7. **Timeframe** - Dates/deadlines
8. **Responsibility** - Assigned person/team

### Database Tables:
- `program_modules` - Strategic objectives
- `sub_programs` - Intermediate outcomes
- `project_components` - Outputs
- `activities` - Key activities
- `me_indicators` - Indicators
- `means_of_verification` - Verification methods

---

## Missing Elements for Reporting

### 1. **Status Tracking Fields** (CRITICAL)

Need to add to multiple tables:

#### For Activities:
```sql
ALTER TABLE activities ADD COLUMN IF NOT EXISTS:
- status ENUM('not-started', 'on-track', 'at-risk', 'off-track', 'delayed', 'completed', 'cancelled')
- progress_percentage DECIMAL(5,2) DEFAULT 0.00  -- 0-100%
- status_override BOOLEAN DEFAULT FALSE  -- Manual override flag
- auto_status VARCHAR(50)  -- Automatically calculated status
- manual_status VARCHAR(50)  -- Manually set status
- status_reason TEXT  -- Reason for status
- last_status_update TIMESTAMP
```

#### For Project Components (Outputs):
```sql
ALTER TABLE project_components ADD COLUMN IF NOT EXISTS:
- overall_status ENUM('not-started', 'on-track', 'at-risk', 'off-track', 'completed')
- progress_percentage DECIMAL(5,2) DEFAULT 0.00
- status_override BOOLEAN DEFAULT FALSE
- auto_status VARCHAR(50)
- manual_status VARCHAR(50)
```

#### For Sub-Programs (Outcomes):
```sql
ALTER TABLE sub_programs ADD COLUMN IF NOT EXISTS:
- overall_status ENUM('not-started', 'on-track', 'at-risk', 'off-track', 'completed')
- progress_percentage DECIMAL(5,2) DEFAULT 0.00
- status_override BOOLEAN DEFAULT FALSE
```

### 2. **Performance Metrics** (For Indicators)

```sql
ALTER TABLE me_indicators ADD COLUMN IF NOT EXISTS:
- baseline_value DECIMAL(15,2)  -- Starting value
- target_value DECIMAL(15,2)  -- Goal value
- current_value DECIMAL(15,2)  -- Actual achieved value
- target_date DATE  -- When target should be reached
- achievement_percentage DECIMAL(5,2)  -- (current/target) * 100
- measurement_frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually')
- last_measured_date DATE
- variance DECIMAL(15,2)  -- Difference from target
```

### 3. **Risk Indicators**

```sql
CREATE TABLE IF NOT EXISTS activity_risks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    component_id INT,
    risk_category ENUM('financial', 'operational', 'external', 'resource', 'timeline'),
    risk_level ENUM('low', 'medium', 'high', 'critical'),
    risk_description TEXT,
    mitigation_strategy TEXT,
    identified_date DATE,
    status ENUM('active', 'mitigated', 'materialized', 'closed'),
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (component_id) REFERENCES project_components(id)
);
```

---

## Automated Status Calculation Logic

### Algorithm for Activity Status:

```javascript
function calculateActivityStatus(activity, indicators) {
    // If manually overridden, use manual status
    if (activity.status_override) {
        return activity.manual_status;
    }

    const now = new Date();
    const startDate = new Date(activity.start_date);
    const endDate = new Date(activity.end_date);

    // Time-based calculation
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    const expectedProgress = (elapsed / totalDuration) * 100;

    // Indicator-based calculation (if indicators exist)
    let indicatorProgress = 0;
    if (indicators.length > 0) {
        const avgAchievement = indicators.reduce((sum, ind) =>
            sum + (ind.achievement_percentage || 0), 0) / indicators.length;
        indicatorProgress = avgAchievement;
    }

    // Combined progress (weight: 40% time, 60% indicators)
    const actualProgress = indicators.length > 0
        ? (expectedProgress * 0.4) + (indicatorProgress * 0.6)
        : expectedProgress;

    // Status determination
    const variance = actualProgress - expectedProgress;

    if (activity.status === 'completed') return 'completed';
    if (activity.status === 'cancelled') return 'cancelled';
    if (now < startDate) return 'not-started';

    if (variance >= 0) return 'on-track';  // Meeting or exceeding expectations
    if (variance >= -10) return 'at-risk';  // Slightly behind (within 10%)
    if (variance >= -25) return 'delayed';  // Significantly behind
    return 'off-track';  // Critically behind (>25%)
}
```

### Component Status (Rollup from Activities):

```javascript
function calculateComponentStatus(component, activities) {
    if (component.status_override) {
        return component.manual_status;
    }

    const statusCounts = {
        'off-track': 0,
        'at-risk': 0,
        'delayed': 0,
        'on-track': 0,
        'completed': 0
    };

    activities.forEach(act => {
        const status = calculateActivityStatus(act);
        statusCounts[status]++;
    });

    // Priority-based status (worst status takes precedence)
    if (statusCounts['off-track'] > 0) return 'off-track';
    if (statusCounts['delayed'] > 0) return 'delayed';
    if (statusCounts['at-risk'] > 0) return 'at-risk';
    if (statusCounts['completed'] === activities.length) return 'completed';
    return 'on-track';
}
```

---

## Enhanced Excel Report Format

### Additional Columns to Add:

| Column | Description | Source |
|--------|-------------|--------|
| **Status** | Auto-calculated or manual | `activity.status` or `auto_status` |
| **Progress %** | Percentage complete | `activity.progress_percentage` |
| **Baseline** | Starting value | `indicator.baseline_value` |
| **Target** | Goal value | `indicator.target_value` |
| **Actual** | Current achievement | `indicator.current_value` |
| **Achievement %** | (Actual/Target) * 100 | `indicator.achievement_percentage` |
| **Variance** | Difference from plan | `indicator.variance` |
| **Risk Level** | Associated risks | `activity_risks.risk_level` |
| **Last Updated** | Status update date | `activity.last_status_update` |
| **Comments/Notes** | Explanation | `activity.status_reason` |

---

## Implementation Phases

### Phase 1: Database Schema Updates ✓ TO DO
- [ ] Add status fields to activities, components, sub_programs
- [ ] Add performance metrics to me_indicators
- [ ] Create activity_risks table
- [ ] Run migration script

### Phase 2: Status Calculation Service ✓ TO DO
- [ ] Create `status-calculator.service.js`
- [ ] Implement activity status calculation
- [ ] Implement component status rollup
- [ ] Implement sub-program status rollup
- [ ] Add cron job for automatic status updates

### Phase 3: Manual Override UI ✓ TO DO
- [ ] Add status override checkbox in activity form
- [ ] Add manual status dropdown
- [ ] Add status reason text field
- [ ] Show auto vs manual status indicator

### Phase 4: Enhanced Excel Export ✓ TO DO
- [ ] Update export template with new columns
- [ ] Add color coding for status (green/yellow/red)
- [ ] Add progress charts
- [ ] Add risk summary section

### Phase 5: Reporting & Analysis Page ✓ TO DO
- [ ] Create dedicated reporting page
- [ ] Add status dashboard with charts
- [ ] Add filtering by status/risk
- [ ] Add export to PDF option

---

## Benefits of Automation

### Current (Manual):
- ❌ User must manually select status for each activity
- ❌ No consistency in status determination
- ❌ Time-consuming to update hundreds of activities
- ❌ No historical tracking of status changes

### After Automation:
- ✅ Status automatically calculated based on progress and indicators
- ✅ Consistent logic across all activities
- ✅ Real-time status updates
- ✅ Manual override available when needed
- ✅ Audit trail of status changes
- ✅ Early warning system for at-risk activities

---

## Next Steps

1. **Review and Approve** this plan
2. **Create database migration** script
3. **Implement status calculation** service
4. **Update Excel export** to include new fields
5. **Add UI controls** for manual override
6. **Test with real data**
7. **Deploy to production**

---

## Questions for Stakeholder

1. Should status calculation run automatically (scheduled) or on-demand?
2. What threshold percentages define "at-risk" vs "off-track"?
3. Should we track status history in a separate audit table?
4. Priority order for Phase implementation?
5. Any additional metrics needed in the report?
