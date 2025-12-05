import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// SVG Icon Components
const HomeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ProgramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ActivityIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const UsersIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const LocationIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IndicatorIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const LinkIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const DocumentIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const WarningIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ReportIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const SettingsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SyncIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const GroupIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MoneyIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TruckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const NutritionIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AgricultureIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  description: string;
  permission?: string; // Permission required to view this menu item
  resource?: string; // Resource name for permission check
  action?: string; // Action name for permission check
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const SidebarRefactored: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  // Check if user has permission for a menu item
  const canAccessMenuItem = (item: MenuItem): boolean => {
    // If no permission is specified, item is accessible to all authenticated users
    if (!item.resource || !item.action) return true;

    // Defensive check: if user is not fully loaded, don't evaluate permissions
    // This prevents issues during login/logout transitions
    if (!user) return false;

    // System admins have access to everything
    if (user.is_system_admin) return true;

    // Check if user has module assignments - users with modules can access module-related features
    const hasModuleAssignments = user.module_assignments && user.module_assignments.length > 0;

    if (hasModuleAssignments) {
      // Module-related menu items that should be accessible to users with module assignments
      const moduleRelatedResources = ['programs', 'activities', 'logframe', 'indicators',
                                       'results_chain', 'means_of_verification', 'assumptions',
                                       'reports', 'beneficiaries', 'locations'];

      if (moduleRelatedResources.includes(item.resource)) {
        // Check if user has appropriate permission in their module assignments
        const hasModulePermission = user.module_assignments.some(assignment => {
          // Map actions to module permission flags
          if (item.action === 'view') return assignment.can_view;
          if (item.action === 'create') return assignment.can_create;
          if (item.action === 'edit') return assignment.can_edit;
          if (item.action === 'delete') return assignment.can_delete;
          if (item.action === 'approve') return assignment.can_approve;
          return false;
        });

        if (hasModulePermission) return true;
      }
    }

    // Check role-based access
    if (user.roles && Array.isArray(user.roles)) {
      // Role-based menu access mapping
      const roleResourceMap: Record<string, string[]> = {
        'me_director': ['dashboard', 'programs', 'activities', 'logframe', 'indicators', 'results_chain',
                       'means_of_verification', 'assumptions', 'reports', 'beneficiaries', 'locations', 'settings'],
        'me_manager': ['dashboard', 'programs', 'activities', 'logframe', 'indicators', 'results_chain',
                      'means_of_verification', 'assumptions', 'reports', 'beneficiaries', 'locations', 'settings'],
        'module_manager': ['programs', 'activities', 'logframe', 'indicators', 'results_chain',
                          'means_of_verification', 'assumptions', 'reports', 'beneficiaries', 'locations'],
        'module_coordinator': ['programs', 'activities', 'indicators', 'beneficiaries', 'locations', 'reports'],
        'field_officer': ['programs', 'activities', 'beneficiaries', 'locations'],
        'finance_officer': ['programs', 'activities', 'reports'],
        'report_viewer': ['reports'], // Report viewers ONLY see reports
        'verification_officer': ['approvals'], // Verification officers ONLY see approvals
        'data_entry_clerk': ['programs', 'activities', 'beneficiaries', 'locations'],
      };

      for (const userRole of user.roles) {
        const allowedResources = roleResourceMap[userRole.name];
        if (allowedResources && allowedResources.includes(item.resource)) {
          return true;
        }
      }
    }

    // Finally, check specific permission from role_permissions
    return hasPermission(item.resource, item.action);
  };

  const menuSections: MenuSection[] = [
    {
      section: 'Main',
      items: [
        {
          icon: HomeIcon,
          label: 'Dashboard',
          path: '/dashboard',
          description: 'Overview & Analytics',
          resource: 'dashboard',
          action: 'view',
        },
        {
          icon: ProgramIcon,
          label: 'Programs',
          path: '/',
          description: 'Program Modules',
          resource: 'programs',
          action: 'view',
        }
      ]
    },
    {
      section: 'Implementation',
      items: [
        {
          icon: ActivityIcon,
          label: 'Activities',
          path: '/activities',
          description: 'Field Activities',
          resource: 'activities',
          action: 'view',
        },
        {
          icon: UsersIcon,
          label: 'Beneficiaries',
          path: '/beneficiaries',
          description: 'Beneficiary Registry',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: GroupIcon,
          label: 'SHG Groups',
          path: '/shg',
          description: 'Self-Help Groups',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: MoneyIcon,
          label: 'Loans',
          path: '/loans',
          description: 'Loan Management',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: ShieldIcon,
          label: 'GBV Cases',
          path: '/gbv',
          description: 'GBV Case Management',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: TruckIcon,
          label: 'Relief',
          path: '/relief',
          description: 'Relief Distribution',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: NutritionIcon,
          label: 'Nutrition',
          path: '/nutrition',
          description: 'Nutrition Assessment',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: AgricultureIcon,
          label: 'Agriculture',
          path: '/agriculture',
          description: 'Agriculture Monitoring',
          resource: 'beneficiaries',
          action: 'view',
        },
        {
          icon: LocationIcon,
          label: 'Locations',
          path: '/locations',
          description: 'Geographic Areas',
          resource: 'locations',
          action: 'view',
        }
      ]
    },
    {
      section: 'Logframe & M&E',
      items: [
        {
          icon: ChartIcon,
          label: 'Logframe Dashboard',
          path: '/logframe',
          description: 'RBM Overview',
          resource: 'logframe',
          action: 'view',
        },
        {
          icon: IndicatorIcon,
          label: 'Indicators',
          path: '/logframe/indicators',
          description: 'SMART Indicators',
          resource: 'indicators',
          action: 'view',
        },
        {
          icon: LinkIcon,
          label: 'Results Chain',
          path: '/logframe/results-chain',
          description: 'Contribution Links',
          resource: 'results_chain',
          action: 'view',
        },
        {
          icon: DocumentIcon,
          label: 'Verification',
          path: '/logframe/verification',
          description: 'Evidence & MoV',
          resource: 'means_of_verification',
          action: 'view',
        },
        {
          icon: WarningIcon,
          label: 'Assumptions',
          path: '/logframe/assumptions',
          description: 'Risk Management',
          resource: 'assumptions',
          action: 'view',
        },
        {
          icon: CheckIcon,
          label: 'Approvals',
          path: '/approvals',
          description: 'Review Activities',
          resource: 'approvals',
          action: 'view',
        }
      ]
    },
    {
      section: 'Reports',
      items: [
        {
          icon: ReportIcon,
          label: 'Analytics',
          path: '/reports',
          description: 'Analytics & Reports',
          resource: 'reports',
          action: 'view',
        }
      ]
    },
    {
      section: 'System',
      items: [
        {
          icon: SettingsIcon,
          label: 'Settings',
          path: '/settings',
          description: 'System Settings',
          resource: 'settings',
          action: 'manage',
        },
        {
          icon: SyncIcon,
          label: 'Sync Status',
          path: '/sync',
          description: 'ClickUp Integration',
          resource: 'sync',
          action: 'view',
        }
      ]
    }
  ];

  // Filter menu sections to only show items the user has access to
  const filteredMenuSections = menuSections.map(section => ({
    ...section,
    items: section.items.filter(canAccessMenuItem)
  })).filter(section => section.items.length > 0); // Remove empty sections

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white transition-all duration-300 shadow-hard z-50 ${
          isExpanded ? 'w-72' : 'w-20'
        } ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header with Logo */}
        <div className="p-4 lg:p-5 border-b border-primary-600/30 bg-primary-900/30">
          <div className="flex items-center justify-between">
            {isExpanded ? (
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <img
                    src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                    alt="Caritas Nairobi"
                    className="w-9 h-9 object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-base lg:text-lg leading-tight truncate">Caritas Nairobi</h1>
                  <p className="text-xs text-primary-200">M&E System</p>
                </div>
              </div>
            ) : (
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <img
                  src="https://imgs.search.brave.com/PNdTlANN4NjysSONK0pXebhL-xL6RK-nVoIgcy_oPMo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly9ob2x5/Y3Jvc3NkYW5kb3Jh/c2hnLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMS8wOC9X/aGF0c0FwcC1JbWFn/ZS0yMDIxLTA4LTIz/LWF0LTkuMzYuNTAt/QU0tMzAweDExMy5q/cGVn"
                  alt="Caritas"
                  className="w-9 h-9 object-contain"
                />
              </div>
            )}

            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-primary-600/50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle Button - Desktop only */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex absolute -right-3 top-7 w-6 h-6 bg-primary-600 rounded-full items-center justify-center text-xs hover:bg-primary-500 transition-all shadow-lg hover:scale-110"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? '‹' : '›'}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="overflow-y-auto h-[calc(100vh-180px)] lg:h-[calc(100vh-160px)] py-3 custom-scrollbar">
          {filteredMenuSections.map((section, idx) => (
            <div key={idx} className="mb-5">
              {isExpanded && (
                <h3 className="px-5 text-xs font-semibold text-primary-200 uppercase tracking-wider mb-2">
                  {section.section}
                </h3>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => handleNavigate(item.path)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                        isActive(item.path)
                          ? 'bg-white/15 shadow-soft border-l-4 border-accent-500'
                          : 'hover:bg-white/10 border-l-4 border-transparent hover:border-primary-400'
                      }`}
                      title={!isExpanded ? item.label : ''}
                      aria-label={item.label}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-accent-500/20'
                          : 'bg-primary-600/20 group-hover:bg-primary-600/30'
                      }`}>
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive(item.path) ? 'text-accent-400' : 'text-primary-200 group-hover:text-white'} transition-colors`} />
                      </div>
                      {isExpanded && (
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-sm truncate">{item.label}</div>
                          <div className="text-xs text-primary-300 opacity-80 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                      {isExpanded && isActive(item.path) && (
                        <div className="w-1.5 h-1.5 bg-accent-400 rounded-full animate-pulse flex-shrink-0"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 border-t border-primary-600/30 bg-primary-900/40 backdrop-blur">
          {isExpanded ? (
            <div className="flex items-center space-x-3">
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || user.username}
                  className="w-10 h-10 rounded-full object-cover shadow-lg flex-shrink-0 ring-2 ring-primary-400/50"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg flex-shrink-0 text-sm ring-2 ring-primary-400/50">
                  {getUserInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.full_name || user?.username || 'User'}
                </p>
                <p className="text-xs text-primary-200 truncate">
                  {user?.roles?.[0]?.display_name || user?.email || ''}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-primary-200 hover:text-white transition-colors flex-shrink-0 p-1.5 hover:bg-primary-600/50 rounded-lg"
                title="Logout"
                aria-label="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              {user?.profile_picture ? (
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-primary-400/50 hover:ring-accent-400 transition-all"
                  title="Logout"
                  aria-label="Logout"
                >
                  <img
                    src={user.profile_picture}
                    alt={user.full_name || user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg text-sm hover:scale-105 transition-transform ring-2 ring-primary-400/50 hover:ring-accent-400"
                  title="Logout"
                  aria-label="Logout"
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

export default SidebarRefactored;
