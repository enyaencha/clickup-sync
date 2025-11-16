-- =====================================================
-- M&E Project Management System - Database Schema
-- Enhanced ClickUp Integration with M&E Capabilities
-- =====================================================

-- Drop existing tables if needed (careful in production!)
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- SECTION 1: M&E CORE TABLES
-- =====================================================

-- Programs Table (Maps to ClickUp Spaces)
CREATE TABLE IF NOT EXISTS programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., FOOD_ENV, SOCIO_ECON, GENDER_YOUTH, RELIEF, CAPACITY',
    description TEXT,
    icon VARCHAR(10) COMMENT 'Emoji icon for program',

    -- ClickUp Integration
    clickup_space_id VARCHAR(50) UNIQUE COMMENT 'ClickUp Space ID',

    -- M&E Metadata
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15, 2),
    status ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'active',

    -- Program Manager
    manager_id INT,
    manager_name VARCHAR(255),
    manager_email VARCHAR(255),

    -- Location
    country VARCHAR(100),
    region VARCHAR(100),
    district VARCHAR(100),

    -- Sync Fields
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL COMMENT 'Soft delete',

    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_sync_status (sync_status),
    INDEX idx_clickup_space (clickup_space_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='M&E Programs - Maps to ClickUp Spaces';

-- Projects Table (Maps to ClickUp Folders)
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., HEALTH-001',
    description TEXT,

    -- ClickUp Integration
    clickup_folder_id VARCHAR(50) UNIQUE COMMENT 'ClickUp Folder ID',

    -- Project Details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,

    status ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

    -- Progress Tracking
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Project Manager
    manager_id INT,
    manager_name VARCHAR(255),

    -- Target Beneficiaries
    target_beneficiaries INT,
    actual_beneficiaries INT DEFAULT 0,

    -- Location
    location_details JSON COMMENT 'Geographic coordinates, address, etc.',

    -- Sync Fields
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,

    INDEX idx_program (program_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_clickup_folder (clickup_folder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Projects within Programs - Maps to ClickUp Folders';

-- Activities Table (Maps to ClickUp Lists)
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,

    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., HEALTH-001-ACT-01',
    description TEXT,

    -- ClickUp Integration
    clickup_list_id VARCHAR(50) UNIQUE COMMENT 'ClickUp List ID',

    -- Activity Details
    start_date DATE,
    end_date DATE,
    status ENUM('not-started', 'in-progress', 'completed', 'blocked') DEFAULT 'not-started',

    -- Progress
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    -- Resources
    responsible_person VARCHAR(255),
    budget DECIMAL(10, 2),

    -- Sync Fields
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,

    INDEX idx_project (project_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_clickup_list (clickup_list_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Activities within Projects - Maps to ClickUp Lists';

-- =====================================================
-- SECTION 2: M&E INDICATORS & RESULTS
-- =====================================================

-- M&E Indicators Table
CREATE TABLE IF NOT EXISTS me_indicators (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Linkage (can be at program, project, or activity level)
    program_id INT,
    project_id INT,
    activity_id INT,

    -- Indicator Details
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT 'e.g., IND-HEALTH-001',
    description TEXT,

    -- Classification
    type ENUM('output', 'outcome', 'impact') NOT NULL,
    category VARCHAR(100) COMMENT 'e.g., Health, Education, WASH',

    -- Measurement
    unit_of_measure VARCHAR(50) COMMENT 'e.g., number, percentage, hectares',
    baseline_value DECIMAL(15, 2),
    target_value DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2) DEFAULT 0,

    -- Data Collection
    collection_frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually') DEFAULT 'monthly',
    data_source TEXT,
    verification_method TEXT,

    -- Disaggregation
    disaggregation JSON COMMENT 'e.g., {sex: [male, female], age: [0-5, 6-17, 18+]}',

    -- ClickUp Mapping (stored as Custom Field)
    clickup_custom_field_id VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,

    INDEX idx_program (program_id),
    INDEX idx_project (project_id),
    INDEX idx_activity (activity_id),
    INDEX idx_type (type),
    INDEX idx_code (code),

    CHECK (
        (program_id IS NOT NULL AND project_id IS NULL AND activity_id IS NULL) OR
        (program_id IS NULL AND project_id IS NOT NULL AND activity_id IS NULL) OR
        (program_id IS NULL AND project_id IS NULL AND activity_id IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='M&E Indicators for Programs, Projects, and Activities';

-- M&E Results Table
CREATE TABLE IF NOT EXISTS me_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    indicator_id INT NOT NULL,

    -- Result Data
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    value DECIMAL(15, 2) NOT NULL,

    -- Disaggregated Data
    disaggregation JSON COMMENT 'e.g., {sex: {male: 45, female: 55}, age: {...}}',

    -- Metadata
    data_collector VARCHAR(255),
    collection_date DATE NOT NULL,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by VARCHAR(255),
    verified_at DATETIME,

    -- Comments
    notes TEXT,
    attachments JSON COMMENT 'Array of file URLs/paths',

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (indicator_id) REFERENCES me_indicators(id) ON DELETE CASCADE,

    INDEX idx_indicator (indicator_id),
    INDEX idx_period (reporting_period_start, reporting_period_end),
    INDEX idx_collection_date (collection_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Actual Results/Achievements for M&E Indicators';

-- M&E Reports Table
CREATE TABLE IF NOT EXISTS me_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Report Details
    title VARCHAR(255) NOT NULL,
    report_type ENUM('monthly', 'quarterly', 'annual', 'ad-hoc', 'donor') NOT NULL,

    -- Scope
    program_id INT,
    project_id INT,

    -- Period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Report Data
    content JSON COMMENT 'Report data structure',
    summary TEXT,

    -- File Storage
    file_path VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'word', 'json') DEFAULT 'pdf',

    -- Status
    status ENUM('draft', 'pending-review', 'approved', 'published') DEFAULT 'draft',

    -- Metadata
    generated_by INT,
    generated_at DATETIME,
    reviewed_by INT,
    reviewed_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,

    INDEX idx_program (program_id),
    INDEX idx_project (project_id),
    INDEX idx_type (report_type),
    INDEX idx_period (period_start, period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Generated M&E Reports';

-- =====================================================
-- SECTION 3: SYNC & MAPPING TABLES
-- =====================================================

-- ClickUp Mapping Table (Bidirectional ID Mapping)
CREATE TABLE IF NOT EXISTS clickup_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Local Entity
    local_entity_type ENUM('program', 'project', 'activity', 'task', 'indicator') NOT NULL,
    local_entity_id INT NOT NULL,

    -- ClickUp Entity
    clickup_entity_type ENUM('space', 'folder', 'list', 'task', 'custom_field') NOT NULL,
    clickup_entity_id VARCHAR(50) NOT NULL,

    -- Metadata
    mapping_status ENUM('active', 'broken', 'deleted') DEFAULT 'active',
    last_verified_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_local (local_entity_type, local_entity_id),
    UNIQUE KEY unique_clickup (clickup_entity_type, clickup_entity_id),

    INDEX idx_local (local_entity_type, local_entity_id),
    INDEX idx_clickup (clickup_entity_type, clickup_entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Maps Local Entities to ClickUp Entities';

-- Sync Queue Table
CREATE TABLE IF NOT EXISTS sync_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Operation Details
    operation_type ENUM('create', 'update', 'delete') NOT NULL,
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,

    -- Direction
    direction ENUM('push', 'pull') NOT NULL,

    -- Payload
    payload JSON COMMENT 'Data to be synced',

    -- Status
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    priority INT DEFAULT 5 COMMENT '1=highest, 10=lowest',

    -- Retry Logic
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_error TEXT,

    -- Timing
    scheduled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Queue for Pending Sync Operations';

-- Sync Conflicts Table
CREATE TABLE IF NOT EXISTS sync_conflicts (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Entity
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,

    -- Conflict Details
    field_name VARCHAR(100) NOT NULL,
    local_value TEXT,
    clickup_value TEXT,

    -- Timestamps
    local_updated_at DATETIME,
    clickup_updated_at DATETIME,

    -- Resolution
    resolution_strategy ENUM('pending', 'local_wins', 'clickup_wins', 'manual_merge') DEFAULT 'pending',
    resolved_value TEXT,
    resolved_by INT,
    resolved_at DATETIME,

    -- Notes
    notes TEXT,

    -- Audit
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_resolution (resolution_strategy),
    INDEX idx_detected (detected_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Detected Sync Conflicts Requiring Resolution';

-- Sync Status Table
CREATE TABLE IF NOT EXISTS sync_status (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Entity
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,

    -- Status
    status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',

    -- Sync Info
    last_synced_at DATETIME,
    last_sync_direction ENUM('push', 'pull'),
    sync_hash VARCHAR(64) COMMENT 'Hash of synced data for change detection',

    -- Error Info
    last_error TEXT,
    error_count INT DEFAULT 0,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY unique_entity (entity_type, entity_id),
    INDEX idx_status (status),
    INDEX idx_last_sync (last_synced_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Current Sync Status per Entity';

-- Sync Log Table
CREATE TABLE IF NOT EXISTS sync_log (
    id INT PRIMARY KEY AUTO_INCREMENT,

    -- Operation
    operation_type ENUM('create', 'update', 'delete', 'pull', 'push') NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,

    -- Direction
    direction ENUM('push', 'pull') NOT NULL,

    -- Status
    status ENUM('success', 'failed', 'partial') NOT NULL,

    -- Details
    message TEXT,
    error_details TEXT,

    -- Metadata
    sync_duration_ms INT,
    records_affected INT DEFAULT 1,

    -- ClickUp API Info
    clickup_request_id VARCHAR(100),
    clickup_response_code INT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit Trail of All Sync Operations';

-- =====================================================
-- SECTION 4: EXISTING CLICKUP TABLES (Reference)
-- =====================================================

-- Note: These tables already exist from the original schema
-- Listed here for reference and foreign key relationships

-- Enhanced Tasks Table (extending existing)
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clickup_task_id VARCHAR(50) UNIQUE NOT NULL,

    -- Links to M&E structure
    activity_id INT COMMENT 'Link to activities table',
    project_id INT COMMENT 'Redundant for quick access',
    program_id INT COMMENT 'Redundant for quick access',

    -- ClickUp Fields
    list_id VARCHAR(50) NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(100),
    priority VARCHAR(50),

    -- Dates
    due_date BIGINT,
    start_date BIGINT,
    time_estimate BIGINT,

    -- Progress
    progress_percentage INT DEFAULT 0,

    -- Sync Fields
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,

    INDEX idx_activity (activity_id),
    INDEX idx_project (project_id),
    INDEX idx_program (program_id),
    INDEX idx_list (list_id),
    INDEX idx_sync_status (sync_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SECTION 5: SEED DATA - 5 Caritas Programs
-- =====================================================

INSERT INTO programs (name, code, icon, description, start_date, status, budget) VALUES
('Food & Environment', 'FOOD_ENV', '🌾', 'Sustainable agriculture, food security, and environmental conservation programs', '2024-01-01', 'active', 500000.00),
('Socio-Economic', 'SOCIO_ECON', '💼', 'Economic empowerment, livelihoods, and poverty alleviation initiatives', '2024-01-01', 'active', 450000.00),
('Gender & Youth', 'GENDER_YOUTH', '👥', 'Gender equality, youth empowerment, and social inclusion programs', '2024-01-01', 'active', 350000.00),
('Relief Services', 'RELIEF', '🏥', 'Emergency relief, health services, and humanitarian assistance', '2024-01-01', 'active', 600000.00),
('Capacity Building', 'CAPACITY', '🎓', 'Training, institutional strengthening, and skills development programs', '2024-01-01', 'active', 400000.00)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- SECTION 6: VIEWS FOR EASY QUERYING
-- =====================================================

-- Program Overview View
CREATE OR REPLACE VIEW v_program_overview AS
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
LEFT JOIN projects pr ON p.id = pr.program_id AND pr.deleted_at IS NULL
LEFT JOIN activities a ON pr.id = a.project_id AND a.deleted_at IS NULL
LEFT JOIN tasks t ON a.id = t.activity_id AND t.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id;

-- Project Progress View
CREATE OR REPLACE VIEW v_project_progress AS
SELECT
    pr.id,
    pr.name,
    pr.code,
    p.name AS program_name,
    pr.status,
    pr.progress_percentage,
    pr.start_date,
    pr.end_date,
    DATEDIFF(pr.end_date, CURDATE()) AS days_remaining,
    pr.budget,
    pr.actual_cost,
    pr.budget - pr.actual_cost AS budget_remaining,
    COUNT(DISTINCT a.id) AS total_activities,
    COUNT(DISTINCT t.id) AS total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
    pr.sync_status
FROM projects pr
INNER JOIN programs p ON pr.program_id = p.id
LEFT JOIN activities a ON pr.id = a.project_id AND a.deleted_at IS NULL
LEFT JOIN tasks t ON a.id = t.activity_id AND t.deleted_at IS NULL
WHERE pr.deleted_at IS NULL
GROUP BY pr.id;

-- M&E Indicator Performance View
CREATE OR REPLACE VIEW v_indicator_performance AS
SELECT
    i.id,
    i.code,
    i.name,
    i.type,
    i.unit_of_measure,
    i.baseline_value,
    i.target_value,
    i.current_value,
    CASE
        WHEN i.target_value > 0 THEN (i.current_value / i.target_value * 100)
        ELSE 0
    END AS achievement_percentage,
    COUNT(r.id) AS total_reports,
    MAX(r.collection_date) AS last_reported_date,
    p.name AS program_name,
    pr.name AS project_name
FROM me_indicators i
LEFT JOIN me_results r ON i.id = r.indicator_id
LEFT JOIN programs p ON i.program_id = p.id
LEFT JOIN projects pr ON i.project_id = pr.id
WHERE i.is_active = TRUE
GROUP BY i.id;

-- Sync Queue Status View
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

-- =====================================================
-- SECTION 7: STORED PROCEDURES
-- =====================================================

-- Procedure to create a new project with sync queue entry
DELIMITER $$

CREATE PROCEDURE sp_create_project(
    IN p_program_id INT,
    IN p_name VARCHAR(255),
    IN p_code VARCHAR(50),
    IN p_description TEXT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_budget DECIMAL(15,2)
)
BEGIN
    DECLARE new_project_id INT;

    -- Insert project
    INSERT INTO projects (
        program_id, name, code, description,
        start_date, end_date, budget, sync_status
    ) VALUES (
        p_program_id, p_name, p_code, p_description,
        p_start_date, p_end_date, p_budget, 'pending'
    );

    SET new_project_id = LAST_INSERT_ID();

    -- Queue for sync
    INSERT INTO sync_queue (
        operation_type, entity_type, entity_id,
        direction, status, priority
    ) VALUES (
        'create', 'project', new_project_id,
        'push', 'pending', 3
    );

    -- Return new project ID
    SELECT new_project_id AS project_id;
END$$

DELIMITER ;

-- =====================================================
-- SECTION 8: TRIGGERS FOR AUTO-SYNC QUEUING
-- =====================================================

-- Trigger: Auto-queue project updates
DELIMITER $$

CREATE TRIGGER trg_project_update_queue
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
    IF OLD.updated_at != NEW.updated_at AND NEW.deleted_at IS NULL THEN
        INSERT INTO sync_queue (
            operation_type, entity_type, entity_id,
            direction, status, priority
        ) VALUES (
            'update', 'project', NEW.id,
            'push', 'pending', 5
        );
    END IF;
END$$

CREATE TRIGGER trg_activity_update_queue
AFTER UPDATE ON activities
FOR EACH ROW
BEGIN
    IF OLD.updated_at != NEW.updated_at AND NEW.deleted_at IS NULL THEN
        INSERT INTO sync_queue (
            operation_type, entity_type, entity_id,
            direction, status, priority
        ) VALUES (
            'update', 'activity', NEW.id,
            'push', 'pending', 5
        );
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- SECTION 9: INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_project_program_status ON projects(program_id, status, deleted_at);
CREATE INDEX idx_activity_project_status ON activities(project_id, status, deleted_at);
CREATE INDEX idx_task_activity_status ON tasks(activity_id, status, deleted_at);
CREATE INDEX idx_indicator_active ON me_indicators(is_active, type);
CREATE INDEX idx_result_indicator_period ON me_results(indicator_id, reporting_period_start, reporting_period_end);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

-- Display summary
SELECT 'M&E Enhanced Schema Created Successfully' AS status;
SELECT COUNT(*) AS programs_created FROM programs;
