const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

module.exports = (authService) => {
    /**
     * POST /api/auth/register
     * Register a new user
     */
    router.post('/register', async (req, res) => {
        try {
            const { username, email, password, full_name, role } = req.body;

            // Validation
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Username, email, and password are required'
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid email format'
                });
            }

            // Password strength validation
            if (password.length < 8) {
                return res.status(400).json({
                    success: false,
                    error: 'Password must be at least 8 characters long'
                });
            }

            const user = await authService.register({
                username,
                email,
                password,
                full_name,
                role
            });

            res.status(201).json({
                success: true,
                data: user,
                message: 'User registered successfully'
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Registration failed'
            });
        }
    });

    /**
     * POST /api/auth/login
     * Login user
     */
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Email and password are required'
                });
            }

            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];

            const result = await authService.login(email, password, ipAddress, userAgent);

            res.json({
                success: true,
                data: result,
                message: 'Login successful'
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                error: error.message || 'Login failed'
            });
        }
    });

    /**
     * POST /api/auth/logout
     * Logout user
     */
    router.post('/logout', async (req, res) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(400).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            await authService.logout(token);

            res.json({
                success: true,
                message: 'Logout successful'
            });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Logout failed'
            });
        }
    });

    /**
     * POST /api/auth/refresh
     * Refresh access token
     */
    router.post('/refresh', async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({
                    success: false,
                    error: 'Refresh token is required'
                });
            }

            const newToken = await authService.refreshAccessToken(refreshToken);

            res.json({
                success: true,
                data: { token: newToken },
                message: 'Token refreshed successfully'
            });
        } catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                error: error.message || 'Token refresh failed'
            });
        }
    });

    /**
     * GET /api/auth/me
     * Get current user
     */
    router.get('/me', async (req, res) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            const user = await authService.getCurrentUser(token);

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(401).json({
                success: false,
                error: error.message || 'Failed to get user'
            });
        }
    });

    /**
     * POST /api/auth/check-permission
     * Check if user has a specific permission
     */
    router.post('/check-permission', async (req, res) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const { resource, action } = req.body;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            const decoded = authService.verifyToken(token);
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }

            const hasPermission = await authService.checkPermission(
                decoded.userId,
                resource,
                action
            );

            res.json({
                success: true,
                data: { hasPermission }
            });
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Permission check failed'
            });
        }
    });

    /**
     * POST /api/auth/change-password
     * Change current user's password
     */
    router.post('/change-password', async (req, res) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            const { current_password, new_password } = req.body;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            if (!current_password || !new_password) {
                return res.status(400).json({
                    success: false,
                    error: 'Current password and new password are required'
                });
            }

            if (new_password.length < 8) {
                return res.status(400).json({
                    success: false,
                    error: 'New password must be at least 8 characters long'
                });
            }

            const decoded = authService.verifyToken(token);
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token'
                });
            }

            const users = await authService.db.query(
                'SELECT id, password_hash FROM users WHERE id = ? AND is_active = true',
                [decoded.userId]
            );

            if (!users || users.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            const user = users[0];
            const isValid = await bcrypt.compare(current_password, user.password_hash);
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    error: 'Current password is incorrect'
                });
            }

            const passwordHash = await bcrypt.hash(new_password, 10);
            await authService.db.query(
                'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
                [passwordHash, user.id]
            );

            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(400).json({
                success: false,
                error: error.message || 'Failed to update password'
            });
        }
    });

    return router;
};
