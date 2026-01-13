import React, { useEffect } from 'react';
import BudgetRequestConversation from './BudgetRequestConversation';

interface ConversationSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  budgetRequestId: number | null;
  activityName: string;
  currentUserId: number;
  isFinanceTeam: boolean;
}

const ConversationSidePanel: React.FC<ConversationSidePanelProps> = ({
  isOpen,
  onClose,
  budgetRequestId,
  activityName,
  currentUserId,
  isFinanceTeam
}) => {
  // Close panel on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!budgetRequestId) return null;

  return (
    <>
      {/* Backdrop - semi-transparent */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--card-background)' }}
      >
        {/* Panel Header - Sticky */}
        <div
          className="sticky top-0 border-b px-6 py-4 flex justify-between items-center z-10"
          style={{ background: 'var(--card-background)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex-1">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--main-text)' }}>
              <span>💬</span>
              Budget Discussion
            </h2>
            <p className="text-sm mt-1" style={{ color: 'var(--main-text)', opacity: 0.8 }}>{activityName}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-3xl font-light leading-none transition-colors"
            title="Close panel (Esc)"
            style={{ color: 'var(--main-text)' }}
          >
            ×
          </button>
        </div>

        {/* Panel Content - Scrollable */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-6">
            <BudgetRequestConversation
              budgetRequestId={budgetRequestId}
              activityName={activityName}
              currentUserId={currentUserId}
              isFinanceTeam={isFinanceTeam}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationSidePanel;
