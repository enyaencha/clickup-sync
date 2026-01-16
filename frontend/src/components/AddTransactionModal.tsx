import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { formatNumberInput, parseNumberInput } from '../utils/numberInput';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Budget {
  id: number;
  program_module_id: number;
  status: string;
  fiscal_year: string;
  program_module_name: string;
  total_budget: number;
  remaining_budget: number;
}

interface Activity {
  id: number;
  name: string;
  code?: string;
  status?: string;
  approval_status?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityBudget, setActivityBudget] = useState<{
    approved_budget: number;
    spent_budget: number;
    committed_budget: number;
    remaining_budget: number;
  } | null>(null);
  const [activityBreakdown, setActivityBreakdown] = useState<Record<string, number>>({});
  const [expenditureBreakdown, setExpenditureBreakdown] = useState<Record<string, number>>({});
  const [transactionBreakdown, setTransactionBreakdown] = useState<Record<string, number>>({});
  const [activityExpenditures, setActivityExpenditures] = useState<
    { amount: number; expense_category: string; status: string }[]
  >([]);
  const [activityTransactions, setActivityTransactions] = useState<
    { amount: number; budget_line?: string | null; expense_category?: string; approval_status: string }[]
  >([]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [linkToActivity, setLinkToActivity] = useState(false);

  const [formData, setFormData] = useState({
    program_budget_id: '',
    activity_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_type: 'expense',
    amount: '',
    expense_category: 'program',
    expense_subcategory: '',
    budget_line: '',
    payment_method: 'bank_transfer',
    payment_reference: '',
    receipt_number: '',
    invoice_number: '',
    payee_name: '',
    payee_type: 'individual',
    payee_id_number: '',
    description: '',
    purpose: '',
    verification_notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchBudgets();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.program_budget_id) {
      fetchActivitiesForBudget(formData.program_budget_id);
    } else {
      setActivities([]);
    }
    setFormData((prev) => ({ ...prev, activity_id: '' }));
  }, [formData.program_budget_id, budgets]);

  useEffect(() => {
    if (linkToActivity && formData.activity_id) {
      fetchActivityBudget(formData.activity_id);
      fetchActivityBreakdown(formData.activity_id);
      fetchExpenditureBreakdown(formData.activity_id);
      fetchTransactionBreakdown(formData.activity_id);
    } else {
      setActivityBudget(null);
      setActivityBreakdown({});
      setExpenditureBreakdown({});
      setTransactionBreakdown({});
      setActivityExpenditures([]);
      setActivityTransactions([]);
    }
  }, [linkToActivity, formData.activity_id]);

  const formatKes = (value: number | string | null | undefined) => {
    const amount = Number(value) || 0;
    return amount.toLocaleString();
  };

  const fetchBudgets = async () => {
    try {
      const response = await authFetch('/api/finance/budgets');
      if (response.ok) {
        const data = await response.json();
        const allBudgets = data.data || [];
        setBudgets(allBudgets.filter((budget: Budget) => ['approved', 'active'].includes(budget.status)));
      }
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    }
  };

  const fetchActivitiesForBudget = async (budgetId: string) => {
    try {
      const response = await authFetch(`/api/finance/budgets/${budgetId}/activities?status=completed,complete`);
      if (response.status === 304) return;
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  const fetchActivityBudget = async (activityId: string) => {
    try {
      const response = await authFetch(`/api/budget-requests/activity/${activityId}/budget`);
      if (response.status === 304) return;
      if (response.ok) {
        const data = await response.json();
        const budgetData = data.data || null;
        if (!budgetData) {
          setActivityBudget(null);
          return;
        }
        setActivityBudget({
          approved_budget: Number(budgetData.approved_budget) || 0,
          spent_budget: Number(budgetData.spent_budget) || 0,
          committed_budget: Number(budgetData.committed_budget) || 0,
          remaining_budget: Number(budgetData.remaining_budget) || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch activity budget:', error);
      setActivityBudget(null);
    }
  };

  const fetchActivityBreakdown = async (activityId: string) => {
    try {
      const response = await authFetch(`/api/budget-requests?activity_id=${activityId}&status=approved`);
      if (response.status === 304) return;
      if (!response.ok) return;
      const data = await response.json();
      const requests = data.data || [];
      const totals: Record<string, number> = {};

      requests.forEach((request: { breakdown?: Record<string, number> | string }) => {
        let breakdown: Record<string, number> = {};
        if (typeof request.breakdown === 'string') {
          try {
            breakdown = JSON.parse(request.breakdown) || {};
          } catch {
            breakdown = {};
          }
        } else {
          breakdown = request.breakdown || {};
        }

        Object.entries(breakdown).forEach(([category, amount]) => {
          totals[category] = (totals[category] || 0) + (Number(amount) || 0);
        });
      });

      setActivityBreakdown(totals);
    } catch (error) {
      console.error('Failed to fetch activity breakdown:', error);
      setActivityBreakdown({});
    }
  };

  const fetchExpenditureBreakdown = async (activityId: string) => {
    try {
      const response = await authFetch(`/api/budget-requests/activity/${activityId}/expenditures`);
      if (response.status === 304) return;
      if (!response.ok) return;
      const data = await response.json();
      const expenditures = data.data || [];
      const totals: Record<string, number> = {};

      expenditures.forEach((exp: { expense_category?: string; amount?: number }) => {
        const category = exp.expense_category || 'Uncategorized';
        totals[category] = (totals[category] || 0) + (Number(exp.amount) || 0);
      });

      setExpenditureBreakdown(totals);
      setActivityExpenditures(expenditures);
    } catch (error) {
      console.error('Failed to fetch expenditure breakdown:', error);
      setExpenditureBreakdown({});
      setActivityExpenditures([]);
    }
  };

  const fetchTransactionBreakdown = async (activityId: string) => {
    try {
      const response = await authFetch(`/api/finance/transactions?activity_id=${activityId}&limit=200`);
      if (response.status === 304) return;
      if (!response.ok) return;
      const data = await response.json();
      const transactions = data.data || [];
      const totals: Record<string, number> = {};

      transactions.forEach((tx: { budget_line?: string; expense_category?: string; amount?: number }) => {
        const line = tx.budget_line || tx.expense_category || 'Unspecified';
        totals[line] = (totals[line] || 0) + (Number(tx.amount) || 0);
      });

      setTransactionBreakdown(totals);
      setActivityTransactions(transactions);
    } catch (error) {
      console.error('Failed to fetch transaction breakdown:', error);
      setTransactionBreakdown({});
      setActivityTransactions([]);
    }
  };

  const statusIs = (value: string | undefined, match: string) =>
    (value || '').toLowerCase() === match;

  const computedActivityBudget = React.useMemo(() => {
    if (!activityBudget) return null;

    const spentExpenditures = activityExpenditures
      .filter((exp) => statusIs(exp.status, 'approved'))
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const committedExpenditures = activityExpenditures
      .filter((exp) => statusIs(exp.status, 'pending'))
      .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const spentTransactions = activityTransactions
      .filter((tx) => statusIs(tx.approval_status, 'approved'))
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const committedTransactions = activityTransactions
      .filter((tx) => statusIs(tx.approval_status, 'pending'))
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    const spent = spentExpenditures + spentTransactions;
    const committed = committedExpenditures + committedTransactions;
    const remaining = activityBudget.approved_budget - (spent + committed);

    return {
      approved_budget: activityBudget.approved_budget,
      spent_budget: spent,
      committed_budget: committed,
      remaining_budget: remaining,
    };
  }, [activityBudget, activityExpenditures, activityTransactions]);

  const uploadAttachment = async (transactionId: number, file: File, type: string, description: string) => {
    const formData = new FormData();
    formData.append('entity_type', 'transaction');
    formData.append('entity_id', transactionId.toString());
    formData.append('attachment_type', type);
    formData.append('description', description);
    formData.append('file', file);

    const response = await authFetch('/api/attachments/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const data = await response.json();
    return data.attachments?.[0]?.path as string | undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const amountValue = parseNumberInput(formData.amount) ?? 0;
      if (linkToActivity && computedActivityBudget && amountValue > computedActivityBudget.remaining_budget) {
        alert('Amount exceeds the remaining activity budget.');
        setLoading(false);
        return;
      }

      const response = await authFetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          program_budget_id: parseInt(formData.program_budget_id),
          activity_id: linkToActivity ? parseInt(formData.activity_id) : null,
          amount: amountValue,
        })
      });

      if (response.ok) {
        const data = await response.json();
        const transactionId = data?.data?.id;

        if (transactionId) {
          try {
            const documentUpdates: {
              receipt_url?: string;
              invoice_url?: string;
              approval_document_url?: string;
            } = {};

            if (receiptFile) {
              documentUpdates.receipt_url = await uploadAttachment(
                transactionId,
                receiptFile,
                'receipt',
                'Transaction receipt'
              );
            }

            if (invoiceFile) {
              documentUpdates.invoice_url = await uploadAttachment(
                transactionId,
                invoiceFile,
                'invoice',
                'Transaction invoice'
              );
            }

            if (verificationFile) {
              documentUpdates.approval_document_url = await uploadAttachment(
                transactionId,
                verificationFile,
                'approval_document',
                'Verification evidence'
              );
            }

            if (Object.keys(documentUpdates).length > 0) {
              await authFetch(`/api/finance/transactions/${transactionId}/documents`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(documentUpdates),
              });
            }
          } catch (uploadError) {
            console.error('Failed to upload transaction documents:', uploadError);
            alert('Transaction saved, but document upload failed. You can re-upload from attachments.');
          }
        }

        onSuccess();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Failed to create transaction: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Failed to create transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      program_budget_id: '',
      activity_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_type: 'expense',
      amount: '',
      expense_category: 'program',
      expense_subcategory: '',
      budget_line: '',
      payment_method: 'bank_transfer',
      payment_reference: '',
      receipt_number: '',
      invoice_number: '',
      payee_name: '',
      payee_type: 'individual',
      payee_id_number: '',
      description: '',
      purpose: '',
      verification_notes: ''
    });
    setReceiptFile(null);
    setInvoiceFile(null);
    setVerificationFile(null);
    setLinkToActivity(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Record New Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Budget & Transaction Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget <span className="text-red-500">*</span>
              </label>
              <select
                name="program_budget_id"
                value={formData.program_budget_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Budget</option>
                {budgets.map(budget => (
                  <option key={budget.id} value={budget.id}>
                    {budget.program_module_name} - FY {budget.fiscal_year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Activity?
              </label>
              <select
                value={linkToActivity ? 'yes' : 'no'}
                onChange={(e) => setLinkToActivity(e.target.value === 'yes')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {linkToActivity && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity (Completed in selected program) <span className="text-red-500">*</span>
                </label>
                <select
                  name="activity_id"
                  value={formData.activity_id}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Activity</option>
                  {activities.map(activity => (
                    <option key={activity.id} value={activity.id}>
                      {activity.code ? `${activity.code} - ${activity.name}` : activity.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {linkToActivity && computedActivityBudget && (
              <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                <div className="flex flex-wrap gap-4">
                  <div>Approved: <strong>KES {formatKes(computedActivityBudget.approved_budget)}</strong></div>
                  <div>Spent: <strong>KES {formatKes(computedActivityBudget.spent_budget)}</strong></div>
                  <div>Committed: <strong>KES {formatKes(computedActivityBudget.committed_budget)}</strong></div>
                  <div>Remaining: <strong>KES {formatKes(computedActivityBudget.remaining_budget)}</strong></div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <select
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="transfer">Transfer</option>
                <option value="advance">Advance</option>
                <option value="reimbursement">Reimbursement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KES) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: formatNumberInput(e.target.value) }))}
                required
                inputMode="decimal"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {linkToActivity && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity Budget Line Items</h3>
              {Object.keys(activityBreakdown).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                  {Object.entries(activityBreakdown).map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}</span>
                      <span className="font-medium">KES {formatKes(amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No approved budget line items found for this activity.</p>
              )}
            </div>
          )}

          {/* Expense Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Category
              </label>
              <select
                name="expense_category"
                value={formData.expense_category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="program">Program</option>
                <option value="operational">Operational</option>
                <option value="capital">Capital</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <input
                type="text"
                name="expense_subcategory"
                value={formData.expense_subcategory}
                onChange={handleChange}
                placeholder="e.g., Training, Equipment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Line
              </label>
              <input
                type="text"
                name="budget_line"
                value={formData.budget_line}
                onChange={handleChange}
                placeholder="e.g., 4.1.2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {linkToActivity && Object.keys(activityBreakdown).length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Budget Line Item (Optional)
              </label>
              <select
                value={formData.budget_line || ''}
                onChange={(e) => setFormData({ ...formData, budget_line: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select line item</option>
                {Object.keys(activityBreakdown).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">This will fill the budget line but is not required.</p>
            </div>
          )}

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="mobile_money">Mobile Money</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Reference
              </label>
              <input
                type="text"
                name="payment_reference"
                value={formData.payment_reference}
                onChange={handleChange}
                placeholder="e.g., TRX12345"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Receipt Number
              </label>
              <input
                type="text"
                name="receipt_number"
                value={formData.receipt_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payee Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payee Name
              </label>
              <input
                type="text"
                name="payee_name"
                value={formData.payee_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payee Type
              </label>
              <select
                name="payee_type"
                value={formData.payee_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="individual">Individual</option>
                <option value="organization">Organization</option>
                <option value="vendor">Vendor</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Number
              </label>
              <input
                type="text"
                name="payee_id_number"
                value={formData.payee_id_number}
                onChange={handleChange}
                placeholder="ID or KRA PIN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {linkToActivity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Spent via Activity Expenditures</h3>
                {Object.keys(expenditureBreakdown).length > 0 ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    {Object.entries(expenditureBreakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between">
                        <span>{category}</span>
                        <span className="font-medium">KES {formatKes(amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No expenditures recorded yet.</p>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Spent via Transactions</h3>
                {Object.keys(transactionBreakdown).length > 0 ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    {Object.entries(transactionBreakdown).map(([line, amount]) => (
                      <div key={line} className="flex justify-between">
                        <span>{line}</span>
                        <span className="font-medium">KES {formatKes(amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No transactions recorded yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Description & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Verification & Evidence */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification & Evidence</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code / Notes
              </label>
              <input
                type="text"
                name="verification_notes"
                value={formData.verification_notes}
                onChange={handleChange}
                placeholder="Enter verification code or notes"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receipt Upload
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Upload
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  onChange={(e) => setInvoiceFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Evidence / Approval Document
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  onChange={(e) => setVerificationFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
