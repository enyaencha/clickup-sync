-- =====================================================
-- M&E Project Management System - Core Schema
-- Simplified version without stored procedures
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(10),
    description TEXT,
    clickup_space_id VARCHAR(50) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15, 2),
    status ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'active',
    manager_id INT,
    manager_name VARCHAR(255),
    manager_email VARCHAR(255),
    country VARCHAR(100),
    region VARCHAR(100),
    district VARCHAR(100),
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_sync_status (sync_status),
    INDEX idx_clickup_space (clickup_space_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    clickup_folder_id VARCHAR(50) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(15, 2),
    actual_cost DECIMAL(15, 2) DEFAULT 0,
    status ENUM('planning', 'active', 'on-hold', 'completed', 'cancelled') DEFAULT 'active',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    progress_percentage INT DEFAULT 0,
    manager_id INT,
    manager_name VARCHAR(255),
    target_beneficiaries INT,
    actual_beneficiaries INT DEFAULT 0,
    location_details JSON,
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_clickup_folder (clickup_folder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    clickup_list_id VARCHAR(50) UNIQUE,
    start_date DATE,
    end_date DATE,
    status ENUM('not-started', 'in-progress', 'completed', 'blocked') DEFAULT 'not-started',
    progress_percentage INT DEFAULT 0,
    responsible_person VARCHAR(255),
    budget DECIMAL(10, 2),
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project (project_id),
    INDEX idx_code (code),
    INDEX idx_clickup_list (clickup_list_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clickup_task_id VARCHAR(50) UNIQUE,
    activity_id INT,
    project_id INT,
    program_id INT,
    list_id VARCHAR(50),
    name VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(100),
    priority VARCHAR(50),
    due_date BIGINT,
    start_date BIGINT,
    time_estimate BIGINT,
    progress_percentage INT DEFAULT 0,
    sync_status ENUM('synced', 'pending', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_activity (activity_id),
    INDEX idx_project (project_id),
    INDEX idx_clickup_task (clickup_task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- M&E Indicators Table
CREATE TABLE IF NOT EXISTS me_indicators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_id INT,
    project_id INT,
    activity_id INT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    type ENUM('output', 'outcome', 'impact') NOT NULL,
    category VARCHAR(100),
    unit_of_measure VARCHAR(50),
    baseline_value DECIMAL(15, 2),
    target_value DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2) DEFAULT 0,
    collection_frequency ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually') DEFAULT 'monthly',
    data_source TEXT,
    verification_method TEXT,
    disaggregation JSON,
    clickup_custom_field_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_project (project_id),
    INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- M&E Results Table
CREATE TABLE IF NOT EXISTS me_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    indicator_id INT NOT NULL,
    reporting_period_start DATE NOT NULL,
    reporting_period_end DATE NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    disaggregation JSON,
    data_collector VARCHAR(255),
    collection_date DATE NOT NULL,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by VARCHAR(255),
    verified_at DATETIME,
    notes TEXT,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (indicator_id) REFERENCES me_indicators(id) ON DELETE CASCADE,
    INDEX idx_indicator (indicator_id),
    INDEX idx_period (reporting_period_start, reporting_period_end)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- M&E Reports Table
CREATE TABLE IF NOT EXISTS me_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    report_type ENUM('monthly', 'quarterly', 'annual', 'ad-hoc', 'donor') NOT NULL,
    program_id INT,
    project_id INT,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    content JSON,
    summary TEXT,
    file_path VARCHAR(500),
    file_format ENUM('pdf', 'excel', 'word', 'json') DEFAULT 'pdf',
    status ENUM('draft', 'pending-review', 'approved', 'published') DEFAULT 'draft',
    generated_by INT,
    generated_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_type (report_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ClickUp Mapping Table
CREATE TABLE IF NOT EXISTS clickup_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    local_entity_type ENUM('program', 'project', 'activity', 'task', 'indicator') NOT NULL,
    local_entity_id INT NOT NULL,
    clickup_entity_type ENUM('space', 'folder', 'list', 'task', 'custom_field') NOT NULL,
    clickup_entity_id VARCHAR(50) NOT NULL,
    mapping_status ENUM('active', 'broken', 'deleted') DEFAULT 'active',
    last_verified_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_local (local_entity_type, local_entity_id),
    UNIQUE KEY unique_clickup (clickup_entity_type, clickup_entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sync Queue Table
CREATE TABLE IF NOT EXISTS sync_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_type ENUM('create', 'update', 'delete') NOT NULL,
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,
    direction ENUM('push', 'pull') NOT NULL,
    payload JSON,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    priority INT DEFAULT 5,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    last_error TEXT,
    scheduled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sync Conflicts Table
CREATE TABLE IF NOT EXISTS sync_conflicts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    local_value TEXT,
    clickup_value TEXT,
    local_updated_at DATETIME,
    clickup_updated_at DATETIME,
    resolution_strategy ENUM('pending', 'local_wins', 'clickup_wins', 'manual_merge') DEFAULT 'pending',
    resolved_value TEXT,
    resolved_by INT,
    resolved_at DATETIME,
    notes TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_resolution (resolution_strategy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sync Status Table
CREATE TABLE IF NOT EXISTS sync_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('program', 'project', 'activity', 'task', 'indicator', 'result') NOT NULL,
    entity_id INT NOT NULL,
    status ENUM('synced', 'pending', 'syncing', 'conflict', 'error') DEFAULT 'pending',
    last_synced_at DATETIME,
    last_sync_direction ENUM('push', 'pull'),
    sync_hash VARCHAR(64),
    last_error TEXT,
    error_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sync Log Table
CREATE TABLE IF NOT EXISTS sync_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operation_type ENUM('create', 'update', 'delete', 'pull', 'push') NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    direction ENUM('push', 'pull') NOT NULL,
    status ENUM('success', 'failed', 'partial') NOT NULL,
    message TEXT,
    error_details TEXT,
    sync_duration_ms INT,
    records_affected INT DEFAULT 1,
    clickup_request_id VARCHAR(100),
    clickup_response_code INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SEED DATA - 5 Caritas Programs
-- =====================================================

INSERT INTO programs (name, code, icon, description, start_date, status, budget) VALUES
('Food & Environment', 'FOOD_ENV', '🌾', 'Sustainable agriculture, food security, and environmental conservation programs', '2024-01-01', 'active', 500000.00),
('Socio-Economic', 'SOCIO_ECON', '💼', 'Economic empowerment, livelihoods, and poverty alleviation initiatives', '2024-01-01', 'active', 450000.00),
('Gender & Youth', 'GENDER_YOUTH', '👥', 'Gender equality, youth empowerment, and social inclusion programs', '2024-01-01', 'active', 350000.00),
('Relief Services', 'RELIEF', '🏥', 'Emergency relief, health services, and humanitarian assistance', '2024-01-01', 'active', 600000.00),
('Capacity Building', 'CAPACITY', '🎓', 'Training, institutional strengthening, and skills development programs', '2024-01-01', 'active', 400000.00)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Display summary
SELECT 'Core Schema Created Successfully' AS status;
SELECT COUNT(*) AS programs_created FROM programs;
