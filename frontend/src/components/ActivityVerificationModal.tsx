import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Verification {
  id: number;
  activity_id: number;
  verification_type: string;
  verification_method: string;
  verified_by: string;
  verification_date: string;
  verification_notes: string;
  status: string;
  attachments: string[];
  created_at: string;
}

interface ActivityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number;
  activityName: string;
}

const ActivityVerificationModal: React.FC<ActivityVerificationModalProps> = ({
  isOpen,
  onClose,
  activityId,
  activityName,
}) => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVerification, setNewVerification] = useState({
    verification_type: 'site-visit',
    verification_method: '',
    verified_by: '',
    verification_date: new Date().toISOString().split('T')[0],
    verification_notes: '',
    status: 'pending',
  });

  useEffect(() => {
    if (isOpen) {
      fetchVerifications();
    }
  }, [isOpen, activityId]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/activities/${activityId}/verifications`);
      if (response.ok) {
        const data = await response.json();
        setVerifications(data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch verifications:', err);
      setLoading(false);
    }
  };

  const handleAddVerification = async () => {
    if (!newVerification.verification_method.trim()) {
      alert('Please enter verification method');
      return;
    }

    try {
      const response = await authFetch(`/api/activities/${activityId}/verifications`, {
        method: 'POST',
        body: JSON.stringify(newVerification),
      });

      if (response.ok) {
        setNewVerification({
          verification_type: 'site-visit',
          verification_method: '',
          verified_by: '',
          verification_date: new Date().toISOString().split('T')[0],
          verification_notes: '',
          status: 'pending',
        });
        setShowAddForm(false);
        await fetchVerifications();
      } else {
        alert('Failed to add verification');
      }
    } catch (err) {
      console.error('Failed to add verification:', err);
      alert('Failed to add verification');
    }
  };

  const handleUpdateStatus = async (verificationId: number, status: string) => {
    try {
      const response = await authFetch(`/api/activities/${activityId}/verifications/${verificationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchVerifications();
      }
    } catch (err) {
      console.error('Failed to update verification:', err);
    }
  };

  const handleDeleteVerification = async (verificationId: number) => {
    if (!confirm('Delete this verification record?')) return;

    try {
      const response = await authFetch(`/api/activities/${activityId}/verifications/${verificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchVerifications();
      }
    } catch (err) {
      console.error('Failed to delete verification:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">✅</span>
              Activity Verification
            </h2>
            <p className="text-blue-100 text-sm mt-1">{activityName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Total Verifications</span>
                <p className="text-2xl font-bold text-blue-600">{verifications.length}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Verified</span>
                <p className="text-2xl font-bold text-green-600">
                  {verifications.filter(v => v.status === 'verified').length}
                </p>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Pending</span>
                <p className="text-2xl font-bold text-yellow-600">
                  {verifications.filter(v => v.status === 'pending').length}
                </p>
              </div>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Verification
              </button>
            )}
          </div>

          {/* Add Verification Form */}
          {showAddForm && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 mb-6 border-2 border-blue-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">➕</span>
                  New Verification Record
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Type *
                    </label>
                    <select
                      value={newVerification.verification_type}
                      onChange={(e) => setNewVerification({ ...newVerification, verification_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="site-visit">Site Visit</option>
                      <option value="document-review">Document Review</option>
                      <option value="beneficiary-interview">Beneficiary Interview</option>
                      <option value="photo-evidence">Photo Evidence</option>
                      <option value="partner-confirmation">Partner Confirmation</option>
                      <option value="financial-audit">Financial Audit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Date *
                    </label>
                    <input
                      type="date"
                      value={newVerification.verification_date}
                      onChange={(e) => setNewVerification({ ...newVerification, verification_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Method *
                    </label>
                    <input
                      type="text"
                      value={newVerification.verification_method}
                      onChange={(e) => setNewVerification({ ...newVerification, verification_method: e.target.value })}
                      placeholder="e.g., Physical inspection, Phone interview"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verified By
                    </label>
                    <input
                      type="text"
                      value={newVerification.verified_by}
                      onChange={(e) => setNewVerification({ ...newVerification, verified_by: e.target.value })}
                      placeholder="Name of verifier"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Notes
                  </label>
                  <textarea
                    value={newVerification.verification_notes}
                    onChange={(e) => setNewVerification({ ...newVerification, verification_notes: e.target.value })}
                    placeholder="Enter detailed verification findings..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddVerification}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md"
                  >
                    ✅ Add Verification
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verifications List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : verifications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">✅</span>
              <p className="text-gray-600 text-lg font-medium">No verification records yet</p>
              <p className="text-gray-500 text-sm mt-2">Click "Add Verification" to create your first record</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">
                Verification History ({verifications.length})
              </h3>
              {verifications.map((verification) => (
                <div
                  key={verification.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                          {verification.verification_type.replace('-', ' ')}
                        </span>
                        <select
                          value={verification.status}
                          onChange={(e) => handleUpdateStatus(verification.id, e.target.value)}
                          className={`text-sm font-semibold rounded-lg px-3 py-1 border-0 cursor-pointer ${
                            verification.status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : verification.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="failed">Failed</option>
                        </select>
                        <span className="text-sm text-gray-500">
                          {new Date(verification.verification_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium text-base mb-2">{verification.verification_method}</p>
                      {verification.verified_by && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Verified by:</span> {verification.verified_by}
                        </p>
                      )}
                      {verification.verification_notes && (
                        <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">
                          {verification.verification_notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteVerification(verification.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors ml-3"
                      title="Delete verification"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityVerificationModal;
