import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Activity {
  id: number;
  component_id: number;
  component_name: string;
  sub_program_name: string;
  module_name: string;
  name: string;
  description: string;
  activity_date: string;
  location_details: string;
  status: string;
  approval_status: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  budget_allocated: number;
  budget_spent: number;
  priority: string;
}

interface ChecklistStatus {
  total: number;
  completed: number;
  percentage: number;
  all_completed: boolean;
}

interface ChecklistItem {
  id: number;
  activity_id: number;
  item_name: string;
  is_completed: boolean;
}

const Approvals: React.FC = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('submitted');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [checklistStatuses, setChecklistStatuses] = useState<Record<number, ChecklistStatus>>({});
  const [checklistItems, setChecklistItems] = useState<Record<number, ChecklistItem[]>>({});
  const [showChecklistProgress, setShowChecklistProgress] = useState(true);
  const [allowApproverToComplete, setAllowApproverToComplete] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPendingActivities();
    fetchSettings();
  }, [filter]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success && data.data) {
        setShowChecklistProgress(data.data.show_checklist_progress_in_approvals ?? true);
        setAllowApproverToComplete(data.data.allow_approver_to_complete_checklist ?? false);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchChecklistStatuses = async (activityIds: number[]) => {
    const statuses: Record<number, ChecklistStatus> = {};

    await Promise.all(
      activityIds.map(async (id) => {
        try {
          const response = await fetch(`/api/checklists/activity/${id}/status`);
          const data = await response.json();
          if (data.success && data.data) {
            statuses[id] = data.data;
          }
        } catch (err) {
          console.error(`Failed to fetch checklist for activity ${id}:`, err);
        }
      })
    );

    setChecklistStatuses(statuses);
  };

  const fetchChecklistItems = async (activityIds: number[]) => {
    const items: Record<number, ChecklistItem[]> = {};

    await Promise.all(
      activityIds.map(async (id) => {
        try {
          const response = await fetch(`/api/checklists/activity/${id}`);
          const data = await response.json();
          if (data.success && data.data) {
            items[id] = data.data;
          }
        } catch (err) {
          console.error(`Failed to fetch checklist items for activity ${id}:`, err);
        }
      })
    );

    setChecklistItems(items);
  };

  const handleToggleChecklistItem = async (activityId: number, itemId: number) => {
    if (!allowApproverToComplete) return;

    try {
      const response = await fetch(`/api/checklists/${itemId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Refresh checklist items and status
        await fetchChecklistItems([activityId]);
        await fetchChecklistStatuses([activityId]);
      }
    } catch (err) {
      console.error('Failed to toggle checklist item:', err);
    }
  };

  const toggleChecklistExpanded = (activityId: number) => {
    const newExpanded = new Set(expandedChecklists);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedChecklists(newExpanded);
  };

  const fetchPendingActivities = async () => {
    try {
      setLoading(true);
      const url = filter === 'submitted'
        ? '/api/approvals/pending'
        : `/api/activities?approval_status=${filter}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      const activitiesData = data.data || [];
      setActivities(activitiesData);

      // Fetch checklist statuses and items for all activities
      if (activitiesData.length > 0) {
        const activityIds = activitiesData.map((a: Activity) => a.id);
        await fetchChecklistStatuses(activityIds);
        await fetchChecklistItems(activityIds);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleApprove = async (activityId: number) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    // Validate if approval is allowed
    try {
      const validationRes = await fetch('/api/settings/validate/can-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity })
      });
      const validationData = await validationRes.json();

      if (!validationData.data.allowed) {
        alert(validationData.data.reason || 'Cannot approve this activity');
        return;
      }
    } catch (err) {
      console.error('Validation error:', err);
    }

    try {
      setProcessingId(activityId);
      const response = await fetch(`/api/activities/${activityId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to approve activity');

      await fetchPendingActivities();
      setProcessingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve activity');
      setProcessingId(null);
    }
  };

  const handleReject = async (activityId: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setProcessingId(activityId);
      const response = await fetch(`/api/activities/${activityId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: reason }),
      });

      if (!response.ok) throw new Error('Failed to reject activity');

      await fetchPendingActivities();
      setProcessingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject activity');
      setProcessingId(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading approvals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Activity Approvals
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Review and approve field activities
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Programs
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('submitted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({activities.filter(a => a.approval_status === 'submitted').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No activities found for this filter</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {activity.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                        <span>{activity.module_name}</span>
                        <span>→</span>
                        <span>{activity.sub_program_name}</span>
                        <span>→</span>
                        <span>{activity.component_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(activity.priority)}`}>
                        {activity.priority}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-4">{activity.description}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Activity Date</p>
                      <p className="font-medium text-gray-900">
                        {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-900">{activity.location_details || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Beneficiaries</p>
                      <p className="font-medium text-gray-900">
                        {activity.actual_beneficiaries || 0} / {activity.target_beneficiaries || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-medium text-gray-900">
                        ${activity.budget_spent || 0} / ${activity.budget_allocated || 0}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        activity.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.status === 'not-started'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        activity.approval_status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : activity.approval_status === 'submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : activity.approval_status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {activity.approval_status}
                    </span>
                  </div>

                  {/* Checklist Progress */}
                  {showChecklistProgress && checklistStatuses[activity.id] && checklistStatuses[activity.id].total > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Checklist Progress</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {checklistStatuses[activity.id].completed} / {checklistStatuses[activity.id].total}
                          <span className="text-gray-500 ml-1">
                            ({Math.round(checklistStatuses[activity.id].percentage)}%)
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            checklistStatuses[activity.id].all_completed
                              ? 'bg-green-500'
                              : checklistStatuses[activity.id].percentage >= 50
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${checklistStatuses[activity.id].percentage}%` }}
                        />
                      </div>
                      {!checklistStatuses[activity.id].all_completed && (
                        <p className="text-xs text-amber-600 mt-2">
                          ⚠ {checklistStatuses[activity.id].total - checklistStatuses[activity.id].completed} item(s) remaining
                        </p>
                      )}

                      {/* Show/Hide Checklist Items Button */}
                      {checklistItems[activity.id] && checklistItems[activity.id].length > 0 && (
                        <button
                          onClick={() => toggleChecklistExpanded(activity.id)}
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {expandedChecklists.has(activity.id) ? '▼ Hide Checklist Items' : '▶ Show Checklist Items'}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Detailed Checklist Items */}
                  {showChecklistProgress && expandedChecklists.has(activity.id) && checklistItems[activity.id] && checklistItems[activity.id].length > 0 && (
                    <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-800">Implementation Checklist</h4>
                        {!allowApproverToComplete && (
                          <span className="text-xs text-gray-500 italic">View only</span>
                        )}
                        {allowApproverToComplete && (
                          <span className="text-xs text-green-600 italic">✓ Can complete items</span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {checklistItems[activity.id].map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded border hover:border-gray-300 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={item.is_completed}
                              onChange={() => handleToggleChecklistItem(activity.id, item.id)}
                              disabled={!allowApproverToComplete}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                              title={allowApproverToComplete ? 'Click to toggle' : 'View only - enable in Settings'}
                            />
                            <span
                              className={`flex-1 text-sm ${
                                item.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}
                            >
                              {item.item_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {activity.approval_status === 'submitted' && (
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <button
                        onClick={() => handleApprove(activity.id)}
                        disabled={processingId === activity.id}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {processingId === activity.id ? 'Processing...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(activity.id)}
                        disabled={processingId === activity.id}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        {processingId === activity.id ? 'Processing...' : '✗ Reject'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Approvals;
