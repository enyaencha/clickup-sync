-- SQL Script to Check Finance Data and User Permissions
-- Run this in MySQL to diagnose why Finance dashboard shows no data

-- ============================================
-- 1. CHECK USER MODULE ASSIGNMENTS
-- ============================================
SELECT
    u.id as user_id,
    u.email,
    u.full_name,
    u.is_system_admin,
    GROUP_CONCAT(pm.name) as assigned_modules,
    GROUP_CONCAT(pm.id) as module_ids
FROM users u
LEFT JOIN user_module_assignments uma ON u.id = uma.user_id AND uma.deleted_at IS NULL
LEFT JOIN program_modules pm ON uma.module_id = pm.id AND pm.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.full_name, u.is_system_admin;

-- ============================================
-- 2. CHECK FINANCE DATA EXISTS
-- ============================================

-- Check Program Budgets
SELECT
    'program_budgets' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status IN ('approved', 'active') THEN 1 END) as active_count,
    GROUP_CONCAT(DISTINCT program_module_id) as module_ids
FROM program_budgets
WHERE deleted_at IS NULL;

-- Check Financial Transactions
SELECT
    'financial_transactions' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN approval_status = 'approved' THEN 1 END) as approved_count
FROM financial_transactions
WHERE deleted_at IS NULL;

-- Check Finance Approvals
SELECT
    'finance_approvals' as table_name,
    COUNT(*) as total_count,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count
FROM finance_approvals
WHERE deleted_at IS NULL;

-- ============================================
-- 3. CHECK DETAILED BUDGET DATA
-- ============================================
SELECT
    pb.id,
    pb.program_module_id,
    pm.name as module_name,
    pb.fiscal_year,
    pb.total_budget,
    pb.status,
    pb.submitted_by
FROM program_budgets pb
LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
WHERE pb.deleted_at IS NULL
ORDER BY pb.created_at DESC
LIMIT 10;

-- ============================================
-- 4. CHECK IF USER CAN SEE ANY BUDGETS (RBAC)
-- ============================================
-- Replace YOUR_USER_ID with the actual user ID you're logged in as
SET @user_id = 1; -- CHANGE THIS TO YOUR USER ID
SET @is_admin = (SELECT is_system_admin FROM users WHERE id = @user_id);

SELECT
    pb.id,
    pb.program_module_id,
    pm.name as module_name,
    pb.fiscal_year,
    pb.total_budget,
    CASE
        WHEN @is_admin = 1 THEN 'Admin - Can See'
        WHEN uma.user_id IS NOT NULL THEN 'Assigned - Can See'
        ELSE 'NOT ASSIGNED - CANNOT SEE'
    END as visibility_status
FROM program_budgets pb
LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
LEFT JOIN user_module_assignments uma ON pb.program_module_id = uma.module_id
    AND uma.user_id = @user_id
    AND uma.deleted_at IS NULL
WHERE pb.deleted_at IS NULL
AND pb.status IN ('approved', 'active')
ORDER BY pb.created_at DESC
LIMIT 10;

-- ============================================
-- 5. FIX: Assign user to Finance module
-- ============================================
-- If you see "NOT ASSIGNED" above, run this to assign yourself to Finance (module_id = 6)
-- UNCOMMENT THE LINES BELOW AND CHANGE THE USER_ID

-- SET @user_to_assign = 1; -- CHANGE THIS TO YOUR USER ID
-- SET @finance_module_id = 6;

-- INSERT INTO user_module_assignments (user_id, module_id, role, can_edit, can_delete)
-- VALUES (@user_to_assign, @finance_module_id, 'manager', TRUE, TRUE)
-- ON DUPLICATE KEY UPDATE deleted_at = NULL;

-- SELECT 'User assigned to Finance module' as result;

-- ============================================
-- 6. CHECK PROGRAM MODULES
-- ============================================
SELECT
    id,
    name,
    code,
    icon,
    status,
    is_active
FROM program_modules
WHERE deleted_at IS NULL
ORDER BY id;
