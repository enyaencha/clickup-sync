const logger = require('../core/utils/logger');

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
function authMiddleware(authService) {
    return async (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided. Please login.'
                });
            }

            const token = authHeader.replace('Bearer ', '');

            // Verify token
            const decoded = authService.verifyToken(token);

            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid or expired token. Please login again.'
                });
            }

            // Check if session is active
            const sessions = await authService.db.query(
                `SELECT user_id FROM user_sessions
                 WHERE token = ? AND is_active = true AND expires_at > NOW()`,
                [token]
            );

            if (sessions.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'Session expired. Please login again.'
                });
            }

            // Get full user data with roles and permissions
            const user = await authService.getCurrentUser(token);

            // Attach user to request
            req.user = user;
            req.token = token;

            next();
        } catch (error) {
            logger.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                error: 'Authentication failed'
            });
        }
    };
}

/**
 * Optional Authentication Middleware
 * Attaches user if token is present, but doesn't require it
 */
function optionalAuthMiddleware(authService) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                const decoded = authService.verifyToken(token);

                if (decoded) {
                    try {
                        const user = await authService.getCurrentUser(token);
                        req.user = user;
                        req.token = token;
                    } catch (error) {
                        // Ignore errors for optional auth
                    }
                }
            }

            next();
        } catch (error) {
            // Ignore errors for optional auth
            next();
        }
    };
}

/**
 * Permission Check Middleware
 * Requires authMiddleware to be used first
 */
function requirePermission(resource, action) {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // System admins have all permissions
            if (req.user.is_system_admin) {
                return next();
            }

            // Check if user has the required permission
            const hasPermission = req.user.permissions?.some(p =>
                p.resource === resource && p.action === action
            );

            if (!hasPermission) {
                logger.warn(`Permission denied: ${req.user.email} attempted ${action} on ${resource}`);
                return res.status(403).json({
                    success: false,
                    error: 'You do not have permission to perform this action'
                });
            }

            next();
        } catch (error) {
            logger.error('Permission middleware error:', error);
            return res.status(403).json({
                success: false,
                error: 'Permission check failed'
            });
        }
    };
}

/**
 * Role Check Middleware
 * Requires specific role(s)
 */
function requireRole(...roleNames) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Authentication required'
                });
            }

            // System admins bypass role checks
            if (req.user.is_system_admin) {
                return next();
            }

            // Check if user has any of the required roles
            const hasRole = req.user.roles?.some(r =>
                roleNames.includes(r.name)
            );

            if (!hasRole) {
                logger.warn(`Role check failed: ${req.user.email} needs one of [${roleNames.join(', ')}]`);
                return res.status(403).json({
                    success: false,
                    error: 'You do not have the required role to access this resource'
                });
            }

            next();
        } catch (error) {
            logger.error('Role middleware error:', error);
            return res.status(403).json({
                success: false,
                error: 'Role check failed'
            });
        }
    };
}

module.exports = {
    authMiddleware,
    optionalAuthMiddleware,
    requirePermission,
    requireRole
};
