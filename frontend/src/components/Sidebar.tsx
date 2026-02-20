import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
  isExpanded: boolean;
  onExpandedChange: (next: boolean) => void;
}

type IconProps = {
  className?: string;
};

type BadgeTone = 'danger' | 'warning' | 'info';

interface MenuItem {
  icon: React.ComponentType<IconProps>;
  label: string;
  path: string;
  feature: string;
  badge?: {
    value: string;
    tone: BadgeTone;
  };
}

type MajorGroupKey = 'main' | 'implementation' | 'finance_resources' | 'task';

interface MajorGroup {
  key: MajorGroupKey;
  label: string;
  icon: React.ComponentType<IconProps>;
  items: MenuItem[];
}

const SIDEBAR_EXPANDED_WIDTH = 272;
const SIDEBAR_COLLAPSED_WIDTH = 84;
const SIDEBAR_MARGIN = 16;

const HomeIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
  </svg>
);

const ProgramIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 3.5h7m-3.5-3.5v7" />
  </svg>
);

const ActivityIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8m-8 4h8m-9 12h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5l-1 2h-5l-1-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
  </svg>
);

const ApprovalsIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9.5 12 2.2 2.2 4.8-4.8M12 3l7 3v6c0 5-3.4 8.7-7 9.9C8.4 20.7 5 17 5 12V6l7-3Z" />
  </svg>
);

const BeneficiariesIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 9h6v-1a5 5 0 0 0-6-4.9m0 5.9H2v-1a5 5 0 0 1 10 0v1" />
  </svg>
);

const GroupIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-10 9H3v-1a4 4 0 0 1 8 0v1H7Zm14 0h-4v-1a4 4 0 0 0-6.2-3.3M21 20v-1a4 4 0 0 0-8 0v1h8Z" />
  </svg>
);

const LoanIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Zm0 0 2.5-3h13L21 8M12 11v4m-2-2h4" />
  </svg>
);

const GbvIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3.2 19 6v5.6c0 4.6-3 8-7 9.2-4-1.2-7-4.6-7-9.2V6l7-2.8Zm0 5v4m0 3h.01" />
  </svg>
);

const ReliefIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M6 7V5h12v2M4 7v12h16V7M9 12h6" />
  </svg>
);

const NutritionIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20c4.5 0 8-3.5 8-8 0-4.4-3.4-8-7.8-8-.4 0-.8 0-1.2.1A8 8 0 0 0 9 20Zm0 0c-1.8-1.2-3-3.3-3-5.8S7.2 9.6 9 8.4" />
  </svg>
);

const FinanceIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16v10H4V7Zm3 3h4m2 4h4m-4-7v10" />
  </svg>
);

const ResourceIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h12l3 4-3 4H6L3 8l3-4Zm0 8h12v8H6v-8Z" />
  </svg>
);

const ReportsIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14M7.5 16V9m4 7V5m4 11v-6" />
  </svg>
);

const TaskIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
);

const SettingsIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.5-3.5.9 2-2 3.4-2.2-.3a8.4 8.4 0 0 1-1.7 1l-.3 2.2h-4l-.3-2.2a8.4 8.4 0 0 1-1.7-1l-2.2.3-2-3.4.9-2a8.8 8.8 0 0 1 0-2l-.9-2 2-3.4 2.2.3a8.4 8.4 0 0 1 1.7-1l.3-2.2h4l.3 2.2a8.4 8.4 0 0 1 1.7 1l2.2-.3 2 3.4-.9 2a8.8 8.8 0 0 1 0 2Z" />
  </svg>
);

const LogoutIcon: React.FC<IconProps> = ({ className = 'h-[18px] w-[18px]' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2m-4-5h11m0 0-3-3m3 3-3 3" />
  </svg>
);

const ChevronLeftIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 5-7 7 7 7" />
  </svg>
);

const ChevronRightIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 5 7 7-7 7" />
  </svg>
);

const SearchIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
  </svg>
);

const CloseIcon: React.FC<IconProps> = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const MAJOR_GROUPS: MajorGroup[] = [
  {
    key: 'main',
    label: 'Main',
    icon: HomeIcon,
    items: [
      { icon: HomeIcon, label: 'Dashboard', path: '/dashboard', feature: 'dashboard' },
      { icon: ProgramIcon, label: 'Programs', path: '/', feature: 'programs' },
      { icon: ReportsIcon, label: 'Reports & Insights', path: '/reports', feature: 'reports' }
    ]
  },
  {
    key: 'implementation',
    label: 'Implementation',
    icon: ActivityIcon,
    items: [
      { icon: ActivityIcon, label: 'Activities', path: '/activities', feature: 'activities' },
      { icon: ApprovalsIcon, label: 'Approvals', path: '/approvals', feature: 'approvals', badge: { value: '5', tone: 'info' } },
      { icon: BeneficiariesIcon, label: 'Beneficiaries', path: '/beneficiaries', feature: 'beneficiaries' },
      { icon: GroupIcon, label: 'SHG Groups', path: '/shg', feature: 'shg', badge: { value: '3', tone: 'warning' } },
      { icon: LoanIcon, label: 'Loans', path: '/loans', feature: 'loans' },
      { icon: GbvIcon, label: 'GBV Cases', path: '/gbv', feature: 'gbv', badge: { value: '2', tone: 'danger' } },
      { icon: ReliefIcon, label: 'Relief', path: '/relief', feature: 'relief' },
      { icon: NutritionIcon, label: 'Nutrition', path: '/nutrition', feature: 'nutrition' }
    ]
  },
  {
    key: 'finance_resources',
    label: 'Finance & Resources',
    icon: FinanceIcon,
    items: [
      { icon: FinanceIcon, label: 'Finance', path: '/finance', feature: 'finance' },
      { icon: ResourceIcon, label: 'Resources', path: '/resources', feature: 'resources' }
    ]
  },
  {
    key: 'task',
    label: 'Task',
    icon: TaskIcon,
    items: [
      { icon: TaskIcon, label: 'Task Board', path: '/tasks', feature: 'activities' }
    ]
  }
];

const BADGE_STYLES: Record<BadgeTone, React.CSSProperties> = {
  danger: { background: '#EF4444', color: '#FFFFFF' },
  warning: { background: '#F59E0B', color: '#111827' },
  info: { background: '#3B82F6', color: '#FFFFFF' }
};

const BADGE_DOT: Record<BadgeTone, string> = {
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6'
};

const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onClose,
  isExpanded,
  onExpandedChange
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, canAccessFeature } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMajorGroup, setActiveMajorGroup] = useState<MajorGroupKey>('main');
  const hasInitializedMajorGroup = useRef(false);

  const showLabels = isExpanded || isMobileOpen;
  const sidebarWidth = isExpanded ? SIDEBAR_EXPANDED_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

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
    if (!user) return 'NA';
    if (user.full_name) {
      const names = user.full_name.trim().split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0].slice(0, 2).toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const availableMajorGroups = useMemo(
    () =>
      MAJOR_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => canAccessFeature(item.feature))
      })).filter((group) => group.items.length > 0),
    [canAccessFeature]
  );

  const routeMajorGroup = useMemo(
    () =>
      availableMajorGroups.find((group) => group.items.some((item) => isActive(item.path)))?.key,
    [availableMajorGroups, location.pathname]
  );

  useEffect(() => {
    if (availableMajorGroups.length === 0) return;

    if (!hasInitializedMajorGroup.current) {
      const initialGroup = routeMajorGroup && availableMajorGroups.some((group) => group.key === routeMajorGroup)
        ? routeMajorGroup
        : availableMajorGroups[0].key;
      setActiveMajorGroup(initialGroup);
      hasInitializedMajorGroup.current = true;
      return;
    }

    if (!availableMajorGroups.some((group) => group.key === activeMajorGroup)) {
      setActiveMajorGroup(availableMajorGroups[0].key);
    }
  }, [activeMajorGroup, availableMajorGroups, routeMajorGroup]);

  const selectedMajorGroup = useMemo(
    () =>
      availableMajorGroups.find((group) => group.key === activeMajorGroup) ??
      availableMajorGroups[0],
    [activeMajorGroup, availableMajorGroups]
  );

  const filteredGroupItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return new Map(
      availableMajorGroups.map((group) => [
        group.key,
        group.items.filter((item) => {
          if (!normalizedQuery) return true;
          return item.label.toLowerCase().includes(normalizedQuery);
        })
      ])
    );
  }, [availableMajorGroups, searchQuery]);

  const userRole = user?.roles?.[0]?.display_name || (user?.is_system_admin ? 'System Administrator' : 'Team Member');

  const sidebarShellStyle = {
    top: SIDEBAR_MARGIN,
    left: SIDEBAR_MARGIN,
    bottom: SIDEBAR_MARGIN,
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 18px 60px rgba(0,0,0,0.45)',
    width: 'min(88vw, 320px)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    backgroundImage: `
      radial-gradient(120% 80% at 20% -10%, rgba(59,130,246,0.25), transparent 45%),
      radial-gradient(90% 70% at 80% 105%, rgba(34,197,94,0.20), transparent 55%),
      linear-gradient(180deg, rgba(15,23,42,0.92), rgba(17,24,39,0.88))
    `,
    '--sidebar-width': `${sidebarWidth}px`
  } as React.CSSProperties;

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`premium-sidebar fixed z-50 flex flex-col overflow-hidden text-white transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'
        }`}
        style={sidebarShellStyle}
      >
        <div className="border-b border-white/10 px-3 py-3">
          <div className="flex items-start gap-2">
            <button
              type="button"
              onClick={() => handleNavigate('/dashboard')}
              className={`flex min-w-0 flex-1 items-center ${showLabels ? 'gap-3' : 'justify-center'} rounded-xl`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg">
                <span className="text-xs font-bold text-white">CN</span>
              </span>
              {showLabels && (
                <span className="min-w-0 text-left">
                  <span className="block truncate text-[15px] font-semibold leading-tight">Caritas Nairobi</span>
                  <span className="block truncate text-[11px] text-white/60">Monitoring &amp; Evaluation</span>
                </span>
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="hidden h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 lg:flex"
                aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                onClick={() => onExpandedChange(!isExpanded)}
              >
                {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/85 transition hover:bg-white/10 lg:hidden"
                aria-label="Close menu"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="mt-3 hidden lg:block">
              <label className="sr-only" htmlFor="sidebar-search">
                Search navigation
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
                <input
                  id="sidebar-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={selectedMajorGroup ? `Search ${selectedMajorGroup.label}` : 'Search menu'}
                  className="h-9 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-blue-400/60 focus:bg-white/[0.08]"
                />
              </div>
            </div>
          )}
        </div>

        <nav className="premium-scrollbar flex-1 overflow-y-auto px-2 pb-3 pt-3">
          <section className="mb-4">
            {showLabels && (
              <h2 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/60">
                Major Pages
              </h2>
            )}
            <div className="space-y-1">
              {availableMajorGroups.map((group) => {
                const GroupIcon = group.icon;
                const groupActive = selectedMajorGroup?.key === group.key;
                const visibleItems = filteredGroupItems.get(group.key) ?? [];
                return (
                  <div key={group.key} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setActiveMajorGroup(group.key)}
                      title={!showLabels ? group.label : undefined}
                      className={`group relative flex h-11 w-full items-center rounded-xl transition-all duration-200 ${
                        showLabels ? 'justify-start gap-3 px-3.5' : 'justify-center'
                      } ${groupActive ? 'text-white shadow-[0_8px_24px_rgba(59,130,246,0.2)]' : 'text-white/80 hover:-translate-y-px hover:bg-white/5 hover:text-white'}`}
                      style={{ background: groupActive ? 'rgba(59,130,246,0.14)' : 'transparent' }}
                    >
                      <span
                        className="absolute left-0 top-2 h-7 w-[3px] rounded-r-full transition-opacity duration-200"
                        style={{
                          background: 'linear-gradient(180deg, #3B82F6, #22C55E)',
                          opacity: groupActive ? 1 : 0
                        }}
                      />
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
                        style={{ background: groupActive ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.02)' }}
                      >
                        <GroupIcon className="h-[18px] w-[18px]" />
                      </span>
                      {showLabels && <span className="min-w-0 flex-1 truncate text-left text-[13px] font-semibold uppercase tracking-[0.04em]">{group.label}</span>}
                      {showLabels && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white/20 px-1.5 text-[10px] font-semibold text-white/75">
                          {group.items.length}
                        </span>
                      )}
                      {!showLabels && (
                        <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block">
                          {group.label}
                        </span>
                      )}
                    </button>

                    {groupActive && (
                      <div
                        className={`space-y-1 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 ${
                          showLabels ? 'ml-3' : ''
                        }`}
                      >
                        {visibleItems.map((item) => {
                          const active = isActive(item.path);
                          const Icon = item.icon;
                          return (
                            <button
                              key={item.path}
                              type="button"
                              onClick={() => handleNavigate(item.path)}
                              title={!showLabels ? item.label : undefined}
                              className={`group relative flex h-10 w-full items-center rounded-lg transition-all duration-200 ${
                                showLabels ? 'justify-start gap-2.5 px-3' : 'justify-center'
                              } ${active ? 'text-white shadow-[0_8px_24px_rgba(59,130,246,0.2)]' : 'text-white/80 hover:-translate-y-px hover:bg-white/5 hover:text-white'}`}
                              style={{ background: active ? 'rgba(59,130,246,0.14)' : 'transparent' }}
                            >
                              <span
                                className="absolute left-0 top-2 h-6 w-[3px] rounded-r-full transition-opacity duration-200"
                                style={{
                                  background: 'linear-gradient(180deg, #3B82F6, #22C55E)',
                                  opacity: active ? 1 : 0
                                }}
                              />

                              <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition"
                                style={{ background: active ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.02)' }}
                              >
                                <Icon className="h-4 w-4" />
                              </span>

                              {showLabels && <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium">{item.label}</span>}

                              {showLabels && item.badge && (
                                <span
                                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-2 text-[11px] font-semibold leading-none"
                                  style={BADGE_STYLES[item.badge.tone]}
                                >
                                  {item.badge.value}
                                </span>
                              )}

                              {!showLabels && item.badge && (
                                <span
                                  className="absolute right-3 top-2.5 h-2.5 w-2.5 rounded-full"
                                  style={{ background: BADGE_DOT[item.badge.tone] }}
                                />
                              )}

                              {!showLabels && (
                                <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block">
                                  {item.label}
                                </span>
                              )}
                            </button>
                          );
                        })}
                        {showLabels && visibleItems.length === 0 && (
                          <p className="px-2 py-1 text-xs text-white/55">
                            No sections match your search in {group.label}.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </section>
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className={`${showLabels ? 'grid grid-cols-2 gap-2' : 'flex justify-center gap-2'}`}>
            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className={`flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white ${
                showLabels ? 'gap-2 px-3 text-xs font-medium' : 'w-9'
              }`}
              title={!showLabels ? 'Settings' : undefined}
            >
              <SettingsIcon className="h-4 w-4" />
              {showLabels && <span>Settings</span>}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={`flex h-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white ${
                showLabels ? 'gap-2 px-3 text-xs font-medium' : 'w-9'
              }`}
              title={!showLabels ? 'Logout' : undefined}
            >
              <LogoutIcon className="h-4 w-4" />
              {showLabels && <span>Logout</span>}
            </button>
          </div>

          <div className={`mt-3 rounded-2xl border border-white/10 bg-white/[0.04] ${showLabels ? 'p-2.5' : 'p-2'}`}>
            <div className={`flex items-center ${showLabels ? 'gap-2.5' : 'justify-center'}`}>
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || user.username}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-xs font-semibold text-white ring-1 ring-white/20">
                  {getUserInitials()}
                </span>
              )}
              {showLabels && (
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-white">
                    {user?.full_name || user?.username || 'User'}
                  </span>
                  <span className="block truncate text-xs text-white/65">{userRole}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      <style>{`
        .premium-sidebar {
          width: min(88vw, 320px);
        }
        @media (min-width: 1024px) {
          .premium-sidebar {
            width: var(--sidebar-width) !important;
          }
        }
        .premium-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .premium-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.18);
          border-radius: 9999px;
        }
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.28);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
