# Logframe Enhancement Migration

## Overview
This migration adds comprehensive Results-Based Management (RBM) and Logframe functionality to the M&E system.

## What's Added

### 1. **Indicators Table** (`indicators`)
Tracks SMART indicators at all hierarchy levels (Module → Sub-Program → Component → Activity)

**Features:**
- Indicator type: Impact, Outcome, Output, Process
- Baseline and Target values with dates
- Current value and achievement percentage
- Disaggregation support (gender, age, location, etc.)
- Measurement frequency tracking
- Status monitoring (on-track, at-risk, off-track)

### 2. **Indicator Measurements Table** (`indicator_measurements`)
Records periodic measurements of indicators over time

**Features:**
- Time-series data collection
- Disaggregated value storage
- Verification status and notes
- Measurement methodology tracking

### 3. **Means of Verification Table** (`means_of_verification`)
Documents evidence sources and verification methods

**Features:**
- Multiple evidence types (documents, photos, surveys, reports)
- Document management (name, path, date)
- Verification status workflow
- Collection frequency tracking
- Links to any hierarchy level or indicator

### 4. **Assumptions Table** (`assumptions`)
Tracks key assumptions and risks at each level

**Features:**
- Assumption categorization (external, internal, financial, political, etc.)
- Risk assessment (likelihood × impact = risk level)
- Validation status tracking
- Mitigation strategy documentation
- Periodic review scheduling

### 5. **Results Chain Table** (`results_chain`)
Explicitly links hierarchy levels to show results pathways

**Features:**
- Activity → Component → Sub-Program → Module linkages
- Contribution descriptions
- Contribution weights (for multiple activities contributing to one output)

### 6. **Enhanced Existing Tables**
Adds logframe fields to existing hierarchy tables:
- `program_modules`: Goal statement and indicators
- `sub_programs`: Outcome statement and indicators
- `project_components`: Output statement and indicators

### 7. **Reporting Views**
Pre-built views for easy reporting:
- `v_indicators_with_latest`: Indicators with latest measurements and progress
- `v_results_chain_detailed`: Results chain with entity names

## How to Apply Migration

### Option 1: MySQL Command Line
```bash
mysql -u root -p me_clickup_system < 001_add_logframe_tables.sql
```

### Option 2: MySQL Workbench
1. Open MySQL Workbench
2. Connect to your database
3. File → Open SQL Script → Select `001_add_logframe_tables.sql`
4. Execute (⚡ button)

### Option 3: phpMyAdmin
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
DROP VIEW IF EXISTS v_indicators_with_latest;
DROP VIEW IF EXISTS v_results_chain_detailed;
DROP TABLE IF EXISTS results_chain;
DROP TABLE IF EXISTS assumptions;
DROP TABLE IF EXISTS means_of_verification;
DROP TABLE IF EXISTS indicator_measurements;
DROP TABLE IF EXISTS indicators;

ALTER TABLE program_modules DROP COLUMN IF EXISTS logframe_goal;
ALTER TABLE program_modules DROP COLUMN IF EXISTS goal_indicators;
ALTER TABLE sub_programs DROP COLUMN IF EXISTS logframe_outcome;
ALTER TABLE sub_programs DROP COLUMN IF EXISTS outcome_indicators;
ALTER TABLE project_components DROP COLUMN IF EXISTS logframe_output;
ALTER TABLE project_components DROP COLUMN IF EXISTS output_indicators;
```

## Support

For questions or issues with this migration, check:
- Database logs
- MySQL error messages
- Ensure you have sufficient privileges (CREATE, ALTER, DROP)
