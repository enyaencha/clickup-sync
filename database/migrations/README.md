# Logframe Enhancement Migration (Revised)

## Overview
This migration enhances the existing M&E system with comprehensive Results-Based Management (RBM) and Logframe functionality. It builds upon existing `me_indicators` and `me_results` tables while adding new components.

## What's Added

### 1. **Enhanced me_indicators Table** (UPDATED)
Updates existing table to support new hierarchy and additional fields

**New Fields:**
- `module_id`, `sub_program_id`, `component_id` - Links to new hierarchy
- `baseline_date`, `target_date` - Temporal tracking
- `last_measured_date`, `next_measurement_date` - Measurement scheduling
- `status` - On-track, at-risk, off-track, not-started
- `achievement_percentage` - Progress tracking
- `responsible_person`, `notes` - Metadata
- `deleted_at` - Soft delete support
- Updated `type` enum to include 'process'

**Existing Fields Retained:**
- All original fields from `me_indicators` preserved
- Backward compatible with old hierarchy (`program_id`, `project_id`)

### 2. **me_results Table** (UPDATED)
Enhances existing measurements table

**New Fields:**
- `measurement_method` - How measurement was taken
- `verified_date` - Date of verification

**Existing Fields Retained:**
- All original measurement and verification fields

### 3. **Means of Verification Table** (`means_of_verification`) - NEW
Documents evidence sources and verification methods

**Features:**
- Multiple evidence types (documents, photos, surveys, reports)
- Document management (name, path, date)
- Verification status workflow
- Collection frequency tracking
- Links to any hierarchy level or indicator

### 4. **Assumptions Table** (`assumptions`) - NEW
Tracks key assumptions and risks at each level

**Features:**
- Assumption categorization (external, internal, financial, political, etc.)
- Risk assessment (likelihood × impact = risk level)
- Validation status tracking
- Mitigation strategy documentation
- Periodic review scheduling

### 5. **Results Chain Table** (`results_chain`) - NEW
Explicitly links hierarchy levels to show results pathways

**Features:**
- Activity → Component → Sub-Program → Module linkages
- Contribution descriptions
- Contribution weights (for multiple activities contributing to one output)

### 6. **Enhanced Hierarchy Tables** (UPDATED)
Adds logframe fields to existing hierarchy tables:
- `program_modules`: Goal statement and indicators
- `sub_programs`: Outcome statement and indicators
- `project_components`: Output statement and indicators

### 7. **Reporting Views** (UPDATED)
Pre-built views for easy reporting (updated to use me_indicators and me_results):
- `v_indicators_with_latest`: Indicators with latest measurements and progress
- `v_results_chain_detailed`: Results chain with entity names

## How to Apply Migration

### Option 1: Automated Script (Recommended)
```bash
cd backend
node scripts/run-migration.js
```
This script:
- Loads environment variables from `.env`
- Connects to the database
- Executes the migration with error handling
- Verifies tables were created

### Option 2: MySQL Command Line
```bash
mysql -u root -p me_clickup_system < 002_add_logframe_enhancements.sql
```

### Option 3: MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. File → Open SQL Script → Select `002_add_logframe_enhancements.sql`
4. Execute (⚡ button)

### Option 4: phpMyAdmin
1. Log in to phpMyAdmin
2. Select `me_clickup_system` database
3. Click "SQL" tab
4. Copy and paste the migration script
5. Click "Go"

## Logframe Mapping

```
┌─────────────────────────────────────────────────────────┐
│ LOGFRAME LEVEL    →   SYSTEM ENTITY    →   TABLE       │
├─────────────────────────────────────────────────────────┤
│ GOAL              →   Program Module   →   program_modules      │
│                       + Indicators     →   indicators (entity_type='module')     │
│                       + MoV            →   means_of_verification                 │
│                       + Assumptions    →   assumptions                           │
├─────────────────────────────────────────────────────────┤
│ OUTCOME           →   Sub-Program      →   sub_programs         │
│                       + Indicators     →   indicators (entity_type='sub_program')│
│                       + MoV            →   means_of_verification                 │
│                       + Assumptions    →   assumptions                           │
├─────────────────────────────────────────────────────────┤
│ OUTPUT            →   Component        →   project_components   │
│                       + Indicators     →   indicators (entity_type='component')  │
│                       + MoV            →   means_of_verification                 │
│                       + Assumptions    →   assumptions                           │
├─────────────────────────────────────────────────────────┤
│ ACTIVITY          →   Activity         →   activities           │
│                       + Indicators     →   indicators (entity_type='activity')   │
│                       + MoV            →   means_of_verification                 │
│                       + Checklist      →   activity_checklists                   │
└─────────────────────────────────────────────────────────┘
```

## Sample Data Included

The migration includes sample data for Module 1 (Food, Water & Environment):
- Sample indicator: "Percentage increase in food secure households"
- Sample means of verification: "Household surveys and field reports"
- Sample assumption: "Stable climatic conditions with normal rainfall patterns"

## Next Steps

After applying this migration:

1. **Backend Implementation** - Create services and routes for:
   - Indicators CRUD
   - Indicator measurements
   - Means of verification
   - Assumptions
   - Results chain

2. **Frontend Implementation** - Create UI components for:
   - Indicator management dashboards
   - Measurement data entry
   - Verification tracking
   - Assumptions management
   - Results framework visualization

3. **Integration** - Integrate logframe components into:
   - Program/Sub-Program/Component/Activity pages
   - Dashboard statistics
   - Reporting and analytics

## Benefits

✅ **RBM Compliance**: Fully conformant with Results-Based Management standards
✅ **Logframe Structure**: Complete hierarchy with goals → outcomes → outputs → activities
✅ **Evidence-Based**: Systematic tracking of indicators and verification
✅ **Risk Management**: Comprehensive assumptions and risk tracking
✅ **Results Reporting**: Clear results chain for impact assessment
✅ **Donor Requirements**: Meets international donor logframe requirements

## Rollback

If needed, you can rollback this migration:

```sql
-- Drop new views
DROP VIEW IF EXISTS v_indicators_with_latest;
DROP VIEW IF EXISTS v_results_chain_detailed;

-- Drop new tables
DROP TABLE IF EXISTS results_chain;
DROP TABLE IF EXISTS assumptions;
DROP TABLE IF EXISTS means_of_verification;

-- Remove new columns from me_indicators
ALTER TABLE me_indicators
  DROP FOREIGN KEY IF EXISTS fk_me_indicators_module,
  DROP FOREIGN KEY IF EXISTS fk_me_indicators_sub_program,
  DROP FOREIGN KEY IF EXISTS fk_me_indicators_component,
  DROP COLUMN IF EXISTS module_id,
  DROP COLUMN IF EXISTS sub_program_id,
  DROP COLUMN IF EXISTS component_id,
  DROP COLUMN IF EXISTS baseline_date,
  DROP COLUMN IF EXISTS target_date,
  DROP COLUMN IF EXISTS last_measured_date,
  DROP COLUMN IF EXISTS next_measurement_date,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS achievement_percentage,
  DROP COLUMN IF EXISTS responsible_person,
  DROP COLUMN IF EXISTS notes,
  DROP COLUMN IF EXISTS deleted_at;

-- Revert me_indicators type enum
ALTER TABLE me_indicators
  MODIFY COLUMN `type` ENUM('output','outcome','impact') NOT NULL;

-- Remove new columns from me_results
ALTER TABLE me_results
  DROP COLUMN IF EXISTS measurement_method,
  DROP COLUMN IF EXISTS verified_date;

-- Remove columns from hierarchy tables
ALTER TABLE program_modules
  DROP COLUMN IF EXISTS logframe_goal,
  DROP COLUMN IF EXISTS goal_indicators;

ALTER TABLE sub_programs
  DROP COLUMN IF EXISTS logframe_outcome,
  DROP COLUMN IF EXISTS outcome_indicators;

ALTER TABLE project_components
  DROP COLUMN IF EXISTS logframe_output,
  DROP COLUMN IF EXISTS output_indicators;
```

## Support

For questions or issues with this migration, check:
- Database logs
- MySQL error messages
- Ensure you have sufficient privileges (CREATE, ALTER, DROP)
