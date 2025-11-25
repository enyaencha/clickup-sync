-- ============================================
-- Logframe Enhancement Migration (Revised)
-- Adds missing tables and updates existing me_indicators
-- ============================================

-- ============================================
-- 1. UPDATE me_indicators TABLE for New Hierarchy
-- ============================================

-- Add columns for new hierarchy (program_modules, sub_programs, project_components)
SET @dbname = DATABASE();
SET @tablename = 'me_indicators';

-- Add module_id column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'module_id';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `module_id` INT DEFAULT NULL COMMENT ''Link to program_modules table''',
    'SELECT "Column module_id already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add sub_program_id column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'sub_program_id';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `sub_program_id` INT DEFAULT NULL COMMENT ''Link to sub_programs table''',
    'SELECT "Column sub_program_id already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add component_id column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'component_id';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `component_id` INT DEFAULT NULL COMMENT ''Link to project_components table''',
    'SELECT "Column component_id already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign keys for new hierarchy (check if they don't exist first)
SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_me_indicators_module';
SET @query = IF(@fk_exists = 0,
    'ALTER TABLE me_indicators ADD CONSTRAINT `fk_me_indicators_module` FOREIGN KEY (`module_id`) REFERENCES `program_modules` (`id`) ON DELETE CASCADE',
    'SELECT "Foreign key fk_me_indicators_module already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_me_indicators_sub_program';
SET @query = IF(@fk_exists = 0,
    'ALTER TABLE me_indicators ADD CONSTRAINT `fk_me_indicators_sub_program` FOREIGN KEY (`sub_program_id`) REFERENCES `sub_programs` (`id`) ON DELETE CASCADE',
    'SELECT "Foreign key fk_me_indicators_sub_program already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = 0;
SELECT COUNT(*) INTO @fk_exists FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND CONSTRAINT_NAME = 'fk_me_indicators_component';
SET @query = IF(@fk_exists = 0,
    'ALTER TABLE me_indicators ADD CONSTRAINT `fk_me_indicators_component` FOREIGN KEY (`component_id`) REFERENCES `project_components` (`id`) ON DELETE CASCADE',
    'SELECT "Foreign key fk_me_indicators_component already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes for new hierarchy columns
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_module';
SET @query = IF(@idx_exists = 0,
    'ALTER TABLE me_indicators ADD INDEX `idx_module` (`module_id`)',
    'SELECT "Index idx_module already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_sub_program';
SET @query = IF(@idx_exists = 0,
    'ALTER TABLE me_indicators ADD INDEX `idx_sub_program` (`sub_program_id`)',
    'SELECT "Index idx_sub_program already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_component';
SET @query = IF(@idx_exists = 0,
    'ALTER TABLE me_indicators ADD INDEX `idx_component` (`component_id`)',
    'SELECT "Index idx_component already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add additional fields missing from me_indicators
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'baseline_date';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `baseline_date` DATE DEFAULT NULL COMMENT ''Date when baseline was measured''',
    'SELECT "Column baseline_date already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'target_date';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `target_date` DATE DEFAULT NULL COMMENT ''Target achievement date''',
    'SELECT "Column target_date already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'last_measured_date';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `last_measured_date` DATE DEFAULT NULL COMMENT ''Last measurement date''',
    'SELECT "Column last_measured_date already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'next_measurement_date';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `next_measurement_date` DATE DEFAULT NULL COMMENT ''Next scheduled measurement''',
    'SELECT "Column next_measurement_date already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'status';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `status` ENUM(''on-track'', ''at-risk'', ''off-track'', ''not-started'') DEFAULT ''not-started'' COMMENT ''Current status''',
    'SELECT "Column status already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'achievement_percentage';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `achievement_percentage` DECIMAL(5,2) DEFAULT 0 COMMENT ''Progress towards target''',
    'SELECT "Column achievement_percentage already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'responsible_person';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `responsible_person` VARCHAR(255) DEFAULT NULL COMMENT ''Person responsible for indicator''',
    'SELECT "Column responsible_person already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'notes';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `notes` TEXT DEFAULT NULL COMMENT ''Additional notes''',
    'SELECT "Column notes already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'deleted_at';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_indicators ADD COLUMN `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT ''Soft delete timestamp''',
    'SELECT "Column deleted_at already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add index for soft deletes
SET @idx_exists = 0;
SELECT COUNT(*) INTO @idx_exists FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND INDEX_NAME = 'idx_deleted';
SET @query = IF(@idx_exists = 0,
    'ALTER TABLE me_indicators ADD INDEX `idx_deleted` (`deleted_at`)',
    'SELECT "Index idx_deleted already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update me_indicators type enum to include 'process' type
ALTER TABLE me_indicators
MODIFY COLUMN `type` ENUM('output','outcome','impact','process') NOT NULL;

-- ============================================
-- 2. UPDATE me_results TABLE
-- ============================================

SET @tablename = 'me_results';

-- Add measurement_method column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'measurement_method';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_results ADD COLUMN `measurement_method` VARCHAR(255) DEFAULT NULL COMMENT ''How measurement was taken''',
    'SELECT "Column measurement_method already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add verified_date column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'verified_date';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE me_results ADD COLUMN `verified_date` DATE DEFAULT NULL COMMENT ''Date of verification''',
    'SELECT "Column verified_date already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 3. MEANS OF VERIFICATION TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS `means_of_verification` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- Link to hierarchy level or indicator
  `entity_type` ENUM('module', 'sub_program', 'component', 'activity', 'indicator') NOT NULL COMMENT 'Type of entity',
  `entity_id` INT NOT NULL COMMENT 'ID of the entity',

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
-- 4. ASSUMPTIONS TABLE (NEW)
-- ============================================
CREATE TABLE IF NOT EXISTS `assumptions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,

  -- Link to hierarchy level
  `entity_type` ENUM('module', 'sub_program', 'component', 'activity') NOT NULL COMMENT 'Type of entity',
  `entity_id` INT NOT NULL COMMENT 'ID of the entity',

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
-- 5. RESULTS CHAIN TABLE (NEW)
-- Links activities → components → sub_programs → modules
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
-- 6. Add Logframe Fields to Existing Hierarchy Tables
-- ============================================

SET @tablename = 'program_modules';

-- Add logframe_goal column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'logframe_goal';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE program_modules ADD COLUMN `logframe_goal` TEXT COMMENT ''Overall goal statement''',
    'SELECT "Column logframe_goal already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add goal_indicators column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'goal_indicators';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE program_modules ADD COLUMN `goal_indicators` TEXT COMMENT ''Key goal-level indicators (optional text summary)''',
    'SELECT "Column goal_indicators already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tablename = 'sub_programs';

-- Add logframe_outcome column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'logframe_outcome';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE sub_programs ADD COLUMN `logframe_outcome` TEXT COMMENT ''Expected outcome statement''',
    'SELECT "Column logframe_outcome already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add outcome_indicators column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'outcome_indicators';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE sub_programs ADD COLUMN `outcome_indicators` TEXT COMMENT ''Key outcome indicators (optional text summary)''',
    'SELECT "Column outcome_indicators already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tablename = 'project_components';

-- Add logframe_output column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'logframe_output';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE project_components ADD COLUMN `logframe_output` TEXT COMMENT ''Expected output statement''',
    'SELECT "Column logframe_output already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add output_indicators column
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'output_indicators';
SET @query = IF(@col_exists = 0,
    'ALTER TABLE project_components ADD COLUMN `output_indicators` TEXT COMMENT ''Key output indicators (optional text summary)''',
    'SELECT "Column output_indicators already exists" AS info');
PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample means of verification for Module 1 (only if module with id=1 exists)
INSERT INTO `means_of_verification` (
  entity_type, entity_id, verification_method, evidence_type,
  description, collection_frequency
)
SELECT 'module', 1,
  'Household surveys and field reports',
  'survey',
  'Annual household food security surveys conducted in target communities',
  'annual'
FROM program_modules WHERE id = 1
LIMIT 1
ON DUPLICATE KEY UPDATE verification_method = verification_method;

-- Sample assumption for Module 1 (only if module with id=1 exists)
INSERT INTO `assumptions` (
  entity_type, entity_id, assumption_text, assumption_category,
  likelihood, impact, risk_level, mitigation_strategy
)
SELECT 'module', 1,
  'Stable climatic conditions with normal rainfall patterns',
  'environmental',
  'medium',
  'high',
  'medium',
  'Promote climate-resilient agricultural practices and early warning systems'
FROM program_modules WHERE id = 1
LIMIT 1
ON DUPLICATE KEY UPDATE assumption_text = assumption_text;

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

-- Drop existing views if they exist
DROP VIEW IF EXISTS v_indicators_with_latest;
DROP VIEW IF EXISTS v_results_chain_detailed;

-- View: Indicators with latest measurement (updated to use me_indicators and me_results)
CREATE VIEW v_indicators_with_latest AS
SELECT
  i.*,
  r.value as latest_value,
  r.reporting_period_end as latest_measurement_date,
  CASE
    WHEN i.target_value > 0 THEN (i.current_value / i.target_value * 100)
    ELSE 0
  END as progress_percentage
FROM me_indicators i
LEFT JOIN me_results r ON i.id = r.indicator_id
  AND r.reporting_period_end = (
    SELECT MAX(reporting_period_end)
    FROM me_results
    WHERE indicator_id = i.id
  )
WHERE i.deleted_at IS NULL;

-- View: Results chain with entity names
CREATE VIEW v_results_chain_detailed AS
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
