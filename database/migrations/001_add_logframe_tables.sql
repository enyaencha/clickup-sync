-- ============================================
-- Logframe Enhancement Migration
-- Adds Indicators, Means of Verification, and Assumptions
-- ============================================

-- ============================================
-- 1. INDICATORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `indicators` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- Link to hierarchy level
  `entity_type` ENUM('module', 'sub_program', 'component', 'activity') NOT NULL COMMENT 'Which level this indicator is for',
  `entity_id` INT NOT NULL COMMENT 'ID of the module/sub-program/component/activity',

  -- Indicator Details
  `indicator_name` VARCHAR(500) NOT NULL,
  `indicator_type` ENUM('impact', 'outcome', 'output', 'process') NOT NULL DEFAULT 'output',
  `description` TEXT,
  `unit_of_measure` VARCHAR(100) COMMENT 'e.g., %, number, USD',

  -- Disaggregation
  `disaggregation` JSON COMMENT 'Array of disaggregation categories: gender, age, location, etc.',

  -- Target Values
  `baseline_value` DECIMAL(15,2) DEFAULT 0,
  `baseline_date` DATE,
  `target_value` DECIMAL(15,2) NOT NULL,
  `target_date` DATE,

  -- Current Value
  `current_value` DECIMAL(15,2) DEFAULT 0,
  `last_measured_date` DATE,

  -- Frequency
  `measurement_frequency` ENUM('monthly', 'quarterly', 'semi-annual', 'annual', 'ad-hoc') DEFAULT 'quarterly',
  `next_measurement_date` DATE,

  -- Status
  `status` ENUM('on-track', 'at-risk', 'off-track', 'not-started') DEFAULT 'not-started',
  `achievement_percentage` DECIMAL(5,2) DEFAULT 0 COMMENT 'Progress towards target',

  -- Metadata
  `data_source` VARCHAR(255) COMMENT 'Primary data source',
  `responsible_person` VARCHAR(255),
  `notes` TEXT,

  -- Audit fields
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT,
  `updated_by` INT,

  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_indicator_type (indicator_type),
  INDEX idx_status (status),
  INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. INDICATOR MEASUREMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `indicator_measurements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `indicator_id` INT NOT NULL,

  -- Measurement Details
  `measurement_date` DATE NOT NULL,
  `measured_value` DECIMAL(15,2) NOT NULL,

  -- Disaggregated Values (JSON for flexibility)
  `disaggregated_values` JSON COMMENT 'Breakdown by gender, age, location, etc.',

  -- Context
  `measurement_method` VARCHAR(255) COMMENT 'How was this measured',
  `notes` TEXT,
  `verified` BOOLEAN DEFAULT FALSE,
  `verified_by` INT,
  `verified_date` DATE,

  -- Audit fields
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT,

  FOREIGN KEY (indicator_id) REFERENCES indicators(id) ON DELETE CASCADE,
  INDEX idx_indicator (indicator_id),
  INDEX idx_date (measurement_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. MEANS OF VERIFICATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `means_of_verification` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- Link to hierarchy level
  `entity_type` ENUM('module', 'sub_program', 'component', 'activity', 'indicator') NOT NULL,
  `entity_id` INT NOT NULL,

  -- Verification Details
  `verification_method` VARCHAR(255) NOT NULL COMMENT 'e.g., Field reports, GPS data, Photos',
  `description` TEXT,
  `evidence_type` ENUM('document', 'photo', 'video', 'survey', 'report', 'database', 'other') NOT NULL,

  -- Document Reference
  `document_name` VARCHAR(255),
  `document_path` VARCHAR(500) COMMENT 'File path or URL',
  `document_date` DATE,

  -- Verification Status
  `verification_status` ENUM('pending', 'verified', 'rejected', 'needs-update') DEFAULT 'pending',
  `verified_by` INT,
  `verified_date` DATE,
  `verification_notes` TEXT,

  -- Frequency
  `collection_frequency` ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'ad-hoc') DEFAULT 'monthly',

  -- Metadata
  `responsible_person` VARCHAR(255),
  `notes` TEXT,

  -- Audit fields
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT,

  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_evidence_type (evidence_type),
  INDEX idx_status (verification_status),
  INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ASSUMPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS `assumptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- Link to hierarchy level
  `entity_type` ENUM('module', 'sub_program', 'component', 'activity') NOT NULL,
  `entity_id` INT NOT NULL,

  -- Assumption Details
  `assumption_text` TEXT NOT NULL,
  `assumption_category` ENUM('external', 'internal', 'financial', 'political', 'social', 'environmental', 'technical') NOT NULL,

  -- Risk Assessment
  `likelihood` ENUM('very-low', 'low', 'medium', 'high', 'very-high') DEFAULT 'medium',
  `impact` ENUM('very-low', 'low', 'medium', 'high', 'very-high') DEFAULT 'medium',
  `risk_level` ENUM('low', 'medium', 'high', 'critical') COMMENT 'Calculated from likelihood x impact',

  -- Status & Validation
  `status` ENUM('valid', 'invalid', 'partially-valid', 'needs-review') DEFAULT 'needs-review',
  `validation_date` DATE,
  `validation_notes` TEXT,

  -- Mitigation
  `mitigation_strategy` TEXT,
  `mitigation_status` ENUM('not-started', 'in-progress', 'implemented', 'not-needed') DEFAULT 'not-started',

  -- Monitoring
  `last_reviewed_date` DATE,
  `next_review_date` DATE,
  `responsible_person` VARCHAR(255),

  -- Metadata
  `notes` TEXT,

  -- Audit fields
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT,

  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_risk_level (risk_level),
  INDEX idx_status (status),
  INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. RESULTS CHAIN TABLE (Links activities → outputs → outcomes → goals)
-- ============================================
CREATE TABLE IF NOT EXISTS `results_chain` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- From (lower level)
  `from_entity_type` ENUM('activity', 'component', 'sub_program') NOT NULL,
  `from_entity_id` INT NOT NULL,

  -- To (higher level)
  `to_entity_type` ENUM('component', 'sub_program', 'module') NOT NULL,
  `to_entity_id` INT NOT NULL,

  -- Contribution Details
  `contribution_description` TEXT COMMENT 'How does this contribute to the higher level',
  `contribution_weight` DECIMAL(5,2) DEFAULT 100 COMMENT 'Percentage contribution (if multiple activities contribute)',

  -- Metadata
  `notes` TEXT,

  -- Audit fields
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` INT,

  INDEX idx_from_entity (from_entity_type, from_entity_id),
  INDEX idx_to_entity (to_entity_type, to_entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. Add Logframe Fields to Existing Tables
-- ============================================

-- Add logframe level indicators to program_modules
ALTER TABLE program_modules
ADD COLUMN IF NOT EXISTS `logframe_goal` TEXT COMMENT 'Overall goal statement',
ADD COLUMN IF NOT EXISTS `goal_indicators` TEXT COMMENT 'Key goal-level indicators';

-- Add logframe level indicators to sub_programs
ALTER TABLE sub_programs
ADD COLUMN IF NOT EXISTS `logframe_outcome` TEXT COMMENT 'Expected outcome statement',
ADD COLUMN IF NOT EXISTS `outcome_indicators` TEXT COMMENT 'Key outcome indicators';

-- Add logframe level indicators to project_components
ALTER TABLE project_components
ADD COLUMN IF NOT EXISTS `logframe_output` TEXT COMMENT 'Expected output statement',
ADD COLUMN IF NOT EXISTS `output_indicators` TEXT COMMENT 'Key output indicators';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample indicator for Module 1: Food, Water & Environment
INSERT INTO `indicators` (
  entity_type, entity_id, indicator_name, indicator_type,
  unit_of_measure, baseline_value, target_value,
  measurement_frequency, data_source
) VALUES (
  'module', 1,
  'Percentage increase in food secure households',
  'impact',
  'percentage',
  45.0,
  75.0,
  'annual',
  'Household surveys'
);

-- Sample means of verification
INSERT INTO `means_of_verification` (
  entity_type, entity_id, verification_method, evidence_type,
  description, collection_frequency
) VALUES (
  'module', 1,
  'Household surveys and field reports',
  'survey',
  'Annual household food security surveys conducted in target communities',
  'annual'
);

-- Sample assumption
INSERT INTO `assumptions` (
  entity_type, entity_id, assumption_text, assumption_category,
  likelihood, impact, risk_level, mitigation_strategy
) VALUES (
  'module', 1,
  'Stable climatic conditions with normal rainfall patterns',
  'environmental',
  'medium',
  'high',
  'medium',
  'Promote climate-resilient agricultural practices and early warning systems'
);

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- View: Indicators with latest measurement
CREATE OR REPLACE VIEW v_indicators_with_latest AS
SELECT
  i.*,
  im.measured_value as latest_value,
  im.measurement_date as latest_measurement_date,
  CASE
    WHEN i.target_value > 0 THEN (i.current_value / i.target_value * 100)
    ELSE 0
  END as progress_percentage
FROM indicators i
LEFT JOIN indicator_measurements im ON i.id = im.indicator_id
  AND im.measurement_date = (
    SELECT MAX(measurement_date)
    FROM indicator_measurements
    WHERE indicator_id = i.id
  )
WHERE i.deleted_at IS NULL;

-- View: Results chain with entity names
CREATE OR REPLACE VIEW v_results_chain_detailed AS
SELECT
  rc.*,
  CASE rc.from_entity_type
    WHEN 'activity' THEN (SELECT name FROM activities WHERE id = rc.from_entity_id)
    WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.from_entity_id)
    WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.from_entity_id)
  END as from_entity_name,
  CASE rc.to_entity_type
    WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.to_entity_id)
    WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.to_entity_id)
    WHEN 'module' THEN (SELECT name FROM program_modules WHERE id = rc.to_entity_id)
  END as to_entity_name
FROM results_chain rc;

-- ============================================
-- END OF MIGRATION
-- ============================================
