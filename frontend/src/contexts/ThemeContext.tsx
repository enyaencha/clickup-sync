import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '../types/theme.types';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Device-specific theme key (using a combination of browser fingerprint)
  const getDeviceId = () => {
    const nav = navigator;
    const screen = window.screen;
    const deviceId = `${nav.userAgent}_${screen.width}x${screen.height}`;
    return btoa(deviceId).substring(0, 20);
  };

  const THEME_STORAGE_KEY = `me_theme_${getDeviceId()}`;
  const DEFAULT_THEME_ID = 'theme-2'; // Theme 2: Dark Professional - Modern Cyan/Black

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Try to load theme from localStorage (device-specific)
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const savedTheme = themes.find(t => t.id === savedThemeId);
      if (savedTheme) {
        return savedTheme;
      }
    }
    // Default to Theme 2
    return themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1];
  });

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Set CSS custom properties
    root.style.setProperty('--sidebar-background', colors.sidebarBackground);
    root.style.setProperty('--sidebar-text', colors.sidebarText);
    root.style.setProperty('--sidebar-active-item', colors.sidebarActiveItem);
    root.style.setProperty('--sidebar-active-border', colors.sidebarActiveBorder);
    root.style.setProperty('--sidebar-hover', colors.sidebarHover);
    root.style.setProperty('--main-background', colors.mainBackground);
    root.style.setProperty('--main-text', colors.mainText);
    root.style.setProperty('--card-background', colors.cardBackground);
    root.style.setProperty('--card-border', colors.cardBorder);
    root.style.setProperty('--card-shadow', colors.cardShadow);
    root.style.setProperty('--accent-primary', colors.accentPrimary);
    root.style.setProperty('--accent-secondary', colors.accentSecondary);
    root.style.setProperty('--accent-gradient', colors.accentGradient);
    root.style.setProperty('--stat-card-background', colors.statCardBackground);
    root.style.setProperty('--stat-card-border-color', colors.statCardBorderColor);
    root.style.setProperty('--activity-card-background', colors.activityCardBackground);
    root.style.setProperty('--activity-card-border', colors.activityCardBorder);
    root.style.setProperty('--program-card-background', colors.programCardBackground);
    root.style.setProperty('--program-card-border', colors.programCardBorder);
    root.style.setProperty('--program-icon-background', colors.programIconBackground);
    root.style.setProperty('--program-icon-color', colors.programIconColor);
    root.style.setProperty('--program-status-background', colors.programStatusBackground);
    root.style.setProperty('--program-status-color', colors.programStatusColor);

    // Update body background
    document.body.style.background = colors.mainBackground;
    document.body.style.color = colors.mainText;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
