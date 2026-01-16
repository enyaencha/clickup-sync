import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { formatNumberInput, parseNumberInput } from '../utils/numberInput';
import { useAuth } from '../contexts/AuthContext';

interface Expenditure {
  id: number;
  activity_id: number;
  budget_request_id: number | null;
  expense_date: string;
  expense_category: string;
  description: string;
  amount: number;
  receipt_number: string | null;
  vendor_name: string | null;
  payment_method: string;
  status: string;
  notes: string | null;
  submitted_by: number;
  submitted_by_name: string;
  approved_by: number | null;
  approved_by_name: string | null;
  approved_at: string | null;
  created_at: string;
  request_number: string | null;
}

interface ActivityTransaction {
  id: number;
  transaction_number: string;
  transaction_date: string;
  amount: number;
  budget_line: string | null;
  expense_category: string;
  approval_status: string;
  payee_name: string | null;
}

interface ActivityExpenditureTrackingProps {
  activityId: number;
  activityName: string;
  approvedBudget: number;
}

const ActivityExpenditureTracking: React.FC<ActivityExpenditureTrackingProps> = ({
  activityId,
  activityName,
  approvedBudget: _approvedBudget
}) => {
  const { user } = useAuth();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [transactions, setTransactions] = useState<ActivityTransaction[]>([]);
  const [budgetSummary, setBudgetSummary] = useState({
    approved_budget: 0,
    spent_budget: 0,
    committed_budget: 0,
    remaining_budget: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    expense_category: 'Materials',
    description: '',
    amount: '',
    receipt_number: '',
    vendor_name: '',
    payment_method: 'cash',
    notes: ''
  });

  useEffect(() => {
    fetchExpenditures();
    fetchTransactions();
    fetchBudgetSummary();
  }, [activityId]);

  const fetchExpenditures = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/budget-requests/activity/${activityId}/expenditures`);
      if (response.ok) {
        const data = await response.json();
        setExpenditures(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching expenditures:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await authFetch(`/api/finance/transactions?activity_id=${activityId}&limit=100`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBudgetSummary = async () => {
    try {
      const response = await authFetch(`/api/budget-requests/activity/${activityId}/budget`);
      if (response.ok) {
        const data = await response.json();
        const summary = data.data || {};
        setBudgetSummary({
          approved_budget: Number(summary.approved_budget) || 0,
          spent_budget: Number(summary.spent_budget) || 0,
          committed_budget: Number(summary.committed_budget) || 0,
          remaining_budget: Number(summary.remaining_budget) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching budget summary:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim() || !formData.amount) {
      alert('Description and amount are required');
      return;
    }

    try {
      const response = await authFetch('/api/budget-requests/expenditures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          ...formData,
          amount: parseNumberInput(formData.amount) ?? 0
        })
      });

      if (!response.ok) {
        throw new Error('Failed to record expenditure');
      }

      alert('Expenditure recorded successfully!');
      setShowAddModal(false);
      setFormData({
        expense_date: new Date().toISOString().split('T')[0],
        expense_category: 'Materials',
        description: '',
        amount: '',
        receipt_number: '',
        vendor_name: '',
        payment_method: 'cash',
        notes: ''
      });
      fetchExpenditures();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to record expenditure');
    }
  };

  const statusIs = (value: string | undefined, match: string) =>
    (value || '').toLowerCase() === match;

  const spentExpenditures = expenditures
    .filter((exp) => statusIs(exp.status, 'approved'))
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const committedExpenditures = expenditures
    .filter((exp) => statusIs(exp.status, 'pending'))
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const spentTransactions = transactions
    .filter((tx) => statusIs(tx.approval_status, 'approved'))
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const committedTransactions = transactions
    .filter((tx) => statusIs(tx.approval_status, 'pending'))
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const totalSpent = spentExpenditures + spentTransactions;
  const totalCommitted = committedExpenditures + committedTransactions;
  const remaining = budgetSummary.approved_budget - (totalSpent + totalCommitted);
  const spentPercentage = budgetSummary.approved_budget > 0
    ? (totalSpent / budgetSummary.approved_budget) * 100
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">💰 Expenditure Tracking</h2>
          <p className="text-sm text-gray-600 mt-1">{activityName}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          + Record Expense
        </button>
      </div>

      {/* Budget Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <p className="text-sm text-gray-600">Approved Budget</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(budgetSummary.approved_budget)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalSpent)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-gray-600">
                Budget Utilization
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-600">
                {spentPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                spentPercentage > 100 ? 'bg-red-500' : spentPercentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            />
          </div>
          {spentPercentage > 100 && (
            <p className="text-xs text-red-600 font-medium">⚠️ Budget exceeded!</p>
          )}
        </div>
      </div>

      {/* Expenditures List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading expenditures...</p>
        </div>
      ) : expenditures.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No expenditures recorded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenditures.map((exp) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{exp.expense_category}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(exp.status)}`}>
                      {exp.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{exp.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(exp.amount)}</p>
                  <p className="text-xs text-gray-500">{new Date(exp.expense_date).toLocaleDateString()}</p>
                </div>
              </div>

              {exp.vendor_name && (
                <p className="text-sm text-gray-600">Vendor: {exp.vendor_name}</p>
              )}
              {exp.receipt_number && (
                <p className="text-sm text-gray-600">Receipt #: {exp.receipt_number}</p>
              )}

              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                <p>Submitted by: {exp.submitted_by_name}</p>
                {exp.approved_by_name && (
                  <p>Approved by: {exp.approved_by_name} on {new Date(exp.approved_at!).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transactions List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Transactions</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No transactions recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.transaction_number}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.transaction_date).toLocaleDateString()} • {tx.expense_category}
                    {tx.budget_line ? ` • ${tx.budget_line}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(tx.approval_status)}`}>
                    {tx.approval_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Record Expense</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.expense_date}
                      onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.expense_category}
                      onChange={(e) => setFormData({ ...formData, expense_category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Materials">Materials</option>
                      <option value="Personnel">Personnel</option>
                      <option value="Venue">Venue</option>
                      <option value="Transport">Transport</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Catering">Catering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what this expense was for..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (KES) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: formatNumberInput(e.target.value) })}
                      inputMode="decimal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="cash">Cash</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="check">Check</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Receipt Number
                    </label>
                    <input
                      type="text"
                      value={formData.receipt_number}
                      onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={formData.vendor_name}
                      onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional notes..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Record Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityExpenditureTracking;
