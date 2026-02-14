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
  canAccessFeature: (feature: string) => boolean;
  canAccessModule: (moduleId: number) => boolean;
  canPerformModuleAction: (moduleId: number, action: 'view' | 'create' | 'edit' | 'delete' | 'approve') => boolean;
  canModifyResource: (resourceOwnerId: number | null, resourceCreatorId: number | null, action: 'edit' | 'delete') => boolean;
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

  const decodeJwtPayload = (jwtToken: string): any | null => {
    try {
      const payload = jwtToken.split('.')[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
      const decoded = atob(padded);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  const isTokenExpired = (jwtToken: string): boolean => {
    const payload = decodeJwtPayload(jwtToken);
    if (!payload || typeof payload.exp !== 'number') return false;
    return Date.now() >= payload.exp * 1000;
  };

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        if (isTokenExpired(storedToken)) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } else {
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

  const canAccessFeature = (feature: string): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;
    if (feature === 'settings') return true;

    if (!user.roles || user.roles.length === 0) return false;

    const roleFeatureMap: Record<string, string[]> = {
      // Level 1: System Administration
      system_admin: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'shg', 'loans', 'gbv',
        'relief', 'nutrition', 'agriculture', 'locations', 'logframe', 'indicators',
        'results_chain', 'verification', 'assumptions', 'approvals', 'reports',
        'finance', 'resources', 'settings', 'sync'
      ],

      // Level 2: Directors & Senior Management
      me_director: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'logframe',
        'indicators', 'results_chain', 'verification', 'assumptions', 'approvals', 'reports', 'settings'
      ],
      program_director: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'logframe',
        'indicators', 'results_chain', 'verification', 'assumptions', 'approvals', 'reports'
      ],
      module_manager: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'logframe',
        'indicators', 'results_chain', 'verification', 'assumptions', 'approvals', 'reports'
      ],

      // Level 3: Managers & Coordinators
      me_manager: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'logframe',
        'indicators', 'results_chain', 'verification', 'assumptions', 'approvals', 'reports'
      ],
      program_manager: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'reports'],
      finance_manager: ['dashboard', 'programs', 'activities', 'beneficiaries', 'reports', 'finance'],
      logistics_manager: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'reports', 'resources'],
      relief_coordinator: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'reports', 'relief'],
      seep_coordinator: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'reports', 'shg', 'loans'],

      // Level 4: Officers & Specialists
      me_officer: [
        'dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'logframe',
        'indicators', 'results_chain', 'verification', 'assumptions', 'reports'
      ],
      data_analyst: ['dashboard', 'programs', 'activities', 'indicators', 'reports'],
      finance_officer: ['programs', 'activities', 'beneficiaries', 'reports', 'finance'],
      procurement_officer: ['programs', 'activities', 'beneficiaries', 'reports', 'resources'],
      program_officer: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'reports'],
      technical_advisor: ['dashboard', 'programs', 'activities', 'beneficiaries', 'locations', 'indicators', 'reports'],
      module_coordinator: ['programs', 'activities', 'beneficiaries', 'locations', 'indicators', 'reports'],

      // Specialists (Program-specific)
      gbv_specialist: ['programs', 'activities', 'beneficiaries', 'locations', 'reports', 'gbv'],
      nutrition_specialist: ['programs', 'activities', 'beneficiaries', 'locations', 'reports', 'nutrition'],
      agriculture_specialist: ['programs', 'activities', 'beneficiaries', 'locations', 'reports', 'agriculture'],

      // Level 5: Field Staff
      field_officer: ['dashboard', 'programs', 'activities', 'beneficiaries', 'settings'],
      community_mobilizer: ['dashboard', 'programs', 'activities', 'beneficiaries', 'settings'],
      data_entry_officer: ['dashboard', 'programs', 'activities', 'beneficiaries', 'settings'],
      data_entry_clerk: ['dashboard', 'programs', 'activities', 'beneficiaries', 'settings'],
      enumerator: ['dashboard', 'programs', 'activities', 'beneficiaries', 'settings'],

      // Level 6: Specialized & Restricted Roles
      approver: ['approvals', 'programs', 'activities', 'reports'],
      verification_officer: ['approvals', 'verification', 'programs', 'activities'],
      report_viewer: ['dashboard', 'reports'],
      module_viewer: ['programs', 'reports'],
      external_auditor: ['dashboard', 'reports', 'programs', 'activities']
    };

    for (const role of user.roles) {
      const allowedFeatures = roleFeatureMap[role.name];
      if (allowedFeatures && allowedFeatures.includes(feature)) {
        return true;
      }
    }

    return false;
  };

  const canAccessModule = (moduleId: number): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    return user.module_assignments?.some(
      (m) => m.module_id === moduleId && m.can_view
    ) || false;
  };

  // Check if user can perform a specific action on a module
  const canPerformModuleAction = (moduleId: number, action: 'view' | 'create' | 'edit' | 'delete' | 'approve'): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    const assignment = user.module_assignments?.find(m => m.module_id === moduleId);
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
  };

  // Check if user can edit/delete based on ownership
  const canModifyResource = (resourceOwnerId: number | null, resourceCreatorId: number | null, action: 'edit' | 'delete'): boolean => {
    if (!user) return false;
    if (user.is_system_admin) return true;

    // User can modify if they own it or created it
    if (resourceOwnerId === user.id || resourceCreatorId === user.id) return true;

    // Otherwise check if they have the permission via roles
    return hasPermission('activities', action); // Generic check for any resource
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
      { role: 'verification_officer', path: '/approvals' }, // Verification officers go to approvals ONLY
      { role: 'report_viewer', path: '/reports' }, // Report viewers go to reports ONLY
      { role: 'me_director', path: '/dashboard' },
      { role: 'me_manager', path: '/dashboard' },
      { role: 'module_manager', path: '/' },
      { role: 'module_coordinator', path: '/' },
      { role: 'field_officer', path: '/' },
      { role: 'finance_officer', path: '/' },
      { role: 'data_entry_clerk', path: '/' },
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
    canAccessFeature,
    canAccessModule,
    canPerformModuleAction,
    canModifyResource,
    getDefaultLandingPage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
