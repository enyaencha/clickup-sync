const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../core/utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthService {
    constructor(db) {
        this.db = db;
        this.saltRounds = 10;
    }

    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const { username, email, password, full_name, role = 'field_officer' } = userData;

            // Check if user already exists
            const existingUser = await this.db.query(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUser.length > 0) {
                throw new Error('User with this email or username already exists');
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, this.saltRounds);

            // Insert user
            const result = await this.db.query(
                `INSERT INTO users (username, email, password_hash, full_name, role, is_active, sync_status)
                 VALUES (?, ?, ?, ?, ?, true, 'pending')`,
                [username, email, password_hash, full_name, role]
            );

            const userId = result.insertId;

            // Assign default role based on role ENUM
            await this.assignDefaultRole(userId, role);

            logger.info(`User registered: ${email} (ID: ${userId})`);

            return {
                id: userId,
                username,
                email,
                full_name,
                role
            };
        } catch (error) {
            logger.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Assign default role to new user based on old ENUM role
     */
    async assignDefaultRole(userId, oldRole) {
        const roleMapping = {
            'admin': 'system_admin',
            'program_manager': 'module_manager',
            'me_officer': 'me_manager',
            'field_officer': 'field_officer',
            'viewer': 'report_viewer'
        };

        const newRoleName = roleMapping[oldRole] || 'field_officer';

        try {
            const role = await this.db.query(
                'SELECT id FROM roles WHERE name = ?',
                [newRoleName]
            );

            if (role.length > 0) {
                await this.db.query(
                    'INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)',
                    [userId, role[0].id]
                );
            }
        } catch (error) {
            logger.error('Error assigning default role:', error);
        }
    }

    /**
     * Login user
     */
    async login(email, password, ipAddress = null, userAgent = null) {
        try {
            // Get user by email
            const users = await this.db.query(
                `SELECT id, username, email, password_hash, full_name, profile_picture,
                        role, is_active, is_system_admin
                 FROM users
                 WHERE email = ? AND is_active = true`,
                [email]
            );

            if (users.length === 0) {
                throw new Error('Invalid email or password');
            }

            const user = users[0];

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordValid) {
                await this.logAccess(user.id, 'LOGIN', 'users', user.id, false, 'Invalid password', ipAddress);
                throw new Error('Invalid email or password');
            }

            // Get user's roles and permissions
            const rolesAndPermissions = await this.getUserRolesAndPermissions(user.id);

            // Get user's module assignments
            const moduleAssignments = await this.getUserModuleAssignments(user.id);

            // Generate tokens
            const { token, refreshToken } = await this.generateTokens(user, ipAddress, userAgent);

            // Update last login
            await this.db.query(
                'UPDATE users SET last_login_at = NOW() WHERE id = ?',
                [user.id]
            );

            // Log successful login
            await this.logAccess(user.id, 'LOGIN', 'users', user.id, true, null, ipAddress);

            logger.info(`User logged in: ${email} (ID: ${user.id})`);

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    profile_picture: user.profile_picture,
                    role: user.role, // Old ENUM role for backward compatibility
                    is_system_admin: user.is_system_admin,
                    roles: rolesAndPermissions.roles,
                    permissions: rolesAndPermissions.permissions,
                    module_assignments: moduleAssignments
                },
                token,
                refreshToken
            };
        } catch (error) {
            logger.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Get user's roles and permissions
     */
    async getUserRolesAndPermissions(userId) {
        try {
            // Get roles
            const roles = await this.db.query(
                `SELECT r.id, r.name, r.display_name, r.description, r.scope, r.level
                 FROM user_roles ur
                 JOIN roles r ON ur.role_id = r.id
                 WHERE ur.user_id = ?
                 AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
                 ORDER BY r.level ASC`,
                [userId]
            );

            // Get permissions for these roles
            const roleIds = roles.map(r => r.id);
            let permissions = [];

            if (roleIds.length > 0) {
                permissions = await this.db.query(
                    `SELECT DISTINCT p.id, p.name, p.resource, p.action, p.description, p.applies_to
                     FROM role_permissions rp
                     JOIN permissions p ON rp.permission_id = p.id
                     WHERE rp.role_id IN (?)`,
                    [roleIds]
                );
            }

            return {
                roles,
                permissions
            };
        } catch (error) {
            logger.error('Error getting roles and permissions:', error);
            return { roles: [], permissions: [] };
        }
    }

    /**
     * Get user's module assignments
     */
    async getUserModuleAssignments(userId) {
        try {
            const assignments = await this.db.query(
                `SELECT uma.module_id, p.name as module_name,
                        uma.can_view, uma.can_create, uma.can_edit,
                        uma.can_delete, uma.can_approve
                 FROM user_module_assignments uma
                 JOIN programs p ON uma.module_id = p.id
                 WHERE uma.user_id = ?`,
                [userId]
            );

            return assignments;
        } catch (error) {
            logger.error('Error getting module assignments:', error);
            return [];
        }
    }

    /**
     * Generate JWT tokens
     */
    async generateTokens(user, ipAddress = null, userAgent = null) {
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            username: user.username,
            is_system_admin: user.is_system_admin
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

        // Calculate expiry dates
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

        const refreshExpiresAt = new Date();
        refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days

        // Store session
        await this.db.query(
            `INSERT INTO user_sessions (user_id, token, refresh_token, expires_at, refresh_expires_at, ip_address, user_agent)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.id, token, refreshToken, expiresAt, refreshExpiresAt, ipAddress, userAgent]
        );

        return { token, refreshToken };
    }

    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        } catch (error) {
            logger.error('Token verification error:', error.message);
            return null;
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(refreshToken) {
        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, JWT_SECRET);

            // Check if session exists and is active
            const sessions = await this.db.query(
                `SELECT user_id FROM user_sessions
                 WHERE refresh_token = ? AND is_active = true
                 AND refresh_expires_at > NOW()`,
                [refreshToken]
            );

            if (sessions.length === 0) {
                throw new Error('Invalid or expired refresh token');
            }

            // Get user
            const users = await this.db.query(
                `SELECT id, username, email, is_system_admin
                 FROM users WHERE id = ? AND is_active = true`,
                [decoded.userId]
            );

            if (users.length === 0) {
                throw new Error('User not found or inactive');
            }

            const user = users[0];

            // Generate new access token
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                username: user.username,
                is_system_admin: user.is_system_admin
            };

            const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            // Update session with new token
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);

            await this.db.query(
                `UPDATE user_sessions
                 SET token = ?, expires_at = ?
                 WHERE refresh_token = ?`,
                [newToken, expiresAt, refreshToken]
            );

            return newToken;
        } catch (error) {
            logger.error('Token refresh error:', error);
            throw new Error('Failed to refresh token');
        }
    }

    /**
     * Logout user
     */
    async logout(token) {
        try {
            await this.db.query(
                'UPDATE user_sessions SET is_active = false WHERE token = ?',
                [token]
            );

            logger.info('User logged out');
            return true;
        } catch (error) {
            logger.error('Logout error:', error);
            throw error;
        }
    }

    /**
     * Get current user by token
     */
    async getCurrentUser(token) {
        try {
            const decoded = this.verifyToken(token);
            if (!decoded) {
                throw new Error('Invalid token');
            }

            // Check if session is active
            const sessions = await this.db.query(
                `SELECT user_id FROM user_sessions
                 WHERE token = ? AND is_active = true AND expires_at > NOW()`,
                [token]
            );

            if (sessions.length === 0) {
                throw new Error('Session expired or invalid');
            }

            // Get user with roles and permissions
            const users = await this.db.query(
                `SELECT id, username, email, full_name, profile_picture,
                        role, is_active, is_system_admin
                 FROM users
                 WHERE id = ? AND is_active = true`,
                [decoded.userId]
            );

            if (users.length === 0) {
                throw new Error('User not found');
            }

            const user = users[0];
            const rolesAndPermissions = await this.getUserRolesAndPermissions(user.id);
            const moduleAssignments = await this.getUserModuleAssignments(user.id);

            return {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                profile_picture: user.profile_picture,
                role: user.role,
                is_system_admin: user.is_system_admin,
                roles: rolesAndPermissions.roles,
                permissions: rolesAndPermissions.permissions,
                module_assignments: moduleAssignments
            };
        } catch (error) {
            logger.error('Get current user error:', error);
            throw error;
        }
    }

    /**
     * Log access for audit trail
     */
    async logAccess(userId, action, resource, resourceId = null, granted = true, reason = null, ipAddress = null) {
        try {
            await this.db.query(
                `INSERT INTO access_audit_log
                 (user_id, action, resource, resource_id, access_granted, denial_reason, ip_address)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [userId, action, resource, resourceId, granted, reason, ipAddress]
            );
        } catch (error) {
            logger.error('Error logging access:', error);
        }
    }

    /**
     * Check if user has permission
     */
    async checkPermission(userId, resource, action) {
        try {
            const permissions = await this.db.query(
                `SELECT p.id
                 FROM user_roles ur
                 JOIN role_permissions rp ON ur.role_id = rp.role_id
                 JOIN permissions p ON rp.permission_id = p.id
                 WHERE ur.user_id = ?
                 AND p.resource = ?
                 AND p.action = ?
                 AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
                 LIMIT 1`,
                [userId, resource, action]
            );

            return permissions.length > 0;
        } catch (error) {
            logger.error('Error checking permission:', error);
            return false;
        }
    }
}

module.exports = AuthService;
