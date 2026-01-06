-- ============================================================================
-- VERIFICATION SCRIPT - Run BEFORE cleanup
-- ============================================================================
-- Shows what will be deleted and what will be preserved
-- ============================================================================

USE me_clickup_system;

SELECT '
╔════════════════════════════════════════════════════════════════╗
║         PRODUCTION CLEANUP VERIFICATION                        ║
╠════════════════════════════════════════════════════════════════╣
║  This shows what will be DELETED vs PRESERVED                 ║
╚════════════════════════════════════════════════════════════════╝
' as header;

-- ============================================================================
-- SHOW WHAT WILL BE PRESERVED
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║  SYSTEM DATA THAT WILL BE PRESERVED:                          ║
╚════════════════════════════════════════════════════════════════╝
' as preserved_header;

SELECT '=== SYSTEM CONFIGURATION (KEPT) ===' as section;

SELECT 'Organizations' as table_name, COUNT(*) as record_count FROM organizations
UNION ALL SELECT 'Program Modules', COUNT(*) FROM program_modules
UNION ALL SELECT 'Roles', COUNT(*) FROM roles
UNION ALL SELECT 'Permissions', COUNT(*) FROM permissions
UNION ALL SELECT 'Role Permissions', COUNT(*) FROM role_permissions
UNION ALL SELECT 'Resource Types', COUNT(*) FROM resource_types
UNION ALL SELECT 'Locations', COUNT(*) FROM locations
UNION ALL SELECT 'Goal Categories', COUNT(*) FROM goal_categories
UNION ALL SELECT 'Strategic Goals', COUNT(*) FROM strategic_goals
UNION ALL SELECT 'ME Indicators', COUNT(*) FROM me_indicators
ORDER BY record_count DESC;

-- ============================================================================
-- SHOW USER ID 1 (WILL BE KEPT)
-- ============================================================================
SELECT '=== USER ID 1 (WILL BE KEPT) ===' as section;
SELECT id, email, full_name, is_system_admin, is_active, created_at
FROM users
WHERE id = 1;

-- ============================================================================
-- SHOW WHAT WILL BE DELETED
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║  TEST DATA THAT WILL BE DELETED:                              ║
╚════════════════════════════════════════════════════════════════╝
' as deleted_header;

SELECT '=== DATA TO BE REMOVED ===' as section;

SELECT 'Test Users (ID > 1)' as table_name, COUNT(*) as record_count FROM users WHERE id > 1
UNION ALL SELECT 'User Module Assignments (user > 1)', COUNT(*) FROM user_module_assignments WHERE user_id > 1
UNION ALL SELECT 'User Roles (user > 1)', COUNT(*) FROM user_roles WHERE user_id > 1
UNION ALL SELECT 'Activities', COUNT(*) FROM activities
UNION ALL SELECT 'Activity Checklists', COUNT(*) FROM activity_checklists
UNION ALL SELECT 'Programs', COUNT(*) FROM programs
UNION ALL SELECT 'Sub Programs', COUNT(*) FROM sub_programs
UNION ALL SELECT 'Projects', COUNT(*) FROM projects
UNION ALL SELECT 'Components', COUNT(*) FROM project_components
UNION ALL SELECT 'Indicators', COUNT(*) FROM indicators
UNION ALL SELECT 'Program Budgets', COUNT(*) FROM program_budgets
UNION ALL SELECT 'Financial Transactions', COUNT(*) FROM financial_transactions
UNION ALL SELECT 'Finance Approvals', COUNT(*) FROM finance_approvals
UNION ALL SELECT 'Loans', COUNT(*) FROM loans
UNION ALL SELECT 'Resources', COUNT(*) FROM resources
UNION ALL SELECT 'Resource Requests', COUNT(*) FROM resource_requests
UNION ALL SELECT 'Beneficiaries', COUNT(*) FROM beneficiaries
UNION ALL SELECT 'Trainings', COUNT(*) FROM trainings
UNION ALL SELECT 'Audit Logs', COUNT(*) FROM access_audit_log
UNION ALL SELECT 'Attachments', COUNT(*) FROM attachments
ORDER BY record_count DESC;

-- ============================================================================
-- SHOW SAMPLE USERS TO BE DELETED
-- ============================================================================
SELECT '=== SAMPLE TEST USERS TO BE DELETED (ID > 1) ===' as section;
SELECT id, email, full_name, is_system_admin, is_active
FROM users
WHERE id > 1
ORDER BY id
LIMIT 10;

-- ============================================================================
-- SHOW SAMPLE ACTIVITIES TO BE DELETED
-- ============================================================================
SELECT '=== SAMPLE ACTIVITIES TO BE DELETED ===' as section;
SELECT id, name, status, created_at
FROM activities
ORDER BY id DESC
LIMIT 5;

-- ============================================================================
-- IMPORTANT REMINDER
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║                    IMPORTANT REMINDER                           ║
╠════════════════════════════════════════════════════════════════╣
║  1. BACKUP YOUR DATABASE FIRST!                               ║
║     mysqldump -u root -p me_clickup_system > backup.sql      ║
║                                                                 ║
║  2. Review the counts above carefully                         ║
║                                                                 ║
║  3. User ID 1 will be KEPT (your existing admin)              ║
║                                                                 ║
║  4. All system config will be PRESERVED                       ║
║     (organizations, modules, roles, permissions)              ║
║                                                                 ║
║  5. ALL test data will be DELETED                             ║
║     (activities, budgets, resources, beneficiaries, etc.)     ║
║                                                                 ║
║  6. Run clean_for_production.sql when ready                   ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' as reminder;
