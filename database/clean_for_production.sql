-- ============================================================================
-- PRODUCTION DATABASE CLEANUP SCRIPT
-- ============================================================================
-- This script removes all dummy/test data while preserving essential system data
-- Run this BEFORE deploying to production
-- ============================================================================

USE me_clickup_system;

-- ============================================================================
-- STEP 1: DISABLE FOREIGN KEY CHECKS (to avoid constraint errors)
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 2: CLEAR AUDIT AND LOG TABLES
-- ============================================================================
TRUNCATE TABLE access_audit_log;
TRUNCATE TABLE activity_logs;

-- ============================================================================
-- STEP 3: CLEAR USER-GENERATED DATA
-- ============================================================================

-- Clear Activities and Related Data
TRUNCATE TABLE activity_attachments;
TRUNCATE TABLE activity_checklists;
TRUNCATE TABLE activity_verification;
DELETE FROM activities WHERE id > 0;

-- Clear Means of Verification
TRUNCATE TABLE means_of_verification;

-- Clear Attachments
TRUNCATE TABLE attachments;

-- Clear Components
DELETE FROM components WHERE id > 0;

-- Clear Sub-Programs (programs table)
DELETE FROM programs WHERE id > 0;

-- Clear Projects
DELETE FROM projects WHERE id > 0;

-- Clear Indicators
TRUNCATE TABLE indicator_data;
TRUNCATE TABLE indicator_targets;
DELETE FROM indicators WHERE id > 0;

-- Clear Logframe Data
TRUNCATE TABLE logframe_assumptions;
TRUNCATE TABLE results_chain;

-- ============================================================================
-- STEP 4: CLEAR FINANCE DATA
-- ============================================================================

-- Clear Financial Transactions
DELETE FROM financial_transactions WHERE id > 0;

-- Clear Finance Approvals
DELETE FROM finance_approvals WHERE id > 0;

-- Clear Program Budgets
DELETE FROM program_budgets WHERE id > 0;

-- Clear Loans
DELETE FROM loan_guarantors WHERE id > 0;
DELETE FROM loan_repayments WHERE id > 0;
DELETE FROM loans WHERE id > 0;

-- ============================================================================
-- STEP 5: CLEAR RESOURCE MANAGEMENT DATA
-- ============================================================================

-- Clear Resource Requests
DELETE FROM resource_requests WHERE id > 0;

-- Clear Resource Maintenance
DELETE FROM resource_maintenance WHERE id > 0;

-- Clear Resources Inventory
DELETE FROM resources WHERE id > 0;

-- Note: We keep resource_types as they are reference data

-- ============================================================================
-- STEP 6: CLEAR USER DATA (Keep structure but remove test users)
-- ============================================================================

-- Clear user module assignments
DELETE FROM user_module_assignments WHERE id > 0;

-- Clear user role assignments
DELETE FROM user_roles WHERE id > 0;

-- Delete all users EXCEPT system admin (user id 1)
-- WARNING: Adjust this if you want to keep a specific admin user
-- DELETE FROM users WHERE id > 1;

-- OR: Delete ALL users and create a fresh admin later
DELETE FROM users WHERE id > 0;

-- ============================================================================
-- STEP 7: RESET AUTO_INCREMENT VALUES
-- ============================================================================

ALTER TABLE access_audit_log AUTO_INCREMENT = 1;
ALTER TABLE activities AUTO_INCREMENT = 1;
ALTER TABLE activity_attachments AUTO_INCREMENT = 1;
ALTER TABLE activity_checklists AUTO_INCREMENT = 1;
ALTER TABLE activity_logs AUTO_INCREMENT = 1;
ALTER TABLE activity_verification AUTO_INCREMENT = 1;
ALTER TABLE attachments AUTO_INCREMENT = 1;
ALTER TABLE components AUTO_INCREMENT = 1;
ALTER TABLE finance_approvals AUTO_INCREMENT = 1;
ALTER TABLE financial_transactions AUTO_INCREMENT = 1;
ALTER TABLE indicator_data AUTO_INCREMENT = 1;
ALTER TABLE indicator_targets AUTO_INCREMENT = 1;
ALTER TABLE indicators AUTO_INCREMENT = 1;
ALTER TABLE loan_guarantors AUTO_INCREMENT = 1;
ALTER TABLE loan_repayments AUTO_INCREMENT = 1;
ALTER TABLE loans AUTO_INCREMENT = 1;
ALTER TABLE logframe_assumptions AUTO_INCREMENT = 1;
ALTER TABLE means_of_verification AUTO_INCREMENT = 1;
ALTER TABLE program_budgets AUTO_INCREMENT = 1;
ALTER TABLE programs AUTO_INCREMENT = 1;
ALTER TABLE projects AUTO_INCREMENT = 1;
ALTER TABLE resource_maintenance AUTO_INCREMENT = 1;
ALTER TABLE resource_requests AUTO_INCREMENT = 1;
ALTER TABLE resources AUTO_INCREMENT = 1;
ALTER TABLE results_chain AUTO_INCREMENT = 1;
ALTER TABLE user_module_assignments AUTO_INCREMENT = 1;
ALTER TABLE user_roles AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- ============================================================================
-- STEP 8: RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- STEP 9: CREATE DEFAULT ADMIN USER
-- ============================================================================
-- Default password: 'Admin@123' (CHANGE THIS IMMEDIATELY after first login!)
-- Password hash generated with bcrypt rounds=10

INSERT INTO users (
    email,
    password_hash,
    full_name,
    is_system_admin,
    is_active,
    created_at
) VALUES (
    'admin@caritas.org',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGGa/p.8G8Z8OG9S8C', -- Password: Admin@123
    'System Administrator',
    1,
    1,
    NOW()
);

-- ============================================================================
-- VERIFICATION: Check what data remains
-- ============================================================================

SELECT '=== VERIFICATION: Remaining Data Counts ===' as status;

SELECT 'Organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL
SELECT 'Program Modules', COUNT(*) FROM program_modules
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Permissions', COUNT(*) FROM permissions
UNION ALL
SELECT 'Role Permissions', COUNT(*) FROM role_permissions
UNION ALL
SELECT 'Resource Types', COUNT(*) FROM resource_types
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Programs (Sub-Programs)', COUNT(*) FROM programs
UNION ALL
SELECT 'Components', COUNT(*) FROM components
UNION ALL
SELECT 'Activities', COUNT(*) FROM activities
UNION ALL
SELECT 'Financial Transactions', COUNT(*) FROM financial_transactions
UNION ALL
SELECT 'Program Budgets', COUNT(*) FROM program_budgets
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║                DATABASE CLEANUP COMPLETED                       ║
╠════════════════════════════════════════════════════════════════╣
║  ✓ All test/dummy data has been removed                       ║
║  ✓ System configuration data preserved                        ║
║  ✓ Default admin user created                                 ║
║                                                                 ║
║  NEXT STEPS:                                                   ║
║  1. Login with: admin@caritas.org / Admin@123                 ║
║  2. CHANGE THE DEFAULT PASSWORD IMMEDIATELY!                  ║
║  3. Create your organization users and assign roles           ║
║  4. Configure module assignments for users                    ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' as completion_message;
