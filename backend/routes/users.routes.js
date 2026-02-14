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
                WHERE u.deleted_at IS NULL
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
                WHERE u.id = ? AND u.deleted_at IS NULL
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
     * GET /api/users/:id/modules
     * Get user's module assignments
     */
    router.get('/:id/modules', async (req, res) => {
        try {
            const userId = parseInt(req.params.id);

            // Check permission (users can view their own modules)
            if (req.user.id !== userId && !req.user.is_system_admin) {
                return res.status(403).json({
                    success: false,
                    error: 'You do not have permission to view this user\'s modules'
                });
            }

            const modules = await db.query(`
                SELECT
                    uma.id,
                    uma.module_id,
                    uma.can_view,
                    uma.can_create,
                    uma.can_edit,
                    uma.can_delete,
                    uma.can_approve,
                    pm.name as module_name,
                    pm.description as module_description
                FROM user_module_assignments uma
                JOIN program_modules pm ON uma.module_id = pm.id
                WHERE uma.user_id = ?
                ORDER BY pm.name
            `, [userId]);

            res.json({
                success: true,
                data: modules
            });
        } catch (error) {
            console.error('Error fetching user modules:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user modules'
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

            const { username, email, password, full_name, is_system_admin, role_ids, is_active, module_permissions } = req.body;

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

            // Determine the primary role for the legacy role field
            let primaryRole = 'field_officer'; // Default fallback

            if (is_system_admin) {
                primaryRole = 'admin';
            } else if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
                // Get the role with the highest level (lowest level number = highest authority)
                const rolesData = await db.query(`
                    SELECT name, level
                    FROM roles
                    WHERE id IN (?)
                    ORDER BY level ASC
                    LIMIT 1
                `, [role_ids]);

                if (rolesData.length > 0) {
                    // Map new role names to legacy ENUM values
                    const roleMapping = {
                        'system_admin': 'admin',
                        'me_director': 'admin',
                        'program_director': 'program_manager',
                        'module_manager': 'program_manager',
                        'program_manager': 'program_manager',
                        'me_manager': 'me_officer',
                        'me_officer': 'me_officer',
                        'finance_manager': 'program_manager',
                        'logistics_manager': 'program_manager',
                        'data_analyst': 'me_officer',
                        'finance_officer': 'field_officer',
                        'procurement_officer': 'field_officer',
                        'program_officer': 'field_officer',
                        'technical_advisor': 'me_officer',
                        'field_officer': 'field_officer',
                        'community_mobilizer': 'field_officer',
                        'data_entry_officer': 'field_officer',
                        'data_entry_clerk': 'field_officer',
                        'enumerator': 'field_officer',
                        'module_coordinator': 'field_officer',
                        'verification_officer': 'field_officer',
                        'approver': 'me_officer',
                        'report_viewer': 'viewer',
                        'module_viewer': 'viewer',
                        'external_auditor': 'viewer',
                        'gbv_specialist': 'field_officer',
                        'nutrition_specialist': 'field_officer',
                        'agriculture_specialist': 'field_officer',
                        'relief_coordinator': 'program_manager',
                        'seep_coordinator': 'program_manager'
                    };

                    primaryRole = roleMapping[rolesData[0].name] || 'field_officer';
                }
            }

            // Create user
            const result = await db.query(`
                INSERT INTO users
                (username, email, password_hash, full_name, is_system_admin, is_active, role, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [username, email, passwordHash, full_name, is_system_admin || false, is_active !== false, primaryRole]);

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

            // Assign module permissions
            if (module_permissions && Array.isArray(module_permissions) && module_permissions.length > 0) {
                for (let perm of module_permissions) {
                    await db.query(`
                        INSERT INTO user_module_assignments
                        (user_id, module_id, can_view, can_create, can_edit, can_delete, can_approve, assigned_by, assigned_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    `, [
                        userId,
                        perm.module_id,
                        perm.can_view || false,
                        perm.can_create || false,
                        perm.can_edit || false,
                        perm.can_delete || false,
                        perm.can_approve || false,
                        req.user.id
                    ]);
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

            const { username, email, password, full_name, is_system_admin, role_ids, is_active, module_permissions } = req.body;

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

                    // Update the legacy role field based on selected roles
                    const rolesData = await db.query(`
                        SELECT name, level
                        FROM roles
                        WHERE id IN (?)
                        ORDER BY level ASC
                        LIMIT 1
                    `, [role_ids]);

                    if (rolesData.length > 0) {
                        const roleMapping = {
                            'system_admin': 'admin',
                            'me_director': 'admin',
                            'program_director': 'program_manager',
                            'module_manager': 'program_manager',
                            'program_manager': 'program_manager',
                            'me_manager': 'me_officer',
                            'me_officer': 'me_officer',
                            'finance_manager': 'program_manager',
                            'logistics_manager': 'program_manager',
                            'data_analyst': 'me_officer',
                            'finance_officer': 'field_officer',
                            'procurement_officer': 'field_officer',
                            'program_officer': 'field_officer',
                            'technical_advisor': 'me_officer',
                            'field_officer': 'field_officer',
                            'community_mobilizer': 'field_officer',
                            'data_entry_officer': 'field_officer',
                            'data_entry_clerk': 'field_officer',
                            'enumerator': 'field_officer',
                            'module_coordinator': 'field_officer',
                            'verification_officer': 'field_officer',
                            'approver': 'me_officer',
                            'report_viewer': 'viewer',
                            'module_viewer': 'viewer',
                            'external_auditor': 'viewer',
                            'gbv_specialist': 'field_officer',
                            'nutrition_specialist': 'field_officer',
                            'agriculture_specialist': 'field_officer',
                            'relief_coordinator': 'program_manager',
                            'seep_coordinator': 'program_manager'
                        };

                        const primaryRole = roleMapping[rolesData[0].name] || 'field_officer';

                        await db.query(`
                            UPDATE users
                            SET role = ?
                            WHERE id = ?
                        `, [primaryRole, userId]);
                    }
                } else {
                    // No roles selected, set to default
                    await db.query(`
                        UPDATE users
                        SET role = 'field_officer'
                        WHERE id = ?
                    `, [userId]);
                }
            }

            // Update module permissions (only for admins)
            if (req.user.is_system_admin && module_permissions !== undefined) {
                // Remove existing module assignments
                await db.query('DELETE FROM user_module_assignments WHERE user_id = ?', [userId]);

                // Add new module permissions
                if (Array.isArray(module_permissions) && module_permissions.length > 0) {
                    for (let perm of module_permissions) {
                        await db.query(`
                            INSERT INTO user_module_assignments
                            (user_id, module_id, can_view, can_create, can_edit, can_delete, can_approve, assigned_by, assigned_at)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
                        `, [
                            userId,
                            perm.module_id,
                            perm.can_view || false,
                            perm.can_create || false,
                            perm.can_edit || false,
                            perm.can_delete || false,
                            perm.can_approve || false,
                            req.user.id
                        ]);
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

            // Soft delete - mark as deleted and deactivate
            await db.query(`
                UPDATE users
                SET deleted_at = NOW(), is_active = false
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
