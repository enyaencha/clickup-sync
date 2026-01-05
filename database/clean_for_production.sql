-- ============================================================================
-- PRODUCTION DATABASE CLEANUP SCRIPT
-- ============================================================================
-- This script removes ONLY user accounts while preserving ALL other data
-- Use this to clear user accounts before deployment while keeping test data
-- ============================================================================

USE me_clickup_system;

-- ============================================================================
-- STEP 1: DISABLE FOREIGN KEY CHECKS (to avoid constraint errors)
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 2: CLEAR USER-RELATED DATA ONLY
-- ============================================================================

-- Clear user module assignments
DELETE FROM user_module_assignments WHERE id > 0;

-- Clear user role assignments (if exists)
DELETE FROM user_roles WHERE id > 0;

-- Delete ALL users
DELETE FROM users WHERE id > 0;

-- ============================================================================
-- STEP 3: RESET AUTO_INCREMENT VALUES FOR USER TABLES
-- ============================================================================

ALTER TABLE user_module_assignments AUTO_INCREMENT = 1;
ALTER TABLE user_roles AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

-- ============================================================================
-- STEP 4: RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- STEP 5: CREATE DEFAULT ADMIN USER
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
-- VERIFICATION: Check user data was cleared
-- ============================================================================

SELECT '=== VERIFICATION: Data Status After Cleanup ===' as status;

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'User Module Assignments', COUNT(*) FROM user_module_assignments
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles
UNION ALL
SELECT '--- PRESERVED DATA ---', NULL
UNION ALL
SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'Program Modules', COUNT(*) FROM program_modules
UNION ALL
SELECT 'Roles', COUNT(*) FROM roles
UNION ALL
SELECT 'Permissions', COUNT(*) FROM permissions
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
SELECT 'Resources', COUNT(*) FROM resources
UNION ALL
SELECT 'Resource Requests', COUNT(*) FROM resource_requests;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║              USER ACCOUNTS CLEANUP COMPLETED                    ║
╠════════════════════════════════════════════════════════════════╣
║  ✓ All user accounts have been removed                        ║
║  ✓ User module assignments cleared                            ║
║  ✓ User role assignments cleared                              ║
║  ✓ Default admin user created                                 ║
║  ✓ ALL OTHER DATA PRESERVED (activities, budgets, etc.)       ║
║                                                                 ║
║  NEXT STEPS:                                                   ║
║  1. Login with: admin@caritas.org / Admin@123                 ║
║  2. CHANGE THE DEFAULT PASSWORD IMMEDIATELY!                  ║
║  3. Create your organization users and assign roles           ║
║  4. Configure module assignments for users                    ║
║                                                                 ║
║  NOTE: All test data (activities, budgets, resources) has     ║
║        been kept intact. Only user accounts were cleared.     ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' as completion_message;
