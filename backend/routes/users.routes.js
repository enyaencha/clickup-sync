const express = require('express');
const bcrypt = require('bcryptjs');

module.exports = (db, authService, authMiddleware) => {
    const router = express.Router();

    // Middleware to require authentication
    router.use(authMiddleware);

    /**
     * GET /api/users
     * Get all users (with their roles)
     */
    router.get('/', async (req, res) => {
        try {
            // Check permission
            if (!req.user.is_system_admin && !authService.hasPermissionSync(req.user, 'users', 'read')) {
                return res.status(403).json({
                    success: false,
                    error: 'You do not have permission to view users'
                });
            }

            const users = await db.query(`
                SELECT
                    u.id,
                    u.username,
                    u.email,
                    u.full_name,
                    u.profile_picture,
                    u.is_active,
                    u.is_system_admin,
                    u.role,
                    u.last_login_at,
                    u.created_at
                FROM users u
                ORDER BY u.created_at DESC
            `);

            // Get roles for each user
            for (let user of users) {
                const userRoles = await db.query(`
                    SELECT r.id, r.name, r.display_name, r.scope, r.level
                    FROM user_roles ur
                    JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = ?
                    ORDER BY r.level ASC
                `, [user.id]);

                user.roles = userRoles;
            }

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch users'
            });
        }
    });

    /**
     * GET /api/users/:id
     * Get a single user by ID
     */
    router.get('/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Check permission (users can view their own profile)
            if (req.user.id !== userId && !req.user.is_system_admin) {
                return res.status(403).json({
                    success: false,
                    error: 'You do not have permission to view this user'
                });
            }

            const users = await db.query(`
                SELECT
                    u.id,
                    u.username,
                    u.email,
                    u.full_name,
                    u.profile_picture,
                    u.is_active,
                    u.is_system_admin,
                    u.role,
                    u.last_login_at,
                    u.created_at
                FROM users u
                WHERE u.id = ?
            `, [userId]);

            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const user = users[0];

            // Get roles
            const userRoles = await db.query(`
                SELECT r.id, r.name, r.display_name, r.scope, r.level
                FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = ?
                ORDER BY r.level ASC
            `, [userId]);

            user.roles = userRoles;

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user'
            });
        }
    });

    /**
     * POST /api/users
     * Create a new user
     */
    router.post('/', async (req, res) => {
        try {
            // Check permission
            if (!req.user.is_system_admin) {
                return res.status(403).json({
                    success: false,
                    error: 'Only system administrators can create users'
                });
            }

            const { username, email, password, full_name, is_system_admin, role_ids, is_active } = req.body;

            // Validation
            if (!username || !email || !password || !full_name) {
                return res.status(400).json({
                    success: false,
                    error: 'Username, email, password, and full name are required'
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    error: 'Password must be at least 8 characters long'
                });
            }

            // Check if user already exists
            const existingUsers = await db.query(
                'SELECT id FROM users WHERE email = ? OR username = ?',
                [email, username]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'User with this email or username already exists'
                });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const result = await db.query(`
                INSERT INTO users
                (username, email, password_hash, full_name, is_system_admin, is_active, role, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, 'field_officer', NOW(), NOW())
            `, [username, email, passwordHash, full_name, is_system_admin || false, is_active !== false]);

            const userId = result.insertId;

            // Assign roles
            if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
                for (let roleId of role_ids) {
                    await db.query(`
                        INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
                        VALUES (?, ?, ?, NOW())
                    `, [userId, roleId, req.user.id]);
                }
            }

            res.status(201).json({
                success: true,
                data: { id: userId },
                message: 'User created successfully'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create user'
            });
        }
    });

    /**
     * PUT /api/users/:id
     * Update a user
     */
    router.put('/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Check permission
            if (!req.user.is_system_admin && req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'You do not have permission to update this user'
                });
            }

            const { username, email, password, full_name, is_system_admin, role_ids, is_active } = req.body;

            // Check if user exists
            const existingUsers = await db.query(
                'SELECT id FROM users WHERE id = ?',
                [userId]
            );

            if (existingUsers.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Build update query
            let updateFields = [];
            let updateValues = [];

            if (username) {
                updateFields.push('username = ?');
                updateValues.push(username);
            }
            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }
            if (full_name) {
                updateFields.push('full_name = ?');
                updateValues.push(full_name);
            }
            if (password) {
                if (password.length < 8) {
                    return res.status(400).json({
                        success: false,
                        error: 'Password must be at least 8 characters long'
                    });
                }
                const passwordHash = await bcrypt.hash(password, 10);
                updateFields.push('password_hash = ?');
                updateValues.push(passwordHash);
            }

            // Only admins can change these
            if (req.user.is_system_admin) {
                if (is_system_admin !== undefined) {
                    updateFields.push('is_system_admin = ?');
                    updateValues.push(is_system_admin);
                }
                if (is_active !== undefined) {
                    updateFields.push('is_active = ?');
                    updateValues.push(is_active);
                }
            }

            updateFields.push('updated_at = NOW()');
            updateValues.push(userId);

            // Update user
            if (updateFields.length > 1) {
                await db.query(`
                    UPDATE users
                    SET ${updateFields.join(', ')}
                    WHERE id = ?
                `, updateValues);
            }

            // Update roles (only for admins)
            if (req.user.is_system_admin && role_ids !== undefined) {
                // Remove existing roles
                await db.query('DELETE FROM user_roles WHERE user_id = ?', [userId]);

                // Add new roles
                if (Array.isArray(role_ids) && role_ids.length > 0) {
                    for (let roleId of role_ids) {
                        await db.query(`
                            INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
                            VALUES (?, ?, ?, NOW())
                        `, [userId, roleId, req.user.id]);
                    }
                }
            }

            res.json({
                success: true,
                message: 'User updated successfully'
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update user'
            });
        }
    });

    /**
     * DELETE /api/users/:id
     * Delete a user (soft delete)
     */
    router.delete('/:id', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Check permission
            if (!req.user.is_system_admin) {
                return res.status(403).json({
                    success: false,
                    error: 'Only system administrators can delete users'
                });
            }

            // Prevent self-deletion
            if (req.user.id === userId) {
                return res.status(400).json({
                    success: false,
                    error: 'You cannot delete your own account'
                });
            }

            // Deactivate user (soft delete)
            await db.query(`
                UPDATE users
                SET is_active = false
                WHERE id = ?
            `, [userId]);

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete user'
            });
        }
    });

    /**
     * PATCH /api/users/:id/status
     * Toggle user active status
     */
    router.patch('/:id/status', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const { is_active } = req.body;

            // Check permission
            if (!req.user.is_system_admin) {
                return res.status(403).json({
                    success: false,
                    error: 'Only system administrators can change user status'
                });
            }

            // Prevent deactivating self
            if (req.user.id === userId && !is_active) {
                return res.status(400).json({
                    success: false,
                    error: 'You cannot deactivate your own account'
                });
            }

            await db.query(`
                UPDATE users
                SET is_active = ?, updated_at = NOW()
                WHERE id = ?
            `, [is_active, userId]);

            res.json({
                success: true,
                message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update user status'
            });
        }
    });

    return router;
};
