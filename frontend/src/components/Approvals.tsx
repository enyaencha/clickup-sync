import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EvidenceViewer from './EvidenceViewer';
import { authFetch } from '../config/api';

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

interface Verification {
  id: number;
  entity_type: string;
  entity_id: number;
  verification_method: string;
  description: string;
  evidence_type: string;
  document_name: string;
  document_path: string;
  document_date: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'needs-update';
  verified_by: number | null;
  verified_date: string | null;
  verification_notes: string;
  collection_frequency: string;
  responsible_person: string;
  notes: string;
  entity_name?: string;
}

interface Attachment {
  id: number;
  entity_type: string;
  entity_id: number;
  file_name: string;
  file_path: string | null;
  file_url: string | null;
  file_type: string | null;
  file_size: number | null;
  attachment_type: string;
  description: string | null;
  uploaded_at: string;
  uploaded_by: number | null;
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
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'approved' | 'rejected'>('submitted');
  const [activeTab, setActiveTab] = useState<'activities' | 'verifications'>('activities');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [checklistStatuses, setChecklistStatuses] = useState<Record<number, ChecklistStatus>>({});
  const [checklistItems, setChecklistItems] = useState<Record<number, ChecklistItem[]>>({});
  const [showChecklistProgress, setShowChecklistProgress] = useState(true);
  const [allowApproverToComplete, setAllowApproverToComplete] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState<Set<number>>(new Set());

  // Verification-specific state
  const [attachments, setAttachments] = useState<Record<number, Attachment[]>>({});
  const [showEvidenceViewer, setShowEvidenceViewer] = useState(false);
  const [viewingVerification, setViewingVerification] = useState<Verification | null>(null);

  useEffect(() => {
    if (activeTab === 'activities') {
      fetchPendingActivities();
    } else if (activeTab === 'verifications') {
      fetchPendingVerifications();
    }
    fetchSettings();
  }, [filter, activeTab]);

  const fetchSettings = async () => {
    try {
      const response = await authFetch('/api/settings');
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
          const response = await authFetch(`/api/checklists/activity/${id}/status`);
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
          const response = await authFetch(`/api/checklists/activity/${id}`);
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
      const response = await authFetch(`/api/checklists/${itemId}/toggle`, {
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

      const response = await authFetch(url);
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
      const validationRes = await authFetch('/api/settings/validate/can-approve', {
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
      const response = await authFetch(`/api/activities/${activityId}/approve`, {
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
      const response = await authFetch(`/api/activities/${activityId}/reject`, {
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

  const fetchPendingVerifications = async () => {
    try {
      setLoading(true);
      const url = '/api/means-of-verification';

      const response = await authFetch(url);
      if (!response.ok) throw new Error('Failed to fetch verifications');

      const data = await response.json();
      let verifs = data.data || [];

      // Filter by verification status
      if (filter === 'submitted') {
        verifs = verifs.filter((v: Verification) => v.verification_status === 'pending');
      } else if (filter === 'approved') {
        verifs = verifs.filter((v: Verification) => v.verification_status === 'verified');
      } else if (filter === 'rejected') {
        verifs = verifs.filter((v: Verification) => v.verification_status === 'rejected');
      }

      setVerifications(verifs);

      // Fetch attachments for each verification
      for (const verif of verifs) {
        fetchAttachmentsForVerification(verif.id);
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchAttachmentsForVerification = async (verificationId: number) => {
    try {
      const response = await authFetch(`/api/attachments?entity_type=verification&entity_id=${verificationId}`);
      if (!response.ok) return;

      const data = await response.json();
      setAttachments(prev => ({
        ...prev,
        [verificationId]: data.data || []
      }));
    } catch (err) {
      console.error('Error fetching attachments:', err);
    }
  };

  const handleViewEvidence = (verification: Verification) => {
    setViewingVerification(verification);
    setShowEvidenceViewer(true);
  };

  const handleVerifyVerification = async (id: number) => {
    const notes = prompt('Add verification notes (optional):');
    if (notes === null) return; // User cancelled

    try {
      setProcessingId(id);
      const response = await authFetch(`/api/means-of-verification/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified_by: 1, // TODO: Get from auth context
          verification_notes: notes
        })
      });

      if (!response.ok) throw new Error('Failed to verify evidence');

      await fetchPendingVerifications();
      setProcessingId(null);
      alert('Evidence verified successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to verify evidence');
      setProcessingId(null);
    }
  };

  const handleRejectVerification = async (id: number) => {
    const notes = prompt('Reason for rejection (required):');
    if (!notes || notes.trim() === '') {
      alert('Rejection reason is required');
      return;
    }

    try {
      setProcessingId(id);
      const response = await authFetch(`/api/means-of-verification/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified_by: 1, // TODO: Get from auth context
          verification_notes: notes
        })
      });

      if (!response.ok) throw new Error('Failed to reject evidence');

      await fetchPendingVerifications();
      setProcessingId(null);
      alert('Evidence rejected');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject evidence');
      setProcessingId(null);
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'module': 'Module',
      'sub_program': 'Sub-Program',
      'component': 'Component',
      'activity': 'Activity',
      'indicator': 'Indicator'
    };
    return labels[type] || type;
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
                Approvals
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Review and approve activities and verification evidence
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
        {/* Tab Switcher */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-2 border-b pb-3 mb-3">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'activities'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📋 Activities
            </button>
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap border-b-2 ${
                activeTab === 'verifications'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📎 Verification Evidence
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter('submitted')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({activeTab === 'activities'
                ? activities.filter(a => a.approval_status === 'submitted').length
                : verifications.filter(v => v.verification_status === 'pending').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {activeTab === 'activities' ? 'Approved' : 'Verified'}
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
        {activeTab === 'activities' && (
          <>
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
          </>
        )}

        {/* Verifications List */}
        {activeTab === 'verifications' && (
          <>
            {verifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500 text-lg">No verification evidence found for this filter</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map((verification) => (
                  <div key={verification.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded text-xs font-medium ${
                              verification.verification_status === 'verified'
                                ? 'bg-green-100 text-green-800'
                                : verification.verification_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : verification.verification_status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {verification.verification_status.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {verification.evidence_type.toUpperCase()}
                            </span>
                            {verification.entity_name && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                {getEntityTypeLabel(verification.entity_type)}: {verification.entity_name}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {verification.verification_method}
                          </h3>
                          {verification.description && (
                            <p className="text-gray-700 mb-3">{verification.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Document Info */}
                      {verification.document_name && (
                        <div className="p-3 bg-gray-50 rounded mb-3">
                          <p className="text-sm font-medium text-gray-700">📄 {verification.document_name}</p>
                          {verification.document_date && (
                            <p className="text-xs text-gray-500">
                              Date: {new Date(verification.document_date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {verification.collection_frequency && (
                          <div>
                            <span className="font-medium">Frequency:</span> {verification.collection_frequency}
                          </div>
                        )}
                        {verification.responsible_person && (
                          <div>
                            <span className="font-medium">Responsible:</span> {verification.responsible_person}
                          </div>
                        )}
                      </div>

                      {/* Verification Notes */}
                      {verification.verification_notes && (
                        <div className="p-2 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-gray-700 mb-3">
                          <span className="font-medium">Notes:</span> {verification.verification_notes}
                        </div>
                      )}

                      {/* Attachments */}
                      {attachments[verification.id] && attachments[verification.id].length > 0 && (
                        <div className="mb-3 p-3 bg-gray-50 rounded">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            📎 Attachments ({attachments[verification.id].length})
                          </h4>
                          <div className="space-y-2">
                            {attachments[verification.id].slice(0, 3).map((attachment) => (
                              <div key={attachment.id} className="flex items-center text-xs text-gray-600">
                                <span className="truncate">{attachment.file_name}</span>
                                <span className="ml-2 text-gray-400">
                                  ({formatFileSize(attachment.file_size)})
                                </span>
                              </div>
                            ))}
                            {attachments[verification.id].length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{attachments[verification.id].length - 3} more...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        {attachments[verification.id] && attachments[verification.id].length > 0 && (
                          <button
                            onClick={() => handleViewEvidence(verification)}
                            className="flex-1 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 font-medium"
                          >
                            👁️ View Evidence
                          </button>
                        )}
                        {verification.verification_status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyVerification(verification.id)}
                              disabled={processingId === verification.id}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                              {processingId === verification.id ? 'Processing...' : '✓ Verify'}
                            </button>
                            <button
                              onClick={() => handleRejectVerification(verification.id)}
                              disabled={processingId === verification.id}
                              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                            >
                              {processingId === verification.id ? 'Processing...' : '✗ Reject'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Evidence Viewer Modal */}
      {showEvidenceViewer && viewingVerification && (
        <EvidenceViewer
          attachments={attachments[viewingVerification.id] || []}
          verificationMethod={viewingVerification.verification_method}
          onClose={() => {
            setShowEvidenceViewer(false);
            setViewingVerification(null);
          }}
          onDelete={async (attachmentId) => {
            // We don't allow deletion from approvals page
            alert('Please use the Verification page to delete attachments');
          }}
          canDelete={false}
        />
      )}
    </div>
  );
};

export default Approvals;
