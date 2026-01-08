-- ============================================================================
-- NOTIFICATIONS AND EXPENDITURE TRACKING
-- ============================================================================
-- Adds notification system and activity expenditure tracking
-- ============================================================================

USE me_clickup_system;

-- Notifications table for system-wide notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'User to be notified',
  `type` ENUM('budget_approved', 'budget_rejected', 'budget_returned', 'budget_revised', 'comment_added', 'expense_approved', 'general') NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL COMMENT 'budget_request, activity, expense, etc',
  `entity_id` INT DEFAULT NULL COMMENT 'ID of related entity',
  `action_url` VARCHAR(500) DEFAULT NULL COMMENT 'URL to navigate when clicked',
  `is_read` TINYINT(1) DEFAULT 0,
  `read_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,

  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_type` (`type`),
  KEY `idx_entity` (`entity_type`, `entity_id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='System notifications for users';

-- Activity Expenditures table for tracking spending
CREATE TABLE IF NOT EXISTS `activity_expenditures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `activity_id` INT NOT NULL,
  `budget_request_id` INT DEFAULT NULL COMMENT 'Link to approved budget request',
  `expense_date` DATE NOT NULL,
  `expense_category` VARCHAR(100) NOT NULL COMMENT 'Materials, Personnel, Transport, etc',
  `description` TEXT NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `receipt_number` VARCHAR(100) DEFAULT NULL,
  `vendor_name` VARCHAR(255) DEFAULT NULL,
  `payment_method` ENUM('cash', 'bank_transfer', 'mobile_money', 'check', 'other') DEFAULT 'cash',
  `status` ENUM('pending', 'approved', 'rejected', 'reimbursed') DEFAULT 'pending',

  -- Supporting documents
  `receipt_attachment_url` VARCHAR(500) DEFAULT NULL,
  `notes` TEXT,

  -- Tracking
  `submitted_by` INT NOT NULL,
  `approved_by` INT DEFAULT NULL,
  `approved_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,

  PRIMARY KEY (`id`),
  KEY `idx_activity` (`activity_id`),
  KEY `idx_budget_request` (`budget_request_id`),
  KEY `idx_status` (`status`),
  KEY `idx_expense_date` (`expense_date`),
  KEY `idx_submitted_by` (`submitted_by`),
  CONSTRAINT `fk_exp_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_exp_budget_request` FOREIGN KEY (`budget_request_id`) REFERENCES `activity_budget_requests` (`id`),
  CONSTRAINT `fk_exp_submitted_by` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_exp_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Activity expenditure tracking';

-- Budget Revision History table
CREATE TABLE IF NOT EXISTS `budget_revision_history` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `budget_request_id` INT NOT NULL,
  `previous_amount` DECIMAL(15,2) NOT NULL,
  `new_amount` DECIMAL(15,2) NOT NULL,
  `revision_reason` TEXT NOT NULL,
  `revised_by` INT NOT NULL,
  `revised_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_budget_request` (`budget_request_id`),
  KEY `idx_revised_by` (`revised_by`),
  CONSTRAINT `fk_brh_budget_request` FOREIGN KEY (`budget_request_id`) REFERENCES `activity_budget_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_brh_revised_by` FOREIGN KEY (`revised_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Track all budget revisions after approval';

-- Create indexes for performance
CREATE INDEX `idx_notification_created` ON `notifications` (`created_at` DESC);
CREATE INDEX `idx_expenditure_category` ON `activity_expenditures` (`expense_category`);

SELECT '
╔════════════════════════════════════════════════════════════════╗
║     NOTIFICATIONS & EXPENDITURE TABLES CREATED                  ║
╠════════════════════════════════════════════════════════════════╣
║  ✓ notifications - System notifications for users             ║
║  ✓ activity_expenditures - Track activity spending           ║
║  ✓ budget_revision_history - Track budget changes            ║
║                                                                 ║
║  FEATURES:                                                      ║
║  1. Notify users when budgets are approved/rejected           ║
║  2. Track all activity expenses with receipts                 ║
║  3. Maintain history of budget revisions                      ║
║  4. Link expenses to approved budget requests                 ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' AS setup_complete;
