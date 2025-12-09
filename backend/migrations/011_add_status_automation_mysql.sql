-- Migration: Add Status Automation (MySQL Compatible - Dec 9, 2025 Schema)
-- Date: 2025-12-09
-- Description: Adds status automation fields compatible with existing schema and MySQL syntax

-- ================================================
-- ACTIVITIES: Add Automation Fields
-- ================================================

-- Modify status enum to add new values
ALTER TABLE activities
MODIFY COLUMN status ENUM(
    'not-started','in-progress','completed','blocked','cancelled',
    'on-track','at-risk','delayed','off-track','on-hold'
) DEFAULT 'not-started';

-- Add new automation columns (without IF NOT EXISTS)
ALTER TABLE activities
ADD COLUMN status_override BOOLEAN DEFAULT FALSE COMMENT 'Manual override flag',
ADD COLUMN auto_status VARCHAR(50) COMMENT 'Auto-calculated status',
ADD COLUMN manual_status VARCHAR(50) COMMENT 'Manually set status',
ADD COLUMN status_reason TEXT COMMENT 'Explanation for status',
ADD COLUMN last_status_update TIMESTAMP NULL COMMENT 'Last status update',
ADD COLUMN risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none';

-- Add indices
ALTER TABLE activities
ADD INDEX idx_auto_status (auto_status),
ADD INDEX idx_risk_level (risk_level);

-- ================================================
-- PROJECT_COMPONENTS: Add Automation Fields
-- ================================================

-- Modify status enum
ALTER TABLE project_components
MODIFY COLUMN status ENUM(
    'not-started','in-progress','completed','blocked',
    'on-track','at-risk','delayed','off-track'
) DEFAULT 'not-started';

-- Add new columns
ALTER TABLE project_components
ADD COLUMN overall_status VARCHAR(50) COMMENT 'Rolled-up status from activities',
ADD COLUMN status_override BOOLEAN DEFAULT FALSE,
ADD COLUMN auto_status VARCHAR(50),
ADD COLUMN manual_status VARCHAR(50),
ADD COLUMN last_status_update TIMESTAMP NULL,
ADD COLUMN risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none';

-- Copy existing status to overall_status
UPDATE project_components
SET overall_status = status
WHERE overall_status IS NULL OR overall_status = '';

-- ================================================
-- SUB_PROGRAMS: Add Automation Fields
-- ================================================

-- Modify status enum to add new values
ALTER TABLE sub_programs
MODIFY COLUMN status ENUM(
    'planning','active','on-hold','completed','cancelled',
    'on-track','at-risk','delayed','off-track'
) DEFAULT 'active';

-- Add automation columns
ALTER TABLE sub_programs
ADD COLUMN overall_status VARCHAR(50) COMMENT 'Rolled-up status',
ADD COLUMN status_override BOOLEAN DEFAULT FALSE,
ADD COLUMN auto_status VARCHAR(50),
ADD COLUMN manual_status VARCHAR(50),
ADD COLUMN last_status_update TIMESTAMP NULL,
ADD COLUMN risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none';

-- Copy existing status to overall_status
UPDATE sub_programs
SET overall_status = status
WHERE overall_status IS NULL OR overall_status = '';

-- ================================================
-- PROGRAM_MODULES: Add Status Fields
-- ================================================

ALTER TABLE program_modules
ADD COLUMN overall_status VARCHAR(50) DEFAULT 'not-started',
ADD COLUMN status_override BOOLEAN DEFAULT FALSE,
ADD COLUMN last_status_update TIMESTAMP NULL;

-- ================================================
-- ME_INDICATORS: Add Missing Fields Only
-- ================================================

-- Add only the missing fields
ALTER TABLE me_indicators
ADD COLUMN variance DECIMAL(15,2) DEFAULT 0.00 COMMENT 'current_value - target_value',
ADD COLUMN performance_status ENUM(
    'not-started','on-track','at-risk','off-track','achieved','exceeded'
) DEFAULT 'not-started' COMMENT 'Performance status';

-- Add indices
ALTER TABLE me_indicators
ADD INDEX idx_performance_status (performance_status),
ADD INDEX idx_variance (variance);

-- Calculate variance for existing indicators
UPDATE me_indicators
SET variance = CASE
    WHEN current_value IS NOT NULL AND target_value IS NOT NULL THEN
        current_value - target_value
    ELSE 0
END
WHERE variance = 0;

-- ================================================
-- NEW TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS indicator_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    indicator_id INT NOT NULL,
    measured_value DECIMAL(15,2) NOT NULL,
    measurement_date DATE NOT NULL,
    achievement_at_time DECIMAL(5,2),
    variance_at_time DECIMAL(15,2),
    data_source VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    verified_by INT,
    verified_date TIMESTAMP NULL,
    notes TEXT,
    recorded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (indicator_id) REFERENCES me_indicators(id) ON DELETE CASCADE,
    INDEX idx_indicator_date (indicator_id, measurement_date),
    INDEX idx_measurement_date (measurement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_risks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    component_id INT,
    sub_program_id INT,
    risk_category ENUM('financial','operational','external','resource','timeline','technical','political','security','other') NOT NULL,
    risk_level ENUM('low','medium','high','critical') NOT NULL,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT NOT NULL,
    impact_level ENUM('low','medium','high','critical') NOT NULL,
    probability ENUM('low','medium','high') NOT NULL,
    mitigation_strategy TEXT,
    contingency_plan TEXT,
    owner_id INT,
    status ENUM('identified','active','mitigated','materialized','closed') DEFAULT 'identified',
    identified_date DATE NOT NULL,
    target_resolution_date DATE,
    actual_resolution_date DATE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES project_components(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_program_id) REFERENCES sub_programs(id) ON DELETE CASCADE,
    INDEX idx_activity_risk (activity_id),
    INDEX idx_risk_level (risk_level),
    INDEX idx_risk_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('activity','component','sub_program','module') NOT NULL,
    entity_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    old_progress INT,
    new_progress INT,
    change_type ENUM('auto','manual','system') NOT NULL,
    change_reason TEXT,
    override_applied BOOLEAN DEFAULT FALSE,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_change_date (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS performance_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('activity','component','sub_program','indicator') NOT NULL,
    entity_id INT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_type ENUM('progress_update','challenge','achievement','lesson_learned','general') DEFAULT 'general',
    is_public BOOLEAN DEFAULT TRUE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_entity_comments (entity_type, entity_id),
    INDEX idx_comment_type (comment_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- DATA INITIALIZATION
-- ================================================

-- Initialize auto_status from existing status
UPDATE activities
SET auto_status = status
WHERE auto_status IS NULL OR auto_status = '';

UPDATE project_components
SET auto_status = status
WHERE auto_status IS NULL OR auto_status = '';

UPDATE sub_programs
SET auto_status = status
WHERE auto_status IS NULL OR auto_status = '';

-- Calculate achievement % for indicators (if not already calculated)
UPDATE me_indicators
SET achievement_percentage = CASE
    WHEN target_value > 0 AND current_value IS NOT NULL THEN
        ROUND((current_value / target_value) * 100, 2)
    ELSE 0
END
WHERE (achievement_percentage IS NULL OR achievement_percentage = 0)
AND target_value IS NOT NULL
AND target_value > 0;

SELECT
    'Migration completed successfully!' as message,
    (SELECT COUNT(*) FROM activities) as total_activities,
    (SELECT COUNT(*) FROM project_components) as total_components,
    (SELECT COUNT(*) FROM me_indicators) as total_indicators,
    CURRENT_TIMESTAMP as completed_at;
