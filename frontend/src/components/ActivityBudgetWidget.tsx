import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import BudgetRequestForm from './BudgetRequestForm';

interface ActivityBudget {
  activity_id: number;
  allocated_budget: number;
  requested_budget: number;
  approved_budget: number;
  spent_budget: number;
  committed_budget: number;
  remaining_budget: number;
  budget_source: string;
  last_allocation_date: string | null;
}

interface ActivityBudgetWidgetProps {
  activityId: number;
  activityName: string;
  canRequestBudget?: boolean;
}

const ActivityBudgetWidget: React.FC<ActivityBudgetWidgetProps> = ({
  activityId,
  activityName,
  canRequestBudget = false
}) => {
  const [budget, setBudget] = useState<ActivityBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchBudget();
  }, [activityId]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/budget-requests/activity/${activityId}/budget`);
      if (response.ok) {
        const data = await response.json();
        setBudget(data.data);
      }
    } catch (error) {
      console.error('Error fetching activity budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPercentageUsed = () => {
    if (!budget || budget.approved_budget === 0) return 0;
    return ((budget.spent_budget + budget.committed_budget) / budget.approved_budget) * 100;
  };

  const getProgressBarColor = () => {
    const percentage = getPercentageUsed();
    if (percentage >= 90) return 'bg-red-600';
    if (percentage >= 75) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!budget || budget.approved_budget === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Activity Budget</h3>
            <p className="text-lg font-semibold text-gray-900">No Budget Allocated</p>
          </div>
          {canRequestBudget && (
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Request Budget
            </button>
          )}
        </div>

        {showRequestForm && (
          <BudgetRequestForm
            activityId={activityId}
            activityName={activityName}
            onSuccess={fetchBudget}
            onClose={() => setShowRequestForm(false)}
          />
        )}
      </div>
    );
  }

  const percentageUsed = getPercentageUsed();

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Activity Budget</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(budget.remaining_budget)}
            </p>
            <p className="text-xs text-gray-600">Remaining</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Approved</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(budget.approved_budget)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Budget Utilization</span>
            <span>{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`${getProgressBarColor()} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-green-700 mb-1">Spent</p>
            <p className="text-sm font-semibold text-green-900">
              {formatCurrency(budget.spent_budget)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-xs text-yellow-700 mb-1">Committed</p>
            <p className="text-sm font-semibold text-yellow-900">
              {formatCurrency(budget.committed_budget)}
            </p>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {expanded ? '▲ Show Less' : '▼ Show More Details'}
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Allocated Budget:</span>
              <span className="font-medium">{formatCurrency(budget.allocated_budget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Approved Budget:</span>
              <span className="font-medium">{formatCurrency(budget.approved_budget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spent:</span>
              <span className="font-medium text-green-600">{formatCurrency(budget.spent_budget)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Committed:</span>
              <span className="font-medium text-yellow-600">{formatCurrency(budget.committed_budget)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-gray-900 font-medium">Remaining:</span>
              <span className="font-bold text-blue-600">{formatCurrency(budget.remaining_budget)}</span>
            </div>
            {budget.last_allocation_date && (
              <div className="text-xs text-gray-500">
                Last allocation: {new Date(budget.last_allocation_date).toLocaleDateString()}
              </div>
            )}
            {budget.budget_source && (
              <div className="text-xs text-gray-500">
                Source: {budget.budget_source.replace(/_/g, ' ')}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {canRequestBudget && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Request Additional Budget
            </button>
          </div>
        )}

        {/* Budget Health Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          {percentageUsed >= 90 && (
            <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Budget almost exhausted! Request additional budget soon.</span>
            </div>
          )}
          {percentageUsed >= 75 && percentageUsed < 90 && (
            <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Budget running low. Consider planning for additional budget.</span>
            </div>
          )}
          {percentageUsed < 75 && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Budget healthy. {(100 - percentageUsed).toFixed(1)}% remaining.</span>
            </div>
          )}
        </div>
      </div>

      {showRequestForm && (
        <BudgetRequestForm
          activityId={activityId}
          activityName={activityName}
          onSuccess={fetchBudget}
          onClose={() => setShowRequestForm(false)}
        />
      )}
    </>
  );
};

export default ActivityBudgetWidget;
