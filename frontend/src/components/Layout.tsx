import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import BudgetRequestNotificationBell from './BudgetRequestNotificationBell';
import ConversationSidePanel from './ConversationSidePanel';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

type IconProps = {
  className?: string;
};

interface MobileTab {
  label: string;
  path: string;
  feature: string;
  icon: React.ComponentType<IconProps>;
}

const SIDEBAR_EXPANDED_WIDTH = 272;
const SIDEBAR_COLLAPSED_WIDTH = 84;
const SIDEBAR_MARGIN = 16;
const SIDEBAR_CONTENT_GAP = 16;
const SIDEBAR_STORAGE_KEY = 'caritas-sidebar-expanded';

const HomeIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z" />
  </svg>
);

const ProgramIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 3.5h7m-3.5-3.5v7" />
  </svg>
);

const ActivityIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4h8m-8 4h8m-9 12h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.5l-1 2h-5l-1-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />
  </svg>
);

const ReportIcon: React.FC<IconProps> = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19h14M7.5 16V9m4 7V5m4 11v-6" />
  </svg>
);

const MOBILE_TABS: MobileTab[] = [
  { label: 'Dashboard', path: '/dashboard', feature: 'dashboard', icon: HomeIcon },
  { label: 'Programs', path: '/', feature: 'programs', icon: ProgramIcon },
  { label: 'Activities', path: '/activities', feature: 'activities', icon: ActivityIcon },
  { label: 'Reports', path: '/reports', feature: 'reports', icon: ReportIcon }
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, canAccessFeature } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConversationPanel, setShowConversationPanel] = useState(false);
  const [selectedBudgetRequest, setSelectedBudgetRequest] = useState<{
    id: number;
    activityName: string;
  } | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const persisted = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return persisted ? persisted === 'true' : true;
  });

  const handleOpenConversation = (requestId: number, activityName: string) => {
    setSelectedBudgetRequest({ id: requestId, activityName });
    setShowConversationPanel(true);
  };

  const handleCloseConversation = () => {
    setShowConversationPanel(false);
    setSelectedBudgetRequest(null);
  };

  useEffect(() => {
    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ requestId: number; activityName: string }>;
      if (!customEvent.detail) return;
      handleOpenConversation(customEvent.detail.requestId, customEvent.detail.activityName);
    };

    window.addEventListener('openBudgetConversation', handleCustomEvent);
    return () => window.removeEventListener('openBudgetConversation', handleCustomEvent);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isSidebarExpanded));
  }, [isSidebarExpanded]);

  const isFinanceTeam = user?.module_assignments?.some((module) => module.module_id === 6) || false;

  const sidebarOffset = isSidebarExpanded
    ? SIDEBAR_MARGIN + SIDEBAR_EXPANDED_WIDTH + SIDEBAR_CONTENT_GAP
    : SIDEBAR_MARGIN + SIDEBAR_COLLAPSED_WIDTH + SIDEBAR_CONTENT_GAP;

  const mobileTabs = useMemo(
    () => MOBILE_TABS.filter((tab) => canAccessFeature(tab.feature)),
    [canAccessFeature]
  );

  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const shellStyle = {
    '--layout-sidebar-offset': `${sidebarOffset}px`,
    background: `
      radial-gradient(120% 90% at 10% -20%, rgba(59,130,246,0.18), transparent 52%),
      radial-gradient(110% 95% at 90% 120%, rgba(34,197,94,0.12), transparent 50%),
      var(--main-background)
    `,
    color: 'var(--main-text)'
  } as React.CSSProperties;

  return (
    <div className="min-h-screen" style={shellStyle}>
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isExpanded={isSidebarExpanded}
        onExpandedChange={setIsSidebarExpanded}
      />

      {user && (
        <header className="premium-top-header z-30 flex items-center justify-between px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/90 transition hover:bg-white/10 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-white">Caritas Nairobi Platform</p>
              <p className="truncate text-xs text-white/65">Monitoring, Evaluation, Learning and Reporting</p>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1">
            <BudgetRequestNotificationBell onOpenConversation={handleOpenConversation} />
          </div>
        </header>
      )}

      <main className="premium-main transition-[margin] duration-300">
        <div
          className="min-h-screen px-3 sm:px-4 lg:px-6"
          style={{
            paddingTop: user ? '96px' : '16px',
            paddingBottom: user && mobileTabs.length > 0 ? '102px' : '24px'
          }}
        >
          {children}
        </div>
      </main>

      {user && mobileTabs.length > 0 && (
        <nav className="fixed bottom-4 left-4 right-4 z-30 lg:hidden">
          <div className="flex h-16 items-center rounded-2xl border border-white/10 bg-slate-900/80 p-1 shadow-[0_16px_42px_rgba(0,0,0,0.4)] backdrop-blur-md">
            {mobileTabs.map((tab) => {
              const Icon = tab.icon;
              const active = isPathActive(tab.path);
              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() => navigate(tab.path)}
                  className={`flex h-full flex-1 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-medium transition ${
                    active ? 'text-white' : 'text-white/70'
                  }`}
                  style={{
                    background: active ? 'rgba(59,130,246,0.2)' : 'transparent'
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {user && selectedBudgetRequest && (
        <ConversationSidePanel
          isOpen={showConversationPanel}
          onClose={handleCloseConversation}
          budgetRequestId={selectedBudgetRequest.id}
          activityName={selectedBudgetRequest.activityName}
          currentUserId={user.id}
          isFinanceTeam={isFinanceTeam}
        />
      )}

      <style>{`
        .premium-top-header {
          position: fixed;
          top: 16px;
          left: 16px;
          right: 16px;
          height: 64px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          background:
            radial-gradient(160% 140% at 0% -60%, rgba(59, 130, 246, 0.2), transparent 48%),
            linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.76));
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .premium-main {
          margin-left: 0;
        }
        @media (min-width: 1024px) {
          .premium-top-header {
            left: var(--layout-sidebar-offset);
          }
          .premium-main {
            margin-left: var(--layout-sidebar-offset);
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
