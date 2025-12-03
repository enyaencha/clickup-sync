import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_system_admin: boolean;
  roles: Array<{ id: number; name: string; display_name: string }>;
}

interface EditUserModalEnhancedProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
  description: string;
  scope: string;
}

interface Program {
  id: number;
  name: string;
  description?: string;
}

interface ModulePermission {
  module_id: number;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_approve: boolean;
}

const EditUserModalEnhanced: React.FC<EditUserModalEnhancedProps> = ({ user, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'roles' | 'modules'>('basic');

  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    password: '',
    confirmPassword: '',
    is_system_admin: user.is_system_admin,
    role_ids: user.roles?.map(r => r.id) || [],
    is_active: user.is_active,
    module_permissions: [] as ModulePermission[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetchingData(true);
    try {
      await Promise.all([
        fetchRoles(),
        fetchPrograms(),
        fetchUserModulePermissions(),
      ]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(getApiUrl('/api/roles'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRoles(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(getApiUrl('/api/programs'), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPrograms(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  const fetchUserModulePermissions = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/users/${user.id}/modules`), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Transform the response to match ModulePermission structure
        const permissions: ModulePermission[] = (data.data || []).map((perm: any) => ({
          module_id: perm.module_id || perm.program_id,
          can_view: perm.can_view || false,
          can_create: perm.can_create || false,
          can_edit: perm.can_edit || false,
          can_delete: perm.can_delete || false,
          can_approve: perm.can_approve || false,
        }));
        setFormData(prev => ({ ...prev, module_permissions: permissions }));
      }
    } catch (err) {
      console.error('Failed to fetch user module permissions:', err);
      // Set empty array if fetch fails
      setFormData(prev => ({ ...prev, module_permissions: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validation (only if changing password)
    if (formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
    }

    setLoading(true);

    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        is_system_admin: formData.is_system_admin,
        role_ids: formData.role_ids,
        is_active: formData.is_active,
        module_permissions: formData.module_permissions,
      };

      // Only include password if it's being changed
      if (formData.password) {
        payload.password = formData.password;
      }

      const response = await fetch(getApiUrl(`/api/users/${user.id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (roleId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  };

  const handleModuleToggle = (moduleId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFormData(prev => {
      const exists = prev.module_permissions.find(p => p.module_id === moduleId);
      if (exists) {
        // Remove module
        return {
          ...prev,
          module_permissions: prev.module_permissions.filter(p => p.module_id !== moduleId)
        };
      } else {
        // Add module with default permissions
        return {
          ...prev,
          module_permissions: [
            ...prev.module_permissions,
            {
              module_id: moduleId,
              can_view: true,
              can_create: false,
              can_edit: false,
              can_delete: false,
              can_approve: false,
            }
          ]
        };
      }
    });
  };

  const handlePermissionChange = (moduleId: number, permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      module_permissions: prev.module_permissions.map(p =>
        p.module_id === moduleId
          ? { ...p, [permission]: value }
          : p
      )
    }));
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (pwd.length === 0) return { strength: 0, label: '', color: '' };
    if (pwd.length < 8) return { strength: 25, label: 'Too short', color: 'bg-red-500' };

    let strength = 25;
    if (pwd.length >= 12) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 15;
    if (/[a-z]/.test(pwd)) strength += 15;
    if (/[0-9]/.test(pwd)) strength += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 10;

    if (strength < 50) return { strength, label: 'Weak', color: 'bg-orange-500' };
    if (strength < 75) return { strength, label: 'Medium', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();

  const isModuleAssigned = (moduleId: number) => {
    return formData.module_permissions.some(p => p.module_id === moduleId);
  };

  const getModulePermission = (moduleId: number) => {
    return formData.module_permissions.find(p => p.module_id === moduleId);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit User</h2>
                <p className="text-primary-100 text-sm">Update user information, roles, and module access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 bg-neutral-50">
          <nav className="flex px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Basic Info</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Roles</span>
                {formData.role_ids.length > 0 && (
                  <span className="px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {formData.role_ids.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'modules'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Modules</span>
                {formData.module_permissions.length > 0 && (
                  <span className="px-2 py-0.5 bg-accent-600 text-white text-xs font-bold rounded-full">
                    {formData.module_permissions.length}
                  </span>
                )}
              </div>
            </button>
          </nav>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="px-6 py-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start space-x-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Loading State */}
            {fetchingData && (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                <span className="ml-3 text-neutral-600">Loading user data...</span>
              </div>
            )}

            {/* Basic Info Tab */}
            {!fetchingData && activeTab === 'basic' && (
              <div className="space-y-6">
                {/* User ID Badge */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-neutral-50 to-neutral-100 border-2 border-neutral-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {user.full_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{user.full_name}</p>
                      <p className="text-xs text-neutral-600">@{user.username}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white text-xs font-bold rounded-full">
                    ID: {user.id}
                  </span>
                </div>

                {/* Basic Information Fields */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>Basic Information</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span>Change Password (Optional)</span>
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl mb-4">
                    <p className="text-sm text-neutral-700">
                      Leave password fields blank to keep the current password unchanged
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Leave blank to keep current"
                      />
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-neutral-600">Password strength</span>
                            <span className={`font-semibold ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-orange-600'}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${passwordStrength.color} transition-all duration-300`}
                              style={{ width: `${passwordStrength.strength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Repeat new password"
                      />
                      {formData.confirmPassword && (
                        <p className={`mt-1 text-xs ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Account Status</span>
                  </h3>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-5 h-5 text-green-600 border-neutral-300 rounded focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-bold text-neutral-900">Active User Account</span>
                        <p className="text-xs text-neutral-600 mt-0.5">User can login and access the system</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {!fetchingData && activeTab === 'roles' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span>Roles & Permissions</span>
                </h3>

                {/* System Admin Toggle */}
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.is_system_admin}
                      onChange={(e) => setFormData({ ...formData, is_system_admin: e.target.checked })}
                      className="mt-1 w-5 h-5 text-red-600 border-neutral-300 rounded focus:ring-red-500"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
                        <span>System Administrator</span>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">FULL ACCESS</span>
                      </span>
                      <p className="text-xs text-neutral-600 mt-1">Grant unrestricted system access and configuration rights</p>
                    </div>
                  </label>
                </div>

                {/* Role Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const isSelected = formData.role_ids.includes(role.id);
                    return (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm'
                            : 'border-neutral-200 hover:border-primary-300 bg-white'
                        }`}
                        onClick={(e) => handleRoleToggle(role.id, e)}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleRoleToggle(role.id);
                            }}
                            className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 pointer-events-none"
                          />
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-bold text-neutral-900">{role.display_name}</div>
                            <div className="text-xs text-neutral-600 mt-0.5 line-clamp-2">{role.description}</div>
                            <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-bold rounded-full ${
                              role.scope === 'system'
                                ? 'bg-gradient-to-r from-purple-500 to-primary-500 text-white'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                            }`}>
                              {role.scope}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {roles.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <p>No roles available</p>
                  </div>
                )}
              </div>
            )}

            {/* Modules Tab */}
            {!fetchingData && activeTab === 'modules' && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-accent-100 to-accent-200 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span>Module Access</span>
                    </h3>
                    <p className="text-sm text-neutral-600">Assign user to specific programs/modules with granular permissions</p>
                  </div>
                </div>

                {/* Module/Program Selection */}
                <div className="space-y-3">
                  {programs.map((program) => {
                    const isAssigned = isModuleAssigned(program.id);
                    const modulePermission = getModulePermission(program.id);

                    return (
                      <div
                        key={program.id}
                        className={`border-2 rounded-xl transition-all ${
                          isAssigned
                            ? 'border-accent-500 bg-gradient-to-br from-accent-50 to-accent-100'
                            : 'border-neutral-200 bg-white hover:border-accent-300'
                        }`}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={(e) => handleModuleToggle(program.id, e)}
                        >
                          <div className="flex items-start">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleModuleToggle(program.id);
                              }}
                              className="mt-1 w-5 h-5 text-accent-600 border-neutral-300 rounded focus:ring-accent-500 pointer-events-none"
                            />
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-bold text-neutral-900">{program.name}</div>
                              {program.description && (
                                <div className="text-xs text-neutral-600 mt-0.5">{program.description}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Granular Permissions */}
                        {isAssigned && modulePermission && (
                          <div className="px-4 pb-4 pt-2 border-t border-accent-200">
                            <p className="text-xs font-semibold text-neutral-700 mb-3">Permissions:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { key: 'can_view', label: 'View', icon: '👁️' },
                                { key: 'can_create', label: 'Create', icon: '➕' },
                                { key: 'can_edit', label: 'Edit', icon: '✏️' },
                                { key: 'can_delete', label: 'Delete', icon: '🗑️' },
                                { key: 'can_approve', label: 'Approve', icon: '✅' },
                              ].map(({ key, label, icon }) => (
                                <label
                                  key={key}
                                  className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-neutral-200 hover:border-accent-400 cursor-pointer transition-all"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <input
                                    type="checkbox"
                                    checked={modulePermission[key as keyof ModulePermission] as boolean}
                                    onChange={(e) => handlePermissionChange(program.id, key, e.target.checked)}
                                    className="w-4 h-4 text-accent-600 border-neutral-300 rounded focus:ring-accent-500"
                                  />
                                  <span className="text-xs font-medium text-neutral-700 flex items-center space-x-1">
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {programs.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <p>No programs/modules available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-neutral-300 rounded-xl text-neutral-700 font-semibold hover:bg-neutral-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || fetchingData}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModalEnhanced;
