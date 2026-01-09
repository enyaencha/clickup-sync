import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import BudgetRequestNotificationBell from './BudgetRequestNotificationBell';
import ConversationSidePanel from './ConversationSidePanel';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showConversationPanel, setShowConversationPanel] = useState(false);
  const [selectedBudgetRequest, setSelectedBudgetRequest] = useState<{
    id: number;
    activityName: string;
  } | null>(null);

  const handleOpenConversation = (requestId: number, activityName: string) => {
    setSelectedBudgetRequest({ id: requestId, activityName });
    setShowConversationPanel(true);
  };

  const handleCloseConversation = () => {
    setShowConversationPanel(false);
    setSelectedBudgetRequest(null);
  };

  // Listen for custom events from other components (e.g., FinanceDashboard notification bell)
  useEffect(() => {
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      handleOpenConversation(customEvent.detail.requestId, customEvent.detail.activityName);
    };

    window.addEventListener('openBudgetConversation', handleCustomEvent);
    return () => window.removeEventListener('openBudgetConversation', handleCustomEvent);
  }, []);

  // Determine if user is in finance team (module_id = 6)
  const isFinanceTeam = user?.modules?.some((m: any) => m.module_id === 6) || false;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--main-background)', color: 'var(--main-text)' }}>
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Button - Only visible on mobile/tablet */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden text-white p-3 rounded-xl shadow-soft hover:opacity-90 active:scale-95 transition-all"
        style={{ background: 'var(--accent-primary)' }}
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Top Header Bar with Notification Bell */}
      {user && (
        <div className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white border-b border-gray-200 z-20 flex items-center justify-end px-6">
          <BudgetRequestNotificationBell
            onOpenConversation={handleOpenConversation}
          />
        </div>
      )}

      <main className="flex-1 lg:ml-72 transition-all duration-300">
        {/* Add top padding to account for fixed header */}
        <div className="min-h-screen" style={{ paddingTop: user ? '4rem' : '0' }}>
          {children}
        </div>
      </main>

      {/* Conversation Side Panel */}
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
    </div>
  );
};

export default Layout;
