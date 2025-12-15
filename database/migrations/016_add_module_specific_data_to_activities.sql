-- Migration: Add module_specific_data column to activities table
-- Purpose: Store Finance and Resource Management module-specific activity data
-- Date: December 15, 2025

USE me_clickup_system;

-- Add JSON column to store module-specific data
ALTER TABLE activities
ADD COLUMN module_specific_data JSON DEFAULT NULL COMMENT 'JSON field for module-specific data (Finance, Resources, etc.)';

-- Add index for better query performance when filtering by module-specific data
ALTER TABLE activities
ADD INDEX idx_module_specific_data ((CAST(module_specific_data AS CHAR(255))));

-- Examples of module_specific_data structure:
--
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
--
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

SELECT 'Migration 016 completed successfully' AS status;
