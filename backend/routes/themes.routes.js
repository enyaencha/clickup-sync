const express = require('express');

module.exports = (themesService) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        try {
            const themes = await themesService.listThemesForUser(req.user.id);
            const preferences = await themesService.getPreferences(req.user.id);

            return res.json({
                success: true,
                data: {
                    themes,
                    preferences
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to load themes'
            });
        }
    });

    router.put('/preferences', async (req, res) => {
        try {
            const { themeId, followSystem } = req.body || {};
            const normalizedFollow = Boolean(followSystem);

            if (themeId) {
                const accessible = await themesService.isThemeAccessible(themeId, req.user.id);
                if (!accessible) {
                    return res.status(403).json({
                        success: false,
                        error: 'Theme is not accessible for this user'
                    });
                }
            }

            await themesService.setPreferences(req.user.id, themeId || null, normalizedFollow);

            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to save theme preferences'
            });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const theme = req.body || {};
            if (!theme.name || !theme.colors) {
                return res.status(400).json({
                    success: false,
                    error: 'Theme name and colors are required'
                });
            }

            const created = await themesService.createCustomTheme(req.user.id, theme);
            return res.status(201).json({ success: true, data: created });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to create theme'
            });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const updated = await themesService.updateTheme(
                req.params.id,
                req.user.id,
                req.body || {},
                Boolean(req.user?.is_system_admin)
            );
            return res.json({ success: true, data: updated });
        } catch (error) {
            const status = error.message?.includes('not found') ? 404 : error.message?.includes('permission') ? 403 : 500;
            return res.status(status).json({
                success: false,
                error: error.message || 'Failed to update theme'
            });
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            await themesService.deleteTheme(
                req.params.id,
                req.user.id,
                Boolean(req.user?.is_system_admin)
            );
            return res.json({ success: true });
        } catch (error) {
            const status = error.message?.includes('not found') ? 404 : error.message?.includes('permission') ? 403 : 500;
            return res.status(status).json({
                success: false,
                error: error.message || 'Failed to delete theme'
            });
        }
    });

    router.post('/:id/share', async (req, res) => {
        try {
            const { email } = req.body || {};
            if (!email) {
                return res.status(400).json({
                    success: false,
                    error: 'Email is required'
                });
            }

            await themesService.shareTheme(
                req.params.id,
                req.user.id,
                email,
                Boolean(req.user?.is_system_admin)
            );

            return res.json({ success: true });
        } catch (error) {
            const message = error.message || '';
            const status = message.includes('not found') ? 404
                : message.includes('permission') ? 403
                    : message.includes('custom themes') ? 400
                        : 500;
            return res.status(status).json({
                success: false,
                error: error.message || 'Failed to share theme'
            });
        }
    });

    return router;
};
