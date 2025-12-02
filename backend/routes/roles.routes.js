const express = require('express');

module.exports = (db, authMiddleware) => {
    const router = express.Router();

    // Middleware to require authentication
    router.use(authMiddleware);

    /**
     * GET /api/roles
     * Get all available roles
     */
    router.get('/', async (req, res) => {
        try {
            const roles = await db.query(`
                SELECT
                    id,
                    name,
                    display_name,
                    description,
                    scope,
                    level
                FROM roles
                ORDER BY level ASC, name ASC
            `);

            res.json({
                success: true,
                data: roles
            });
        } catch (error) {
            console.error('Error fetching roles:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch roles'
            });
        }
    });

    /**
     * GET /api/roles/:id
     * Get a single role with its permissions
     */
    router.get('/:id', async (req, res) => {
        try {
            const roleId = parseInt(req.params.id);

            const roles = await db.query(`
                SELECT
                    id,
                    name,
                    display_name,
                    description,
                    scope,
                    level
                FROM roles
                WHERE id = ?
            `, [roleId]);

            if (roles.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Role not found'
                });
            }

            const role = roles[0];

            // Get permissions for this role
            const permissions = await db.query(`
                SELECT
                    p.id,
                    p.name,
                    p.resource,
                    p.action,
                    p.description,
                    p.applies_to
                FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = ?
                ORDER BY p.resource, p.action
            `, [roleId]);

            role.permissions = permissions;

            res.json({
                success: true,
                data: role
            });
        } catch (error) {
            console.error('Error fetching role:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch role'
            });
        }
    });

    return router;
};
