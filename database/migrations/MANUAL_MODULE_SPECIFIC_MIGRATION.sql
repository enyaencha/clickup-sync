-- =====================================================
-- Manual Migration: Add module-specific data to activities
-- Purpose: Enable Finance and Resource Management module-specific activity forms
-- Date: December 15, 2025
-- =====================================================

USE me_clickup_system;

-- Check if column already exists
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'me_clickup_system'
    AND TABLE_NAME = 'activities'
    AND COLUMN_NAME = 'module_specific_data'
);

-- Add column if it doesn't exist
SET @sql = IF(@column_exists = 0,
    'ALTER TABLE activities ADD COLUMN module_specific_data JSON DEFAULT NULL COMMENT ''JSON field for module-specific data (Finance, Resources, etc.)''',
    'SELECT ''Column module_specific_data already exists'' AS status'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- NOTE:
-- Avoid adding a functional index on module_specific_data.
-- CAST(JSON AS CHAR(255)) can truncate valid payloads and fail inserts/updates.

-- Verify the migration
SELECT
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'me_clickup_system'
AND TABLE_NAME = 'activities'
AND COLUMN_NAME = 'module_specific_data';

SELECT '✅ Migration completed successfully!' AS status;

-- =====================================================
-- Module-Specific Data Structure Examples
-- =====================================================

-- Finance Module (module_id = 6):
-- {
--   "transaction_type": "expense",
--   "expense_category": "program",
--   "payment_method": "bank_transfer",
--   "budget_line": "BL-2025-001",
--   "vendor_payee": "ABC Supplies",
--   "invoice_number": "INV-12345",
--   "receipt_number": "RCP-67890",
--   "approval_level": "director",
--   "expected_amount": "50000.00"
-- }

-- Resource Management Module (module_id = 5):
-- {
--   "activity_type": "maintenance",
--   "resource_category": "vehicle",
--   "resource_id": "15",
--   "quantity_needed": "1",
--   "duration_of_use": "7",
--   "maintenance_type": "preventive",
--   "training_topic": null,
--   "participants_count": null
-- }

-- =====================================================
-- How to Run This Migration
-- =====================================================
-- Option 1: MySQL CLI
-- mysql -u root -p me_clickup_system < MANUAL_MODULE_SPECIFIC_MIGRATION.sql

-- Option 2: MySQL Workbench
-- 1. Open MySQL Workbench
-- 2. Connect to your database
-- 3. File > Run SQL Script > Select this file
-- 4. Click "Run"

-- Option 3: Node.js Script
-- cd backend
-- node run-module-specific-migration.js
