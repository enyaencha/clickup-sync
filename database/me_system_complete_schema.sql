-- =====================================================
-- M&E SYSTEM - COMPLETE DATABASE SCHEMA
-- Based on ClickUp Hierarchy Mapping for Caritas Nairobi
-- Pushes data FROM local DB TO ClickUp
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- =====================================================
-- SECTION 1: ORGANIZATION & CONFIGURATION
-- =====================================================

-- Organization (Workspace level)
CREATE TABLE IF NOT EXISTS organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- ClickUp Integration (Team/Workspace)
    clickup_team_id VARCHAR(50) UNIQUE COMMENT 'ClickUp Team ID',
    clickup_workspace_id VARCHAR(50) COMMENT 'ClickUp Workspace ID',

    -- Settings
    settings JSON COMMENT 'Organization-wide settings',

    -- Contact Info
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    country VARCHAR(100) DEFAULT 'Kenya',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_code (code),
    INDEX idx_clickup_team (clickup_team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Organization/Workspace - Top Level Container';

-- Sync Configuration
CREATE TABLE IF NOT EXISTS sync_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,

    -- API Credentials (encrypted)
    clickup_api_token_encrypted TEXT NOT NULL,
    clickup_webhook_secret VARCHAR(255),

    -- Sync Settings
    auto_sync_enabled BOOLEAN DEFAULT TRUE,
    sync_interval_minutes INT DEFAULT 15,

    -- Last Sync Info
    last_full_sync DATETIME,
    last_push_sync DATETIME,
    last_pull_sync DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization (organization_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='ClickUp API Configuration and Sync Settings';

-- =====================================================
-- SECTION 2: PROGRAM HIERARCHY (LEVEL 1-4)
-- =====================================================

-- LEVEL 1: Program Modules (ClickUp Spaces)
CREATE TABLE IF NOT EXISTS program_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., FOOD_ENV, SOCIO_ECON',
    icon VARCHAR(10) COMMENT 'Emoji icon',
    description TEXT,
    color VARCHAR(20),

    -- ClickUp Mapping (Space)
    clickup_space_id VARCHAR(50) UNIQUE,

    -- Settings
    budget DECIMAL(15, 2),
    start_date DATE,
    end_date DATE,

    -- Manager
    manager_name VARCHAR(255),
    manager_email VARCHAR(255),

    -- Status
    status ENUM('planning', 'active', 'on-hold', 'completed', 'archived') DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization (organization_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_clickup (clickup_space_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Level 1: Program Modules (Major Thematic Areas) - ClickUp Spaces';

-- LEVEL 2: Sub-Programs/Projects (ClickUp Folders)
CREATE TABLE IF NOT EXISTS sub_programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    module_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- ClickUp Mapping (Folder)
    clickup_folder_id VARCHAR(50) UNIQUE,

    -- Project Details
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Progress
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Manager
    manager_name VARCHAR(255),
    manager_email VARCHAR(255),

    -- Target Beneficiaries
    target_beneficiaries INT,
    actual_beneficiaries INT DEFAULT 0,

    -- Location
    location JSON COMMENT 'Geographic details',

    -- Status
    status ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT TRUE,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (module_id) REFERENCES program_modules(id) ON DELETE CASCADE,
    INDEX idx_module (module_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_clickup (clickup_folder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Level 2: Sub-Programs/Projects (Specific Initiatives) - ClickUp Folders';

-- LEVEL 3: Project Components (ClickUp Lists)
CREATE TABLE IF NOT EXISTS project_components (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sub_program_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- ClickUp Mapping (List)
    clickup_list_id VARCHAR(50) UNIQUE,

    -- Details
    budget DECIMAL(10, 2),
    orderindex INT DEFAULT 0,

    -- Status
    status ENUM('not-started', 'in-progress', 'completed', 'blocked') DEFAULT 'not-started',
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE,

    -- Responsible Person
    responsible_person VARCHAR(255),

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (sub_program_id) REFERENCES sub_programs(id) ON DELETE CASCADE,
    INDEX idx_sub_program (sub_program_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_clickup (clickup_list_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Level 3: Project Components (Work Packages) - ClickUp Lists';

-- LEVEL 4: Activities (ClickUp Tasks)
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    component_id INT NOT NULL,

    name VARCHAR(500) NOT NULL,
    description TEXT,

    -- ClickUp Mapping (Task)
    clickup_task_id VARCHAR(50) UNIQUE,
    clickup_custom_id VARCHAR(50),

    -- Location
    location_id INT,
    location_details VARCHAR(500),
    parish VARCHAR(100),
    ward VARCHAR(100),
    county VARCHAR(100),

    -- Date & Duration
    activity_date DATE,
    start_date DATE,
    end_date DATE,
    duration_hours INT,

    -- Facilitators/Staff
    facilitators TEXT COMMENT 'Comma-separated or JSON array',
    staff_assigned TEXT,

    -- Beneficiaries
    target_beneficiaries INT,
    actual_beneficiaries INT DEFAULT 0,
    beneficiary_type VARCHAR(100),

    -- Budget
    budget_allocated DECIMAL(10, 2),
    budget_spent DECIMAL(10, 2) DEFAULT 0,

    -- Status
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    approval_status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',

    -- Priority
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',

    -- Progress
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- ClickUp Metadata
    clickup_url VARCHAR(500),
    clickup_status VARCHAR(100),
    time_estimate BIGINT COMMENT 'milliseconds',
    time_spent BIGINT DEFAULT 0,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (component_id) REFERENCES project_components(id) ON DELETE CASCADE,
    INDEX idx_component (component_id),
    INDEX idx_location (location_id),
    INDEX idx_status (status, approval_status),
    INDEX idx_activity_date (activity_date),
    INDEX idx_clickup (clickup_task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Level 4: Activities (Implementation Actions) - ClickUp Tasks';

-- Sub-Activities (ClickUp Subtasks)
CREATE TABLE IF NOT EXISTS sub_activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_activity_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- ClickUp Mapping (Subtask)
    clickup_subtask_id VARCHAR(50) UNIQUE,

    -- Details
    status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
    assigned_to VARCHAR(255),
    due_date DATE,

    -- Progress
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_activity_id),
    INDEX idx_status (status),
    INDEX idx_clickup (clickup_subtask_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Sub-Activities (Optional breakdown) - ClickUp Subtasks';

-- Activity Checklists (ClickUp Checklists)
CREATE TABLE IF NOT EXISTS activity_checklists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,

    item_name VARCHAR(255) NOT NULL,
    orderindex INT DEFAULT 0,

    -- ClickUp Mapping
    clickup_checklist_id VARCHAR(50),
    clickup_checklist_item_id VARCHAR(50),

    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at DATETIME,
    completed_by INT,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_activity (activity_id),
    INDEX idx_completed (is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Activity Checklists (Implementation Steps) - ClickUp Checklists';

-- =====================================================
-- SECTION 3: STRATEGIC GOALS & PERFORMANCE TRACKING
-- =====================================================

-- LEVEL 1: Goal Categories (ClickUp Goal Folders)
CREATE TABLE IF NOT EXISTS goal_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,
    period VARCHAR(100) COMMENT 'e.g., Annual 2025, Q1 2025',

    -- ClickUp Mapping
    clickup_goal_folder_id VARCHAR(50) UNIQUE,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    INDEX idx_organization (organization_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Goal Categories (Organizational Objectives) - ClickUp Goal Folders';

-- LEVEL 2: Strategic Goals (ClickUp Goals)
CREATE TABLE IF NOT EXISTS strategic_goals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- ClickUp Mapping
    clickup_goal_id VARCHAR(50) UNIQUE,

    -- Owner
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),

    -- Timeline
    start_date DATE,
    target_date DATE NOT NULL,

    -- Progress (auto-calculated from targets)
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Status
    status ENUM('active', 'completed', 'archived') DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES goal_categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_target_date (target_date),
    INDEX idx_clickup (clickup_goal_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Strategic Goals (High-Level Objectives) - ClickUp Goals';

-- LEVEL 3: Indicators/Targets (ClickUp Targets/Key Results)
CREATE TABLE IF NOT EXISTS indicators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    goal_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- ClickUp Mapping (Target/Key Result)
    clickup_target_id VARCHAR(50) UNIQUE,

    -- Four Types of Indicators
    indicator_type ENUM('numeric', 'financial', 'binary', 'activity_linked') NOT NULL,

    -- For NUMERIC indicators
    target_value DECIMAL(15, 2),
    current_value DECIMAL(15, 2) DEFAULT 0,
    unit VARCHAR(50) COMMENT 'e.g., farmers, households, children',

    -- For FINANCIAL indicators
    target_amount DECIMAL(15, 2),
    current_amount DECIMAL(15, 2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'KES',

    -- For BINARY indicators
    is_completed BOOLEAN DEFAULT FALSE COMMENT 'For yes/no indicators',

    -- For ACTIVITY-LINKED indicators
    linked_activities_count INT DEFAULT 0,
    completed_activities_count INT DEFAULT 0,

    -- Progress (auto-calculated)
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Tracking Method
    tracking_method ENUM('manual', 'automatic') DEFAULT 'manual',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (goal_id) REFERENCES strategic_goals(id) ON DELETE CASCADE,
    INDEX idx_goal (goal_id),
    INDEX idx_type (indicator_type),
    INDEX idx_clickup (clickup_target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Indicators/Targets (Measurable Key Results) - ClickUp Targets';

-- Indicator-Activity Links (for activity-linked indicators)
CREATE TABLE IF NOT EXISTS indicator_activity_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    indicator_id INT NOT NULL,
    activity_id INT NOT NULL,

    -- Link Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (indicator_id) REFERENCES indicators(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    UNIQUE KEY unique_link (indicator_id, activity_id),
    INDEX idx_indicator (indicator_id),
    INDEX idx_activity (activity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Links Activities to Indicators for Auto-Tracking';

-- =====================================================
-- SECTION 4: CROSS-CUTTING ENTITIES
-- =====================================================

-- Beneficiaries
CREATE TABLE IF NOT EXISTS beneficiaries (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Personal Info
    name VARCHAR(255) NOT NULL,
    beneficiary_id_number VARCHAR(100) UNIQUE,

    -- Demographics
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    age INT,
    age_group ENUM('0-5', '6-17', '18-35', '36-60', '60+'),

    -- Type
    beneficiary_type ENUM('individual', 'household', 'group', 'organization'),

    -- Location
    location_id INT,
    parish VARCHAR(100),
    ward VARCHAR(100),
    county VARCHAR(100),
    gps_coordinates VARCHAR(100),

    -- Vulnerability Status
    is_vulnerable BOOLEAN DEFAULT FALSE,
    vulnerability_category JSON COMMENT 'Array of categories',

    -- Contact
    phone VARCHAR(50),
    email VARCHAR(255),

    -- Additional Demographics
    demographics JSON COMMENT 'Extended demographic data',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_type (beneficiary_type),
    INDEX idx_location (location_id),
    INDEX idx_vulnerable (is_vulnerable)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registered Beneficiaries';

-- Activity-Beneficiary Links
CREATE TABLE IF NOT EXISTS activity_beneficiaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,
    beneficiary_id INT NOT NULL,

    role ENUM('participant', 'facilitator', 'observer', 'other') DEFAULT 'participant',
    attended BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE,
    UNIQUE KEY unique_link (activity_id, beneficiary_id),
    INDEX idx_activity (activity_id),
    INDEX idx_beneficiary (beneficiary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Links Beneficiaries to Activities';

-- Locations (Geographic Hierarchy)
CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,
    type ENUM('country', 'county', 'sub_county', 'ward', 'parish') NOT NULL,
    parent_id INT COMMENT 'For hierarchical structure',

    -- Geographic Data
    coordinates JSON COMMENT 'GPS coordinates',
    boundary_data JSON COMMENT 'Polygon/area definition',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES locations(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Geographic Locations (Hierarchical)';

-- Attachments & Evidence (ClickUp Attachments)
CREATE TABLE IF NOT EXISTS attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Entity Linkage
    entity_type ENUM('activity', 'goal', 'indicator', 'sub_program', 'comment') NOT NULL,
    entity_id INT NOT NULL,

    -- ClickUp Mapping
    clickup_attachment_id VARCHAR(50),

    -- File Details
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_url VARCHAR(500),
    file_type VARCHAR(100),
    file_size INT COMMENT 'bytes',

    -- Categorization
    attachment_type ENUM('photo', 'document', 'attendance_sheet', 'training_material', 'distribution_list', 'report', 'other') DEFAULT 'other',
    description TEXT,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_type (attachment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Attachments & Evidence - ClickUp Attachments';

-- Comments & Notes (ClickUp Comments)
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Entity Linkage
    entity_type ENUM('activity', 'goal', 'sub_program', 'component') NOT NULL,
    entity_id INT NOT NULL,

    -- ClickUp Mapping
    clickup_comment_id VARCHAR(50) UNIQUE,

    -- Comment Details
    comment_text TEXT NOT NULL,
    comment_type ENUM('update', 'challenge', 'lesson_learned', 'approval_feedback', 'observation', 'general') DEFAULT 'general',

    -- User
    user_id INT,
    user_name VARCHAR(255),
    user_email VARCHAR(255),

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_type (comment_type),
    INDEX idx_clickup (clickup_comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Comments & Notes - ClickUp Comments';

-- Time Tracking (ClickUp Time Entries)
CREATE TABLE IF NOT EXISTS time_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Entity Linkage
    activity_id INT NOT NULL,

    -- ClickUp Mapping
    clickup_time_entry_id VARCHAR(50) UNIQUE,

    -- User
    user_id INT,
    user_name VARCHAR(255),
    user_type ENUM('staff', 'volunteer', 'contractor') DEFAULT 'staff',

    -- Time Details
    hours_spent DECIMAL(5, 2) NOT NULL,
    description TEXT,
    entry_date DATE NOT NULL,

    -- Sync
    sync_status ENUM('synced', 'pending', 'syncing', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_activity (activity_id),
    INDEX idx_user (user_id),
    INDEX idx_date (entry_date),
    INDEX idx_clickup (clickup_time_entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Time Tracking - ClickUp Time Entries';

-- Activity Expenses
CREATE TABLE IF NOT EXISTS activity_expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT NOT NULL,

    category VARCHAR(100),
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KES',

    expense_date DATE NOT NULL,
    receipt_number VARCHAR(100),

    -- Status
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_activity (activity_id),
    INDEX idx_date (expense_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Activity Expenses Tracking';

-- =====================================================
-- SECTION 5: USERS & PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- ClickUp User Mapping
    clickup_user_id VARCHAR(50) UNIQUE,

    -- User Info
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),

    full_name VARCHAR(255),
    profile_picture VARCHAR(500),

    -- Role
    role ENUM('admin', 'program_manager', 'me_officer', 'field_officer', 'viewer') DEFAULT 'field_officer',

    -- Program Assignments
    assigned_programs JSON COMMENT 'Array of program IDs',

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Sync
    sync_status ENUM('synced', 'pending', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    last_login_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_clickup (clickup_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System Users';

-- =====================================================
-- SECTION 6: SYNC & PUSH OPERATIONS
-- =====================================================

-- Sync Queue (for pushing data TO ClickUp)
CREATE TABLE IF NOT EXISTS sync_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Operation Details
    operation_type ENUM('create', 'update', 'delete') NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,

    -- ClickUp Target
    clickup_entity_type VARCHAR(50),
    clickup_parent_id VARCHAR(50) COMMENT 'Parent entity in ClickUp',

    -- Payload
    payload JSON COMMENT 'Data to be pushed',

    -- Priority
    priority INT DEFAULT 5 COMMENT '1=highest, 10=lowest',

    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',

    -- Retry Logic
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_error TEXT,
    error_details JSON,

    -- Timing
    scheduled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,

    -- Result
    clickup_response JSON,
    clickup_entity_id VARCHAR(50) COMMENT 'Created/updated entity ID in ClickUp',

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_status (status),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_priority (priority),
    INDEX idx_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Queue for Pushing Data TO ClickUp';

-- Sync Log
CREATE TABLE IF NOT EXISTS sync_log (
    id INT PRIMARY KEY AUTO_INCREMENT,

    operation_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,

    direction ENUM('push', 'pull') NOT NULL,
    status ENUM('success', 'failed', 'partial') NOT NULL,

    message TEXT,
    error_details TEXT,

    sync_duration_ms INT,
    clickup_request_id VARCHAR(100),
    clickup_response_code INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit Trail of All Sync Operations';

-- Webhooks Events (incoming from ClickUp)
CREATE TABLE IF NOT EXISTS webhook_events (
    id INT PRIMARY KEY AUTO_INCREMENT,

    webhook_id VARCHAR(100) UNIQUE NOT NULL,
    event_type VARCHAR(100) NOT NULL,

    entity_type VARCHAR(50),
    clickup_entity_id VARCHAR(50),

    payload JSON,

    processed BOOLEAN DEFAULT FALSE,
    processed_at DATETIME,
    processing_error TEXT,

    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_event (event_type),
    INDEX idx_processed (processed),
    INDEX idx_received (received_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Incoming Webhook Events from ClickUp';

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SEED DATA: 5 PROGRAM MODULES
-- =====================================================

-- First, insert default organization
INSERT INTO organizations (name, code, description, country) VALUES
('Caritas Nairobi', 'CARITAS_NBO', 'Caritas Nairobi - Catholic Archdiocese of Nairobi', 'Kenya')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert 5 Program Modules as per M&E mapping
INSERT INTO program_modules (organization_id, name, code, icon, description, start_date, status) VALUES
(1, 'Food, Water & Environment', 'FOOD_ENV', '🌾', 'Climate-Smart Agriculture, Water Access, Environmental Conservation, Farmer Group Development, and Market Linkages', '2024-01-01', 'active'),
(1, 'Socio-Economic Empowerment', 'SOCIO_ECON', '💼', 'Financial Inclusion (VSLAs), Micro-Enterprise Development, Business Skills Training, Value Chain Development, and Market Access Support', '2024-01-01', 'active'),
(1, 'Gender, Youth & Peace', 'GENDER_YOUTH', '👥', 'Gender Equality & Women Empowerment, Youth Development (Beacon Boys), Peacebuilding & Cohesion, Persons with Disabilities Support, and Vulnerable Children Support (OVC)', '2024-01-01', 'active'),
(1, 'Relief & Charitable Services', 'RELIEF', '🆘', 'Emergency Response Operations, Refugee Support Services, Child Care Centers, Food Distribution Programs, and Social Protection Services', '2024-01-01', 'active'),
(1, 'Capacity Building', 'CAPACITY', '📚', 'Staff Training & Development, Volunteer Mobilization & Management, Community Leadership Training, Organizational Development, and Knowledge Management', '2024-01-01', 'active')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Program Overview
CREATE OR REPLACE VIEW v_program_overview AS
SELECT
    pm.id,
    pm.name,
    pm.code,
    pm.icon,
    pm.status,
    pm.budget,
    COUNT(DISTINCT sp.id) AS total_sub_programs,
    COUNT(DISTINCT pc.id) AS total_components,
    COUNT(DISTINCT a.id) AS total_activities,
    SUM(CASE WHEN a.approval_status = 'approved' THEN 1 ELSE 0 END) AS approved_activities,
    SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) AS completed_activities,
    pm.clickup_space_id,
    pm.sync_status,
    pm.last_synced_at
FROM program_modules pm
LEFT JOIN sub_programs sp ON pm.id = sp.module_id AND sp.deleted_at IS NULL
LEFT JOIN project_components pc ON sp.id = pc.sub_program_id AND pc.deleted_at IS NULL
LEFT JOIN activities a ON pc.id = a.component_id AND a.deleted_at IS NULL
WHERE pm.deleted_at IS NULL
GROUP BY pm.id;

-- Activity Dashboard
CREATE OR REPLACE VIEW v_activity_dashboard AS
SELECT
    a.id,
    a.name,
    a.activity_date,
    a.status,
    a.approval_status,
    pc.name AS component_name,
    sp.name AS sub_program_name,
    pm.name AS module_name,
    a.location_details,
    a.target_beneficiaries,
    a.actual_beneficiaries,
    a.budget_allocated,
    a.budget_spent,
    a.clickup_task_id,
    a.sync_status
FROM activities a
INNER JOIN project_components pc ON a.component_id = pc.id
INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id
INNER JOIN program_modules pm ON sp.module_id = pm.id
WHERE a.deleted_at IS NULL;

-- Goals Progress
CREATE OR REPLACE VIEW v_goals_progress AS
SELECT
    g.id,
    g.name,
    gc.name AS category_name,
    g.owner_name,
    g.target_date,
    g.progress_percentage,
    g.status,
    COUNT(i.id) AS total_indicators,
    AVG(i.progress_percentage) AS avg_indicator_progress,
    g.clickup_goal_id,
    g.sync_status
FROM strategic_goals g
INNER JOIN goal_categories gc ON g.category_id = gc.id
LEFT JOIN indicators i ON g.id = i.goal_id AND i.is_active = TRUE
WHERE g.is_active = TRUE
GROUP BY g.id;

-- Sync Queue Status
CREATE OR REPLACE VIEW v_sync_queue_status AS
SELECT
    entity_type,
    operation_type,
    status,
    COUNT(*) AS count,
    MIN(scheduled_at) AS oldest_pending,
    MAX(updated_at) AS latest_update
FROM sync_queue
GROUP BY entity_type, operation_type, status;

SELECT 'M&E System Complete Schema Created Successfully!' AS status;
SELECT COUNT(*) AS program_modules_created FROM program_modules;
