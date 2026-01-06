-- ============================================================================
-- PRODUCTION DATABASE CLEANUP SCRIPT
-- ============================================================================
-- This script removes ALL test/dummy data while preserving:
-- 1. System configuration (organizations, modules, roles, permissions)
-- 2. User ID 1 (your existing admin account)
-- 3. Reference/lookup data (resource types, locations, etc.)
-- ============================================================================

USE me_clickup_system;

-- ============================================================================
-- BACKUP REMINDER
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║                    ⚠️  CRITICAL WARNING  ⚠️                    ║
╠════════════════════════════════════════════════════════════════╣
║  This script will DELETE ALL test data!                       ║
║  Make sure you have created a backup first:                   ║
║                                                                 ║
║  mysqldump -u root -p me_clickup_system > backup.sql         ║
║                                                                 ║
║  Press Ctrl+C now to cancel if you havent backed up!         ║
╚════════════════════════════════════════════════════════════════╝
' as warning_message;

-- Pause for 5 seconds to allow user to cancel
SELECT SLEEP(5) as 'Starting cleanup in 5 seconds...';

-- ============================================================================
-- STEP 1: DISABLE FOREIGN KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- STEP 2: CLEAR USER DATA (Keep user ID 1)
-- ============================================================================

-- Delete user module assignments for test users (keep user 1's assignments)
DELETE FROM user_module_assignments WHERE user_id > 1;

-- Delete user roles for test users (keep user 1's roles)
DELETE FROM user_roles WHERE user_id > 1;

-- Delete user sessions for test users
DELETE FROM user_sessions WHERE user_id > 1;

-- Delete test users (keep only user ID 1)
DELETE FROM users WHERE id > 1;

-- ============================================================================
-- STEP 3: CLEAR ACTIVITY AND PROGRAM DATA
-- ============================================================================

-- Clear activities and related data
DELETE FROM activity_beneficiaries WHERE id > 0;
DELETE FROM activity_checklists WHERE id > 0;
DELETE FROM activity_expenses WHERE id > 0;
DELETE FROM activity_risks WHERE id > 0;
DELETE FROM sub_activities WHERE id > 0;
DELETE FROM activities WHERE id > 0;

-- Clear attachments and comments
DELETE FROM attachments WHERE id > 0;
DELETE FROM comments WHERE id > 0;

-- Clear program structure
DELETE FROM component_budgets WHERE id > 0;
DELETE FROM project_components WHERE id > 0;
DELETE FROM programs WHERE id > 0;
DELETE FROM sub_programs WHERE id > 0;
DELETE FROM projects WHERE id > 0;

-- Clear logframe and indicators
DELETE FROM indicator_activity_links WHERE id > 0;
DELETE FROM indicator_values WHERE id > 0;
DELETE FROM indicators WHERE id > 0;
DELETE FROM means_of_verification WHERE id > 0;
DELETE FROM results_chain WHERE id > 0;
DELETE FROM assumptions WHERE id > 0;
DELETE FROM me_results WHERE id > 0;
DELETE FROM me_reports WHERE id > 0;

-- ============================================================================
-- STEP 4: CLEAR FINANCE DATA
-- ============================================================================

-- Clear financial transactions and approvals
DELETE FROM financial_transactions WHERE id > 0;
DELETE FROM finance_approvals WHERE id > 0;
DELETE FROM program_budgets WHERE id > 0;
DELETE FROM budget_revisions WHERE id > 0;

-- Clear loans
DELETE FROM loan_repayments WHERE id > 0;
DELETE FROM loans WHERE id > 0;

-- ============================================================================
-- STEP 5: CLEAR RESOURCE MANAGEMENT DATA
-- ============================================================================

-- Clear resource requests and maintenance
DELETE FROM resource_requests WHERE id > 0;
DELETE FROM resource_maintenance WHERE id > 0;
DELETE FROM resources WHERE id > 0;

-- ============================================================================
-- STEP 6: CLEAR BENEFICIARY AND SECTOR-SPECIFIC DATA
-- ============================================================================

-- Clear beneficiaries
DELETE FROM beneficiaries WHERE id > 0;
DELETE FROM relief_beneficiaries WHERE id > 0;
DELETE FROM relief_distributions WHERE id > 0;

-- Clear livelihood data
DELETE FROM businesses WHERE id > 0;
DELETE FROM agricultural_plots WHERE id > 0;
DELETE FROM crop_production WHERE id > 0;
DELETE FROM shg_members WHERE id > 0;

-- Clear health/nutrition data
DELETE FROM nutrition_assessments WHERE id > 0;

-- Clear protection data
DELETE FROM gbv_case_notes WHERE id > 0;
DELETE FROM gbv_cases WHERE id > 0;

-- Clear capacity building data
DELETE FROM capacity_building_participants WHERE id > 0;
DELETE FROM capacity_building_programs WHERE id > 0;
DELETE FROM training_participants WHERE id > 0;
DELETE FROM trainings WHERE id > 0;

-- ============================================================================
-- STEP 7: CLEAR AUDIT AND TRACKING DATA
-- ============================================================================

-- Clear audit logs
DELETE FROM access_audit_log WHERE id > 0;
DELETE FROM status_history WHERE id > 0;
DELETE FROM performance_comments WHERE id > 0;

-- Clear time tracking
DELETE FROM time_entries WHERE id > 0;
DELETE FROM tasks WHERE id > 0;

-- ============================================================================
-- STEP 8: RESET AUTO_INCREMENT VALUES
-- ============================================================================

ALTER TABLE access_audit_log AUTO_INCREMENT = 1;
ALTER TABLE activities AUTO_INCREMENT = 1;
ALTER TABLE activity_beneficiaries AUTO_INCREMENT = 1;
ALTER TABLE activity_checklists AUTO_INCREMENT = 1;
ALTER TABLE activity_expenses AUTO_INCREMENT = 1;
ALTER TABLE activity_risks AUTO_INCREMENT = 1;
ALTER TABLE agricultural_plots AUTO_INCREMENT = 1;
ALTER TABLE assumptions AUTO_INCREMENT = 1;
ALTER TABLE attachments AUTO_INCREMENT = 1;
ALTER TABLE beneficiaries AUTO_INCREMENT = 1;
ALTER TABLE budget_revisions AUTO_INCREMENT = 1;
ALTER TABLE businesses AUTO_INCREMENT = 1;
ALTER TABLE capacity_building_participants AUTO_INCREMENT = 1;
ALTER TABLE capacity_building_programs AUTO_INCREMENT = 1;
ALTER TABLE comments AUTO_INCREMENT = 1;
ALTER TABLE component_budgets AUTO_INCREMENT = 1;
ALTER TABLE crop_production AUTO_INCREMENT = 1;
ALTER TABLE finance_approvals AUTO_INCREMENT = 1;
ALTER TABLE financial_transactions AUTO_INCREMENT = 1;
ALTER TABLE gbv_case_notes AUTO_INCREMENT = 1;
ALTER TABLE gbv_cases AUTO_INCREMENT = 1;
ALTER TABLE indicator_activity_links AUTO_INCREMENT = 1;
ALTER TABLE indicator_values AUTO_INCREMENT = 1;
ALTER TABLE indicators AUTO_INCREMENT = 1;
ALTER TABLE loan_repayments AUTO_INCREMENT = 1;
ALTER TABLE loans AUTO_INCREMENT = 1;
ALTER TABLE me_reports AUTO_INCREMENT = 1;
ALTER TABLE me_results AUTO_INCREMENT = 1;
ALTER TABLE means_of_verification AUTO_INCREMENT = 1;
ALTER TABLE nutrition_assessments AUTO_INCREMENT = 1;
ALTER TABLE performance_comments AUTO_INCREMENT = 1;
ALTER TABLE program_budgets AUTO_INCREMENT = 1;
ALTER TABLE programs AUTO_INCREMENT = 1;
ALTER TABLE project_components AUTO_INCREMENT = 1;
ALTER TABLE projects AUTO_INCREMENT = 1;
ALTER TABLE relief_beneficiaries AUTO_INCREMENT = 1;
ALTER TABLE relief_distributions AUTO_INCREMENT = 1;
ALTER TABLE resource_maintenance AUTO_INCREMENT = 1;
ALTER TABLE resource_requests AUTO_INCREMENT = 1;
ALTER TABLE resources AUTO_INCREMENT = 1;
ALTER TABLE results_chain AUTO_INCREMENT = 1;
ALTER TABLE shg_members AUTO_INCREMENT = 1;
ALTER TABLE status_history AUTO_INCREMENT = 1;
ALTER TABLE sub_activities AUTO_INCREMENT = 1;
ALTER TABLE sub_programs AUTO_INCREMENT = 1;
ALTER TABLE tasks AUTO_INCREMENT = 1;
ALTER TABLE time_entries AUTO_INCREMENT = 1;
ALTER TABLE training_participants AUTO_INCREMENT = 1;
ALTER TABLE trainings AUTO_INCREMENT = 1;
ALTER TABLE user_module_assignments AUTO_INCREMENT = 1;
ALTER TABLE user_roles AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 2; -- Start from 2 since ID 1 exists

-- ============================================================================
-- STEP 9: RE-ENABLE FOREIGN KEY CHECKS
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- VERIFICATION: Check what remains
-- ============================================================================

SELECT '
╔════════════════════════════════════════════════════════════════╗
║              CLEANUP VERIFICATION                               ║
╚════════════════════════════════════════════════════════════════╝
' as section;

SELECT 'USERS' as category, COUNT(*) as count FROM users
UNION ALL SELECT '--- PRESERVED SYSTEM DATA ---', NULL
UNION ALL SELECT 'Organizations', COUNT(*) FROM organizations
UNION ALL SELECT 'Program Modules', COUNT(*) FROM program_modules
UNION ALL SELECT 'Roles', COUNT(*) FROM roles
UNION ALL SELECT 'Permissions', COUNT(*) FROM permissions
UNION ALL SELECT 'Resource Types', COUNT(*) FROM resource_types
UNION ALL SELECT '--- CLEARED TEST DATA ---', NULL
UNION ALL SELECT 'Activities', COUNT(*) FROM activities
UNION ALL SELECT 'Programs', COUNT(*) FROM programs
UNION ALL SELECT 'Components', COUNT(*) FROM project_components
UNION ALL SELECT 'Budgets', COUNT(*) FROM program_budgets
UNION ALL SELECT 'Transactions', COUNT(*) FROM financial_transactions
UNION ALL SELECT 'Resources', COUNT(*) FROM resources
UNION ALL SELECT 'Beneficiaries', COUNT(*) FROM beneficiaries;

-- Show the remaining admin user
SELECT '
╔════════════════════════════════════════════════════════════════╗
║              REMAINING ADMIN USER                               ║
╚════════════════════════════════════════════════════════════════╝
' as section;

SELECT id, email, full_name, is_system_admin FROM users;

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
SELECT '
╔════════════════════════════════════════════════════════════════╗
║              DATABASE CLEANUP COMPLETED                         ║
╠════════════════════════════════════════════════════════════════╣
║  ✓ All test data has been removed                             ║
║  ✓ User ID 1 (admin) preserved                                ║
║  ✓ System configuration intact                                ║
║  ✓ Database ready for production                              ║
║                                                                 ║
║  NEXT STEPS:                                                   ║
║  1. Verify the admin user above can login                     ║
║  2. Create new production users                               ║
║  3. Set up programs, components, and activities               ║
║  4. Configure module assignments                              ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
' as completion_message;
