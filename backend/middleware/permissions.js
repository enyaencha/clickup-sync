/**
 * Permission checking middleware and helpers
 */

/**
 * Check if user has permission to perform an action on a module
 * @param {Object} user - The authenticated user
 * @param {number} moduleId - The module ID
 * @param {string} action - The action to check (view, create, edit, delete, approve)
 * @returns {boolean}
 */
function canPerformModuleAction(user, moduleId, action) {
    if (!user) return false;
    if (user.is_system_admin) return true;

    const assignment = user.module_assignments?.find(m => m.module_id === parseInt(moduleId));
    if (!assignment) return false;

    switch (action) {
        case 'view':
            return assignment.can_view || false;
        case 'create':
            return assignment.can_create || false;
        case 'edit':
            return assignment.can_edit || false;
        case 'delete':
            return assignment.can_delete || false;
        case 'approve':
            return assignment.can_approve || false;
        default:
            return false;
    }
}

/**
 * Check if user can modify a resource based on ownership
 * @param {Object} user - The authenticated user
 * @param {Object} resource - The resource with created_by and owned_by fields
 * @param {string} action - The action (edit or delete)
 * @returns {boolean}
 */
function canModifyResource(user, resource, action) {
    if (!user) return false;
    if (user.is_system_admin) return true;

    // User can modify if they own it or created it
    if (resource.owned_by === user.id || resource.created_by === user.id) return true;

    // Check if they have the permission via roles
    return user.permissions?.some(
        p => p.resource === 'activities' && p.action === action
    ) || false;
}

/**
 * Get module ID for an activity
 * @param {Object} db - Database connection
 * @param {number} activityId - Activity ID
 * @returns {Promise<number|null>}
 */
async function getModuleIdForActivity(db, activityId) {
    const result = await db.query(`
        SELECT sp.program_module_id as module_id
        FROM activities a
        JOIN project_components pc ON a.component_id = pc.id
        JOIN sub_programs sp ON pc.sub_program_id = sp.id
        WHERE a.id = ?
    `, [activityId]);

    return result && result.length > 0 ? result[0].module_id : null;
}

/**
 * Get module ID for a component
 * @param {Object} db - Database connection
 * @param {number} componentId - Component ID
 * @returns {Promise<number|null>}
 */
async function getModuleIdForComponent(db, componentId) {
    const result = await db.query(`
        SELECT sp.program_module_id as module_id
        FROM project_components pc
        JOIN sub_programs sp ON pc.sub_program_id = sp.id
        WHERE pc.id = ?
    `, [componentId]);

    return result && result.length > 0 ? result[0].module_id : null;
}

/**
 * Middleware to check if user has permission for a module action
 * Usage: checkModulePermission(db, 'create') or checkModulePermission(db, 'edit')
 */
function checkModulePermission(db, action) {
    return async (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // System admins bypass all checks
            if (user.is_system_admin) {
                return next();
            }

            // For create operations, module_id should be determinable from component_id
            if (action === 'create' && req.body.component_id) {
                const moduleId = await getModuleIdForComponent(db, req.body.component_id);
                if (!moduleId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid component ID'
                    });
                }

                if (!canPerformModuleAction(user, moduleId, 'create')) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to create activities in this module'
                    });
                }

                // Store module ID for later use
                req.moduleId = moduleId;
                return next();
            }

            // For edit/delete operations, get the activity first
            if ((action === 'edit' || action === 'delete') && req.params.id) {
                const activity = await db.query(
                    'SELECT * FROM activities WHERE id = ? AND deleted_at IS NULL',
                    [req.params.id]
                );

                if (!activity || activity.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'Activity not found'
                    });
                }

                const activityData = activity[0];
                const moduleId = await getModuleIdForActivity(db, req.params.id);

                if (!moduleId) {
                    return res.status(400).json({
                        success: false,
                        error: 'Could not determine module for activity'
                    });
                }

                // Check if user can modify based on ownership OR module permission
                const canModify = canModifyResource(user, activityData, action) ||
                                 canPerformModuleAction(user, moduleId, action);

                if (!canModify) {
                    return res.status(403).json({
                        success: false,
                        error: `You do not have permission to ${action} this activity`
                    });
                }

                // Store for later use
                req.activity = activityData;
                req.moduleId = moduleId;
                return next();
            }

            // If we can't determine what to check, deny access
            return res.status(400).json({
                success: false,
                error: 'Unable to verify permissions for this request'
            });

        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                error: 'Error checking permissions'
            });
        }
    };
}

module.exports = {
    canPerformModuleAction,
    canModifyResource,
    getModuleIdForActivity,
    getModuleIdForComponent,
    checkModulePermission
};
