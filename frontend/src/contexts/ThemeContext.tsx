import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '../types/theme.types';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  customThemes: Theme[];
  addCustomTheme: (theme: Theme) => void;
  updateCustomTheme: (theme: Theme) => void;
  deleteCustomTheme: (themeId: string) => void;
  followSystemTheme: boolean;
  setFollowSystemTheme: (follow: boolean) => void;
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
  const CUSTOM_THEMES_STORAGE_KEY = `me_custom_themes_${getDeviceId()}`;
  const FOLLOW_SYSTEM_THEME_KEY = `me_follow_system_${getDeviceId()}`;
  const DEFAULT_THEME_ID = 'theme-2'; // Theme 2: Dark Professional - Modern Cyan/Black
  const LIGHT_THEME_ID = 'theme-1'; // Theme 1 for light mode
  const DARK_THEME_ID = 'theme-2'; // Theme 2 for dark mode

  // Load custom themes from localStorage
  const loadCustomThemes = (): Theme[] => {
    try {
      const saved = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading custom themes:', error);
    }
    return [];
  };

  const [customThemes, setCustomThemes] = useState<Theme[]>(loadCustomThemes);
  const [allThemes, setAllThemes] = useState<Theme[]>([...themes, ...loadCustomThemes()]);

  // System theme following state
  const [followSystemTheme, setFollowSystemThemeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(FOLLOW_SYSTEM_THEME_KEY);
      return saved === 'true';
    } catch (error) {
      console.error('Error loading system theme preference:', error);
      return false;
    }
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Try to load theme from localStorage (device-specific)
    const savedThemeId = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedThemeId) {
      const savedTheme = allThemes.find(t => t.id === savedThemeId);
      if (savedTheme) {
        return savedTheme;
      }
    }
    // Default to Theme 2
    return themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1];
  });

  // Save custom themes to localStorage
  const saveCustomThemes = (themes: Theme[]) => {
    try {
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(themes));
    } catch (error) {
      console.error('Error saving custom themes:', error);
    }
  };

  // Detect system theme preference
  const getSystemThemePreference = (): 'dark' | 'light' => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // Map system preference to theme ID
  const getThemeForSystemPreference = (preference: 'dark' | 'light'): string => {
    if (preference === 'dark') {
      return DARK_THEME_ID;
    } else {
      return LIGHT_THEME_ID;
    }
  };

  const setTheme = (themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
  };

  const setFollowSystemTheme = (follow: boolean) => {
    setFollowSystemThemeState(follow);
    localStorage.setItem(FOLLOW_SYSTEM_THEME_KEY, follow.toString());

    // If enabling system theme, immediately apply the system preference
    if (follow) {
      const systemPreference = getSystemThemePreference();
      const themeId = getThemeForSystemPreference(systemPreference);
      setTheme(themeId);
    }
  };

  const addCustomTheme = (theme: Theme) => {
    const newCustomThemes = [...customThemes, theme];
    setCustomThemes(newCustomThemes);
    setAllThemes([...themes, ...newCustomThemes]);
    saveCustomThemes(newCustomThemes);
    // Automatically apply the new theme
    setTheme(theme.id);
  };

  const updateCustomTheme = (updatedTheme: Theme) => {
    const newCustomThemes = customThemes.map(t =>
      t.id === updatedTheme.id ? updatedTheme : t
    );
    setCustomThemes(newCustomThemes);
    setAllThemes([...themes, ...newCustomThemes]);
    saveCustomThemes(newCustomThemes);

    // If the updated theme is currently active, update it
    if (currentTheme.id === updatedTheme.id) {
      setCurrentTheme(updatedTheme);
    }
  };

  const deleteCustomTheme = (themeId: string) => {
    const newCustomThemes = customThemes.filter(t => t.id !== themeId);
    setCustomThemes(newCustomThemes);
    setAllThemes([...themes, ...newCustomThemes]);
    saveCustomThemes(newCustomThemes);

    // If the deleted theme was active, switch to default
    if (currentTheme.id === themeId) {
      const defaultTheme = themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1];
      setTheme(defaultTheme.id);
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    if (!followSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const preference = e.matches ? 'dark' : 'light';
      const themeId = getThemeForSystemPreference(preference);
      setTheme(themeId);
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [followSystemTheme, allThemes]);

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
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      availableThemes: allThemes,
      customThemes,
      addCustomTheme,
      updateCustomTheme,
      deleteCustomTheme,
      followSystemTheme,
      setFollowSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
