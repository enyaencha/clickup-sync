# M&E SYSTEM - ClickUp Integration

Complete Monitoring & Evaluation system that pushes data FROM local database TO ClickUp.

## 🎯 Overview

This system implements the complete M&E hierarchy as documented in `ME_System_Hierarchy_Mapping.md`:

- **Organization/Workspace** → ClickUp Team/Workspace
- **Program Modules** (5 modules) → ClickUp Spaces
- **Sub-Programs/Projects** → ClickUp Folders
- **Project Components** → ClickUp Lists
- **Activities** → ClickUp Tasks
- **Sub-Activities** → ClickUp Subtasks
- **Activity Checklists** → ClickUp Checklists
- **Strategic Goals** → ClickUp Goals
- **Indicators/Targets** → ClickUp Key Results

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Sync Process](#sync-process)
- [Program Modules](#program-modules)
- [Workflow](#workflow)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp config/.env.example config/.env
# Edit config/.env with your database and ClickUp credentials
```

Required variables:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `CLICKUP_API_TOKEN` - Get from https://app.clickup.com/settings/apps
- `CLICKUP_TEAM_ID` - Your ClickUp Team ID
- `ENCRYPTION_KEY` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3. Setup Database

```bash
cd backend
npm run setup-db
```

This will:
- Create the `me_clickup_system` database
- Create all tables and views
- Insert the 5 program modules
- Create indexes and triggers

### 4. Configure ClickUp API Token

Option A - Via API:
```bash
curl -X POST http://localhost:4000/api/sync/configure \
  -H "Content-Type: application/json" \
  -d '{
    "clickup_api_token": "pk_your_token_here",
    "clickup_team_id": "your_team_id"
  }'
```

Option B - Direct database:
```sql
-- Encrypt your token first (use the /api/sync/configure endpoint)
INSERT INTO sync_config (id, organization_id, clickup_api_token_encrypted)
VALUES (1, 1, 'encrypted_token_here');

UPDATE organizations SET clickup_team_id = 'your_team_id' WHERE id = 1;
```

### 5. Start Server

```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Server will start on `http://localhost:4000`

## 📊 Database Setup

### Schema Components

The database includes:

#### Core Hierarchy Tables
- `organizations` - Top-level workspace
- `program_modules` - 5 major thematic areas (Spaces)
- `sub_programs` - Specific initiatives (Folders)
- `project_components` - Work packages (Lists)
- `activities` - Implementation actions (Tasks)
- `sub_activities` - Sub-tasks
- `activity_checklists` - Implementation steps

#### Goals & Performance
- `goal_categories` - Goal folders
- `strategic_goals` - High-level objectives
- `indicators` - Measurable targets (4 types: numeric, financial, binary, activity-linked)
- `indicator_activity_links` - Links indicators to activities

#### Cross-Cutting
- `beneficiaries` - Registered beneficiaries
- `activity_beneficiaries` - Links beneficiaries to activities
- `locations` - Geographic hierarchy
- `comments` - Notes and updates
- `attachments` - Evidence and documents
- `time_entries` - Time tracking
- `activity_expenses` - Expense tracking

#### Sync Management
- `sync_config` - ClickUp API configuration
- `sync_queue` - Pending push operations
- `sync_log` - Audit trail
- `webhook_events` - Incoming webhooks

## ⚙️ Configuration

### ClickUp API Token

Get your API token:
1. Go to https://app.clickup.com/settings/apps
2. Click "Generate" under API Token
3. Copy the token

Get your Team ID:
1. In ClickUp, click on your workspace
2. Go to Settings
3. Find your Team ID in the URL or settings

### Encryption Key

Generate a secure encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add this to your `.env` file as `ENCRYPTION_KEY`

## 📡 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Program Modules

#### Get all program modules
```http
GET /api/me/programs
```

#### Create program module
```http
POST /api/me/programs
Content-Type: application/json

{
  "name": "Food, Water & Environment",
  "code": "FOOD_ENV",
  "icon": "🌾",
  "description": "Agriculture and environment programs",
  "budget": 500000,
  "start_date": "2024-01-01",
  "manager_name": "John Doe",
  "manager_email": "john@example.com"
}
```

#### Update program module
```http
PUT /api/me/programs/:id
```

### Sub-Programs

#### Get sub-programs
```http
GET /api/me/sub-programs?module_id=1
```

#### Create sub-program
```http
POST /api/me/sub-programs
Content-Type: application/json

{
  "module_id": 1,
  "name": "Climate-Smart Agriculture Project",
  "code": "FOOD_ENV_CSA_001",
  "description": "Training farmers in climate-smart agriculture",
  "budget": 100000,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "target_beneficiaries": 500
}
```

### Project Components

#### Get components
```http
GET /api/me/components?sub_program_id=1
```

#### Create component
```http
POST /api/me/components
Content-Type: application/json

{
  "sub_program_id": 1,
  "name": "Farmer Training Component",
  "code": "FOOD_ENV_CSA_001_TRAIN",
  "description": "Training sessions for farmers",
  "budget": 30000
}
```

### Activities

#### Get activities
```http
GET /api/me/activities?component_id=1&status=planned&limit=50
```

Query parameters:
- `component_id` - Filter by component
- `status` - Filter by status (planned, ongoing, completed, cancelled)
- `approval_status` - Filter by approval (draft, submitted, approved, rejected)
- `from_date` - Filter from date (YYYY-MM-DD)
- `to_date` - Filter to date
- `limit` - Limit results

#### Get single activity
```http
GET /api/me/activities/:id
```

#### Create activity (Task)
```http
POST /api/me/activities
Content-Type: application/json

{
  "component_id": 1,
  "name": "Farmer Field School Training - Maize Production",
  "description": "Training session on improved maize farming techniques",
  "activity_date": "2025-01-15",
  "start_date": "2025-01-15",
  "end_date": "2025-01-15",
  "duration_hours": 6,
  "location_details": "Kiambu Parish Community Center",
  "parish": "Kiambu",
  "ward": "Kiambu Ward",
  "county": "Kiambu",
  "facilitators": "John Doe, Jane Smith",
  "target_beneficiaries": 30,
  "beneficiary_type": "Farmers",
  "budget_allocated": 5000,
  "status": "planned",
  "approval_status": "draft",
  "priority": "normal"
}
```

#### Update activity
```http
PUT /api/me/activities/:id
Content-Type: application/json

{
  "status": "completed",
  "approval_status": "approved",
  "actual_beneficiaries": 28,
  "budget_spent": 4800,
  "progress_percentage": 100
}
```

### Goals & Indicators

#### Create goal
```http
POST /api/me/goals
Content-Type: application/json

{
  "category_id": 1,
  "name": "Improve Food Security for 5,000 Households",
  "description": "Increase food security through agricultural training",
  "owner_name": "Program Manager",
  "target_date": "2025-12-31"
}
```

#### Create indicator
```http
POST /api/me/indicators
Content-Type: application/json

{
  "goal_id": 1,
  "name": "Number of farmers trained",
  "indicator_type": "numeric",
  "target_value": 1000,
  "unit": "farmers",
  "tracking_method": "automatic"
}
```

Indicator types:
- `numeric` - Number-based (e.g., farmers trained)
- `financial` - Money-based (e.g., savings mobilized)
- `binary` - Yes/No (e.g., framework developed)
- `activity_linked` - Auto-calculated from linked activities

#### Update indicator progress
```http
PUT /api/me/indicators/:id/progress
Content-Type: application/json

{
  "current_value": 450,
  "progress_percentage": 45
}
```

### Beneficiaries

#### Create beneficiary
```http
POST /api/me/beneficiaries
Content-Type: application/json

{
  "name": "John Farmer",
  "beneficiary_id_number": "BEN-2025-001",
  "gender": "male",
  "age": 45,
  "age_group": "36-60",
  "beneficiary_type": "individual",
  "parish": "Kiambu",
  "ward": "Kiambu Ward",
  "county": "Kiambu",
  "phone": "+254712345678",
  "is_vulnerable": false
}
```

#### Link beneficiary to activity
```http
POST /api/me/activities/:activityId/beneficiaries/:beneficiaryId
Content-Type: application/json

{
  "role": "participant"
}
```

### Comments

#### Add comment
```http
POST /api/me/comments
Content-Type: application/json

{
  "entity_type": "activity",
  "entity_id": 1,
  "comment_text": "Training went very well. High attendance and engagement.",
  "comment_type": "update",
  "user_name": "Field Officer",
  "user_email": "officer@example.com"
}
```

### Dashboards

#### Program overview
```http
GET /api/me/dashboard/programs
```

#### Activity dashboard
```http
GET /api/me/dashboard/activities?module_name=Food,%20Water%20&%20Environment
```

#### Goals progress
```http
GET /api/me/dashboard/goals
```

#### Sync status
```http
GET /api/me/dashboard/sync-status
```

### Sync Management

#### Process sync queue manually
```http
POST /api/sync/process
```

#### Get sync queue
```http
GET /api/sync/queue
```

#### Get sync log
```http
GET /api/sync/log?limit=100
```

## 🔄 Sync Process

### How It Works

1. **Create/Update Entity**: When you create or update an M&E entity (activity, goal, etc.), it's saved to the local database
2. **Auto-Queue**: The entity is automatically added to the `sync_queue` table with status `pending`
3. **Periodic Processing**: Every 15 minutes (configurable), the SyncManager processes the queue
4. **Push to ClickUp**: Each pending item is pushed to ClickUp via API
5. **Update Local Record**: The ClickUp ID is saved back to the local record
6. **Mark Synced**: The entity's `sync_status` is updated to `synced`

### Sync Priority

Items are processed by priority (1=highest, 10=lowest):

- **Priority 1**: Indicator progress updates
- **Priority 2**: Goals and indicators
- **Priority 3**: Activities (tasks)
- **Priority 4**: Comments
- **Priority 5**: Other entities

### Retry Logic

Failed syncs are retried up to 3 times with exponential backoff.

### Monitoring

Check sync status:
```bash
curl http://localhost:4000/api/me/dashboard/sync-status
```

View sync log:
```bash
curl http://localhost:4000/api/sync/log?limit=20
```

## 🎯 Program Modules

The system includes 5 pre-configured program modules:

### 1. 🌾 Food, Water & Environment
**Code**: `FOOD_ENV`

Sub-programs:
- Climate-Smart Agriculture
- Water & Irrigation Projects
- Environmental Conservation
- Farmer Group Development
- Market Linkages

### 2. 💼 Socio-Economic Empowerment
**Code**: `SOCIO_ECON`

Sub-programs:
- Financial Inclusion & VSLAs
- Micro-Enterprise Development
- Business Skills Training
- Value Chain Development
- Market Access Support

### 3. 👥 Gender, Youth & Peace
**Code**: `GENDER_YOUTH`

Sub-programs:
- Gender Equality & Women Empowerment
- Youth Development (Beacon Boys)
- Peacebuilding & Cohesion
- Persons with Disabilities Support
- Vulnerable Children Support (OVC)

### 4. 🆘 Relief & Charitable Services
**Code**: `RELIEF`

Sub-programs:
- Emergency Response Operations
- Refugee Support Services
- Child Care Centers
- Food Distribution Programs
- Social Protection Services

### 5. 📚 Capacity Building
**Code**: `CAPACITY`

Sub-programs:
- Staff Training & Development
- Volunteer Mobilization & Management
- Community Leadership Training
- Organizational Development
- Knowledge Management

## 🔄 Workflow

### Activity Workflow

1. **Draft** → Field Officer creates activity
2. **Submitted** → Officer submits for review
3. **Approved** → M&E Officer approves
4. **Ongoing** → Activity is being implemented
5. **Completed** → Activity finished

At each stage, the activity is automatically synced to ClickUp.

### Approval Statuses

- `draft` - Being created
- `submitted` - Awaiting review
- `approved` - Ready to implement
- `rejected` - Needs revision

## 🛠️ Development

### Run Tests
```bash
npm test
```

### Database Migrations

The system uses automatic migrations via the `setup-me-system.js` script.

To reset database:
```bash
npm run setup-db
```

### Logs

Logs are written to:
- Console (stdout)
- `logs/app.log` (if configured)

## 📚 Additional Resources

- [ClickUp API Documentation](https://clickup.com/api)
- [M&E System Hierarchy Mapping](ME_System_Hierarchy_Mapping.md)
- [M&E System Visual Diagram](ME_System_Hierarchy_Visual.html)

## 🐛 Troubleshooting

### Sync not working

1. Check ClickUp API token is configured:
```bash
curl http://localhost:4000/api/sync/queue
```

2. Verify database connectivity:
```bash
curl http://localhost:4000/health
```

3. Check sync logs:
```bash
curl http://localhost:4000/api/sync/log?limit=10
```

### Database connection issues

- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE me_clickup_system;`

## 📝 License

Proprietary - Caritas Nairobi

## 👥 Support

For support, contact the M&E team at Caritas Nairobi.
