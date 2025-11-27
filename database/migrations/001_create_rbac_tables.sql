-- ============================================
-- RBAC + RLS Database Migration
-- Phase 1: Core Authentication & Authorization Tables
-- ============================================

USE me_clickup_system;

-- ============================================
-- 1. EXTEND USERS TABLE
-- ============================================

-- Add system admin flag to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_system_admin BOOLEAN DEFAULT false COMMENT 'System-wide admin flag' AFTER is_active;

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_is_system_admin ON users(is_system_admin);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- ============================================
-- 2. ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Internal role name (e.g., system_admin)',
  display_name VARCHAR(100) NOT NULL COMMENT 'Display name (e.g., System Administrator)',
  description TEXT COMMENT 'Role description',
  scope ENUM('system', 'module') NOT NULL DEFAULT 'module' COMMENT 'System-wide or module-specific',
  level INT NOT NULL DEFAULT 10 COMMENT 'Hierarchy level (1=highest, 10=lowest)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scope (scope),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User roles for RBAC system';

-- ============================================
-- 3. PERMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL COMMENT 'Permission identifier',
  resource VARCHAR(50) NOT NULL COMMENT 'Resource: activities, verifications, etc.',
  action VARCHAR(50) NOT NULL COMMENT 'Action: create, read, update, delete, approve',
  description TEXT COMMENT 'Permission description',
  applies_to ENUM('all', 'own', 'module', 'team') DEFAULT 'all' COMMENT 'Scope of permission',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_resource_action (resource, action),
  INDEX idx_applies_to (applies_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Available permissions in the system';

-- ============================================
-- 4. ROLE_PERMISSIONS (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
  UNIQUE KEY unique_role_permission (role_id, permission_id),
  INDEX idx_role (role_id),
  INDEX idx_permission (permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Maps permissions to roles';

-- ============================================
-- 5. USER_ROLES (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  assigned_by INT COMMENT 'User ID who assigned this role',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NULL COMMENT 'Optional role expiration',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_role (user_id, role_id),
  INDEX idx_user (user_id),
  INDEX idx_role (role_id),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Maps users to their roles';

-- ============================================
-- 6. USER_MODULE_ASSIGNMENTS (RLS)
-- ============================================

CREATE TABLE IF NOT EXISTS user_module_assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  module_id INT NOT NULL COMMENT 'References programs table (modules)',
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  assigned_by INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES programs(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_module (user_id, module_id),
  INDEX idx_user (user_id),
  INDEX idx_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User access to specific modules (RLS)';

-- ============================================
-- 7. USER_HIERARCHY (Team Structure for RLS)
-- ============================================

CREATE TABLE IF NOT EXISTS user_hierarchy (
  id INT PRIMARY KEY AUTO_INCREMENT,
  supervisor_id INT NOT NULL,
  subordinate_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subordinate_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_hierarchy (supervisor_id, subordinate_id),
  INDEX idx_supervisor (supervisor_id),
  INDEX idx_subordinate (subordinate_id),
  CHECK (supervisor_id != subordinate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Supervisor-subordinate relationships for team-based RLS';

-- ============================================
-- 8. USER_SESSIONS (JWT Token Management)
-- ============================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL COMMENT 'JWT token',
  refresh_token VARCHAR(500) UNIQUE COMMENT 'Refresh token',
  expires_at DATETIME NOT NULL,
  refresh_expires_at DATETIME COMMENT 'Refresh token expiry',
  ip_address VARCHAR(45) COMMENT 'IPv4 or IPv6',
  user_agent TEXT COMMENT 'Browser/client info',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_user_active (user_id, is_active),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Active user sessions and JWT tokens';

-- ============================================
-- 9. ACCESS_AUDIT_LOG (RLS Audit Trail)
-- ============================================

CREATE TABLE IF NOT EXISTS access_audit_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL COMMENT 'SELECT, INSERT, UPDATE, DELETE, LOGIN, etc.',
  resource VARCHAR(50) NOT NULL COMMENT 'Table/resource accessed',
  resource_id INT COMMENT 'ID of the record accessed',
  module_id INT COMMENT 'Module context if applicable',
  access_granted BOOLEAN NOT NULL,
  denial_reason VARCHAR(255) COMMENT 'Reason if access denied',
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_data JSON COMMENT 'Additional request metadata',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_action (user_id, action),
  INDEX idx_resource (resource, resource_id),
  INDEX idx_created_at (created_at),
  INDEX idx_access_granted (access_granted),
  INDEX idx_module (module_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Audit log for access control and RLS';

-- ============================================
-- 10. ADD OWNERSHIP COLUMNS TO EXISTING TABLES
-- ============================================

-- Activities table
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS created_by INT COMMENT 'User who created this record' AFTER actual_beneficiaries,
ADD COLUMN IF NOT EXISTS owned_by INT COMMENT 'User who owns this record' AFTER created_by,
ADD COLUMN IF NOT EXISTS last_modified_by INT COMMENT 'User who last modified' AFTER owned_by;

CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by);
CREATE INDEX IF NOT EXISTS idx_activities_owned_by ON activities(owned_by);
CREATE INDEX IF NOT EXISTS idx_activities_module ON activities(component_id);

-- Means of Verification table
ALTER TABLE means_of_verification
ADD COLUMN IF NOT EXISTS created_by INT COMMENT 'User who created this record' AFTER notes,
ADD COLUMN IF NOT EXISTS owned_by INT COMMENT 'User who owns this record' AFTER created_by,
ADD COLUMN IF NOT EXISTS last_modified_by INT COMMENT 'User who last modified' AFTER owned_by;

CREATE INDEX IF NOT EXISTS idx_mov_created_by ON means_of_verification(created_by);
CREATE INDEX IF NOT EXISTS idx_mov_owned_by ON means_of_verification(owned_by);

-- Indicators table
ALTER TABLE indicators
ADD COLUMN IF NOT EXISTS created_by INT COMMENT 'User who created this record' AFTER notes,
ADD COLUMN IF NOT EXISTS owned_by INT COMMENT 'User who owns this record' AFTER created_by,
ADD COLUMN IF NOT EXISTS last_modified_by INT COMMENT 'User who last modified' AFTER owned_by;

CREATE INDEX IF NOT EXISTS idx_indicators_created_by ON indicators(created_by);
CREATE INDEX IF NOT EXISTS idx_indicators_owned_by ON indicators(owned_by);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

SELECT 'RBAC + RLS tables created successfully!' as status;
