import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';

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

const FinanceDashboard: React.FC = () => {
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'approvals'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);

      // Fetch budget summary
      const budgetResponse = await authFetch('/api/finance/budget-summary');
      if (budgetResponse.ok) {
        const budgetData = await budgetResponse.json();
        setBudgetSummary(budgetData.data || []);
      }

      // Fetch recent transactions
      const transactionsResponse = await authFetch('/api/finance/transactions?limit=10');
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setRecentTransactions(transactionsData.data || []);
      }

      // Fetch pending approvals
      const approvalsResponse = await authFetch('/api/finance/approvals?status=pending');
      if (approvalsResponse.ok) {
        const approvalsData = await approvalsResponse.json();
        setPendingApprovals(approvalsData.data || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'verified': 'bg-blue-100 text-blue-800',
      'flagged': 'bg-orange-100 text-orange-800',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'urgent': 'text-red-600',
      'high': 'text-orange-600',
      'medium': 'text-yellow-600',
      'low': 'text-gray-600',
    };
    return colors[priority.toLowerCase()] || 'text-gray-600';
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.approval_status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-4xl">💰</span>
                Finance Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">Budget Tracking & Expenditure Management</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {/* TODO: Open new budget modal */}}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Budget
              </button>
              <button
                onClick={() => {/* TODO: Open new transaction modal */}}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Record Transaction
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(budgetSummary.reduce((sum, b) => sum + b.total_budget, 0))}
                </p>
              </div>
              <div className="text-blue-500 text-3xl">💵</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {formatCurrency(budgetSummary.reduce((sum, b) => sum + b.remaining_budget, 0))}
                </p>
              </div>
              <div className="text-green-500 text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Spent</p>
                <p className="text-2xl font-bold text-red-700 mt-1">
                  {formatCurrency(budgetSummary.reduce((sum, b) => sum + b.spent_budget, 0))}
                </p>
              </div>
              <div className="text-red-500 text-3xl">💸</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-700 mt-1">
                  {pendingApprovals.length}
                </p>
              </div>
              <div className="text-yellow-500 text-3xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Budget Overview
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('approvals')}
                className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors relative ${
                  activeTab === 'approvals'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approvals
                {pendingApprovals.length > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Program Budget Breakdown</h2>
                <div className="space-y-4">
                  {budgetSummary.map((budget) => {
                    const spentPercentage = (budget.spent_budget / budget.total_budget) * 100;
                    return (
                      <div key={budget.program_module_id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{budget.program_name}</h3>
                          <span className="text-sm text-gray-600">
                            {spentPercentage.toFixed(1)}% spent
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              spentPercentage > 90 ? 'bg-red-500' :
                              spentPercentage > 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Total Budget</p>
                            <p className="font-semibold">{formatCurrency(budget.total_budget)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Spent</p>
                            <p className="font-semibold text-red-600">{formatCurrency(budget.spent_budget)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Committed</p>
                            <p className="font-semibold text-yellow-600">{formatCurrency(budget.committed_budget)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Remaining</p>
                            <p className="font-semibold text-green-600">{formatCurrency(budget.remaining_budget)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{transaction.transaction_number}</div>
                            <div className="text-sm text-gray-500">{transaction.description.substring(0, 40)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.payee_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.expense_category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(transaction.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.approval_status)}`}>
                              {transaction.approval_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-green-600 hover:text-green-900">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Approvals</h2>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{approval.request_title}</h3>
                            <span className={`text-sm font-medium ${getPriorityColor(approval.priority)}`}>
                              {approval.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {approval.request_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{approval.approval_number}</span>
                            <span>•</span>
                            <span>Requested by: {approval.requester_name}</span>
                            <span>•</span>
                            <span>{new Date(approval.requested_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(approval.requested_amount)}</p>
                          <div className="flex gap-2 mt-3">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                              Approve
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                              Reject
                            </button>
                            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingApprovals.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-4xl mb-2">✅</p>
                      <p>No pending approvals</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;
