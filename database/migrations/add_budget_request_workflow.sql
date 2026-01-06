-- ============================================================================
-- BUDGET REQUEST WORKFLOW TABLES
-- ============================================================================
-- This creates tables for budget request workflow where teams can request
-- budgets for activities, and finance can approve/edit/return them
-- ============================================================================

USE me_clickup_system;

-- Activity Budget Requests table
CREATE TABLE IF NOT EXISTS `activity_budget_requests` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `request_number` VARCHAR(50) NOT NULL UNIQUE,
  `requested_amount` DECIMAL(15,2) NOT NULL,
  `justification` TEXT NOT NULL,
  `breakdown` JSON COMMENT 'Detailed budget breakdown',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'returned_for_amendment') DEFAULT 'draft',

  -- Finance review fields
  `approved_amount` DECIMAL(15,2) DEFAULT NULL,
  `finance_notes` TEXT COMMENT 'Notes from finance team',
  `rejection_reason` TEXT,
  `amendment_notes` TEXT COMMENT 'What needs to be changed',

  -- Tracking
  `requested_by` INT NOT NULL,
  `reviewed_by` INT DEFAULT NULL,
  `submitted_at` TIMESTAMP NULL,
  `reviewed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,

  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_status` (`status`),
  KEY `idx_requested_by` (`requested_by`),
  KEY `idx_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_abr_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_abr_requested_by` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_abr_reviewed_by` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Budget requests from teams for activities';

-- Budget Allocation Tracking table
CREATE TABLE IF NOT EXISTS `budget_allocations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `source_type` ENUM('program_budget', 'sub_program', 'component') NOT NULL,
  `source_id` INT NOT NULL COMMENT 'ID of source budget entity',
  `target_type` ENUM('sub_program', 'component', 'activity') NOT NULL,
  `target_id` INT NOT NULL COMMENT 'ID of target entity',

  `allocated_amount` DECIMAL(15,2) NOT NULL,
  `allocation_date` DATE NOT NULL,
  `allocation_notes` TEXT,

  -- Track spending against allocation
  `spent_amount` DECIMAL(15,2) DEFAULT 0.00,
  `committed_amount` DECIMAL(15,2) DEFAULT 0.00,
  `remaining_amount` DECIMAL(15,2) GENERATED ALWAYS AS (`allocated_amount` - `spent_amount` - `committed_amount`) STORED,

  `allocated_by` INT NOT NULL,
  `status` ENUM('active', 'exhausted', 'cancelled') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_source` (`source_type`, `source_id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_allocated_by` (`allocated_by`),
  CONSTRAINT `fk_ba_allocated_by` FOREIGN KEY (`allocated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracks budget allocations from program down to activity level';

-- Extend comments table to support more entity types
ALTER TABLE `comments`
MODIFY COLUMN `entity_type` ENUM(
  'activity',
  'goal',
  'sub_program',
  'component',
  'approval',
  'finance_approval',
  'budget_request',
  'checklist',
  'expense',
  'risk'
) NOT NULL;

-- Add parent comment support for threaded discussions
ALTER TABLE `comments`
ADD COLUMN `parent_comment_id` INT DEFAULT NULL AFTER `entity_id`,
ADD KEY `idx_parent_comment` (`parent_comment_id`),
ADD CONSTRAINT `fk_parent_comment` FOREIGN KEY (`parent_comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

-- Activity Budget table (extends activities with budget tracking)
CREATE TABLE IF NOT EXISTS `activity_budgets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL UNIQUE,

  -- Budget amounts
  `allocated_budget` DECIMAL(15,2) DEFAULT 0.00,
  `requested_budget` DECIMAL(15,2) DEFAULT 0.00,
  `approved_budget` DECIMAL(15,2) DEFAULT 0.00,
  `spent_budget` DECIMAL(15,2) DEFAULT 0.00,
  `committed_budget` DECIMAL(15,2) DEFAULT 0.00,
  `remaining_budget` DECIMAL(15,2) GENERATED ALWAYS AS (`approved_budget` - `spent_budget` - `committed_budget`) STORED,

  -- Tracking
  `budget_source` ENUM('program', 'sub_program', 'component', 'request') DEFAULT 'request',
  `last_allocation_date` DATE DEFAULT NULL,
  `last_updated_by` INT DEFAULT NULL,

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  CONSTRAINT `fk_ab_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ab_updated_by` FOREIGN KEY (`last_updated_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Activity-level budget tracking';

-- Create indexes for performance
CREATE INDEX `idx_abr_request_number` ON `activity_budget_requests` (`request_number`);
CREATE INDEX `idx_ba_status` ON `budget_allocations` (`status`);
CREATE INDEX `idx_ba_allocation_date` ON `budget_allocations` (`allocation_date`);

SELECT '
╔════════════════════════════════════════════════════════════════╗
║       BUDGET REQUEST WORKFLOW TABLES CREATED                    ║
╠════════════════════════════════════════════════════════════════╣
║  ✓ activity_budget_requests - Budget request workflow         ║
║  ✓ budget_allocations - Track budget flow                     ║
║  ✓ activity_budgets - Activity budget tracking                ║
║  ✓ comments - Extended for more entity types                  ║
║                                                                 ║
║  WORKFLOW:                                                      ║
║  1. Team requests budget for activity                         ║
║  2. Finance reviews, can approve/edit/return                  ║
║  3. Budget allocated from program → activity                  ║
║  4. Track spending with automatic remaining calculation       ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' AS setup_complete;
