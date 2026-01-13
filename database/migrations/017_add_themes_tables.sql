CREATE TABLE IF NOT EXISTS themes (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    icon VARCHAR(20),
    colors JSON NOT NULL,
    is_custom TINYINT(1) DEFAULT 0,
    is_default TINYINT(1) DEFAULT 0,
    owner_user_id INT DEFAULT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_theme_owner (owner_user_id),
    KEY idx_theme_default (is_default),
    CONSTRAINT fk_themes_owner FOREIGN KEY (owner_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS theme_shares (
    id BIGINT NOT NULL AUTO_INCREMENT,
    theme_id VARCHAR(50) NOT NULL,
    shared_with_user_id INT NOT NULL,
    shared_by_user_id INT NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uniq_theme_share (theme_id, shared_with_user_id),
    KEY idx_theme_share_with (shared_with_user_id),
    CONSTRAINT fk_theme_shares_theme FOREIGN KEY (theme_id) REFERENCES themes (id) ON DELETE CASCADE,
    CONSTRAINT fk_theme_shares_with FOREIGN KEY (shared_with_user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_theme_shares_by FOREIGN KEY (shared_by_user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_theme_preferences (
    user_id INT NOT NULL,
    theme_id VARCHAR(50) DEFAULT NULL,
    follow_system TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    KEY idx_user_theme (theme_id),
    CONSTRAINT fk_user_theme_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_theme_theme FOREIGN KEY (theme_id) REFERENCES themes (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO themes (id, name, description, icon, colors, is_custom, is_default, owner_user_id)
VALUES
    ('theme-1', 'Ocean Breeze', 'Professional Purple/Blue', '🌊',
     '{"sidebarBackground":"linear-gradient(180deg, #667eea 0%, #5a67d8 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #f7fafc, #edf2f7)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(102, 126, 234, 0.2)","cardShadow":"0 4px 15px rgba(102, 126, 234, 0.1)","accentPrimary":"#667eea","accentSecondary":"#764ba2","accentGradient":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #667eea, #764ba2)","activityCardBackground":"rgba(102, 126, 234, 0.05)","activityCardBorder":"#667eea","programCardBackground":"#ffffff","programCardBorder":"#667eea","programIconBackground":"rgba(102, 126, 234, 0.1)","programIconColor":"#667eea","programStatusBackground":"rgba(102, 126, 234, 0.1)","programStatusColor":"#667eea"}',
     0, 1, NULL),
    ('theme-2', 'Dark Professional', 'Modern Cyan/Black', '🌙',
     '{"sidebarBackground":"linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)","sidebarText":"#e0e0e0","sidebarActiveItem":"rgba(0, 255, 245, 0.1)","sidebarActiveBorder":"#00fff5","sidebarHover":"rgba(0, 255, 245, 0.05)","mainBackground":"linear-gradient(to bottom, #16213e, #0f3460)","mainText":"#e0e0e0","cardBackground":"rgba(255, 255, 255, 0.05)","cardBorder":"rgba(0, 255, 245, 0.2)","cardShadow":"0 4px 15px rgba(0, 0, 0, 0.3)","accentPrimary":"#00fff5","accentSecondary":"#00d4d4","accentGradient":"linear-gradient(135deg, #00fff5 0%, #00d4d4 100%)","statCardBackground":"rgba(255, 255, 255, 0.05)","statCardBorderColor":"linear-gradient(to bottom, #00fff5, #00d4d4)","activityCardBackground":"rgba(0, 255, 245, 0.1)","activityCardBorder":"#00fff5","programCardBackground":"rgba(255, 255, 255, 0.05)","programCardBorder":"#00fff5","programIconBackground":"rgba(0, 255, 245, 0.2)","programIconColor":"#00fff5","programStatusBackground":"rgba(0, 255, 245, 0.2)","programStatusColor":"#00fff5"}',
     0, 1, NULL),
    ('theme-3', 'Sunset Warmth', 'Pink/Coral Gradient', '🌅',
     '{"sidebarBackground":"linear-gradient(180deg, #f093fb 0%, #f5576c 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #fff5f7, #ffe8ec)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(245, 87, 108, 0.2)","cardShadow":"0 4px 15px rgba(245, 87, 108, 0.1)","accentPrimary":"#f5576c","accentSecondary":"#f093fb","accentGradient":"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #f093fb, #f5576c)","activityCardBackground":"rgba(245, 87, 108, 0.05)","activityCardBorder":"#f5576c","programCardBackground":"#ffffff","programCardBorder":"#f5576c","programIconBackground":"rgba(245, 87, 108, 0.1)","programIconColor":"#f5576c","programStatusBackground":"rgba(245, 87, 108, 0.1)","programStatusColor":"#f5576c"}',
     0, 1, NULL),
    ('theme-4', 'Forest Green', 'Teal/Green Natural', '🌲',
     '{"sidebarBackground":"linear-gradient(180deg, #0d7377 0%, #11998e 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #f0fff4, #e6ffed)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(17, 153, 142, 0.2)","cardShadow":"0 4px 15px rgba(17, 153, 142, 0.1)","accentPrimary":"#11998e","accentSecondary":"#38ef7d","accentGradient":"linear-gradient(135deg, #11998e 0%, #38ef7d 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #11998e, #38ef7d)","activityCardBackground":"rgba(17, 153, 142, 0.05)","activityCardBorder":"#11998e","programCardBackground":"#ffffff","programCardBorder":"#11998e","programIconBackground":"rgba(17, 153, 142, 0.1)","programIconColor":"#11998e","programStatusBackground":"rgba(17, 153, 142, 0.1)","programStatusColor":"#11998e"}',
     0, 1, NULL),
    ('theme-5', 'Elegant Black & Gold', 'Luxury Premium', '✨',
     '{"sidebarBackground":"linear-gradient(180deg, #000000 0%, #1a1a1a 100%)","sidebarText":"#ffd700","sidebarActiveItem":"rgba(255, 215, 0, 0.1)","sidebarActiveBorder":"#ffd700","sidebarHover":"rgba(255, 215, 0, 0.05)","mainBackground":"linear-gradient(to bottom, #1a1a1a, #000000)","mainText":"#e0e0e0","cardBackground":"rgba(255, 215, 0, 0.05)","cardBorder":"rgba(255, 215, 0, 0.3)","cardShadow":"0 4px 15px rgba(0, 0, 0, 0.5)","accentPrimary":"#ffd700","accentSecondary":"#ffed4e","accentGradient":"linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)","statCardBackground":"rgba(255, 215, 0, 0.05)","statCardBorderColor":"linear-gradient(to bottom, #ffd700, #ffed4e)","activityCardBackground":"rgba(255, 215, 0, 0.1)","activityCardBorder":"#ffd700","programCardBackground":"rgba(255, 255, 255, 0.05)","programCardBorder":"#ffd700","programIconBackground":"rgba(255, 215, 0, 0.2)","programIconColor":"#ffd700","programStatusBackground":"rgba(255, 215, 0, 0.2)","programStatusColor":"#ffd700"}',
     0, 1, NULL),
    ('theme-6', 'Modern Blue', 'Corporate Clean', '💎',
     '{"sidebarBackground":"linear-gradient(180deg, #2196f3 0%, #4facfe 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #f0f9ff, #e0f2fe)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(79, 172, 254, 0.2)","cardShadow":"0 4px 15px rgba(79, 172, 254, 0.1)","accentPrimary":"#4facfe","accentSecondary":"#00f2fe","accentGradient":"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #4facfe, #00f2fe)","activityCardBackground":"rgba(79, 172, 254, 0.05)","activityCardBorder":"#4facfe","programCardBackground":"#ffffff","programCardBorder":"#4facfe","programIconBackground":"rgba(79, 172, 254, 0.1)","programIconColor":"#4facfe","programStatusBackground":"rgba(79, 172, 254, 0.1)","programStatusColor":"#4facfe"}',
     0, 1, NULL),
    ('theme-7', 'Royal Purple', 'Bold Sophisticated', '👑',
     '{"sidebarBackground":"linear-gradient(180deg, #6a00f4 0%, #8e2de2 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #faf5ff, #f3e8ff)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(142, 45, 226, 0.2)","cardShadow":"0 4px 15px rgba(142, 45, 226, 0.1)","accentPrimary":"#8e2de2","accentSecondary":"#4a00e0","accentGradient":"linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #8e2de2, #4a00e0)","activityCardBackground":"rgba(142, 45, 226, 0.05)","activityCardBorder":"#8e2de2","programCardBackground":"#ffffff","programCardBorder":"#8e2de2","programIconBackground":"rgba(142, 45, 226, 0.1)","programIconColor":"#8e2de2","programStatusBackground":"rgba(142, 45, 226, 0.1)","programStatusColor":"#8e2de2"}',
     0, 1, NULL),
    ('theme-8', 'Coral Reef', 'Warm Red Tones', '🌺',
     '{"sidebarBackground":"linear-gradient(180deg, #c92a2a 0%, #ff6b6b 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #fff5f5, #ffe3e3)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(255, 107, 107, 0.2)","cardShadow":"0 4px 15px rgba(255, 107, 107, 0.1)","accentPrimary":"#ff6b6b","accentSecondary":"#ee5a6f","accentGradient":"linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #ff6b6b, #ee5a6f)","activityCardBackground":"rgba(255, 107, 107, 0.05)","activityCardBorder":"#ff6b6b","programCardBackground":"#ffffff","programCardBorder":"#ff6b6b","programIconBackground":"rgba(255, 107, 107, 0.1)","programIconColor":"#ff6b6b","programStatusBackground":"rgba(255, 107, 107, 0.1)","programStatusColor":"#ff6b6b"}',
     0, 1, NULL),
    ('theme-9', 'Midnight Navy', 'Professional Blue', '🌊',
     '{"sidebarBackground":"linear-gradient(180deg, #1a252f 0%, #2c3e50 100%)","sidebarText":"#ecf0f1","sidebarActiveItem":"rgba(52, 152, 219, 0.3)","sidebarActiveBorder":"#3498db","sidebarHover":"rgba(52, 152, 219, 0.1)","mainBackground":"linear-gradient(to bottom, #ecf0f1, #d5dbdb)","mainText":"#2c3e50","cardBackground":"#ffffff","cardBorder":"rgba(52, 73, 94, 0.2)","cardShadow":"0 4px 15px rgba(52, 73, 94, 0.1)","accentPrimary":"#3498db","accentSecondary":"#2980b9","accentGradient":"linear-gradient(135deg, #3498db 0%, #2980b9 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #3498db, #2980b9)","activityCardBackground":"rgba(52, 152, 219, 0.05)","activityCardBorder":"#3498db","programCardBackground":"#ffffff","programCardBorder":"#3498db","programIconBackground":"rgba(52, 152, 219, 0.1)","programIconColor":"#3498db","programStatusBackground":"rgba(52, 152, 219, 0.1)","programStatusColor":"#3498db"}',
     0, 1, NULL),
    ('theme-10', 'Amber Sunrise', 'Orange/Gold Warm', '🌅',
     '{"sidebarBackground":"linear-gradient(180deg, #d68910 0%, #f39c12 100%)","sidebarText":"#ffffff","sidebarActiveItem":"rgba(255,255,255,0.2)","sidebarActiveBorder":"#ffffff","sidebarHover":"rgba(255,255,255,0.1)","mainBackground":"linear-gradient(to bottom, #fffbeb, #fef3c7)","mainText":"#2d3748","cardBackground":"#ffffff","cardBorder":"rgba(243, 156, 18, 0.2)","cardShadow":"0 4px 15px rgba(243, 156, 18, 0.1)","accentPrimary":"#f39c12","accentSecondary":"#e67e22","accentGradient":"linear-gradient(135deg, #f39c12 0%, #e67e22 100%)","statCardBackground":"#ffffff","statCardBorderColor":"linear-gradient(to bottom, #f39c12, #e67e22)","activityCardBackground":"rgba(243, 156, 18, 0.05)","activityCardBorder":"#f39c12","programCardBackground":"#ffffff","programCardBorder":"#f39c12","programIconBackground":"rgba(243, 156, 18, 0.1)","programIconColor":"#f39c12","programStatusBackground":"rgba(243, 156, 18, 0.1)","programStatusColor":"#f39c12"}',
     0, 1, NULL)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    icon = VALUES(icon),
    colors = VALUES(colors),
    is_custom = VALUES(is_custom),
    is_default = VALUES(is_default),
    owner_user_id = VALUES(owner_user_id);
