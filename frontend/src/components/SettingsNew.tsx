import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './settings/UserManagement';
import WorkflowSettings from './settings/WorkflowSettings';
import SystemSettings from './settings/SystemSettings';

type TabType = 'users' | 'workflow' | 'system' | 'profile';

const Settings: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');

  const tabs = [
    {
      id: 'users' as TabType,
      label: 'User Management',
      icon: '👥',
      component: UserManagement,
      permission: 'users.read.all',
      description: 'Manage users, roles, and permissions'
    },
    {
      id: 'workflow' as TabType,
      label: 'Workflow Settings',
      icon: '⚙️',
      component: WorkflowSettings,
      permission: 'settings.update',
      description: 'Configure approval and activity workflows'
    },
    {
      id: 'system' as TabType,
      label: 'System Settings',
      icon: '🔧',
      component: SystemSettings,
      permission: 'settings.read',
      description: 'General system configuration'
    }
  ];

  // Filter tabs based on permissions
  const availableTabs = tabs.filter(tab =>
    !tab.permission || hasPermission('settings', 'read') || user?.is_system_admin
  );

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your system configuration, users, and preferences
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 border-b border-gray-200 -mb-px">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-t-lg
                  transition-all duration-200 border-b-2
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ActiveComponent ? <ActiveComponent /> : (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a tab to view settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
