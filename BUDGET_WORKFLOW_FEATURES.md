# Budget Request Workflow & Enhanced Features

This document describes the new budget request workflow, comments system, and reference data features added to the M&E system.

## 🚀 New Features Overview

### 1. **Budget Request Workflow**
Teams can now request budgets for activities, and the finance team can review, approve, edit, or return them.

### 2. **Budget Allocations Tracking**
Track budget flow from program level down to activity level with automatic remaining budget calculations.

### 3. **Unified Comments System**
Extended comments table to support more entity types including approvals, checklists, expenses, and risks.

### 4. **Reference Data Populated**
- **Locations**: Hierarchical structure (Country → County → Sub-County → Ward → Parish)
- **Goal Categories**: 12 organizational goal categories aligned with SDGs
- **Strategic Goals**: Organizational strategic objectives

---

## 📋 Database Tables Added

### `activity_budget_requests`
Tracks budget requests from teams for activities.

**Key Fields:**
- `activity_id` - Activity requesting budget
- `requested_amount` - Amount requested
- `approved_amount` - Amount approved by finance
- `status` - draft, submitted, under_review, approved, rejected, returned_for_amendment
- `finance_notes` - Notes from finance team
- `amendment_notes` - Required changes for returned requests
- `rejection_reason` - Why request was rejected

### `budget_allocations`
Tracks budget flow from one level to another.

**Key Fields:**
- `source_type` / `source_id` - Where money comes from (program_budget, sub_program, component)
- `target_type` / `target_id` - Where money goes to (sub_program, component, activity)
- `allocated_amount` - Amount allocated
- `spent_amount` - Amount spent
- `committed_amount` - Amount committed
- `remaining_amount` - Auto-calculated remaining budget

### `activity_budgets`
Activity-level budget tracking with spending.

**Key Fields:**
- `allocated_budget` - Total allocated to activity
- `approved_budget` - Approved through requests
- `spent_budget` - Actually spent
- `committed_amount` - Committed but not spent
- `remaining_budget` - Auto-calculated

### Extended `comments` Table
Now supports:
- `activity`, `goal`, `sub_program`, `component` (existing)
- `approval`, `finance_approval`, `budget_request` (new)
- `checklist`, `expense`, `risk` (new)
- `parent_comment_id` - For threaded discussions

---

## 🔄 Budget Request Workflow

### Step 1: Team Requests Budget
```http
POST /api/budget-requests
{
  "activity_id": 123,
  "requested_amount": 50000.00,
  "justification": "Budget needed for training materials and venue",
  "breakdown": {
    "materials": 20000,
    "venue": 15000,
    "facilitators": 15000
  },
  "priority": "high"
}
```

**Status**: `submitted`

### Step 2: Finance Reviews
Finance team has 4 options:

#### Option A: Approve (Full or Partial)
```http
PUT /api/budget-requests/:id/approve
{
  "approved_amount": 45000.00,
  "finance_notes": "Approved with slight reduction on venue costs"
}
```
**Status**: `approved` → Budget automatically allocated to activity

#### Option B: Reject
```http
PUT /api/budget-requests/:id/reject
{
  "rejection_reason": "No budget available in this fiscal year"
}
```
**Status**: `rejected`

#### Option C: Return for Amendments
```http
PUT /api/budget-requests/:id/return
{
  "amendment_notes": "Please provide detailed breakdown of materials costs and reduce venue budget"
}
```
**Status**: `returned_for_amendment`

#### Option D: Edit Request
```http
PUT /api/budget-requests/:id/edit
{
  "requested_amount": 40000.00,
  "justification": "Updated after discussion with team",
  "finance_notes": "Adjusted based on available budget"
}
```
**Status**: `under_review`

### Step 3: Automatic Budget Allocation
When approved, the system automatically:
1. Creates/updates `activity_budgets` record
2. Sets `approved_budget` = approved amount
3. Creates `budget_allocations` record linking source to activity
4. Tracks remaining budget as expenses are recorded

---

## 💰 Budget Mathematics

The system tracks budget flow and automatically calculates remaining amounts:

```
Remaining Budget = Approved Budget - Spent Budget - Committed Budget
```

### Example Flow:

1. **Program Budget**: KES 1,000,000
2. **Allocated to Sub-Program**: KES 300,000
   - Program remaining: KES 700,000
3. **Allocated to Component**: KES 150,000
   - Sub-program remaining: KES 150,000
4. **Allocated to Activity**: KES 50,000
   - Component remaining: KES 100,000
5. **Activity Spends**: KES 20,000
   - Activity remaining: KES 30,000

All calculations are automatic using database triggers and generated columns.

---

## 📝 Comments Integration

Comments now support more entities:

### Approval Comments
```javascript
{
  "entity_type": "finance_approval",
  "entity_id": 456,
  "comment_text": "Approved with conditions - see attached documentation",
  "comment_type": "approval_feedback",
  "user_id": 1
}
```

### Checklist Comments
```javascript
{
  "entity_type": "checklist",
  "entity_id": 789,
  "comment_text": "This item needs supervisor review before marking complete",
  "comment_type": "observation",
  "user_id": 2
}
```

### Budget Request Comments
```javascript
{
  "entity_type": "budget_request",
  "entity_id": 123,
  "comment_text": "Please revise the materials budget breakdown",
  "comment_type": "general",
  "user_id": 3
}
```

### Threaded Discussions
```javascript
{
  "entity_type": "activity",
  "entity_id": 100,
  "parent_comment_id": 50, // Reply to comment #50
  "comment_text": "I agree, we should adjust the timeline",
  "comment_type": "general",
  "user_id": 4
}
```

---

## 🌍 Reference Data

### Locations
Hierarchical structure populated with Kenya data:

```
Kenya (country)
  ├── Nairobi (county)
  │     ├── Westlands (sub_county)
  │     ├── Kibra (sub_county)
  │     │     ├── Laini Saba (ward)
  │     │     ├── Lindi (ward)
  │     │     └── Makina (ward)
  │     └── Dagoretti North (sub_county)
  ├── Mombasa (county)
  └── Kisumu (county)
```

### Goal Categories (12 Categories)
- Poverty Reduction
- Food Security & Nutrition
- Health & Well-being
- Quality Education
- Gender Equality
- WASH
- Economic Growth
- Infrastructure Development
- Peace & Justice
- Climate Action
- Protection
- Community Empowerment

### Strategic Goals
Auto-created for each category with targets for 2027.

---

## 🔧 Setup Instructions

### 1. Run Database Migrations

```bash
# Create budget workflow tables
mysql -u root -p me_clickup_system < database/migrations/add_budget_request_workflow.sql

# Populate reference data
mysql -u root -p me_clickup_system < database/migrations/populate_reference_data.sql
```

### 2. Restart Backend Server

The routes are automatically loaded on server restart:
```bash
cd backend
npm run dev
```

You should see:
```
💰 Registering Budget Request Workflow routes...
✅ Budget Requests routes registered at /api/budget-requests
```

---

## 📊 API Endpoints Summary

### Budget Requests
- `GET /api/budget-requests` - List all requests (with filters)
- `POST /api/budget-requests` - Create new request
- `PUT /api/budget-requests/:id/approve` - Approve request
- `PUT /api/budget-requests/:id/reject` - Reject request
- `PUT /api/budget-requests/:id/return` - Return for amendments
- `PUT /api/budget-requests/:id/edit` - Edit request (finance only)

### Budget Allocations
- `POST /api/budget-requests/allocate` - Allocate budget from one level to another
- `GET /api/budget-requests/activity/:activityId/budget` - Get activity budget summary

---

## 🎯 Next Steps (Frontend UI Needed)

### 1. Budget Request Form
Create UI component for teams to submit budget requests with:
- Activity selection
- Amount input
- Justification text area
- Budget breakdown editor (JSON)
- Priority selection

### 2. Finance Review Dashboard
Create finance dashboard showing:
- Pending requests list
- Request details view
- Approve/Reject/Return/Edit actions
- Comments/notes interface

### 3. Activity Budget Display
Add to activity detail page:
- Current budget status
- Allocated vs Spent vs Remaining
- Request new budget button
- Budget request history

### 4. Budget Allocation Interface
Create UI for finance to allocate budgets:
- Source selection (program/sub-program/component)
- Target selection (activity)
- Amount input
- Allocation notes

---

## 🔐 Permissions

**Finance Module Access Required**:
- View all budget requests: `READ` permission
- Approve/Reject requests: `APPROVE` permission
- Edit requests: `UPDATE` permission
- Allocate budgets: `CREATE` permission

**Activity Managers**:
- Can create budget requests for their activities
- Can view status of their requests
- Can resubmit after amendments

---

## 📈 Benefits

1. **Transparency**: All budget requests are tracked and auditable
2. **Efficiency**: Automated workflow reduces manual processes
3. **Control**: Finance team has full control with multiple review options
4. **Accuracy**: Automatic budget calculations prevent errors
5. **Visibility**: Teams can see budget status in real-time
6. **Accountability**: Complete audit trail of all budget decisions

---

## 🐛 Troubleshooting

### Budget not updating after approval
- Check `activity_budgets` table has record for activity
- Verify `budget_allocations` record was created
- Check for database triggers

### Comments not appearing
- Verify `entity_type` matches one of the allowed ENUM values
- Check `entity_id` exists in the referenced table
- Ensure user has permission to view entity

### Location hierarchy broken
- Check `parent_id` references are correct
- Verify foreign key constraints are in place
- Run location verification query

---

**Last Updated**: 2026-01-06
**Version**: 1.0
**Status**: Ready for Frontend Development

