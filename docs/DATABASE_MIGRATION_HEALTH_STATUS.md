# Database Schema Update - Activity Status Separation

## ⚠️ CRITICAL: Two Separate Fields

## Overview
We need to separate the user-entered activity status from the auto-calculated health status to provide better visibility and control.

**IMPORTANT:** These are TWO COMPLETELY SEPARATE fields that should NEVER contain the same values!

## Changes Required

### 1. Activities Table

#### Column 1: `status` (Existing - User Entered)
This column stores what the USER manually sets:
- **Values:** `not-started`, `in-progress`, `completed`, `blocked`, `cancelled`
- **Updated by:** User via UI
- **Never contains:** Auto-calculated values like "on-track" or "at-risk"

#### Column 2: `auto_status` (New - Auto Calculated)
This column stores what the SYSTEM calculates based on dates, budget, etc:
- **Values:** `on-track`, `at-risk`, `behind-schedule`
- **Updated by:** Backend auto-calculation job ONLY
- **Never contains:** User status values like "in-progress" or "blocked"

```sql
ALTER TABLE activities ADD COLUMN auto_status VARCHAR(50);
```

**Column Details:**
- **Name:** `auto_status` (NOT health_status)
- **Type:** VARCHAR(50) or ENUM
- **Nullable:** YES (optional, only set when auto-calculation runs)
- **Values (ONLY these three):**
  - `on-track` - Activity is progressing as planned
  - `at-risk` - Activity may face issues or delays
  - `behind-schedule` - Activity is delayed

### 2. ⚠️ CRITICAL API BEHAVIOR - DO NOT COPY VALUES BETWEEN FIELDS

## THE PROBLEM WE ARE FIXING:
Currently, when a user changes status to "in-progress", the backend is incorrectly saving "in-progress" to BOTH `status` AND `auto_status` columns. This is WRONG!

- ✅ CORRECT: `status` = "in-progress", `auto_status` = "on-track"
- ❌ WRONG: `status` = "in-progress", `auto_status` = "in-progress" (INVALID!)

### API Updates Needed

#### GET /api/activities
Response should include both fields with DIFFERENT values:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Training Session",
      "status": "in-progress",     // ✅ User-entered (what user set)
      "auto_status": "at-risk",    // ✅ Auto-calculated (what system thinks)
      "approval_status": "approved",
      ...
    }
  ]
}
```

**INVALID Example (What's happening now - WRONG):**
```json
{
  "status": "in-progress",
  "auto_status": "in-progress"  // ❌ WRONG! auto_status should be on-track/at-risk/behind-schedule
}
```

#### POST /api/activities/:id/status
**CRITICAL:** This endpoint should ONLY update the `status` field!

**Request:**
```json
{
  "status": "in-progress"
}
```

**Backend Logic:**
```javascript
// ✅ CORRECT
activity.status = req.body.status;  // Update user status
// Do NOT touch auto_status here!

// ❌ WRONG - DO NOT DO THIS
activity.status = req.body.status;
activity.auto_status = req.body.status;  // WRONG! Never copy!
```

The `auto_status` should be calculated separately based on:
- Activity dates vs current date
- Progress indicators
- Budget utilization
- Completion percentage

### 3. Auto-Calculation Logic (Backend)

Create a job/function that calculates `auto_status` based on:

```javascript
// Pseudo-code for auto_status calculation
function calculateAutoStatus(activity) {
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
-- Migration: Add auto_status column to activities table

-- Step 1: Add the column
ALTER TABLE activities
ADD COLUMN auto_status VARCHAR(50) DEFAULT NULL;

-- Step 2: Add index for better query performance
CREATE INDEX idx_activities_auto_status ON activities(auto_status);

-- Step 3: Add constraint to ensure only valid values
ALTER TABLE activities
ADD CONSTRAINT chk_auto_status
CHECK (auto_status IS NULL OR auto_status IN ('on-track', 'at-risk', 'behind-schedule'));

-- Step 4: Initial calculation (optional - can be done via API)
-- IMPORTANT: This uses the USER status to CALCULATE auto_status
-- They will have DIFFERENT values!
UPDATE activities
SET auto_status = CASE
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

**Backend Implementation:**
```javascript
// ✅ CORRECT
router.post('/activities/:id/status', async (req, res) => {
  const { status } = req.body;

  // ONLY update the status field
  await db.query(
    'UPDATE activities SET status = ? WHERE id = ?',
    [status, req.params.id]
  );

  // Do NOT update auto_status here!
  // It will be updated by the scheduled job
});
```

**❌ WRONG Implementation (Current Problem):**
```javascript
// ❌ DO NOT DO THIS
router.post('/activities/:id/status', async (req, res) => {
  const { status } = req.body;

  // WRONG! Don't copy status to auto_status
  await db.query(
    'UPDATE activities SET status = ?, auto_status = ? WHERE id = ?',
    [status, status, req.params.id]  // ❌ This is the bug!
  );
});
```

#### Recalculate Auto Status
```
POST /api/activities/:id/recalculate-auto-status
```
- This runs the auto-calculation logic
- Updates ONLY the `auto_status` field

#### Bulk Recalculation (Scheduled Job)
```
POST /api/activities/recalculate-all-auto-status
```
- Runs for all activities
- Should be scheduled to run daily/hourly

### 6. Frontend Changes (Already Implemented)

The frontend has been updated to:
- Use `auto_status` field (not `health_status`)
- Display both statuses separately in card and list views
- Allow users to change only the `status` field via dropdown
- Show `auto_status` as a read-only badge with icons:
  - ✓ On Track (Green)
  - ⚠️ At Risk (Yellow)
  - 🚨 Behind Schedule (Red)

**Frontend Interface:**
```typescript
interface Activity {
  status: string;           // User-entered: not-started, in-progress, completed, blocked, cancelled
  auto_status?: string;     // Auto-calculated: on-track, at-risk, behind-schedule
}
```

## Benefits

1. **Clear Separation:** User control vs system calculation
2. **Better Visibility:** See both what user set AND system assessment
3. **No Conflicts:** User can mark as "in-progress" while system shows "at-risk"
4. **Proactive Alerts:** Auto status helps identify issues early
5. **Audit Trail:** Both statuses are tracked independently

## Testing Checklist

- [ ] Migration runs successfully with `auto_status` column
- [ ] Database constraint prevents invalid auto_status values
- [ ] Existing activities can be fetched with new field
- [ ] ✅ **CRITICAL:** User status changes ONLY update `status` field, NOT `auto_status`
- [ ] ✅ **CRITICAL:** `status` and `auto_status` contain DIFFERENT values
- [ ] Auto-calculation job runs correctly
- [ ] Frontend displays both statuses properly
- [ ] Filters work with both status fields

## Example Test Cases

### Test Case 1: User Changes Status
```
Before: status = "not-started", auto_status = "on-track"
User Action: Change status to "in-progress"
After: status = "in-progress", auto_status = "on-track" (unchanged)
```

### Test Case 2: Auto Calculation Updates
```
Before: status = "in-progress", auto_status = "on-track"
System Action: Activity date is tomorrow, auto-calculation runs
After: status = "in-progress" (unchanged), auto_status = "at-risk" (updated)
```

### Test Case 3: Invalid Auto Status
```
Attempt: Set auto_status = "in-progress"
Result: Database constraint violation (should fail)
Expected: auto_status can only be on-track/at-risk/behind-schedule
```
