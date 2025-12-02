import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserManagement from './settings/UserManagement';
import WorkflowSettings from './settings/WorkflowSettings';
import SystemSettings from './settings/SystemSettings';

type TabType = 'users' | 'workflow' | 'system';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  component: React.ComponentType;
  requiredPermission?: string;
  description: string;
}

const Settings: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: Tab[] = [
    {
      id: 'users',
      label: 'User Management',
      icon: '👥',
      component: UserManagement,
      requiredPermission: 'users.read',
      description: 'Manage users, roles, and permissions'
    },
    {
      id: 'workflow',
      label: 'Workflow Settings',
      icon: '⚙️',
      component: WorkflowSettings,
      requiredPermission: 'settings.read',
      description: 'Configure approval and activity workflows'
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: '🔧',
      component: SystemSettings,
      requiredPermission: 'settings.read',
      description: 'General system configuration'
    }
  ];

  // Filter tabs based on permissions
  const availableTabs = tabs.filter(tab => {
    if (!tab.requiredPermission) return true;
    const [resource, action] = tab.requiredPermission.split('.');
    return user?.is_system_admin || hasPermission(resource, action);
  });

  const activeTabData = availableTabs.find(t => t.id === activeTab) || availableTabs[0];
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage system configuration and preferences</p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden ml-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex space-x-1 pb-px">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group relative flex items-center space-x-3 px-6 py-3 text-sm font-medium rounded-t-xl
                  transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }
                `}
              >
                <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className="font-semibold">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Tabs Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-2">
              {availableTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left
                    transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 shadow-sm border-2 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
                    }
                  `}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs text-gray-500 truncate">{tab.description}</div>
                  </div>
                  {activeTab === tab.id && (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active Tab Info Card - Mobile */}
        <div className="lg:hidden mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{activeTabData?.icon}</span>
            <div>
              <h2 className="text-lg font-bold">{activeTabData?.label}</h2>
              <p className="text-sm text-blue-100">{activeTabData?.description}</p>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          {ActiveComponent ? (
            <div className="p-4 sm:p-6 lg:p-8">
              <ActiveComponent />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No content available</p>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Need help? Contact your system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
