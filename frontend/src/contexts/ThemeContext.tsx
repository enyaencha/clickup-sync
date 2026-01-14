import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Theme, themes } from '../types/theme.types';
import { authFetch } from '../config/api';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  customThemes: Theme[];
  addCustomTheme: (theme: Theme) => Promise<void>;
  updateCustomTheme: (theme: Theme) => Promise<void>;
  updateDefaultTheme: (theme: Theme) => Promise<void>;
  deleteCustomTheme: (themeId: string) => Promise<void>;
  shareTheme: (themeId: string, email: string) => Promise<void>;
  unshareTheme: (themeId: string, email: string) => Promise<void>;
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
  const DEFAULT_THEME_ID = 'theme-2'; // Theme 2: Dark Professional - Modern Cyan/Black
  const LIGHT_THEME_ID = 'theme-1'; // Theme 1 for light mode
  const DARK_THEME_ID = 'theme-2'; // Theme 2 for dark mode

  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [allThemes, setAllThemes] = useState<Theme[]>(themes);

  // System theme following state
  const [followSystemTheme, setFollowSystemThemeState] = useState<boolean>(false);

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    return themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1];
  });
  const hasLoadedThemes = useRef(false);

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

  const persistPreferences = async (themeId: string | null, followSystem: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    await authFetch('/api/themes/preferences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ themeId, followSystem }),
    });
  };

  const setTheme = (themeId: string) => {
    const theme = allThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (hasLoadedThemes.current) {
        void persistPreferences(themeId, followSystemTheme);
      }
    }
  };

  const applySystemTheme = () => {
    const systemPreference = getSystemThemePreference();
    const themeId = getThemeForSystemPreference(systemPreference);
    const themeExists = allThemes.some((theme) => theme.id === themeId);
    setTheme(themeExists ? themeId : DEFAULT_THEME_ID);
  };

  const setFollowSystemTheme = (follow: boolean) => {
    setFollowSystemThemeState(follow);
    if (hasLoadedThemes.current) {
      void persistPreferences(currentTheme.id, follow);
    }

    // If enabling system theme, immediately apply the system preference
    if (follow) {
      applySystemTheme();
    }
  };

  const fetchThemes = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAllThemes(themes);
      setCustomThemes([]);
      setCurrentTheme(themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1]);
      hasLoadedThemes.current = true;
      return;
    }

    const response = await authFetch('/api/themes');
    if (!response.ok) {
      hasLoadedThemes.current = true;
      return;
    }

    const payload = await response.json();
    const themeList = payload?.data?.themes || [];
    const preferences = payload?.data?.preferences || {};
    const followSystem = Boolean(preferences.follow_system);
    const preferredThemeId = preferences.theme_id as string | undefined;

    setAllThemes(themeList);
    setCustomThemes(themeList.filter((theme: Theme) => theme.isCustom && theme.accessType !== 'shared'));
    setFollowSystemThemeState(followSystem);

    let selectedTheme = themeList.find((theme: Theme) => theme.id === preferredThemeId);

    if (followSystem) {
      const systemPreference = getSystemThemePreference();
      const systemThemeId = getThemeForSystemPreference(systemPreference);
      const systemTheme = themeList.find((theme: Theme) => theme.id === systemThemeId);
      if (systemTheme) {
        selectedTheme = systemTheme;
      }
    }

    if (!selectedTheme) {
      selectedTheme = themeList.find((theme: Theme) => theme.id === DEFAULT_THEME_ID)
        || themeList[0]
        || themes.find(t => t.id === DEFAULT_THEME_ID)
        || themes[1];
    }

    setCurrentTheme(selectedTheme);
    hasLoadedThemes.current = true;
  }, []);

  const addCustomTheme = async (theme: Theme) => {
    const response = await authFetch('/api/themes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(theme),
    });

    if (!response.ok) {
      throw new Error('Failed to add custom theme');
    }

    await fetchThemes();
    if (theme.id) {
      setTheme(theme.id);
    }
  };

  const updateCustomTheme = async (updatedTheme: Theme) => {
    const response = await authFetch(`/api/themes/${updatedTheme.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTheme),
    });

    if (!response.ok) {
      throw new Error('Failed to update custom theme');
    }

    await fetchThemes();
  };

  const updateDefaultTheme = async (updatedTheme: Theme): Promise<void> => {
    const response = await authFetch(`/api/themes/${updatedTheme.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTheme),
    });

    if (!response.ok) {
      throw new Error('Failed to update default theme');
    }

    await fetchThemes();
  };

  const deleteCustomTheme = async (themeId: string) => {
    const response = await authFetch(`/api/themes/${themeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete custom theme');
    }

    await fetchThemes();
    if (currentTheme.id === themeId) {
      const defaultTheme = themes.find(t => t.id === DEFAULT_THEME_ID) || themes[1];
      setTheme(defaultTheme.id);
    }
  };

  const shareTheme = async (themeId: string, email: string) => {
    const response = await authFetch(`/api/themes/${themeId}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Failed to share theme');
    }
  };

  const unshareTheme = async (themeId: string, email: string) => {
    const response = await authFetch(`/api/themes/${themeId}/share`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.error || 'Failed to unshare theme');
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

  // Apply system theme once themes are loaded or updated
  useEffect(() => {
    if (!followSystemTheme || !hasLoadedThemes.current) return;
    applySystemTheme();
  }, [followSystemTheme, allThemes]);

  useEffect(() => {
    void fetchThemes();
  }, [fetchThemes]);

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
      updateDefaultTheme,
      deleteCustomTheme,
      shareTheme,
      unshareTheme,
      followSystemTheme,
      setFollowSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
