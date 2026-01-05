import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose(); // Close mobile menu after navigation
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '??';
    if (user.full_name) {
      const names = user.full_name.split(' ');
      return names.length >= 2
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  // Check if user can access a menu item
  const canAccessMenuItem = (item: any): boolean => {
    // If no permission required, accessible to all
    if (!item.resource || !item.action) return true;

    // Check if user has explicit permission
    let hasAccess = hasPermission(item.resource, item.action);

    // If no explicit permission but item allows module access, check module assignments
    if (!hasAccess && item.allowWithModuleAccess) {
      hasAccess = !!(user?.module_assignments && user.module_assignments.length > 0);
    }

    return hasAccess;
  };

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        {
          icon: '🏠',
          label: 'Dashboard',
          path: '/dashboard',
          description: 'Overview & Analytics',
          resource: 'reports',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '📊',
          label: 'Programs',
          path: '/',
          description: 'Program Modules',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        }
      ]
    },
    {
      section: 'IMPLEMENTATION',
      items: [
        {
          icon: '✓',
          label: 'Activities',
          path: '/activities',
          description: 'Field Activities',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '👥',
          label: 'Beneficiaries',
          path: '/beneficiaries',
          description: 'Beneficiary Registry',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '👪',
          label: 'SHG Groups',
          path: '/shg',
          description: 'Self-Help Groups',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '💰',
          label: 'Loans',
          path: '/loans',
          description: 'Loan Management',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '⚖️',
          label: 'GBV Cases',
          path: '/gbv',
          description: 'GBV Case Management',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '🎁',
          label: 'Relief',
          path: '/relief',
          description: 'Relief Distribution',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '🥗',
          label: 'Nutrition',
          path: '/nutrition',
          description: 'Nutrition Assessment',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        }
      ]
    },
    {
      section: 'FINANCE & RESOURCES',
      items: [
        {
          icon: '💰',
          label: 'Finance',
          path: '/finance',
          description: 'Budget & Expenditure',
          resource: 'reports',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '🏗️',
          label: 'Resources',
          path: '/resources',
          description: 'Asset Management',
          resource: 'activities',
          action: 'read',
          allowWithModuleAccess: true
        }
      ]
    },
    {
      section: 'LOGFRAME & M&E',
      items: [
        {
          icon: '📐',
          label: 'Logframe Dashboard',
          path: '/logframe',
          description: 'RBM Overview',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '📊',
          label: 'Indicators',
          path: '/logframe/indicators',
          description: 'SMART Indicators',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '🔗',
          label: 'Results Chain',
          path: '/logframe/results-chain',
          description: 'Contribution Links',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '📋',
          label: 'Verification',
          path: '/logframe/verification',
          description: 'Evidence & MoV',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '⚠️',
          label: 'Assumptions',
          path: '/logframe/assumptions',
          description: 'Risk Management',
          resource: 'modules',
          action: 'read',
          allowWithModuleAccess: true
        },
        {
          icon: '✅',
          label: 'Approvals',
          path: '/approvals',
          description: 'Review Activities',
          resource: 'activities',
          action: 'approve',
          allowWithModuleAccess: true
        }
      ]
    },
    {
      section: 'ANALYTICS & INSIGHTS',
      items: [
        {
          icon: '📈',
          label: 'Reports & Analytics',
          path: '/reports',
          description: 'AI-Powered Insights',
          resource: 'reports',
          action: 'read',
          allowWithModuleAccess: true
        }
      ]
    },
    {
      section: 'SYSTEM',
      items: [
        {
          icon: '⚙️',
          label: 'Settings',
          path: '/settings',
          description: 'System Settings',
          resource: 'settings',
          action: 'read',
          allowWithModuleAccess: false
        }
      ]
    }
  ];

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems
    .map(section => ({
      ...section,
      items: section.items.filter(item => canAccessMenuItem(item))
    }))
    .filter(section => section.items.length > 0); // Remove empty sections

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen transition-all duration-300 shadow-2xl z-50 ${
          isExpanded ? 'w-72' : 'w-20'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{
          background: 'var(--sidebar-background)',
          color: 'var(--sidebar-text)'
        }}
      >
        {/* Header with Logo */}
        <div className="p-4 lg:p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <img
                    src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                    alt="Caritas Nairobi"
                    className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-base lg:text-lg leading-tight truncate">Caritas Nairobi</h1>
                  <p className="text-xs opacity-80">M&E System</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto">
                <img
                  src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                  alt="Caritas"
                  className="w-8 h-8 object-contain"
                />
              </div>
            )}

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ background: 'var(--sidebar-hover)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle Button - Desktop only */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 rounded-full items-center justify-center text-xs transition-colors shadow-lg"
            style={{
              background: 'var(--accent-primary)',
              color: 'white'
            }}
          >
            {isExpanded ? '‹' : '›'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="overflow-y-auto h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] py-4 custom-scrollbar">
          {filteredMenuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {isExpanded && (
                <h3 className="px-6 text-xs font-semibold uppercase tracking-wider mb-2 opacity-60">
                  {section.section}
                </h3>
              )}
              <div className="space-y-1 px-3">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    onClick={() => handleNavigate(item.path)}
                    className="w-full flex items-center space-x-3 px-3 py-3 lg:py-3 rounded-lg transition-all duration-200 group active:scale-95 border-l-4"
                    style={{
                      background: isActive(item.path) ? 'var(--sidebar-active-item)' : 'transparent',
                      borderLeftColor: isActive(item.path) ? 'var(--sidebar-active-border)' : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.background = 'var(--sidebar-hover)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive(item.path)) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                    title={!isExpanded ? item.label : ''}
                  >
                    <span className="text-xl lg:text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    {isExpanded && (
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium text-sm truncate">{item.label}</div>
                        <div className="text-xs opacity-75 truncate">
                          {item.description}
                        </div>
                      </div>
                    )}
                    {isExpanded && isActive(item.path) && (
                      <div
                        className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ background: 'var(--sidebar-active-border)' }}
                      ></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - User Info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t backdrop-blur"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          {isExpanded ? (
            <div className="flex items-center space-x-3">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || user.username}
                  className="w-10 h-10 rounded-full object-cover shadow-lg flex-shrink-0"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg flex-shrink-0 text-sm"
                  style={{
                    background: 'var(--accent-gradient)',
                    color: 'white'
                  }}
                >
                  {getUserInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.full_name || user?.username || 'User'}
                </p>
                <p className="text-xs opacity-70 truncate">
                  {user?.email || ''}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || user.username}
                  className="w-10 h-10 rounded-full object-cover shadow-lg"
                  title={`${user.full_name || user.username} - Click to logout`}
                  onClick={handleLogout}
                />
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg text-sm hover:scale-105 transition-transform"
                  style={{
                    background: 'var(--accent-gradient)',
                    color: 'white'
                  }}
                  title="Logout"
                >
                  {getUserInitials()}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
