-- ============================================================================
-- VERIFICATION SCRIPT - Run BEFORE cleanup to see what will be preserved
-- ============================================================================

USE me_clickup_system;

SELECT '
╔════════════════════════════════════════════════════════════════╗
║              DATA PRESERVATION VERIFICATION                     ║
║  The following data will be KEPT after cleanup:                ║
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
-- SHOW CURRENT DATA TO BE DELETED
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║  The following data will be DELETED:                           ║
╚════════════════════════════════════════════════════════════════╝
' as divider;

SELECT '=== DATA TO BE REMOVED ===' as section;

SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Programs (Sub-Programs)', COUNT(*) FROM programs
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
SELECT 'Means of Verification', COUNT(*) FROM means_of_verification
UNION ALL
SELECT 'Attachments', COUNT(*) FROM attachments
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM access_audit_log
ORDER BY record_count DESC;

-- ============================================================================
-- SHOW SAMPLE DATA THAT WILL BE DELETED
-- ============================================================================
SELECT '=== SAMPLE USERS TO BE DELETED ===' as section;
SELECT id, email, full_name, is_system_admin, is_active
FROM users
ORDER BY id
LIMIT 10;

SELECT '=== SAMPLE ACTIVITIES TO BE DELETED ===' as section;
SELECT id, name, status, approval_status, created_at
FROM activities
ORDER BY id DESC
LIMIT 10;

SELECT '=== SAMPLE BUDGET ENTRIES TO BE DELETED ===' as section;
SELECT id, fiscal_year, total_budget, status, created_at
FROM program_budgets
ORDER BY id DESC
LIMIT 10;

SELECT '
╔════════════════════════════════════════════════════════════════╗
║                    IMPORTANT REMINDER                           ║
╠════════════════════════════════════════════════════════════════╣
║  1. Backup your database before running cleanup!              ║
║  2. Review the above data carefully                           ║
║  3. Run clean_for_production.sql when ready                   ║
║                                                                 ║
║  To backup:                                                    ║
║  mysqldump -u root -p me_clickup_system > backup.sql         ║
╚════════════════════════════════════════════════════════════════╝
' as reminder;
