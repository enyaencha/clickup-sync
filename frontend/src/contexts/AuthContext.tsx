import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getApiUrl } from '../config/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_picture?: string;
  is_system_admin: boolean;
  roles: Array<{
    id: number;
    name: string;
    display_name: string;
    scope: string;
    level: number;
  }>;
  permissions: Array<{
    resource: string;
    action: string;
    applies_to: string;
  }>;
  module_assignments: Array<{
    module_id: number;
    module_name: string;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_approve: boolean;
  }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (roleName: string) => boolean;
  canAccessModule: (moduleId: number) => boolean;
  getDefaultLandingPage: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const url = getApiUrl('/api/auth/login');
    console.log('🔐 Login attempt to:', url);
    console.log('📧 Email:', email);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📥 Login response status:', response.status);

    const data = await response.json();
    console.log('📦 Login response data:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    setToken(data.data.token);
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    return user.permissions?.some(
      (p) => p.resource === resource && p.action === action
    ) || false;
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    return user.roles?.some((r) => r.name === roleName) || false;
  };

  const canAccessModule = (moduleId: number): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    return user.module_assignments?.some(
      (m) => m.module_id === moduleId && m.can_view
    ) || false;
  };

  const getDefaultLandingPage = useCallback((): string => {
    if (!user) return '/';

    // System admin goes to dashboard
    if (user.is_system_admin) return '/';

    // If user has module assignments, redirect to their first assigned module
    if (user.module_assignments && user.module_assignments.length > 0) {
      const firstModule = user.module_assignments[0];
      return `/programs/${firstModule.module_id}`;
    }

    // Check for specific role-based landing pages
    const roleHierarchy = [
      { role: 'me_director', path: '/' },
      { role: 'me_manager', path: '/' },
      { role: 'module_manager', path: '/programs' },
      { role: 'module_coordinator', path: '/programs' },
      { role: 'field_officer', path: '/programs' },
      { role: 'finance_officer', path: '/' },
      { role: 'report_viewer', path: '/' },
      { role: 'verification_officer', path: '/' },
      { role: 'data_entry_clerk', path: '/programs' },
    ];

    for (const { role, path } of roleHierarchy) {
      // Check if user has this role
      if (user.roles?.some((r) => r.name === role)) {
        return path;
      }
    }

    // Default fallback
    return '/';
  }, [user]);

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    hasPermission,
    hasRole,
    canAccessModule,
    getDefaultLandingPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
