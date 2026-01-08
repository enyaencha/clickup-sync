import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import BudgetRequestConversation from './BudgetRequestConversation';

interface BudgetRequest {
  id: number;
  request_number: string;
  activity_id: number;
  activity_name: string;
  activity_code: string;
  requested_amount: number;
  approved_amount: number | null;
  justification: string;
  breakdown: any;
  priority: string;
  status: string;
  finance_notes: string | null;
  rejection_reason: string | null;
  amendment_notes: string | null;
  requested_by_name: string;
  reviewed_by_name: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

const MyBudgetRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [showConversationModal, setShowConversationModal] = useState(false);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      // Get all requests for activities this user has access to
      const response = await authFetch(`/api/budget-requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching budget requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (request: BudgetRequest) => {
    setSelectedRequest(request);
    setShowConversationModal(true);
  };

  const closeConversation = () => {
    setShowConversationModal(false);
    setSelectedRequest(null);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'draft': 'bg-gray-100 text-gray-700',
      'submitted': 'bg-blue-100 text-blue-700',
      'under_review': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700',
      'returned_for_amendment': 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'urgent': 'bg-red-100 text-red-700',
      'high': 'bg-orange-100 text-orange-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'low': 'bg-blue-100 text-blue-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: string } = {
      'draft': '📝',
      'submitted': '📤',
      'under_review': '🔍',
      'approved': '✅',
      'rejected': '❌',
      'returned_for_amendment': '↩️'
    };
    return icons[status] || '📄';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span>💰</span>
          My Budget Requests
        </h1>
        <p className="text-gray-600 mt-1">Track your budget requests and communicate with finance team</p>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-600 text-lg">No budget requests yet</p>
          <p className="text-gray-500 text-sm mt-2">Request budgets from the 3-dot menu on activities</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.activity_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Request #{request.request_number}</p>
                  <p className="text-sm text-gray-600">Activity Code: {request.activity_code}</p>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(request.submitted_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(request.requested_amount)}
                  </p>
                  {request.approved_amount && (
                    <p className="text-sm text-green-600 font-semibold">
                      Approved: {formatCurrency(request.approved_amount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Status Progress Tracker */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)} {request.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-600">Submitted</div>
                    <div className="text-xs text-gray-600">Under Review</div>
                    <div className="text-xs text-gray-600">Decision</div>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 flex-1 rounded-l ${
                      ['submitted', 'under_review', 'approved', 'rejected', 'returned_for_amendment'].includes(request.status)
                        ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`h-2 flex-1 ${
                      ['under_review', 'approved', 'rejected', 'returned_for_amendment'].includes(request.status)
                        ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}></div>
                    <div className={`h-2 flex-1 rounded-r ${
                      ['approved', 'rejected'].includes(request.status)
                        ? request.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                        : request.status === 'returned_for_amendment' ? 'bg-orange-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* Justification */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Justification:</p>
                <p className="text-sm text-gray-600">{request.justification}</p>
              </div>

              {/* Finance Notes - Important updates from finance */}
              {request.finance_notes && (
                <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-1 flex items-center gap-2">
                    <span>🏦</span> Finance Team Notes:
                  </p>
                  <p className="text-sm text-blue-800">{request.finance_notes}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {request.rejection_reason && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm font-semibold text-red-900 mb-1 flex items-center gap-2">
                    <span>❌</span> Rejection Reason:
                  </p>
                  <p className="text-sm text-red-800">{request.rejection_reason}</p>
                </div>
              )}

              {/* Amendment Notes - Action required */}
              {request.amendment_notes && (
                <div className="mb-4 bg-orange-50 border-l-4 border-orange-500 p-4">
                  <p className="text-sm font-semibold text-orange-900 mb-1 flex items-center gap-2">
                    <span>↩️</span> Amendments Required:
                  </p>
                  <p className="text-sm text-orange-800">{request.amendment_notes}</p>
                  <p className="text-xs text-orange-700 mt-2 italic">
                    Please update your request and resubmit
                  </p>
                </div>
              )}

              {/* Budget Breakdown */}
              {request.breakdown && Object.keys(request.breakdown).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Budget Breakdown:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(request.breakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-gray-600 capitalize">{category}:</span>
                        <span className="font-medium">{formatCurrency(amount as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => openConversation(request)}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  {request.status === 'returned_for_amendment'
                    ? 'Discuss Amendments'
                    : 'View Conversation'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversation Modal */}
      {showConversationModal && selectedRequest && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Budget Request Discussion</h2>
                <p className="text-sm text-gray-600">Request #{selectedRequest.request_number}</p>
              </div>
              <button
                onClick={closeConversation}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <BudgetRequestConversation
                budgetRequestId={selectedRequest.id}
                activityName={selectedRequest.activity_name}
                currentUserId={user.id}
                isFinanceTeam={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBudgetRequests;
