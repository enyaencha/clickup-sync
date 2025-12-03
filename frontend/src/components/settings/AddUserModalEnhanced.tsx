import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getApiUrl } from '../../config/api';

interface AddUserModalProps {
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

const AddUserModalEnhanced: React.FC<AddUserModalProps> = ({ onClose, onSuccess }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'roles' | 'modules'>('basic');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    is_system_admin: false,
    role_ids: [] as number[],
    is_active: true,
    module_permissions: [] as ModulePermission[],
  });

  useEffect(() => {
    fetchRoles();
    fetchPrograms();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(getApiUrl('/api/roles'), {
        headers: { 'Authorization': `Bearer ${token}` },
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
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch programs:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/users'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          is_system_admin: formData.is_system_admin,
          role_ids: formData.role_ids,
          is_active: formData.is_active,
          module_permissions: formData.module_permissions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = (roleId: number, e?: React.MouseEvent) => {
    e?.stopPropagation(); // Prevent double-firing
    setFormData(prev => ({
      ...prev,
      role_ids: prev.role_ids.includes(roleId)
        ? prev.role_ids.filter(id => id !== roleId)
        : [...prev.role_ids, roleId]
    }));
  };

  const handleModulePermissionToggle = (moduleId: number) => {
    setFormData(prev => {
      const existing = prev.module_permissions.find(p => p.module_id === moduleId);
      if (existing) {
        return {
          ...prev,
          module_permissions: prev.module_permissions.filter(p => p.module_id !== moduleId)
        };
      } else {
        return {
          ...prev,
          module_permissions: [...prev.module_permissions, {
            module_id: moduleId,
            can_view: true,
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_approve: false,
          }]
        };
      }
    });
  };

  const handlePermissionChange = (moduleId: number, permission: keyof Omit<ModulePermission, 'module_id'>, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      module_permissions: prev.module_permissions.map(p =>
        p.module_id === moduleId ? { ...p, [permission]: value } : p
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New User</h2>
                <p className="text-primary-100 text-sm">Create a new user account with roles and module access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'basic'
                  ? 'bg-white text-primary-700'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'roles'
                  ? 'bg-white text-primary-700'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Roles ({formData.role_ids.length})
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'modules'
                  ? 'bg-white text-primary-700'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Modules ({formData.module_permissions.length})
            </button>
          </div>
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

            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
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
                      placeholder="john.doe"
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
                      placeholder="John Doe"
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
                      placeholder="john.doe@caritas.org"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Min. 8 characters"
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
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Repeat password"
                    />
                    {formData.confirmPassword && (
                      <p className={`mt-1 text-xs ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                        {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>
                </div>

                {/* System Admin & Active Status */}
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_system_admin}
                        onChange={(e) => setFormData({ ...formData, is_system_admin: e.target.checked })}
                        className="mt-1 w-5 h-5 text-red-600 border-neutral-300 rounded focus:ring-red-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-bold text-neutral-900">System Administrator</span>
                        <p className="text-xs text-neutral-600 mt-0.5">Full unrestricted access to all features</p>
                      </div>
                    </label>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="mt-1 w-5 h-5 text-green-600 border-neutral-300 rounded focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-bold text-neutral-900">Active Account</span>
                        <p className="text-xs text-neutral-600 mt-0.5">User can login immediately</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Select one or more roles for this user. Click to toggle selection.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const isSelected = formData.role_ids.includes(role.id);
                    return (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${
                          isSelected
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm'
                            : 'border-neutral-200 hover:border-primary-300 bg-white'
                        }`}
                        onClick={() => handleRoleToggle(role.id)}
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
                            <div className="text-xs text-neutral-600 mt-0.5">{role.description}</div>
                            <span className={`inline-block mt-2 px-2.5 py-1 text-xs font-bold rounded-full ${
                              role.scope === 'system'
                                ? 'bg-primary-500 text-white'
                                : 'bg-accent-500 text-white'
                            }`}>
                              {role.scope}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Modules Tab */}
            {activeTab === 'modules' && (
              <div>
                <p className="text-sm text-neutral-600 mb-4">Assign specific programs/modules to this user with granular permissions.</p>
                <div className="space-y-3">
                  {programs.map((program) => {
                    const modulePermission = formData.module_permissions.find(p => p.module_id === program.id);
                    const isAssigned = !!modulePermission;

                    return (
                      <div
                        key={program.id}
                        className={`border-2 rounded-xl transition-all ${
                          isAssigned
                            ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100'
                            : 'border-neutral-200 bg-white'
                        }`}
                      >
                        <div className="p-4">
                          <label className="flex items-start cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              onChange={() => handleModulePermissionToggle(program.id)}
                              className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                            />
                            <div className="ml-3 flex-1">
                              <div className="text-sm font-bold text-neutral-900">{program.name}</div>
                              {program.description && (
                                <div className="text-xs text-neutral-600 mt-0.5">{program.description}</div>
                              )}
                            </div>
                          </label>

                          {isAssigned && modulePermission && (
                            <div className="mt-4 pt-4 border-t border-primary-200 grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { key: 'can_view' as const, label: 'View' },
                                { key: 'can_create' as const, label: 'Create' },
                                { key: 'can_edit' as const, label: 'Edit' },
                                { key: 'can_delete' as const, label: 'Delete' },
                                { key: 'can_approve' as const, label: 'Approve' },
                              ].map(({ key, label }) => (
                                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={modulePermission[key]}
                                    onChange={(e) => handlePermissionChange(program.id, key, e.target.checked)}
                                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                                  />
                                  <span className="text-xs font-medium text-neutral-700">{label}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-soft hover:shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModalEnhanced;
