-- Enhanced User Roles System
-- This migration creates a comprehensive role-based access control system

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    scope ENUM('global', 'module', 'component', 'activity') DEFAULT 'global',
    level INT NOT NULL COMMENT 'Lower number = higher authority (1=highest)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_roles junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Insert comprehensive roles
-- Clear existing roles first (optional - comment out if you want to preserve existing data)
-- DELETE FROM user_roles;
-- DELETE FROM roles;

-- Level 1: System-wide Administration
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('system_admin', 'System Administrator', 'Full system access with all permissions', 'global', 1)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Level 2: Program/Module Management
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('program_director', 'Program Director', 'Oversees entire programs and strategic planning', 'global', 2),
('module_manager', 'Module Manager', 'Manages specific program modules', 'module', 2),
('me_director', 'M&E Director', 'Oversees all M&E activities and reporting', 'global', 2)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Level 3: Department/Unit Management
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('me_manager', 'M&E Manager', 'Manages M&E data collection and analysis', 'module', 3),
('finance_manager', 'Finance Manager', 'Manages budgets and financial tracking', 'module', 3),
('logistics_manager', 'Logistics Manager', 'Manages logistics and procurement', 'module', 3),
('program_manager', 'Program Manager', 'Manages program implementation', 'module', 3)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Level 4: Officers and Specialists
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('me_officer', 'M&E Officer', 'Collects and validates M&E data', 'component', 4),
('data_analyst', 'Data Analyst', 'Analyzes data and generates reports', 'component', 4),
('finance_officer', 'Finance Officer', 'Handles financial transactions and reporting', 'component', 4),
('procurement_officer', 'Procurement Officer', 'Manages procurement processes', 'component', 4),
('program_officer', 'Program Officer', 'Implements program activities', 'component', 4),
('technical_advisor', 'Technical Advisor', 'Provides technical guidance and support', 'component', 4)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Level 5: Field Staff
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('field_officer', 'Field Officer', 'Implements field activities and collects data', 'activity', 5),
('community_mobilizer', 'Community Mobilizer', 'Mobilizes communities and facilitates activities', 'activity', 5),
('data_entry_officer', 'Data Entry Officer', 'Enters and validates field data', 'activity', 5),
('enumerator', 'Enumerator', 'Conducts surveys and data collection', 'activity', 5)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Level 6: Specialized Roles
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('approver', 'Approver', 'Reviews and approves activities and reports', 'module', 6),
('report_viewer', 'Report Viewer', 'View-only access to reports and dashboards', 'global', 6),
('external_auditor', 'External Auditor', 'Audits program data and compliance', 'global', 6)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Module-specific roles
INSERT INTO roles (name, display_name, description, scope, level) VALUES
('gbv_specialist', 'GBV Specialist', 'Specialized in Gender-Based Violence programs', 'module', 4),
('nutrition_specialist', 'Nutrition Specialist', 'Specialized in Nutrition programs', 'module', 4),
('agriculture_specialist', 'Agriculture Specialist', 'Specialized in Agriculture programs', 'module', 4),
('relief_coordinator', 'Relief Coordinator', 'Coordinates relief and emergency response', 'module', 3),
('seep_coordinator', 'SEEP Coordinator', 'Coordinates SEEP economic empowerment activities', 'module', 3)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    description = VALUES(description),
    scope = VALUES(scope),
    level = VALUES(level);

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL COMMENT 'e.g., activities, reports, users',
    action VARCHAR(50) NOT NULL COMMENT 'e.g., create, read, update, delete, approve',
    description TEXT,
    applies_to ENUM('global', 'module', 'component', 'activity') DEFAULT 'global',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Insert basic permissions
INSERT INTO permissions (name, resource, action, description, applies_to) VALUES
-- User management
('users.create', 'users', 'create', 'Create new users', 'global'),
('users.read', 'users', 'read', 'View user information', 'global'),
('users.update', 'users', 'update', 'Update user information', 'global'),
('users.delete', 'users', 'delete', 'Delete users', 'global'),

-- Activity management
('activities.create', 'activities', 'create', 'Create new activities', 'module'),
('activities.read', 'activities', 'read', 'View activities', 'module'),
('activities.update', 'activities', 'update', 'Update activities', 'module'),
('activities.delete', 'activities', 'delete', 'Delete activities', 'module'),
('activities.approve', 'activities', 'approve', 'Approve activities', 'module'),

-- Report management
('reports.create', 'reports', 'create', 'Create reports', 'module'),
('reports.read', 'reports', 'read', 'View reports', 'module'),
('reports.update', 'reports', 'update', 'Update reports', 'module'),
('reports.delete', 'reports', 'delete', 'Delete reports', 'module'),
('reports.export', 'reports', 'export', 'Export reports', 'module'),

-- Module management
('modules.create', 'modules', 'create', 'Create program modules', 'global'),
('modules.read', 'modules', 'read', 'View program modules', 'global'),
('modules.update', 'modules', 'update', 'Update program modules', 'global'),
('modules.delete', 'modules', 'delete', 'Delete program modules', 'global'),

-- Settings management
('settings.read', 'settings', 'read', 'View system settings', 'global'),
('settings.update', 'settings', 'update', 'Update system settings', 'global')
ON DUPLICATE KEY UPDATE
    resource = VALUES(resource),
    action = VALUES(action),
    description = VALUES(description),
    applies_to = VALUES(applies_to);

-- Grant permissions to roles (examples - customize as needed)
-- System Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'system_admin'
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;

-- Program Director gets most permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'program_director'
AND p.name NOT LIKE 'users.%'
AND p.name NOT LIKE 'settings.%'
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;

-- Field Officer gets basic activity permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'field_officer'
AND (
    p.name IN ('activities.create', 'activities.read', 'activities.update', 'reports.read')
)
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;

-- Report Viewer gets read-only permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'report_viewer'
AND p.action = 'read'
ON DUPLICATE KEY UPDATE granted_at = CURRENT_TIMESTAMP;
