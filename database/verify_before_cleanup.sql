-- ============================================================================
-- VERIFICATION SCRIPT - Run BEFORE cleanup to see what will be deleted
-- ============================================================================
-- This script shows you what USER DATA will be deleted
-- ALL OTHER DATA (activities, budgets, resources) will be PRESERVED
-- ============================================================================

USE me_clickup_system;

SELECT '
╔════════════════════════════════════════════════════════════════╗
║              USER CLEANUP VERIFICATION                          ║
║  Only USER data will be deleted. Everything else is kept!      ║
╚════════════════════════════════════════════════════════════════╝
' as header;

-- ============================================================================
-- SHOW ORGANIZATION DATA (WILL BE KEPT)
-- ============================================================================
SELECT '=== ORGANIZATIONS (PRESERVED) ===' as section;
SELECT id, name, code, country FROM organizations;

-- ============================================================================
-- SHOW PROGRAM MODULES (WILL BE KEPT)
-- ============================================================================
SELECT '=== PROGRAM MODULES (PRESERVED) ===' as section;
SELECT id, name, code, icon, is_active
FROM program_modules
ORDER BY id;

-- ============================================================================
-- SHOW ROLES (WILL BE KEPT)
-- ============================================================================
SELECT '=== ROLES (PRESERVED) ===' as section;
SELECT id, name, description, is_system_role
FROM roles
ORDER BY id;

-- ============================================================================
-- SHOW PERMISSIONS (WILL BE KEPT)
-- ============================================================================
SELECT '=== PERMISSIONS (PRESERVED) ===' as section;
SELECT id, name, resource, action, description
FROM permissions
ORDER BY resource, action
LIMIT 20;

-- ============================================================================
-- SHOW RESOURCE TYPES (WILL BE KEPT)
-- ============================================================================
SELECT '=== RESOURCE TYPES (PRESERVED) ===' as section;
SELECT id, name, category, description
FROM resource_types
WHERE is_active = TRUE
ORDER BY category, name;

-- ============================================================================
-- SHOW SETTINGS (WILL BE KEPT)
-- ============================================================================
SELECT '=== SYSTEM SETTINGS (PRESERVED) ===' as section;
SELECT * FROM settings LIMIT 1;

-- ============================================================================
-- SHOW USER DATA TO BE DELETED
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║  ONLY THE FOLLOWING USER DATA WILL BE DELETED:                ║
╚════════════════════════════════════════════════════════════════╝
' as divider;

SELECT '=== USER DATA TO BE REMOVED ===' as section;

SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'User Module Assignments', COUNT(*) FROM user_module_assignments
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles
ORDER BY record_count DESC;

-- ============================================================================
-- SHOW OTHER DATA THAT WILL BE PRESERVED
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║  ALL OTHER DATA WILL BE KEPT (NOT DELETED):                   ║
╚════════════════════════════════════════════════════════════════╝
' as kept_header;

SELECT '=== DATA TO BE PRESERVED ===' as section;

SELECT 'Programs (Sub-Programs)' as table_name, COUNT(*) as record_count FROM programs
UNION ALL
SELECT 'Components', COUNT(*) FROM components
UNION ALL
SELECT 'Activities', COUNT(*) FROM activities
UNION ALL
SELECT 'Activity Checklists', COUNT(*) FROM activity_checklists
UNION ALL
SELECT 'Financial Transactions', COUNT(*) FROM financial_transactions
UNION ALL
SELECT 'Finance Approvals', COUNT(*) FROM finance_approvals
UNION ALL
SELECT 'Program Budgets', COUNT(*) FROM program_budgets
UNION ALL
SELECT 'Resources', COUNT(*) FROM resources
UNION ALL
SELECT 'Resource Requests', COUNT(*) FROM resource_requests
UNION ALL
SELECT 'Loans', COUNT(*) FROM loans
UNION ALL
SELECT 'Indicators', COUNT(*) FROM indicators
UNION ALL
SELECT 'Attachments', COUNT(*) FROM attachments
ORDER BY record_count DESC;

-- ============================================================================
-- SHOW SAMPLE USER DATA THAT WILL BE DELETED
-- ============================================================================
SELECT '=== SAMPLE USERS TO BE DELETED ===' as section;
SELECT id, email, full_name, is_system_admin, is_active
FROM users
ORDER BY id
LIMIT 10;

SELECT '=== USER MODULE ASSIGNMENTS TO BE DELETED ===' as section;
SELECT uma.id, u.email, pm.name as module_name, uma.role
FROM user_module_assignments uma
LEFT JOIN users u ON uma.user_id = u.id
LEFT JOIN program_modules pm ON uma.module_id = pm.id
ORDER BY uma.id
LIMIT 10;

SELECT '
╔════════════════════════════════════════════════════════════════╗
║                    IMPORTANT REMINDER                           ║
╠════════════════════════════════════════════════════════════════╣
║  1. Backup your database before running cleanup!              ║
║  2. Review the above data carefully                           ║
║  3. ONLY user accounts will be deleted                        ║
║  4. All activities, budgets, resources will be KEPT           ║
║  5. Run clean_for_production.sql when ready                   ║
║                                                                 ║
║  To backup:                                                    ║
║  mysqldump -u root -p me_clickup_system > backup.sql         ║
╚════════════════════════════════════════════════════════════════╝
' as reminder;
