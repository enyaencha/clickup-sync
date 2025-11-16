# Database Schema Documentation

## Overview

This document provides a comprehensive overview of the database schema for the M&E Project Management System integrated with ClickUp.

## Database Structure

### Total Tables: 38+

The schema is organized into several logical groups:

---

## 1. M&E Core Tables

### `programs`
Maps to ClickUp Spaces - Represents the 5 main programs

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Program name |
| code | VARCHAR(50) | Unique code (e.g., HEALTH, EDUCATION) |
| description | TEXT | Program description |
| clickup_space_id | VARCHAR(50) | ClickUp Space ID |
| start_date | DATE | Program start date |
| end_date | DATE | Program end date |
| budget | DECIMAL(15,2) | Total budget |
| status | ENUM | planning, active, on-hold, completed, cancelled |
| manager_id | INT | Program manager ID |
| manager_name | VARCHAR(255) | Manager name |
| manager_email | VARCHAR(255) | Manager email |
| country | VARCHAR(100) | Country |
| region | VARCHAR(100) | Region |
| district | VARCHAR(100) | District |
| sync_status | ENUM | synced, pending, conflict, error |
| last_synced_at | DATETIME | Last sync timestamp |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |
| deleted_at | DATETIME | Soft delete timestamp |

**Default Programs:**
1. Health & Nutrition (HEALTH)
2. Education & Livelihoods (EDUCATION)
3. WASH (WASH)
4. Protection & Advocacy (PROTECTION)
5. Emergency Response (EMERGENCY)

---

### `projects`
Maps to ClickUp Folders - Projects within programs

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| program_id | INT | Foreign key to programs |
| name | VARCHAR(255) | Project name |
| code | VARCHAR(50) | Unique code (e.g., HEALTH-001) |
| description | TEXT | Project description |
| clickup_folder_id | VARCHAR(50) | ClickUp Folder ID |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| budget | DECIMAL(15,2) | Project budget |
| actual_cost | DECIMAL(15,2) | Actual spending |
| status | ENUM | planning, active, on-hold, completed, cancelled |
| priority | ENUM | low, medium, high, urgent |
| progress_percentage | INT | 0-100 progress |
| manager_id | INT | Project manager ID |
| manager_name | VARCHAR(255) | Manager name |
| target_beneficiaries | INT | Target number of beneficiaries |
| actual_beneficiaries | INT | Actual beneficiaries reached |
| location_details | JSON | Geographic details |
| sync_status | ENUM | Sync status |
| last_synced_at | DATETIME | Last sync |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |
| deleted_at | DATETIME | Soft delete |

---

### `activities`
Maps to ClickUp Lists - Activities within projects

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| project_id | INT | Foreign key to projects |
| name | VARCHAR(255) | Activity name |
| code | VARCHAR(50) | Unique code |
| description | TEXT | Description |
| clickup_list_id | VARCHAR(50) | ClickUp List ID |
| start_date | DATE | Start date |
| end_date | DATE | End date |
| status | ENUM | not-started, in-progress, completed, blocked |
| progress_percentage | INT | 0-100 progress |
| responsible_person | VARCHAR(255) | Person responsible |
| budget | DECIMAL(10,2) | Budget |
| sync_status | ENUM | Sync status |
| last_synced_at | DATETIME | Last sync |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |
| deleted_at | DATETIME | Soft delete |

---

## 2. M&E Indicators & Results

### `me_indicators`
M&E indicators for measuring performance

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| program_id | INT | Linked program (optional) |
| project_id | INT | Linked project (optional) |
| activity_id | INT | Linked activity (optional) |
| name | VARCHAR(255) | Indicator name |
| code | VARCHAR(50) | Unique code |
| description | TEXT | Description |
| type | ENUM | output, outcome, impact |
| category | VARCHAR(100) | Category |
| unit_of_measure | VARCHAR(50) | Unit (e.g., number, percentage) |
| baseline_value | DECIMAL(15,2) | Starting value |
| target_value | DECIMAL(15,2) | Target value |
| current_value | DECIMAL(15,2) | Current achieved value |
| collection_frequency | ENUM | daily, weekly, monthly, quarterly, annually |
| data_source | TEXT | Where data comes from |
| verification_method | TEXT | How to verify |
| disaggregation | JSON | Breakdown (sex, age, etc.) |
| clickup_custom_field_id | VARCHAR(50) | ClickUp field ID |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

**Note:** An indicator can be linked to either program, project, or activity (not multiple)

---

### `me_results`
Actual results/achievements for indicators

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| indicator_id | INT | Foreign key to indicators |
| reporting_period_start | DATE | Period start |
| reporting_period_end | DATE | Period end |
| value | DECIMAL(15,2) | Achieved value |
| disaggregation | JSON | Disaggregated data |
| data_collector | VARCHAR(255) | Who collected |
| collection_date | DATE | When collected |
| verification_status | ENUM | pending, verified, rejected |
| verified_by | VARCHAR(255) | Verifier |
| verified_at | DATETIME | Verification time |
| notes | TEXT | Additional notes |
| attachments | JSON | File URLs |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

### `me_reports`
Generated M&E reports

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| title | VARCHAR(255) | Report title |
| report_type | ENUM | monthly, quarterly, annual, ad-hoc, donor |
| program_id | INT | Scope: program |
| project_id | INT | Scope: project |
| period_start | DATE | Reporting period start |
| period_end | DATE | Reporting period end |
| content | JSON | Report data |
| summary | TEXT | Executive summary |
| file_path | VARCHAR(500) | File location |
| file_format | ENUM | pdf, excel, word, json |
| status | ENUM | draft, pending-review, approved, published |
| generated_by | INT | Generator |
| generated_at | DATETIME | Generation time |
| reviewed_by | INT | Reviewer |
| reviewed_at | DATETIME | Review time |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

## 3. Sync & Mapping Tables

### `clickup_mapping`
Bidirectional mapping between local and ClickUp entities

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| local_entity_type | ENUM | program, project, activity, task, indicator |
| local_entity_id | INT | Local ID |
| clickup_entity_type | ENUM | space, folder, list, task, custom_field |
| clickup_entity_id | VARCHAR(50) | ClickUp ID |
| mapping_status | ENUM | active, broken, deleted |
| last_verified_at | DATETIME | Last verification |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

**Unique Constraints:**
- (local_entity_type, local_entity_id)
- (clickup_entity_type, clickup_entity_id)

---

### `sync_queue`
Queue for pending sync operations

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| operation_type | ENUM | create, update, delete |
| entity_type | ENUM | program, project, activity, task, indicator, result |
| entity_id | INT | Entity ID |
| direction | ENUM | push, pull |
| payload | JSON | Data to sync |
| status | ENUM | pending, processing, completed, failed, cancelled |
| priority | INT | 1 (highest) to 10 (lowest) |
| retry_count | INT | Number of retries |
| max_retries | INT | Max retry attempts (default: 3) |
| last_error | TEXT | Last error message |
| scheduled_at | DATETIME | When to process |
| started_at | DATETIME | Processing start |
| completed_at | DATETIME | Processing end |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

---

### `sync_conflicts`
Detected conflicts requiring resolution

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| entity_type | ENUM | Entity type |
| entity_id | INT | Entity ID |
| field_name | VARCHAR(100) | Conflicting field |
| local_value | TEXT | Local version |
| clickup_value | TEXT | ClickUp version |
| local_updated_at | DATETIME | Local update time |
| clickup_updated_at | DATETIME | ClickUp update time |
| resolution_strategy | ENUM | pending, local_wins, clickup_wins, manual_merge |
| resolved_value | TEXT | Final resolved value |
| resolved_by | INT | Resolver user ID |
| resolved_at | DATETIME | Resolution time |
| notes | TEXT | Resolution notes |
| detected_at | TIMESTAMP | When detected |

---

### `sync_status`
Current sync status per entity

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| entity_type | ENUM | Entity type |
| entity_id | INT | Entity ID |
| status | ENUM | synced, pending, syncing, conflict, error |
| last_synced_at | DATETIME | Last successful sync |
| last_sync_direction | ENUM | push, pull |
| sync_hash | VARCHAR(64) | Hash for change detection |
| last_error | TEXT | Last error |
| error_count | INT | Number of errors |
| created_at | TIMESTAMP | Created |
| updated_at | TIMESTAMP | Updated |

**Unique Constraint:** (entity_type, entity_id)

---

### `sync_log`
Audit trail of all sync operations

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| operation_type | ENUM | create, update, delete, pull, push |
| entity_type | VARCHAR(50) | Entity type |
| entity_id | INT | Entity ID |
| direction | ENUM | push, pull |
| status | ENUM | success, failed, partial |
| message | TEXT | Log message |
| error_details | TEXT | Error details |
| sync_duration_ms | INT | Duration in ms |
| records_affected | INT | Number of records |
| clickup_request_id | VARCHAR(100) | ClickUp request ID |
| clickup_response_code | INT | HTTP status code |
| created_at | TIMESTAMP | Created |

---

## 4. Database Views

### `v_program_overview`
Aggregated program statistics

```sql
SELECT
    p.id,
    p.name,
    p.code,
    p.status,
    p.budget,
    COUNT(DISTINCT pr.id) AS total_projects,
    COUNT(DISTINCT a.id) AS total_activities,
    COUNT(DISTINCT t.id) AS total_tasks,
    SUM(pr.budget) AS total_project_budget,
    AVG(pr.progress_percentage) AS avg_progress,
    p.clickup_space_id,
    p.sync_status,
    p.last_synced_at
FROM programs p
LEFT JOIN projects pr ON ...
```

---

### `v_project_progress`
Project progress tracking

```sql
SELECT
    pr.id,
    pr.name,
    p.name AS program_name,
    pr.progress_percentage,
    DATEDIFF(pr.end_date, CURDATE()) AS days_remaining,
    pr.budget - pr.actual_cost AS budget_remaining,
    COUNT(DISTINCT t.id) AS total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks
FROM projects pr
```

---

### `v_indicator_performance`
M&E indicator achievement

```sql
SELECT
    i.*,
    (i.current_value / i.target_value * 100) AS achievement_percentage,
    COUNT(r.id) AS total_reports,
    MAX(r.collection_date) AS last_reported_date
FROM me_indicators i
LEFT JOIN me_results r ON ...
```

---

## 5. Stored Procedures

### `sp_create_project`
Creates project and queues for sync

```sql
CALL sp_create_project(
    program_id,
    'Project Name',
    'PROJ-001',
    'Description',
    '2024-01-01',
    '2024-12-31',
    100000.00
);
```

---

## 6. Triggers

### `trg_project_update_queue`
Auto-queues project updates for sync

```sql
CREATE TRIGGER trg_project_update_queue
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    INSERT INTO sync_queue (operation_type, entity_type, entity_id, ...)
    VALUES ('update', 'project', NEW.id, ...);
END
```

---

## 7. Indexes

### Performance Indexes

**Programs:**
- idx_code
- idx_status
- idx_sync_status
- idx_clickup_space

**Projects:**
- idx_program
- idx_code
- idx_status
- idx_dates (start_date, end_date)
- idx_clickup_folder
- idx_project_program_status (composite)

**Sync Tables:**
- idx_entity (entity_type, entity_id)
- idx_status
- idx_priority
- idx_scheduled

---

## 8. Data Relationships

```
programs (1) ──→ (∞) projects
    │                  │
    │                  └──→ (∞) activities
    │                            │
    │                            └──→ (∞) tasks
    │
    └──→ (∞) me_indicators ──→ (∞) me_results
```

---

## 9. Sync Flow

### Create Flow:
1. User creates entity → Local DB
2. Trigger/Service → Insert into sync_queue (pending)
3. Sync Engine → Process queue → Push to ClickUp
4. Update clickup_mapping with ClickUp ID
5. Update sync_status to 'synced'

### Update Flow:
1. User updates entity → Local DB updated
2. Auto-queue via trigger
3. Sync Engine → Push to ClickUp
4. Update sync_status

### Pull Flow:
1. Periodic sync or webhook trigger
2. Fetch from ClickUp API
3. Compare timestamps (conflict detection)
4. Update local DB or create conflict record

---

## 10. Query Examples

### Get Program with Projects
```sql
SELECT p.*,
       JSON_ARRAYAGG(
           JSON_OBJECT('id', pr.id, 'name', pr.name, 'status', pr.status)
       ) as projects
FROM programs p
LEFT JOIN projects pr ON p.id = pr.program_id
WHERE p.deleted_at IS NULL
GROUP BY p.id;
```

### Get Pending Sync Operations
```sql
SELECT * FROM sync_queue
WHERE status = 'pending' AND retry_count < max_retries
ORDER BY priority ASC, scheduled_at ASC
LIMIT 10;
```

### Get Indicator Achievement
```sql
SELECT
    name,
    target_value,
    current_value,
    ROUND((current_value / target_value * 100), 2) as achievement_percent
FROM me_indicators
WHERE is_active = TRUE
ORDER BY achievement_percent DESC;
```

---

## Notes

1. **Soft Deletes:** Most tables use `deleted_at` for soft deletion
2. **JSON Fields:** Used for flexible schema (location_details, disaggregation)
3. **Timestamps:** Auto-managed by MySQL
4. **Foreign Keys:** Cascade deletes where appropriate
5. **Charset:** utf8mb4 for emoji and special character support
6. **Engine:** InnoDB for transaction support and foreign keys
