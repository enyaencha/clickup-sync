# Finance & Resource Management Modules

This document describes the implementation of two new program modules: **Finance Management** and **Resource Management**.

## Overview

### Finance Management Module (ID: 6, Icon: 💰)
Comprehensive budget tracking and expenditure management system for all programs.

**Features:**
- Program budget allocation and tracking
- Financial transaction recording and approval
- Budget vs. Actual spending analysis
- Multi-level approval workflows
- Expenditure verification
- Budget revision history
- Real-time budget balance calculations
- Search and filter capabilities

### Resource Management Module (ID: 5, Icon: 🏗️)
Previously "Capacity Building" - renamed to manage all organizational resources.

**Features:**
- Asset and equipment inventory management
- Resource allocation and booking system
- Maintenance tracking and scheduling
- Resource request approvals
- Capacity building program management
- Training participant tracking
- Resource utilization reporting

## Database Changes

### New Tables Created

#### Finance Management Tables:
1. `program_budgets` - Budget allocations per program/fiscal year
2. `component_budgets` - Component-level budget breakdown
3. `financial_transactions` - All expenditures and transactions
4. `finance_approvals` - Budget requests and approvals
5. `budget_revisions` - Budget modification history

#### Resource Management Tables:
1. `resource_types` - Categories of resources (equipment, vehicles, etc.)
2. `resources` - Complete resource inventory
3. `resource_requests` - Resource allocation requests
4. `resource_maintenance` - Maintenance records and schedules
5. `capacity_building_programs` - Training and development programs
6. `capacity_building_participants` - Training attendance and outcomes

### Module Updates:
- Updated `program_modules` table:
  - ID 5: "Capacity Building" → "Resource Management" (Icon: 🏗️)
  - ID 6: "Finance Management" (NEW) (Icon: 💰)

## Installation & Setup

### 1. Run Database Migrations

The database migration script will create all necessary tables and update module information.

```bash
cd backend
node run-finance-resource-migrations.js
```

**What this script does:**
- Updates icons for Finance (💰) and Resource Management (🏗️) modules
- Creates all Finance Management tables
- Creates all Resource Management tables
- Inserts default resource types
- Sets up proper indexes and foreign keys

**Note:** If the MySQL server is not running, the migrations are ready and can be run when the database is available. The migration files are located at:
- `database/migrations/014_update_finance_resource_modules.sql`
- `database/migrations/015_create_finance_resource_tables.sql`

### 2. Frontend Components

New React components have been created:

**Finance Dashboard:** `frontend/src/components/FinanceDashboard.tsx`
- Budget overview with visual progress indicators
- Recent transactions table with search/filter
- Pending approvals list
- Real-time budget tracking

**Resource Management:** `frontend/src/components/ResourceManagement.tsx`
- Resource inventory grid view
- Resource request management
- Maintenance schedule tracking
- Availability status indicators

### 3. Routing

Routes have been automatically configured:

**Frontend Routes (App.tsx):**
- `/finance` - Finance dashboard
- `/finance/dashboard` - Finance dashboard (alias)
- `/resources` - Resource management
- `/resources/inventory` - Resource inventory (alias)

**Backend API Routes (server-me.js):**
- `/api/finance/*` - Finance management endpoints
- `/api/resources/*` - Resource management endpoints

**Sidebar Navigation:**
New section added: "FINANCE & RESOURCES"
- 💰 Finance - Budget & Expenditure
- 🏗️ Resources - Asset Management

## API Endpoints

### Finance Management

#### Budgets
- `GET /api/finance/budget-summary` - Get budget summary for all programs
- `GET /api/finance/budgets` - List all budgets (with filters)
- `POST /api/finance/budgets` - Create new budget
- `GET /api/finance/budgets/:id` - Get budget details

#### Transactions
- `GET /api/finance/transactions` - List transactions (with filters)
- `POST /api/finance/transactions` - Record new transaction
- `GET /api/finance/transactions/:id` - Get transaction details

#### Approvals
- `GET /api/finance/approvals` - List approval requests
- `POST /api/finance/approvals` - Create approval request
- `PUT /api/finance/approvals/:id/approve` - Approve request
- `PUT /api/finance/approvals/:id/reject` - Reject request

### Resource Management

#### Resources
- `GET /api/resources` - List all resources (with filters)
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `GET /api/resources/types` - Get resource types

#### Requests
- `GET /api/resources/requests` - List resource requests
- `POST /api/resources/requests` - Create request
- `PUT /api/resources/requests/:id/approve` - Approve request
- `PUT /api/resources/requests/:id/reject` - Reject request

#### Maintenance
- `GET /api/resources/:id/maintenance` - Get maintenance history
- `POST /api/resources/:id/maintenance` - Record maintenance

## Usage Examples

### Creating a Budget

```javascript
POST /api/finance/budgets
{
  "program_module_id": 1,
  "fiscal_year": "2025",
  "total_budget": 1000000,
  "operational_budget": 300000,
  "program_budget": 600000,
  "capital_budget": 100000,
  "donor": "World Bank",
  "budget_start_date": "2025-01-01",
  "budget_end_date": "2025-12-31"
}
```

### Recording a Transaction

```javascript
POST /api/finance/transactions
{
  "program_budget_id": 1,
  "transaction_date": "2025-12-15",
  "transaction_type": "expenditure",
  "amount": 50000,
  "expense_category": "Training",
  "payee_name": "Training Facilitator",
  "description": "Financial Literacy Training",
  "purpose": "Community capacity building"
}
```

### Adding a Resource

```javascript
POST /api/resources
{
  "resource_type_id": 5,
  "name": "Project Vehicle - Toyota Hilux",
  "category": "vehicle",
  "serial_number": "VEH-2025-001",
  "acquisition_date": "2025-01-15",
  "acquisition_cost": 3500000,
  "location": "Main Office",
  "condition_status": "excellent",
  "availability_status": "available"
}
```

### Requesting a Resource

```javascript
POST /api/resources/requests
{
  "resource_id": 1,
  "program_module_id": 2,
  "request_type": "booking",
  "purpose": "Field visit to project sites",
  "start_date": "2025-12-20",
  "end_date": "2025-12-22",
  "priority": "high"
}
```

## Key Features

### Budget Validation
- Automatic calculation of remaining budget
- Prevents over-spending through validation
- Tracks committed vs. spent amounts
- Real-time budget status updates

### Multi-Level Approvals
- Configurable approval workflows
- Priority-based request handling
- Approval history tracking
- Rejection with reason capture

### Resource Tracking
- Complete asset lifecycle management
- Maintenance scheduling and reminders
- Availability status management
- Assignment tracking (user/program)

### Reporting & Analytics
- Budget utilization dashboards
- Expenditure by category analysis
- Resource utilization reports
- Maintenance cost tracking

## Security & Permissions

All endpoints are protected with authentication middleware (`authMW`). Users must:
1. Be authenticated
2. Have appropriate module permissions
3. Have role-based access for approvals

## Future Enhancements

Potential additions for future releases:
- Budget forecasting and projections
- Automated budget alerts at thresholds (75%, 90%, 100%)
- Resource depreciation calculations
- Integration with accounting systems
- Mobile app for resource requests
- QR code scanning for resource tracking
- Automated maintenance reminders
- Dashboard widgets for executive summary

## Troubleshooting

### Migration Fails
If migrations fail due to existing tables:
```bash
# Check which tables already exist
SHOW TABLES LIKE '%budget%';
SHOW TABLES LIKE '%resource%';

# Drop tables if needed (CAUTION: Data loss!)
DROP TABLE IF EXISTS program_budgets, financial_transactions, ...;
```

### Routes Not Working
Ensure server-me.js is running (not server.js):
```bash
cd backend
node server-me.js
```

### Frontend Not Loading
Check that frontend dev server is running:
```bash
cd frontend
npm run dev
```

## Support

For issues or questions:
1. Check migration logs in console output
2. Verify database tables were created
3. Confirm API routes are registered
4. Check browser console for frontend errors
5. Review backend logs for API errors

## Files Changed/Created

### Database:
- `database/migrations/014_update_finance_resource_modules.sql`
- `database/migrations/015_create_finance_resource_tables.sql`
- `backend/run-finance-resource-migrations.js`

### Backend:
- `backend/routes/finance.routes.js` (NEW)
- `backend/routes/resources.routes.js` (NEW)
- `backend/server-me.js` (UPDATED - route registration)

### Frontend:
- `frontend/src/components/FinanceDashboard.tsx` (NEW)
- `frontend/src/components/ResourceManagement.tsx` (NEW)
- `frontend/src/App.tsx` (UPDATED - routes)
- `frontend/src/components/Sidebar.tsx` (UPDATED - navigation)

---

**Created:** December 15, 2025
**Version:** 1.0
**Modules:** Finance Management (ID: 6), Resource Management (ID: 5)
