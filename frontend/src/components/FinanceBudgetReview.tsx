import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { formatNumberInput, parseNumberInput } from '../utils/numberInput';

interface BudgetRequest {
  id: number;
  request_number: string;
  activity_id: number;
  activity_name: string;
  activity_code: string;
  requested_amount: number;
  approved_amount: number | null;
  justification: string;
  breakdown: Record<string, number>;
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

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseBreakdown = (value: unknown): Record<string, number> => {
  if (!value) return {};

  let parsedValue: unknown = value;
  if (typeof value === 'string') {
    try {
      parsedValue = JSON.parse(value);
    } catch {
      return {};
    }
  }

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    return {};
  }

  return Object.entries(parsedValue as Record<string, unknown>).reduce<Record<string, number>>((accumulator, [key, amount]) => {
    accumulator[key] = toNumber(amount);
    return accumulator;
  }, {});
};

const extractRequestsArray = (payload: unknown): any[] => {
  if (Array.isArray(payload)) return payload;

  if (!payload || typeof payload !== 'object') return [];

  const typedPayload = payload as Record<string, unknown>;
  const directCandidates = [typedPayload.data, typedPayload.rows, typedPayload.requests, typedPayload.results];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  if (typedPayload.data && typeof typedPayload.data === 'object') {
    const nestedData = typedPayload.data as Record<string, unknown>;
    const nestedCandidates = [nestedData.data, nestedData.rows, nestedData.requests, nestedData.results];
    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) return candidate;
    }
  }

  return [];
};

const FinanceBudgetReview: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'return' | 'edit' | 'revise'>('approve');
  const [actionData, setActionData] = useState({
    approved_amount: '',
    finance_notes: '',
    rejection_reason: '',
    amendment_notes: '',
    requested_amount: '',
    justification: '',
    new_amount: '',
    revision_reason: ''
  });

  useEffect(() => {
    void fetchRequests();
  }, [filterStatus]);

  const fetchRequests = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const statusQuery = filterStatus === 'all' ? '' : `?status=${encodeURIComponent(filterStatus)}`;
      const response = await authFetch(`/api/budget-requests${statusQuery}`);
      const rawResponse = await response.text();
      const responseData = rawResponse ? JSON.parse(rawResponse) : {};

      if (!response.ok) {
        setErrorMessage(responseData?.error || `Failed to fetch budget requests (HTTP ${response.status}).`);
        setRequests([]);
        return;
      }

      const requestRows = extractRequestsArray(responseData);
      const normalizedRequests = requestRows.map((request) => ({
        ...request,
        requested_amount: toNumber(request.requested_amount),
        approved_amount: request.approved_amount === null ? null : toNumber(request.approved_amount),
        breakdown: parseBreakdown(request.breakdown),
        status: (request.status || '').toLowerCase()
      })) as BudgetRequest[];
      setRequests(normalizedRequests);
    } catch (error) {
      console.error('Error fetching budget requests:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Unable to load budget requests. ${message}`);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (request: BudgetRequest, action: typeof actionType) => {
    setSelectedRequest(request);
    setActionType(action);
    const requestedAmount = toNumber(request.requested_amount);
    const approvedAmount = request.approved_amount === null ? null : toNumber(request.approved_amount);
    setActionData({
      approved_amount: formatNumberInput(requestedAmount.toString()),
      finance_notes: '',
      rejection_reason: '',
      amendment_notes: '',
      requested_amount: formatNumberInput(requestedAmount.toString()),
      justification: request.justification,
      new_amount: formatNumberInput((approvedAmount ?? requestedAmount).toString()),
      revision_reason: ''
    });
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setSelectedRequest(null);
    setActionData({
      approved_amount: '',
      finance_notes: '',
      rejection_reason: '',
      amendment_notes: '',
      requested_amount: '',
      justification: '',
      new_amount: '',
      revision_reason: ''
    });
  };

  const openConversation = (request: BudgetRequest) => {
    // Emit custom event for Layout to handle (to use the global ConversationSidePanel)
    const event = new CustomEvent('openBudgetConversation', {
      detail: { requestId: request.id, activityName: request.activity_name }
    });
    window.dispatchEvent(event);
  };

  const handleMarkAsUnderReview = async (requestId: number) => {
    if (!confirm('Mark this request as under review?')) return;

    try {
      const response = await authFetch(`/api/budget-requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'under_review' })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      alert('Request marked as under review');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  const handleAction = async () => {
    if (!selectedRequest) return;

    try {
      let endpoint = '';
      let body = {};

      switch (actionType) {
        case 'approve':
          if (!actionData.approved_amount) {
            alert('Approved amount is required');
            return;
          }
          endpoint = `/api/budget-requests/${selectedRequest.id}/approve`;
          body = {
            approved_amount: parseNumberInput(actionData.approved_amount) ?? 0,
            finance_notes: actionData.finance_notes
          };
          break;

        case 'reject':
          if (!actionData.rejection_reason.trim()) {
            alert('Rejection reason is required');
            return;
          }
          endpoint = `/api/budget-requests/${selectedRequest.id}/reject`;
          body = { rejection_reason: actionData.rejection_reason };
          break;

        case 'return':
          if (!actionData.amendment_notes.trim()) {
            alert('Amendment notes are required');
            return;
          }
          endpoint = `/api/budget-requests/${selectedRequest.id}/return`;
          body = { amendment_notes: actionData.amendment_notes };
          break;

        case 'edit':
          endpoint = `/api/budget-requests/${selectedRequest.id}/edit`;
          body = {
            requested_amount: parseNumberInput(actionData.requested_amount) ?? 0,
            justification: actionData.justification,
            finance_notes: actionData.finance_notes
          };
          break;

        case 'revise':
          if (!actionData.new_amount || !actionData.revision_reason.trim()) {
            alert('New amount and revision reason are required');
            return;
          }
          endpoint = `/api/budget-requests/${selectedRequest.id}/revise`;
          body = {
            new_amount: parseNumberInput(actionData.new_amount) ?? 0,
            revision_reason: actionData.revision_reason
          };
          break;
      }

      const response = await authFetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Action failed');
      }

      alert(`Budget request ${actionType === 'revise' ? 'revised' : actionType + 'd'} successfully!`);
      closeActionModal();
      await fetchRequests();
    } catch (error) {
      console.error(`Error ${actionType}ing request:`, error);
      alert(error instanceof Error ? error.message : `Failed to ${actionType} request`);
    }
  };

  const getPriorityColor = (priority: string) => {
    const normalizedPriority = (priority || '').toLowerCase();
    const colors: { [key: string]: string } = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[normalizedPriority] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = (status || '').toLowerCase();
    const colors: { [key: string]: string } = {
      pending: 'bg-blue-100 text-blue-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      returned_for_amendment: 'bg-yellow-100 text-yellow-800'
    };
    return colors[normalizedStatus] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: unknown) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(toNumber(amount));
  };

  const statusOptions = [
    'all',
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'returned_for_amendment'
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Budget Request Review</h1>
        <p className="text-gray-600 mt-1">Review and manage budget requests from teams</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No budget requests found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              {(() => {
                const requestStatus = (request.status || '').toLowerCase();
                const canTakePrimaryActions = requestStatus === 'submitted' || requestStatus === 'under_review' || requestStatus === 'pending';

                return (
                  <>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.activity_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(request.priority)}`}>
                      {(request.priority || 'medium').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${getStatusColor(request.status)}`}>
                      {(request.status || 'unknown').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Request #{request.request_number}</p>
                  <p className="text-sm text-gray-600">Activity Code: {request.activity_code}</p>
                  <p className="text-sm text-gray-600">Requested by: {request.requested_by_name}</p>
                  <p className="text-sm text-gray-600">Submitted: {new Date(request.submitted_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(request.requested_amount)}
                  </p>
                  {request.approved_amount !== null && (
                    <p className="text-sm text-green-600 font-semibold">
                      Approved: {formatCurrency(request.approved_amount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Justification */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Justification:</p>
                <p className="text-sm text-gray-600">{request.justification}</p>
              </div>

              {/* Budget Breakdown */}
              {request.breakdown && Object.keys(request.breakdown).length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Budget Breakdown:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(request.breakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between bg-gray-50 px-3 py-1 rounded">
                        <span className="text-gray-600">{category}:</span>
                        <span className="font-medium">{formatCurrency(amount as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finance Notes */}
              {request.finance_notes && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm font-medium text-blue-900 mb-1">Finance Notes:</p>
                  <p className="text-sm text-blue-800">{request.finance_notes}</p>
                </div>
              )}

              {/* Rejection Reason */}
              {request.rejection_reason && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded p-3">
                  <p className="text-sm font-medium text-red-900 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-800">{request.rejection_reason}</p>
                </div>
              )}

              {/* Amendment Notes */}
              {request.amendment_notes && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm font-medium text-yellow-900 mb-1">Amendment Required:</p>
                  <p className="text-sm text-yellow-800">{request.amendment_notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {/* View Conversation - Always available */}
                <button
                  onClick={() => openConversation(request)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2"
                >
                  <span>💬</span> View Conversation
                </button>

                {/* Mark as Under Review - Only for submitted requests */}
                {(requestStatus === 'submitted' || requestStatus === 'pending') && (
                  <button
                    onClick={() => handleMarkAsUnderReview(request.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Mark Under Review
                  </button>
                )}

                {/* Action buttons for submitted or under_review */}
                {canTakePrimaryActions && (
                  <>
                    <button
                      onClick={() => openActionModal(request, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openActionModal(request, 'edit')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Edit Request
                    </button>
                    <button
                      onClick={() => openActionModal(request, 'return')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      Return for Amendment
                    </button>
                    <button
                      onClick={() => openActionModal(request, 'reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* Revise button for approved requests */}
                {requestStatus === 'approved' && (
                  <button
                    onClick={() => openActionModal(request, 'revise')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm flex items-center gap-2"
                  >
                    <span>✏️</span> Revise Budget
                  </button>
                )}
              </div>
                  </>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {actionType === 'approve' && 'Approve Budget Request'}
                  {actionType === 'reject' && 'Reject Budget Request'}
                  {actionType === 'return' && 'Return for Amendment'}
                  {actionType === 'edit' && 'Edit Budget Request'}
                  {actionType === 'revise' && 'Revise Approved Budget'}
                </h2>
                <button
                  onClick={closeActionModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Request #{selectedRequest.request_number}</p>
                <p className="font-semibold">{selectedRequest.activity_name}</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(selectedRequest.requested_amount)}
                </p>
              </div>

              <div className="space-y-4">
                {actionType === 'approve' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Approved Amount (KES) *
                      </label>
                      <input
                        type="text"
                        required
                        value={actionData.approved_amount}
                        onChange={(e) => setActionData({ ...actionData, approved_amount: formatNumberInput(e.target.value) })}
                        inputMode="decimal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can approve partial amount if needed
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finance Notes (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={actionData.finance_notes}
                        onChange={(e) => setActionData({ ...actionData, finance_notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Add any notes or conditions..."
                      />
                    </div>
                  </>
                )}

                {actionType === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rejection Reason *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={actionData.rejection_reason}
                      onChange={(e) => setActionData({ ...actionData, rejection_reason: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Explain why this request is being rejected..."
                    />
                  </div>
                )}

                {actionType === 'return' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amendment Notes *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={actionData.amendment_notes}
                      onChange={(e) => setActionData({ ...actionData, amendment_notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      placeholder="Explain what needs to be changed..."
                    />
                  </div>
                )}

                {actionType === 'edit' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Requested Amount (KES) *
                      </label>
                      <input
                        type="text"
                        required
                        value={actionData.requested_amount}
                        onChange={(e) => setActionData({ ...actionData, requested_amount: formatNumberInput(e.target.value) })}
                        inputMode="decimal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Justification *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={actionData.justification}
                        onChange={(e) => setActionData({ ...actionData, justification: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Finance Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={actionData.finance_notes}
                        onChange={(e) => setActionData({ ...actionData, finance_notes: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Explain why you edited the request..."
                      />
                    </div>
                  </>
                )}

                {actionType === 'revise' && (
                  <>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Current Approved Amount:</strong> {formatCurrency(selectedRequest.approved_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Approved Amount (KES) *
                      </label>
                      <input
                        type="text"
                        required
                        value={actionData.new_amount}
                        onChange={(e) => setActionData({ ...actionData, new_amount: formatNumberInput(e.target.value) })}
                        inputMode="decimal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        You can increase or decrease the approved budget
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Revision Reason *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={actionData.revision_reason}
                        onChange={(e) => setActionData({ ...actionData, revision_reason: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="Explain why you're revising this approved budget..."
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  onClick={closeActionModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  className={`px-6 py-2 rounded-lg text-white ${
                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'return' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    actionType === 'revise' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {actionType === 'approve' && 'Approve Request'}
                  {actionType === 'reject' && 'Reject Request'}
                  {actionType === 'return' && 'Return Request'}
                  {actionType === 'edit' && 'Update Request'}
                  {actionType === 'revise' && 'Revise Budget'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceBudgetReview;
