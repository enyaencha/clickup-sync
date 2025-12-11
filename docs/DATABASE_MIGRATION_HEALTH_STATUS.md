# Database Schema Update - Activity Status Separation

## Overview
We need to separate the user-entered activity status from the auto-calculated health status to provide better visibility and control.

## Changes Required

### 1. Activities Table

#### Add New Column
```sql
ALTER TABLE activities ADD COLUMN health_status VARCHAR(50);
```

**Column Details:**
- **Name:** `health_status`
- **Type:** VARCHAR(50) or ENUM
- **Nullable:** YES (optional, only set when auto-calculation runs)
- **Values:**
  - `on-track` - Activity is progressing as planned
  - `at-risk` - Activity may face issues or delays
  - `behind-schedule` - Activity is delayed

#### Keep Existing Status Column
The existing `status` column remains for user-entered values:
- `not-started`
- `in-progress`
- `completed`
- `blocked`
- `cancelled`

### 2. API Updates Needed

#### GET /api/activities
Response should include both fields:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Training Session",
      "status": "in-progress",        // User-entered
      "health_status": "at-risk",     // Auto-calculated
      "approval_status": "approved",
      ...
    }
  ]
}
```

#### POST/PUT /api/activities/:id/status
This endpoint should ONLY update the user `status` field.
The `health_status` should be auto-calculated separately based on:
- Activity dates vs current date
- Progress indicators
- Budget utilization
- Completion percentage

### 3. Auto-Calculation Logic (Backend)

Create a job/function that calculates `health_status` based on:

```javascript
// Pseudo-code for health_status calculation
function calculateHealthStatus(activity) {
  const today = new Date();
  const activityDate = new Date(activity.activity_date);
  const daysUntil = (activityDate - today) / (1000 * 60 * 60 * 24);

  // If activity is in the past and not completed
  if (daysUntil < 0 && activity.status !== 'completed') {
    return 'behind-schedule';
  }

  // If activity is soon (< 7 days) and not started
  if (daysUntil < 7 && activity.status === 'not-started') {
    return 'at-risk';
  }

  // If blocked or has issues
  if (activity.status === 'blocked') {
    return 'at-risk';
  }

  // If budget is overspent
  if (activity.budget_spent > activity.budget_allocated * 1.1) {
    return 'at-risk';
  }

  // Everything looks good
  if (activity.status === 'in-progress' || activity.status === 'not-started') {
    return 'on-track';
  }

  return null; // No health status for completed/cancelled
}
```

### 4. Database Migration

```sql
-- Migration: Add health_status column to activities table

-- Step 1: Add the column
ALTER TABLE activities
ADD COLUMN health_status VARCHAR(50) DEFAULT NULL;

-- Step 2: Add index for better query performance
CREATE INDEX idx_activities_health_status ON activities(health_status);

-- Step 3: Initial calculation (optional - can be done via API)
UPDATE activities
SET health_status = CASE
  WHEN status = 'completed' THEN NULL
  WHEN status = 'cancelled' THEN NULL
  WHEN status = 'blocked' THEN 'at-risk'
  WHEN DATEDIFF(activity_date, NOW()) < 0 AND status != 'completed' THEN 'behind-schedule'
  WHEN DATEDIFF(activity_date, NOW()) < 7 AND status = 'not-started' THEN 'at-risk'
  ELSE 'on-track'
END
WHERE status IS NOT NULL;
```

### 5. API Endpoint Updates

#### Update Activity Status (User Status Only)
```
POST /api/activities/:id/status
Body: { "status": "in-progress" }
```
- This updates ONLY the `status` field
- Does NOT modify `health_status`

#### Recalculate Health Status
```
POST /api/activities/:id/recalculate-health
```
- This runs the auto-calculation logic
- Updates ONLY the `health_status` field

#### Bulk Recalculation (Scheduled Job)
```
POST /api/activities/recalculate-all-health
```
- Runs for all activities
- Should be scheduled to run daily/hourly

### 6. Frontend Changes (Already Implemented)

The frontend has been updated to:
- Display both statuses separately
- Allow users to change only the `status` field
- Show `health_status` as a read-only badge with icons:
  - ✓ On Track (Green)
  - ⚠️ At Risk (Yellow)
  - 🚨 Behind Schedule (Red)

## Benefits

1. **Clear Separation:** User control vs system calculation
2. **Better Visibility:** See both what user set AND system assessment
3. **No Conflicts:** User can mark as "in-progress" while system shows "at-risk"
4. **Proactive Alerts:** Auto health status helps identify issues early
5. **Audit Trail:** Both statuses are tracked independently

## Testing Checklist

- [ ] Migration runs successfully
- [ ] Existing activities can be fetched with new field
- [ ] User status changes work without affecting health_status
- [ ] Auto-calculation job runs correctly
- [ ] Frontend displays both statuses properly
- [ ] Filters work with both status fields
