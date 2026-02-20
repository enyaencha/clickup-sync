import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';
import AddBudgetModal from './AddBudgetModal';
import AddTransactionModal from './AddTransactionModal';
import FinanceBudgetReview from './FinanceBudgetReview';

interface BudgetSummary {
  program_module_id: number;
  program_name: string;
  total_budget: number;
  allocated_budget: number;
  spent_budget: number;
  committed_budget: number;
  remaining_budget: number;
}

interface Transaction {
  id: number;
  transaction_number: string;
  transaction_date: string;
  amount: number;
  expense_category: string;
  description: string;
  approval_status: string;
  verification_status: string;
  payee_name: string;
}

interface PendingApproval {
  id: number;
  approval_number: string;
  request_type: string;
  requested_amount: number;
  request_title: string;
  status: string;
  priority: string;
  requested_at: string;
  requester_name: string;
}

interface PendingExpenditure {
  id: number;
  activity_id: number;
  activity_name: string;
  activity_code: string;
  expense_category: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: string;
  status: string;
  approved_budget: number | null;
  spent_budget: number | null;
  remaining_budget: number | null;
  request_number: string | null;
}

interface BudgetConversationNotification {
  request_id: number;
  request_number: string;
  activity_name: string;
  unread_count: number;
  last_message_at: string;
  status: string;
}

type DashboardTab = 'overview' | 'transactions' | 'approvals' | 'budget-requests';
type InsightTab = 'overview' | 'projects' | 'components' | 'activities' | 'budget' | 'reports';

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const FinanceDashboard: React.FC = () => {
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [pendingExpenditures, setPendingExpenditures] = useState<PendingExpenditure[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [insightTab, setInsightTab] = useState<InsightTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [conversationNotifications, setConversationNotifications] = useState<BudgetConversationNotification[]>([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    void fetchFinanceData();
    void fetchConversationNotifications();
    const interval = setInterval(() => {
      void fetchConversationNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      const [budgetResponse, transactionsResponse, approvalsResponse, expendituresResponse] = await Promise.all([
        authFetch('/api/finance/budget-summary'),
        authFetch('/api/finance/transactions?limit=10'),
        authFetch('/api/finance/approvals?status=pending'),
        authFetch('/api/budget-requests/expenditures?status=pending')
      ]);

      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        const normalizedBudget = (budgetData.data || []).map((item: Partial<BudgetSummary>) => ({
          ...item,
          total_budget: toNumber(item.total_budget),
          allocated_budget: toNumber(item.allocated_budget),
          spent_budget: toNumber(item.spent_budget),
          committed_budget: toNumber(item.committed_budget),
          remaining_budget: toNumber(item.remaining_budget)
        })) as BudgetSummary[];
        setBudgetSummary(normalizedBudget);
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const normalizedTransactions = (transactionsData.data || []).map((item: Partial<Transaction>) => ({
          ...item,
          amount: toNumber(item.amount)
        })) as Transaction[];
        setRecentTransactions(normalizedTransactions);
      }
      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        const normalizedApprovals = (approvalsData.data || []).map((item: Partial<PendingApproval>) => ({
          ...item,
          requested_amount: toNumber(item.requested_amount)
        })) as PendingApproval[];
        setPendingApprovals(normalizedApprovals);
      }

      if (expendituresResponse.ok) {
        const expendituresData = await expendituresResponse.json();
        const normalizedExpenditures = (expendituresData.data || []).map((item: Partial<PendingExpenditure>) => ({
          ...item,
          amount: toNumber(item.amount),
          approved_budget: item.approved_budget === null ? null : toNumber(item.approved_budget),
          spent_budget: item.spent_budget === null ? null : toNumber(item.spent_budget),
          remaining_budget: item.remaining_budget === null ? null : toNumber(item.remaining_budget)
        })) as PendingExpenditure[];
        setPendingExpenditures(normalizedExpenditures);
      }
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationNotifications = async () => {
    try {
      const response = await authFetch('/api/budget-requests/notifications');
      if (response.ok) {
        const data = await response.json();
        const normalizedNotifications = (data.data || []).map((item: Partial<BudgetConversationNotification>) => ({
          ...item,
          unread_count: toNumber(item.unread_count)
        })) as BudgetConversationNotification[];
        setConversationNotifications(normalizedNotifications);
      }
    } catch (error) {
      console.error('Error fetching conversation notifications:', error);
    }
  };


  useEffect(() => {
    void fetchFinanceData();
    void fetchConversationNotifications();
    const interval = setInterval(() => {
      void fetchConversationNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenConversation = (requestId: number, activityName: string) => {
    const event = new CustomEvent('openBudgetConversation', {
      detail: { requestId, activityName }
    });
    window.dispatchEvent(event);
    setShowNotificationDropdown(false);
  };

  const formatCurrency = (amount: unknown) => {
    const normalizedAmount = toNumber(amount);
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(normalizedAmount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      verified: 'bg-blue-100 text-blue-800',
      flagged: 'bg-orange-100 text-orange-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      urgent: 'text-red-500',
      high: 'text-orange-400',
      medium: 'text-yellow-400',
      low: 'text-slate-300',
    };
    return colors[priority.toLowerCase()] || 'text-slate-300';
  };

  const handleApproveFinanceApproval = async (approvalId: number, requestedAmount: number) => {
    const notes = prompt('Add approval notes (optional):');
    if (notes === null) return;

    try {
      const response = await authFetch(`/api/finance/approvals/${approvalId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved_amount: requestedAmount,
          finance_notes: notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve');
      }

      alert('Approval approved successfully!');
      await fetchFinanceData({ includeApprovals: true });
    } catch (error) {
      console.error('Error approving finance approval:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve');
    }
  };

  const handleRejectFinanceApproval = async (approvalId: number) => {
    const reason = prompt('Reason for rejection (required):');
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      const response = await authFetch(`/api/finance/approvals/${approvalId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject');
      }

      alert('Approval rejected');
      await fetchFinanceData({ includeApprovals: true });
    } catch (error) {
      console.error('Error rejecting finance approval:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject');
    }
  };

  const handleApproveExpenditure = async (expenditureId: number) => {
    const notes = prompt('Add approval notes (optional):');
    if (notes === null) return;

    try {
      const response = await authFetch(`/api/budget-requests/expenditures/${expenditureId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve expenditure');
      }

      alert('Expenditure approved successfully!');
      await fetchFinanceData({ includeApprovals: true });
    } catch (error) {
      console.error('Error approving expenditure:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve expenditure');
    }
  };

  const handleRejectExpenditure = async (expenditureId: number) => {
    const notes = prompt('Reason for rejection (required):');
    if (!notes || notes.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      const response = await authFetch(`/api/budget-requests/expenditures/${expenditureId}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject expenditure');
      }

      alert('Expenditure rejected');
      await fetchFinanceData({ includeApprovals: true });
    } catch (error) {
      console.error('Error rejecting expenditure:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject expenditure');
    }
  };

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((transaction) => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.payee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || transaction.approval_status === filterStatus;

      if (filterProgram === 'all') {
        return matchesSearch && matchesStatus;
      }

      return matchesSearch && matchesStatus && transaction.description.toLowerCase().includes(filterProgram.toLowerCase());
    });
  }, [filterProgram, filterStatus, recentTransactions, searchTerm]);

  const filteredBudgetSummary = useMemo(() => {
    if (filterProgram === 'all') {
      return budgetSummary;
    }

    return budgetSummary.filter((budget) => budget.program_name === filterProgram);
  }, [budgetSummary, filterProgram]);

  const totalUnreadConversations = useMemo(
    () => conversationNotifications.reduce((sum, n) => sum + toNumber(n.unread_count), 0),
    [conversationNotifications]
  );

  const totals = useMemo(() => {
    const totalBudget = budgetSummary.reduce((sum, entry) => sum + toNumber(entry.total_budget), 0);
    const totalSpent = budgetSummary.reduce((sum, entry) => sum + toNumber(entry.spent_budget), 0);
    const totalCommitted = budgetSummary.reduce((sum, entry) => sum + toNumber(entry.committed_budget), 0);
    const totalRemaining = budgetSummary.reduce((sum, entry) => sum + toNumber(entry.remaining_budget), 0);
    const utilization = totalBudget > 0 ? Math.round(((totalSpent + totalCommitted) / totalBudget) * 100) : 0;

    return {
      totalBudget,
      totalSpent,
      totalCommitted,
      totalRemaining,
      utilization
    };
  }, [budgetSummary]);

  const activityBreakdown = useMemo(() => {
    const inProgress = pendingApprovals.length;
    const completed = recentTransactions.filter((transaction) => transaction.approval_status.toLowerCase() === 'approved').length;
    const notStarted = Math.max(0, pendingExpenditures.length - inProgress);

    return {
      inProgress,
      completed,
      notStarted
    };
  }, [pendingApprovals.length, pendingExpenditures.length, recentTransactions]);

  const componentMix = useMemo(() => {
    const breakdown = new Map<string, number>();
    recentTransactions.forEach((transaction) => {
      const key = transaction.expense_category || 'Uncategorized';
      breakdown.set(key, (breakdown.get(key) || 0) + 1);
    });

    return Array.from(breakdown.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [recentTransactions]);

  const programOptions = useMemo(() => {
    const names = Array.from(new Set(budgetSummary.map((entry) => entry.program_name)));
    return names.sort();
  }, [budgetSummary]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
          <p className="mt-4 text-sm text-white/70">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8"
      style={{
        background: `
          radial-gradient(120% 120% at 12% -20%, rgba(59,130,246,0.2), transparent 48%),
          radial-gradient(110% 95% at 85% 120%, rgba(34,197,94,0.12), transparent 48%),
          var(--main-background)
        `
      }}
    >
      <div className="mx-auto max-w-[1380px] space-y-6 pt-4">
        <section
          className="overflow-hidden rounded-2xl border border-white/10"
          style={{
            background: `
              radial-gradient(120% 150% at 15% 20%, rgba(255,255,255,0.09), transparent 55%),
              radial-gradient(100% 120% at 90% -10%, rgba(59,130,246,0.28), transparent 50%),
              linear-gradient(165deg, rgba(14,25,61,0.92), rgba(10,19,49,0.88))
            `,
            boxShadow: '0 16px 48px rgba(0,0,0,0.35)'
          }}
        >
          <div
            className="border-b border-white/10 p-5"
            style={{
              background: `
                radial-gradient(130% 120% at 40% 0%, rgba(248,170,88,0.2), transparent 55%),
                radial-gradient(120% 120% at 70% 60%, rgba(59,130,246,0.2), transparent 50%),
                linear-gradient(160deg, rgba(20,30,74,0.9), rgba(16,25,60,0.82))
              `
            }}
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💰</span>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Finance Management</h1>
                    <p className="text-xs uppercase tracking-[0.12em] text-white/55">FINANCE_MGMT</p>
                  </div>
                  <span className="rounded-full border border-amber-300/35 bg-amber-400/20 px-2 py-1 text-xs font-semibold text-amber-200">Active</span>
                </div>
                <p className="mt-3 max-w-3xl text-sm text-white/75">
                  Budget management, financial planning, expenditure tracking, program funding allocation, and financial reporting.
                </p>
                <p className="mt-2 text-xs text-white/55">
                  Signed in as {user?.full_name || user?.username || 'Finance Team'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowNotificationDropdown((previous) => !previous)}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/80 transition hover:bg-white/[0.1]"
                    title="Budget conversations"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    {totalUnreadConversations > 0 && (
                      <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {totalUnreadConversations > 9 ? '9+' : totalUnreadConversations}
                      </span>
                    )}
                  </button>

                  {showNotificationDropdown && (
                    <>
                      <button
                        type="button"
                        aria-label="Close notifications"
                        className="fixed inset-0 z-10"
                        onClick={() => setShowNotificationDropdown(false)}
                      />
                      <div
                        className="absolute right-0 z-20 mt-2 w-[340px] overflow-hidden rounded-xl border border-white/10"
                        style={{ background: 'linear-gradient(170deg, rgba(20,36,84,0.98), rgba(15,28,66,0.96))' }}
                      >
                        <div className="border-b border-white/10 px-3 py-2">
                          <p className="text-sm font-semibold text-white">Budget Conversations</p>
                          <p className="text-xs text-white/60">{totalUnreadConversations} unread messages</p>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {conversationNotifications.length === 0 && (
                            <p className="px-3 py-4 text-sm text-white/60">No conversations yet.</p>
                          )}
                          {conversationNotifications.map((notification) => (
                            <button
                              key={notification.request_id}
                              onClick={() => handleOpenConversation(notification.request_id, notification.activity_name)}
                              className="w-full border-b border-white/5 px-3 py-3 text-left transition hover:bg-white/[0.06]"
                            >
                              <div className="flex items-start justify-between">
                                <p className="text-sm font-medium text-white">{notification.activity_name}</p>
                                {notification.unread_count > 0 && (
                                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                    {notification.unread_count}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-white/60">Request #{notification.request_number}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => alert('Edit Program configuration is not wired yet.')}
                  className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white/90 transition hover:bg-white/[0.12]"
                >
                  Edit Program
                </button>
                <button
                  onClick={() => setShowBudgetModal(true)}
                  className="inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium text-white transition hover:brightness-110"
                  style={{ background: 'linear-gradient(90deg, #22C55E, #16A34A)' }}
                >
                  + Add Project
                </button>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/[0.06] px-3 text-sm font-medium text-white/90 transition hover:bg-white/[0.12]"
                >
                  Record Txn
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/65">Sub-Programs</p>
              <p className="mt-1 text-4xl font-semibold text-white">{budgetSummary.length}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/65">Components</p>
              <p className="mt-1 text-4xl font-semibold text-white">{componentMix.length}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/65">Activities</p>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-4xl font-semibold text-white">{activityBreakdown.inProgress + activityBreakdown.completed + activityBreakdown.notStarted}</p>
                <p className="pb-1 text-xs text-green-300">+{pendingApprovals.length} pending</p>
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/65">Total Budget</p>
              <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totals.totalBudget)}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs text-white/65">Overall Progress</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="relative h-14 w-14">
                  <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke="#63D18B"
                      strokeWidth="4"
                      strokeDasharray={`${Math.min(totals.utilization, 100)}, 100`}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {totals.utilization}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{totals.utilization}%</p>
                  <p className="text-xs text-white/60">Overall Progress</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.9fr_0.9fr]">
          <article
            className="rounded-2xl border border-white/10 p-4"
            style={{
              background: 'linear-gradient(160deg, rgba(18,35,82,0.88), rgba(15,27,66,0.84))',
              boxShadow: '0 14px 40px rgba(0,0,0,0.24)'
            }}
          >
            <h2 className="text-2xl font-semibold text-white">Program Insights</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                ['overview', 'Overview'],
                ['projects', 'Projects'],
                ['components', 'Components'],
                ['activities', 'Activities'],
                ['budget', 'Budget'],
                ['reports', 'Reports']
              ] as Array<[InsightTab, string]>).map(([tabKey, label]) => (
                <button
                  key={tabKey}
                  onClick={() => setInsightTab(tabKey)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    insightTab === tabKey
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                  style={{
                    background: insightTab === tabKey ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {insightTab === 'overview' && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-base font-semibold text-white">Budget Utilization</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative h-20 w-20">
                      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="3.5" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#63D18B"
                          strokeWidth="3.5"
                          strokeDasharray={`${Math.min(totals.utilization, 100)}, 100`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">{totals.utilization}%</span>
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Utilized</p>
                      <p className="text-lg font-semibold text-white">{formatCurrency(totals.totalSpent + totals.totalCommitted)}</p>
                      <p className="text-xs text-white/55">of {formatCurrency(totals.totalBudget)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-base font-semibold text-white">Activity Status Breakdown</p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm text-white/80">
                        <span>In Progress</span>
                        <span>{activityBreakdown.inProgress}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${Math.min(100, activityBreakdown.inProgress * 12)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm text-white/80">
                        <span>Completed</span>
                        <span>{activityBreakdown.completed}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-green-400" style={{ width: `${Math.min(100, activityBreakdown.completed * 12)}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm text-white/80">
                        <span>Not Started</span>
                        <span>{activityBreakdown.notStarted}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${Math.min(100, activityBreakdown.notStarted * 12)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {insightTab === 'projects' && (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {filteredBudgetSummary.map((budget) => {
                  const utilization = budget.total_budget > 0
                    ? Math.round(((budget.spent_budget + budget.committed_budget) / budget.total_budget) * 100)
                    : 0;

                  return (
                    <div key={budget.program_module_id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-lg font-semibold text-white">{budget.program_name}</p>
                      <p className="mt-2 text-sm text-white/70">Budget {formatCurrency(budget.total_budget)}</p>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-green-400" style={{ width: `${Math.min(utilization, 100)}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-white/65">
                        <span>Spent {formatCurrency(budget.spent_budget)}</span>
                        <span>{utilization}%</span>
                      </div>
                    </div>
                  );
                })}
                {filteredBudgetSummary.length === 0 && (
                  <p className="text-sm text-white/65">No project budgets found for this filter.</p>
                )}
              </div>
            )}

            {insightTab === 'components' && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="mb-3 text-base font-semibold text-white">Top Spend Components</p>
                <div className="space-y-3">
                  {componentMix.map(([category, count]) => (
                    <div key={category}>
                      <div className="mb-1 flex items-center justify-between text-sm text-white/80">
                        <span>{category}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div className="h-1.5 rounded-full bg-blue-400" style={{ width: `${Math.min(100, count * 20)}%` }} />
                      </div>
                    </div>
                  ))}
                  {componentMix.length === 0 && (
                    <p className="text-sm text-white/60">No component distribution yet.</p>
                  )}
                </div>
              </div>
            )}

            {insightTab === 'activities' && (
              <div className="mt-4 space-y-2">
                {recentTransactions.slice(0, 8).map((transaction) => (
                  <div key={transaction.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{transaction.description}</p>
                      <span className="text-xs text-white/60">{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-white/65">
                      <span>{transaction.expense_category}</span>
                      <span>{formatCurrency(transaction.amount)}</span>
                    </div>
                  </div>
                ))}
                {recentTransactions.length === 0 && (
                  <p className="text-sm text-white/65">No activity transactions recorded.</p>
                )}
              </div>
            )}

            {insightTab === 'budget' && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-white/70">Allocated</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(budgetSummary.reduce((sum, item) => sum + item.allocated_budget, 0))}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-white/70">Committed</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totals.totalCommitted)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-white/70">Spent</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totals.totalSpent)}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-sm text-white/70">Remaining</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{formatCurrency(totals.totalRemaining)}</p>
                </div>
              </div>
            )}

            {insightTab === 'reports' && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-base font-semibold text-white">Reports Snapshot</p>
                <p className="mt-2 text-sm text-white/70">
                  Financial reporting module is active. Use Export Data or move to Reports & Insights for full analytics outputs.
                </p>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="mt-3 inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/[0.08] px-3 text-sm font-medium text-white transition hover:bg-white/[0.14]"
                >
                  Open Transactions
                </button>
              </div>
            )}
          </article>

          <aside
            className="rounded-2xl border border-white/10 p-4"
            style={{
              background: 'linear-gradient(160deg, rgba(18,35,82,0.88), rgba(15,27,66,0.84))',
              boxShadow: '0 14px 40px rgba(0,0,0,0.24)'
            }}
          >
            <h3 className="text-2xl font-semibold text-white">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => alert('Add Activity flow will be connected to activity module.')}
                className="flex h-11 w-full items-center justify-start rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:bg-white/[0.12]"
              >
                📊 Add Activity
              </button>
              <button
                onClick={() => alert('Add Component flow will be connected to program components.')}
                className="flex h-11 w-full items-center justify-start rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:bg-white/[0.12]"
              >
                🧩 Add Component
              </button>
              <button
                onClick={() => setActiveTab('budget-requests')}
                className="flex h-11 w-full items-center justify-start rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:bg-white/[0.12]"
              >
                📤 Upload Report
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className="flex h-11 w-full items-center justify-start rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white transition hover:bg-white/[0.12]"
              >
                📦 Export Data
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-sm font-semibold text-white">Alerts</p>
              <ul className="mt-2 space-y-1 text-xs text-white/70">
                <li>{pendingApprovals.length} approvals pending review.</li>
                <li>{pendingExpenditures.length} expenditures awaiting decision.</li>
                <li>{totalUnreadConversations} unread budget conversation messages.</li>
              </ul>
            </div>
          </aside>
        </section>

        <section
          className="rounded-2xl border border-white/10 p-4"
          style={{
            background: 'linear-gradient(160deg, rgba(18,35,82,0.88), rgba(15,27,66,0.84))',
            boxShadow: '0 14px 40px rgba(0,0,0,0.24)'
          }}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Finance Operations Console</h2>
              <p className="text-sm text-white/65">Operational tools from the current finance module are available below.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Search transactions or payees"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-blue-400/70"
              />
              <select
                value={filterProgram}
                onChange={(event) => setFilterProgram(event.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-blue-400/70"
              >
                <option value="all">All Programs</option>
                {programOptions.map((programName) => (
                  <option key={programName} value={programName}>{programName}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                className="h-10 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-blue-400/70"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {([
              ['overview', 'Budget Overview'],
              ['transactions', 'Transactions'],
              ['approvals', 'Approvals'],
              ['budget-requests', 'Budget Requests']
            ] as Array<[DashboardTab, string]>).map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  activeTab === tabKey ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                style={{
                  background: activeTab === tabKey ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {label}
                {tabKey === 'approvals' && pendingApprovals.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeTab === 'overview' && (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredBudgetSummary.map((budget) => {
                  const spentPercentage = budget.total_budget > 0
                    ? (budget.spent_budget / budget.total_budget) * 100
                    : 0;

                  return (
                    <article key={budget.program_module_id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-white">{budget.program_name}</h3>
                        <span className="text-sm text-white/65">{spentPercentage.toFixed(1)}% spent</span>
                      </div>

                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full ${spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-amber-400' : 'bg-green-400'}`}
                          style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                        />
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-white/60">Total Budget</p>
                          <p className="font-semibold">{formatCurrency(budget.total_budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60">Spent</p>
                          <p className="font-semibold text-red-300">{formatCurrency(budget.spent_budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60">Committed</p>
                          <p className="font-semibold text-amber-300">{formatCurrency(budget.committed_budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60">Remaining</p>
                          <p className="font-semibold text-green-300">{formatCurrency(budget.remaining_budget)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {filteredBudgetSummary.length === 0 && (
                  <p className="text-sm text-white/65">No program budgets found.</p>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full">
                  <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <tr className="text-left text-xs uppercase tracking-[0.08em] text-white/60">
                      <th className="px-4 py-3">Transaction</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Payee</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-t border-white/10 text-sm text-white/80">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{transaction.transaction_number}</p>
                          <p className="text-xs text-white/60">{transaction.description}</p>
                        </td>
                        <td className="px-4 py-3">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{transaction.payee_name}</td>
                        <td className="px-4 py-3">{transaction.expense_category}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(transaction.amount)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(transaction.approval_status)}`}>
                            {transaction.approval_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td className="px-4 py-6 text-center text-sm text-white/60" colSpan={6}>
                          No transactions match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <article key={approval.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">{approval.request_title}</h3>
                          <span className={`text-xs font-semibold ${getPriorityColor(approval.priority)}`}>
                            {approval.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-white/70">{approval.request_type.replace(/_/g, ' ')}</p>
                        <p className="mt-1 text-xs text-white/55">
                          {approval.approval_number} • {approval.requester_name} • {new Date(approval.requested_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="mr-2 text-lg font-semibold text-white">{formatCurrency(approval.requested_amount)}</p>
                        <button
                          onClick={() => void handleApproveFinanceApproval(approval.id, approval.requested_amount)}
                          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => void handleRejectFinanceApproval(approval.id)}
                          className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {pendingExpenditures.map((expenditure) => {
                  const remaining = Number(expenditure.remaining_budget) || 0;
                  const remainingAfter = remaining - expenditure.amount;
                  return (
                    <article key={expenditure.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{expenditure.activity_name}</h3>
                          <p className="mt-1 text-sm text-white/70">{expenditure.expense_category} • {expenditure.description}</p>
                          <p className="mt-1 text-xs text-white/55">
                            {new Date(expenditure.expense_date).toLocaleDateString()} • Remaining after approval: {formatCurrency(remainingAfter)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="mr-2 text-lg font-semibold text-white">{formatCurrency(expenditure.amount)}</p>
                          <button
                            onClick={() => void handleApproveExpenditure(expenditure.id)}
                            className="rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => void handleRejectExpenditure(expenditure.id)}
                            className="rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {pendingApprovals.length === 0 && pendingExpenditures.length === 0 && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/65">
                    No pending approvals.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'budget-requests' && <FinanceBudgetReview />}
          </div>
        </section>
      </div>

      <AddBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        onSuccess={() => void fetchFinanceData()}
      />
      <AddTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSuccess={() => void fetchFinanceData()}
      />
    </div>
  );
};

export default FinanceDashboard;
