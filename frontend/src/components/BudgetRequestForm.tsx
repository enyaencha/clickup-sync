import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface BudgetRequestFormProps {
  activityId: number;
  activityName: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface BudgetBreakdown {
  [key: string]: number;
}

const BudgetRequestForm: React.FC<BudgetRequestFormProps> = ({
  activityId,
  activityName,
  onSuccess,
  onClose
}) => {
  const [formData, setFormData] = useState({
    requested_amount: '',
    justification: '',
    priority: 'medium'
  });
  const [breakdown, setBreakdown] = useState<BudgetBreakdown>({
    'Materials': 0,
    'Personnel': 0,
    'Venue': 0,
    'Transport': 0,
    'Other': 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBreakdownChange = (category: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBreakdown(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const addBreakdownItem = () => {
    const newCategory = prompt('Enter budget category name:');
    if (newCategory && newCategory.trim()) {
      setBreakdown(prev => ({
        ...prev,
        [newCategory.trim()]: 0
      }));
    }
  };

  const removeBreakdownItem = (category: string) => {
    setBreakdown(prev => {
      const newBreakdown = { ...prev };
      delete newBreakdown[category];
      return newBreakdown;
    });
  };

  const totalBreakdown = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const requestedAmount = parseFloat(formData.requested_amount);

    if (requestedAmount <= 0) {
      setError('Requested amount must be greater than 0');
      return;
    }

    if (totalBreakdown > requestedAmount) {
      setError(`Breakdown total (${totalBreakdown.toFixed(2)}) exceeds requested amount (${requestedAmount.toFixed(2)})`);
      return;
    }

    if (!formData.justification.trim()) {
      setError('Justification is required');
      return;
    }

    setLoading(true);

    try {
      const response = await authFetch('/api/budget-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          requested_amount: requestedAmount,
          justification: formData.justification,
          breakdown: breakdown,
          priority: formData.priority
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit budget request');
      }

      alert('Budget request submitted successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request Budget</h2>
              <p className="text-sm text-gray-600 mt-1">For: {activityName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Requested Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Amount (KES) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.requested_amount}
                onChange={(e) => setFormData({ ...formData, requested_amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="0.00"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                required
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Justification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Justification *
              </label>
              <textarea
                required
                rows={4}
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Explain why this budget is needed and how it will be used..."
              />
            </div>

            {/* Budget Breakdown */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Budget Breakdown (Optional)
                </label>
                <button
                  type="button"
                  onClick={addBreakdownItem}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Category
                </button>
              </div>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                {Object.entries(breakdown).map(([category, amount]) => (
                  <div key={category} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={category}
                      disabled
                      className="flex-1 px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={amount || ''}
                      onChange={(e) => handleBreakdownChange(category, e.target.value)}
                      className="w-40 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                    {!['Materials', 'Personnel', 'Venue', 'Transport', 'Other'].includes(category) && (
                      <button
                        type="button"
                        onClick={() => removeBreakdownItem(category)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-300 font-semibold">
                  <span>Total Breakdown:</span>
                  <span className={totalBreakdown > parseFloat(formData.requested_amount || '0') ? 'text-red-600' : 'text-green-600'}>
                    KES {totalBreakdown.toFixed(2)}
                  </span>
                </div>
                {totalBreakdown > 0 && totalBreakdown !== parseFloat(formData.requested_amount || '0') && (
                  <p className="text-sm text-gray-600">
                    {totalBreakdown < parseFloat(formData.requested_amount || '0')
                      ? `Unallocated: KES ${(parseFloat(formData.requested_amount || '0') - totalBreakdown).toFixed(2)}`
                      : 'Breakdown exceeds requested amount'}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetRequestForm;
