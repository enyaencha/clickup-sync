-- ============================================
-- RBAC Seed Data
-- Roles and Permissions for M&E System
-- ============================================

USE me_clickup_system;

-- ============================================
-- 1. SEED ROLES
-- ============================================

INSERT INTO roles (name, display_name, description, scope, level) VALUES
-- System-Level Roles
('system_admin', 'System Administrator', 'Full system access and configuration', 'system', 1),
('me_director', 'M&E Director', 'Director-level access across all modules', 'system', 2),
('me_manager', 'M&E Manager', 'Manager-level access across all modules', 'system', 3),
('finance_officer', 'Finance Officer', 'Access to budget and financial data', 'system', 4),
('report_viewer', 'Report Viewer', 'Read-only access to reports', 'system', 5),

-- Module-Level Roles
('module_manager', 'Module Manager', 'Full control within assigned modules', 'module', 3),
('module_coordinator', 'Module Coordinator', 'Coordinate activities within modules', 'module', 4),
('field_officer', 'Field Officer', 'Field-level data collection and entry', 'module', 6),
('verification_officer', 'Verification Officer', 'Manage verification and evidence', 'module', 5),
('data_entry_clerk', 'Data Entry Clerk', 'Basic data entry only', 'module', 8),
('module_viewer', 'Module Viewer', 'Read-only access to module data', 'module', 9)
ON DUPLICATE KEY UPDATE
  display_name = VALUES(display_name),
  description = VALUES(description),
  scope = VALUES(scope),
  level = VALUES(level);

-- ============================================
-- 2. SEED PERMISSIONS
-- ============================================

INSERT INTO permissions (name, resource, action, description, applies_to) VALUES
-- Activities Permissions
('activities.create', 'activities', 'create', 'Create new activities', 'module'),
('activities.read.all', 'activities', 'read', 'View all activities', 'all'),
('activities.read.own', 'activities', 'read', 'View own activities', 'own'),
('activities.read.module', 'activities', 'read', 'View module activities', 'module'),
('activities.update.all', 'activities', 'update', 'Edit all activities', 'all'),
('activities.update.own', 'activities', 'update', 'Edit own activities', 'own'),
('activities.update.module', 'activities', 'update', 'Edit module activities', 'module'),
('activities.delete.all', 'activities', 'delete', 'Delete all activities', 'all'),
('activities.delete.own', 'activities', 'delete', 'Delete own activities', 'own'),
('activities.approve', 'activities', 'approve', 'Approve activities', 'module'),
('activities.reject', 'activities', 'reject', 'Reject activities', 'module'),
('activities.submit', 'activities', 'submit', 'Submit for approval', 'own'),

-- Verifications Permissions
('verifications.create', 'verifications', 'create', 'Create verifications', 'module'),
('verifications.read.all', 'verifications', 'read', 'View all verifications', 'all'),
('verifications.read.module', 'verifications', 'read', 'View module verifications', 'module'),
('verifications.update.all', 'verifications', 'update', 'Edit all verifications', 'all'),
('verifications.update.module', 'verifications', 'update', 'Edit module verifications', 'module'),
('verifications.delete.all', 'verifications', 'delete', 'Delete all verifications', 'all'),
('verifications.verify', 'verifications', 'verify', 'Verify evidence', 'module'),
('verifications.reject', 'verifications', 'reject', 'Reject evidence', 'module'),

-- Indicators Permissions
('indicators.create', 'indicators', 'create', 'Create indicators', 'module'),
('indicators.read.all', 'indicators', 'read', 'View all indicators', 'all'),
('indicators.read.module', 'indicators', 'read', 'View module indicators', 'module'),
('indicators.update.all', 'indicators', 'update', 'Edit all indicators', 'all'),
('indicators.update.module', 'indicators', 'update', 'Edit module indicators', 'module'),
('indicators.delete.all', 'indicators', 'delete', 'Delete all indicators', 'all'),

-- Settings Permissions
('settings.view', 'settings', 'read', 'View settings', 'all'),
('settings.manage', 'settings', 'manage', 'Manage system settings', 'all'),

-- Users Permissions
('users.create', 'users', 'create', 'Create users', 'all'),
('users.read.all', 'users', 'read', 'View all users', 'all'),
('users.read.team', 'users', 'read', 'View team members', 'team'),
('users.update.all', 'users', 'update', 'Edit all users', 'all'),
('users.delete', 'users', 'delete', 'Delete users', 'all'),
('users.manage_roles', 'users', 'manage', 'Assign roles to users', 'all'),

-- Reports Permissions
('reports.view.all', 'reports', 'read', 'View all reports', 'all'),
('reports.view.module', 'reports', 'read', 'View module reports', 'module'),
('reports.export', 'reports', 'export', 'Export reports', 'module'),

-- Budget Permissions
('budget.view.all', 'budget', 'read', 'View all budgets', 'all'),
('budget.view.module', 'budget', 'read', 'View module budgets', 'module'),
('budget.update.all', 'budget', 'update', 'Edit all budgets', 'all'),
('budget.update.module', 'budget', 'update', 'Edit module budgets', 'module'),

-- Modules Permissions
('modules.read', 'modules', 'read', 'View modules', 'all'),
('modules.manage', 'modules', 'manage', 'Manage modules', 'all')
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  applies_to = VALUES(applies_to);

-- ============================================
-- 3. ASSIGN PERMISSIONS TO ROLES
-- ============================================

-- System Administrator - ALL PERMISSIONS
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'system_admin';

-- M&E Director - Full access except user management
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'me_director'
  AND p.name IN (
    'activities.read.all', 'activities.update.all', 'activities.approve', 'activities.reject',
    'verifications.read.all', 'verifications.update.all', 'verifications.verify', 'verifications.reject',
    'indicators.read.all', 'indicators.update.all',
    'settings.view',
    'users.read.all', 'users.read.team',
    'reports.view.all', 'reports.export',
    'budget.view.all',
    'modules.read'
  );

-- M&E Manager
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'me_manager'
  AND p.name IN (
    'activities.read.all', 'activities.update.all', 'activities.approve', 'activities.reject',
    'verifications.read.all', 'verifications.update.all', 'verifications.verify', 'verifications.reject',
    'indicators.read.all', 'indicators.update.module',
    'settings.view',
    'users.read.team',
    'reports.view.all', 'reports.export',
    'budget.view.all',
    'modules.read'
  );

-- Finance Officer
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'finance_officer'
  AND p.name IN (
    'activities.read.all',
    'verifications.read.all',
    'indicators.read.all',
    'reports.view.all', 'reports.export',
    'budget.view.all', 'budget.update.all'
  );

-- Report Viewer
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'report_viewer'
  AND p.name IN (
    'activities.read.all',
    'verifications.read.all',
    'indicators.read.all',
    'reports.view.all', 'reports.export',
    'budget.view.all'
  );

-- Module Manager
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'module_manager'
  AND p.name IN (
    'activities.create', 'activities.read.module', 'activities.update.module', 'activities.delete.own', 'activities.approve', 'activities.reject',
    'verifications.create', 'verifications.read.module', 'verifications.update.module', 'verifications.delete.all', 'verifications.verify', 'verifications.reject',
    'indicators.create', 'indicators.read.module', 'indicators.update.module', 'indicators.delete.all',
    'users.read.team',
    'reports.view.module', 'reports.export',
    'budget.view.module', 'budget.update.module'
  );

-- Module Coordinator
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'module_coordinator'
  AND p.name IN (
    'activities.create', 'activities.read.module', 'activities.update.own', 'activities.submit',
    'verifications.create', 'verifications.read.module', 'verifications.update.module',
    'indicators.create', 'indicators.read.module', 'indicators.update.module',
    'users.read.team',
    'reports.view.module',
    'budget.view.module'
  );

-- Field Officer
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'field_officer'
  AND p.name IN (
    'activities.create', 'activities.read.own', 'activities.update.own', 'activities.submit',
    'verifications.create', 'verifications.read.module',
    'indicators.read.module',
    'reports.view.module'
  );

-- Verification Officer
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'verification_officer'
  AND p.name IN (
    'activities.read.module',
    'verifications.create', 'verifications.read.module', 'verifications.update.module', 'verifications.verify', 'verifications.reject',
    'indicators.read.module',
    'reports.view.module'
  );

-- Data Entry Clerk
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'data_entry_clerk'
  AND p.name IN (
    'activities.create', 'activities.read.own',
    'verifications.create',
    'indicators.read.module'
  );

-- Module Viewer
INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'module_viewer'
  AND p.name IN (
    'activities.read.module',
    'verifications.read.module',
    'indicators.read.module',
    'reports.view.module',
    'budget.view.module'
  );

-- ============================================
-- 4. MIGRATE EXISTING USERS TO NEW ROLE SYSTEM
-- ============================================

-- Map old ENUM roles to new role system
INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
SELECT
  u.id,
  r.id,
  NULL as assigned_by,
  NOW() as assigned_at
FROM users u
CROSS JOIN roles r
WHERE u.role = 'admin' AND r.name = 'system_admin'
   OR u.role = 'program_manager' AND r.name = 'module_manager'
   OR u.role = 'me_officer' AND r.name = 'me_manager'
   OR u.role = 'field_officer' AND r.name = 'field_officer'
   OR u.role = 'viewer' AND r.name = 'report_viewer'
ON DUPLICATE KEY UPDATE assigned_at = NOW();

-- Set is_system_admin flag for admin users
UPDATE users SET is_system_admin = true WHERE role = 'admin';

-- ============================================
-- SEED COMPLETE
-- ============================================

SELECT 'Roles and permissions seeded successfully!' as status;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_permissions FROM permissions;
SELECT COUNT(*) as total_role_permissions FROM role_permissions;
SELECT COUNT(*) as users_migrated FROM user_roles;
