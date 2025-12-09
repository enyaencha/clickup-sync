-- Migration: Add Status and Performance Tracking
-- Date: 2025-12-09
-- Description: Adds status tracking, performance metrics, and risk indicators for automated reporting

-- ================================================
-- ACTIVITIES: Add Status Tracking and Progress
-- ================================================

ALTER TABLE activities
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Progress completion (0-100%)',
ADD COLUMN IF NOT EXISTS status_override BOOLEAN DEFAULT FALSE COMMENT 'Flag indicating manual status override',
ADD COLUMN IF NOT EXISTS auto_status VARCHAR(50) COMMENT 'Automatically calculated status',
ADD COLUMN IF NOT EXISTS manual_status VARCHAR(50) COMMENT 'Manually set status (when overridden)',
ADD COLUMN IF NOT EXISTS status_reason TEXT COMMENT 'Explanation for current status',
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP NULL COMMENT 'When status was last updated',
ADD COLUMN IF NOT EXISTS risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none' COMMENT 'Current risk level';

-- Update status column if it's not already the right type
ALTER TABLE activities
MODIFY COLUMN status ENUM('not-started', 'in-progress', 'on-track', 'at-risk', 'delayed', 'off-track', 'completed', 'cancelled', 'on-hold') DEFAULT 'not-started';

-- Add index for status queries
ALTER TABLE activities
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_progress (progress_percentage),
ADD INDEX IF NOT EXISTS idx_risk_level (risk_level);

-- ================================================
-- PROJECT COMPONENTS: Add Status Rollup
-- ================================================

ALTER TABLE project_components
ADD COLUMN IF NOT EXISTS overall_status ENUM('not-started', 'in-progress', 'on-track', 'at-risk', 'delayed', 'off-track', 'completed', 'cancelled') DEFAULT 'not-started' COMMENT 'Rolled-up status from activities',
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Overall progress (0-100%)',
ADD COLUMN IF NOT EXISTS status_override BOOLEAN DEFAULT FALSE COMMENT 'Manual status override flag',
ADD COLUMN IF NOT EXISTS auto_status VARCHAR(50) COMMENT 'Auto-calculated status',
ADD COLUMN IF NOT EXISTS manual_status VARCHAR(50) COMMENT 'Manual status',
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP NULL COMMENT 'Last status update timestamp',
ADD COLUMN IF NOT EXISTS risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none' COMMENT 'Risk level';

-- Add index for status queries
ALTER TABLE project_components
ADD INDEX IF NOT EXISTS idx_overall_status (overall_status),
ADD INDEX IF NOT EXISTS idx_component_progress (progress_percentage);

-- ================================================
-- SUB-PROGRAMS: Add Status Rollup
-- ================================================

ALTER TABLE sub_programs
ADD COLUMN IF NOT EXISTS overall_status ENUM('not-started', 'in-progress', 'on-track', 'at-risk', 'delayed', 'off-track', 'completed', 'cancelled') DEFAULT 'not-started' COMMENT 'Rolled-up status',
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Overall progress',
ADD COLUMN IF NOT EXISTS status_override BOOLEAN DEFAULT FALSE COMMENT 'Manual override flag',
ADD COLUMN IF NOT EXISTS auto_status VARCHAR(50) COMMENT 'Auto-calculated status',
ADD COLUMN IF NOT EXISTS manual_status VARCHAR(50) COMMENT 'Manual status',
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP NULL COMMENT 'Last update timestamp',
ADD COLUMN IF NOT EXISTS risk_level ENUM('none', 'low', 'medium', 'high', 'critical') DEFAULT 'none' COMMENT 'Risk level';

-- Add index for status queries
ALTER TABLE sub_programs
ADD INDEX IF NOT EXISTS idx_sub_program_status (overall_status),
ADD INDEX IF NOT EXISTS idx_sub_program_progress (progress_percentage);

-- ================================================
-- PROGRAM MODULES: Add Status Rollup
-- ================================================

ALTER TABLE program_modules
ADD COLUMN IF NOT EXISTS overall_status ENUM('not-started', 'in-progress', 'on-track', 'at-risk', 'delayed', 'off-track', 'completed', 'cancelled') DEFAULT 'not-started' COMMENT 'Rolled-up status',
ADD COLUMN IF NOT EXISTS progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT 'Overall progress',
ADD COLUMN IF NOT EXISTS status_override BOOLEAN DEFAULT FALSE COMMENT 'Manual override flag',
ADD COLUMN IF NOT EXISTS last_status_update TIMESTAMP NULL COMMENT 'Last update timestamp';

-- Add index
ALTER TABLE program_modules
ADD INDEX IF NOT EXISTS idx_module_status (overall_status);

-- ================================================
-- ME_INDICATORS: Add Performance Metrics
-- ================================================

ALTER TABLE me_indicators
ADD COLUMN IF NOT EXISTS baseline_value DECIMAL(15,2) COMMENT 'Starting/baseline value',
ADD COLUMN IF NOT EXISTS baseline_date DATE COMMENT 'When baseline was measured',
ADD COLUMN IF NOT EXISTS target_value DECIMAL(15,2) COMMENT 'Target/goal value',
ADD COLUMN IF NOT EXISTS target_date DATE COMMENT 'When target should be achieved',
ADD COLUMN IF NOT EXISTS current_value DECIMAL(15,2) COMMENT 'Current actual value',
ADD COLUMN IF NOT EXISTS last_measured_date DATE COMMENT 'When current value was last measured',
ADD COLUMN IF NOT EXISTS achievement_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT '(current/target) * 100',
ADD COLUMN IF NOT EXISTS variance DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Difference from target',
ADD COLUMN IF NOT EXISTS measurement_frequency ENUM('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'semi-annual', 'annual', 'one-time') COMMENT 'How often measured',
ADD COLUMN IF NOT EXISTS unit_of_measure VARCHAR(50) COMMENT 'Unit (%, count, KES, etc.)',
ADD COLUMN IF NOT EXISTS performance_status ENUM('not-started', 'on-track', 'at-risk', 'off-track', 'achieved', 'exceeded') DEFAULT 'not-started' COMMENT 'Performance status';

-- Add indices for performance queries
ALTER TABLE me_indicators
ADD INDEX IF NOT EXISTS idx_achievement (achievement_percentage),
ADD INDEX IF NOT EXISTS idx_performance_status (performance_status),
ADD INDEX IF NOT EXISTS idx_target_date (target_date);

-- ================================================
-- INDICATOR VALUES: Historical Tracking
-- ================================================

CREATE TABLE IF NOT EXISTS indicator_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    indicator_id INT NOT NULL,

    -- Value Information
    measured_value DECIMAL(15,2) NOT NULL,
    measurement_date DATE NOT NULL,
    achievement_at_time DECIMAL(5,2) COMMENT 'Achievement % at this measurement',
    variance_at_time DECIMAL(15,2) COMMENT 'Variance at this measurement',

    -- Context
    data_source VARCHAR(255) COMMENT 'Where data came from',
    verified BOOLEAN DEFAULT FALSE COMMENT 'Whether value is verified',
    verified_by INT COMMENT 'User who verified',
    verified_date TIMESTAMP NULL,
    notes TEXT COMMENT 'Additional notes about this measurement',

    -- Metadata
    recorded_by INT COMMENT 'User who recorded this value',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (indicator_id) REFERENCES me_indicators(id) ON DELETE CASCADE,
    FOREIGN KEY (recorded_by) REFERENCES users(id),
    FOREIGN KEY (verified_by) REFERENCES users(id),

    INDEX idx_indicator_date (indicator_id, measurement_date),
    INDEX idx_measurement_date (measurement_date),
    INDEX idx_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historical tracking of indicator measurements over time';

-- ================================================
-- ACTIVITY RISKS: Risk Tracking
-- ================================================

CREATE TABLE IF NOT EXISTS activity_risks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    component_id INT COMMENT 'Optional: risk at component level',
    sub_program_id INT COMMENT 'Optional: risk at sub-program level',

    -- Risk Details
    risk_category ENUM('financial', 'operational', 'external', 'resource', 'timeline', 'technical', 'political', 'security', 'other') NOT NULL,
    risk_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT NOT NULL,

    -- Impact and Probability
    impact_level ENUM('low', 'medium', 'high', 'critical') NOT NULL COMMENT 'Severity if risk occurs',
    probability ENUM('low', 'medium', 'high') NOT NULL COMMENT 'Likelihood of occurrence',

    -- Mitigation
    mitigation_strategy TEXT COMMENT 'How to mitigate or prevent',
    contingency_plan TEXT COMMENT 'What to do if risk materializes',
    owner_id INT COMMENT 'Person responsible for managing this risk',

    -- Status
    status ENUM('identified', 'active', 'mitigated', 'materialized', 'closed') DEFAULT 'identified',
    identified_date DATE NOT NULL,
    target_resolution_date DATE COMMENT 'When should be resolved',
    actual_resolution_date DATE COMMENT 'When was actually resolved',

    -- Metadata
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES project_components(id) ON DELETE CASCADE,
    FOREIGN KEY (sub_program_id) REFERENCES sub_programs(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),

    INDEX idx_activity_risk (activity_id),
    INDEX idx_component_risk (component_id),
    INDEX idx_risk_level (risk_level),
    INDEX idx_risk_status (status),
    INDEX idx_risk_category (risk_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Risk tracking for activities, components, and sub-programs';

-- ================================================
-- STATUS HISTORY: Audit Trail
-- ================================================

CREATE TABLE IF NOT EXISTS status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Entity Reference
    entity_type ENUM('activity', 'component', 'sub_program', 'module') NOT NULL,
    entity_id INT NOT NULL,

    -- Status Change
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    old_progress DECIMAL(5,2),
    new_progress DECIMAL(5,2),

    -- Change Details
    change_type ENUM('auto', 'manual', 'system') NOT NULL COMMENT 'How status changed',
    change_reason TEXT COMMENT 'Why status changed',
    override_applied BOOLEAN DEFAULT FALSE COMMENT 'Was manual override used',

    -- Metadata
    changed_by INT COMMENT 'User who made change (if manual)',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (changed_by) REFERENCES users(id),

    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_change_date (changed_at),
    INDEX idx_change_type (change_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit trail of all status changes for activities, components, sub-programs, and modules';

-- ================================================
-- PERFORMANCE COMMENTS: Contextual Notes
-- ================================================

CREATE TABLE IF NOT EXISTS performance_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    -- Entity Reference
    entity_type ENUM('activity', 'component', 'sub_program', 'indicator') NOT NULL,
    entity_id INT NOT NULL,

    -- Comment
    comment_text TEXT NOT NULL,
    comment_type ENUM('progress_update', 'challenge', 'achievement', 'lesson_learned', 'general') DEFAULT 'general',

    -- Visibility
    is_public BOOLEAN DEFAULT TRUE COMMENT 'Visible in reports',

    -- Metadata
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (created_by) REFERENCES users(id),

    INDEX idx_entity_comments (entity_type, entity_id),
    INDEX idx_comment_type (comment_type),
    INDEX idx_created_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Comments and notes about performance, progress, challenges, and achievements';

-- ================================================
-- DATA INITIALIZATION: Set Default Values
-- ================================================

-- Set initial progress for completed activities
UPDATE activities
SET progress_percentage = 100.00
WHERE status = 'completed' AND progress_percentage = 0.00;

-- Set initial progress for in-progress activities (estimate based on dates)
UPDATE activities
SET progress_percentage = CASE
    WHEN start_date IS NOT NULL AND end_date IS NOT NULL AND start_date < end_date THEN
        GREATEST(0, LEAST(100,
            ((DATEDIFF(CURRENT_DATE, start_date) / DATEDIFF(end_date, start_date)) * 100)
        ))
    ELSE 0
END
WHERE status IN ('in-progress', 'on-hold')
AND progress_percentage = 0.00
AND start_date IS NOT NULL
AND end_date IS NOT NULL;

-- Initialize auto_status to match current status
UPDATE activities
SET auto_status = status
WHERE auto_status IS NULL;

-- Initialize component status based on activities
UPDATE project_components pc
SET overall_status = (
    SELECT CASE
        WHEN COUNT(CASE WHEN a.status = 'off-track' THEN 1 END) > 0 THEN 'off-track'
        WHEN COUNT(CASE WHEN a.status = 'delayed' THEN 1 END) > 0 THEN 'delayed'
        WHEN COUNT(CASE WHEN a.status = 'at-risk' THEN 1 END) > 0 THEN 'at-risk'
        WHEN COUNT(CASE WHEN a.status = 'completed' THEN 1 END) = COUNT(*) THEN 'completed'
        WHEN COUNT(CASE WHEN a.status IN ('in-progress', 'on-track') THEN 1 END) > 0 THEN 'on-track'
        ELSE 'not-started'
    END
    FROM activities a
    WHERE a.component_id = pc.id AND a.deleted_at IS NULL
)
WHERE overall_status = 'not-started';

-- Calculate achievement percentage for indicators
UPDATE me_indicators
SET achievement_percentage = CASE
    WHEN target_value > 0 AND current_value IS NOT NULL THEN
        (current_value / target_value) * 100
    ELSE 0
END,
variance = CASE
    WHEN target_value IS NOT NULL AND current_value IS NOT NULL THEN
        current_value - target_value
    ELSE 0
END
WHERE target_value IS NOT NULL;

-- ================================================
-- COMPLETION MESSAGE
-- ================================================

SELECT
    'Migration 010 completed successfully!' as message,
    (SELECT COUNT(*) FROM activities) as total_activities,
    (SELECT COUNT(*) FROM project_components) as total_components,
    (SELECT COUNT(*) FROM me_indicators) as total_indicators,
    CURRENT_TIMESTAMP as completed_at;
