const logger = require('../core/utils/logger');

class ThemesService {
    constructor(db) {
        this.db = db;
    }

    parseTheme(row) {
        let colors = row.colors;
        if (typeof colors === 'string') {
            try {
                colors = JSON.parse(colors);
            } catch (error) {
                logger.error('Failed to parse theme colors JSON:', error);
            }
        }

        return {
            id: row.id,
            name: row.name,
            description: row.description,
            icon: row.icon,
            colors,
            isCustom: Boolean(row.is_custom),
            isDefault: Boolean(row.is_default),
            ownerUserId: row.owner_user_id,
            accessType: row.access_type || 'global'
        };
    }

    async listThemesForUser(userId) {
        const rows = await this.db.query(
            `SELECT t.id, t.name, t.description, t.icon, t.colors, t.is_custom, t.is_default, t.owner_user_id,
                    CASE
                        WHEN t.owner_user_id = ? THEN 'owned'
                        WHEN ts.shared_with_user_id IS NOT NULL THEN 'shared'
                        ELSE 'global'
                    END AS access_type
             FROM themes t
             LEFT JOIN theme_shares ts
                ON ts.theme_id = t.id
               AND ts.shared_with_user_id = ?
             WHERE t.owner_user_id IS NULL
                OR t.owner_user_id = ?
                OR ts.shared_with_user_id = ?
             ORDER BY t.is_default DESC, t.name ASC`,
            [userId, userId, userId, userId]
        );

        return rows.map((row) => this.parseTheme(row));
    }

    async getPreferences(userId) {
        return this.db.queryOne(
            `SELECT theme_id, follow_system
             FROM user_theme_preferences
             WHERE user_id = ?`,
            [userId]
        );
    }

    async setPreferences(userId, themeId, followSystem) {
        const existing = await this.db.queryOne(
            'SELECT user_id FROM user_theme_preferences WHERE user_id = ?',
            [userId]
        );

        if (existing) {
            await this.db.query(
                `UPDATE user_theme_preferences
                 SET theme_id = ?, follow_system = ?
                 WHERE user_id = ?`,
                [themeId, followSystem, userId]
            );
        } else {
            await this.db.query(
                `INSERT INTO user_theme_preferences (user_id, theme_id, follow_system)
                 VALUES (?, ?, ?)`,
                [userId, themeId, followSystem]
            );
        }
    }

    async isThemeAccessible(themeId, userId) {
        const rows = await this.db.query(
            `SELECT t.id
             FROM themes t
             LEFT JOIN theme_shares ts
                ON ts.theme_id = t.id
               AND ts.shared_with_user_id = ?
             WHERE t.id = ?
               AND (t.owner_user_id IS NULL OR t.owner_user_id = ? OR ts.shared_with_user_id = ?)
             LIMIT 1`,
            [userId, themeId, userId, userId]
        );

        return rows.length > 0;
    }

    async createCustomTheme(userId, theme) {
        const themeId = theme.id || `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const colors = JSON.stringify(theme.colors || {});

        await this.db.query(
            `INSERT INTO themes (id, name, description, icon, colors, is_custom, is_default, owner_user_id)
             VALUES (?, ?, ?, ?, ?, true, false, ?)`,
            [
                themeId,
                theme.name,
                theme.description || 'Custom Theme',
                theme.icon || '🎨',
                colors,
                userId
            ]
        );

        return this.getThemeById(themeId, userId);
    }

    async getThemeById(themeId, userId) {
        const rows = await this.db.query(
            `SELECT t.id, t.name, t.description, t.icon, t.colors, t.is_custom, t.is_default, t.owner_user_id,
                    CASE
                        WHEN t.owner_user_id = ? THEN 'owned'
                        WHEN ts.shared_with_user_id IS NOT NULL THEN 'shared'
                        ELSE 'global'
                    END AS access_type
             FROM themes t
             LEFT JOIN theme_shares ts
                ON ts.theme_id = t.id
               AND ts.shared_with_user_id = ?
             WHERE t.id = ?
             LIMIT 1`,
            [userId, userId, themeId]
        );

        if (!rows.length) return null;
        return this.parseTheme(rows[0]);
    }

    async updateTheme(themeId, userId, theme, isAdmin) {
        const existing = await this.db.queryOne(
            'SELECT id, owner_user_id, is_custom, is_default FROM themes WHERE id = ?',
            [themeId]
        );

        if (!existing) {
            throw new Error('Theme not found');
        }

        const isOwner = existing.owner_user_id === userId;
        if (existing.is_custom && !isOwner && !isAdmin) {
            throw new Error('You do not have permission to update this theme');
        }

        if (!existing.is_custom && !isAdmin) {
            throw new Error('Only system admins can update default themes');
        }

        await this.db.query(
            `UPDATE themes
             SET name = ?, description = ?, icon = ?, colors = ?
             WHERE id = ?`,
            [
                theme.name,
                theme.description || existing.description,
                theme.icon || existing.icon,
                JSON.stringify(theme.colors || {}),
                themeId
            ]
        );

        return this.getThemeById(themeId, userId);
    }

    async deleteTheme(themeId, userId, isAdmin) {
        const existing = await this.db.queryOne(
            'SELECT id, owner_user_id, is_custom FROM themes WHERE id = ?',
            [themeId]
        );

        if (!existing) {
            throw new Error('Theme not found');
        }

        if (!existing.is_custom) {
            throw new Error('Default themes cannot be deleted');
        }

        if (existing.owner_user_id !== userId && !isAdmin) {
            throw new Error('You do not have permission to delete this theme');
        }

        await this.db.transaction(async (connection) => {
            await connection.execute('DELETE FROM theme_shares WHERE theme_id = ?', [themeId]);
            await connection.execute(
                'UPDATE user_theme_preferences SET theme_id = NULL WHERE theme_id = ?',
                [themeId]
            );
            await connection.execute('DELETE FROM themes WHERE id = ?', [themeId]);
        });
    }

    async shareTheme(themeId, ownerId, email, isAdmin) {
        const theme = await this.db.queryOne(
            'SELECT id, owner_user_id, is_custom FROM themes WHERE id = ?',
            [themeId]
        );

        if (!theme) {
            throw new Error('Theme not found');
        }

        if (!theme.is_custom) {
            throw new Error('Only custom themes can be shared');
        }

        if (theme.owner_user_id !== ownerId && !isAdmin) {
            throw new Error('You do not have permission to share this theme');
        }

        const user = await this.db.queryOne(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            throw new Error('User not found');
        }

        await this.db.query(
            `INSERT INTO theme_shares (theme_id, shared_with_user_id, shared_by_user_id)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE shared_with_user_id = shared_with_user_id`,
            [themeId, user.id, ownerId]
        );
    }

    async unshareTheme(themeId, ownerId, email, isAdmin) {
        const theme = await this.db.queryOne(
            'SELECT id, owner_user_id, is_custom FROM themes WHERE id = ?',
            [themeId]
        );

        if (!theme) {
            throw new Error('Theme not found');
        }

        if (!theme.is_custom) {
            throw new Error('Only custom themes can be unshared');
        }

        if (theme.owner_user_id !== ownerId && !isAdmin) {
            throw new Error('You do not have permission to unshare this theme');
        }

        const user = await this.db.queryOne(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (!user) {
            throw new Error('User not found');
        }

        await this.db.query(
            'DELETE FROM theme_shares WHERE theme_id = ? AND shared_with_user_id = ?',
            [themeId, user.id]
        );
    }
}

module.exports = ThemesService;
