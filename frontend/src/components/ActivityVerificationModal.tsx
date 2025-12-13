import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

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
  verification_status: string;
  verified_by: number | null;
  verified_date: string | null;
  verification_notes: string;
  collection_frequency: string;
  responsible_person: string;
  notes: string;
  created_at: string;
  attachments?: any[];
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newVerification, setNewVerification] = useState({
    verification_method: '',
    description: '',
    evidence_type: 'document',
    document_name: '',
    document_date: new Date().toISOString().split('T')[0],
    collection_frequency: 'once',
    responsible_person: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchVerifications();
    }
  }, [isOpen, activityId]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/means-of-verification?entity_type=activity&entity_id=${activityId}`);
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
      // Create verification with proper null handling - NO undefined values
      const payload = {
        entity_type: 'activity',
        entity_id: activityId,
        verification_method: newVerification.verification_method.trim(),
        description: newVerification.description.trim() || null,
        evidence_type: newVerification.evidence_type || 'document',
        document_name: newVerification.document_name.trim() || null,
        document_path: null,
        document_date: newVerification.document_date || null,
        verification_status: 'pending',
        verified_by: null,
        verified_date: null,
        verification_notes: null,
        collection_frequency: newVerification.collection_frequency || 'once',
        responsible_person: newVerification.responsible_person.trim() || null,
        notes: newVerification.notes.trim() || null,
      };

      const response = await authFetch('/api/means-of-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        const verificationId = data.id;

        // Upload file if selected
        if (selectedFile && verificationId) {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('entity_type', 'verification');
          formData.append('entity_id', verificationId.toString());

          // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
          const uploadResponse = await fetch('/api/attachments/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include', // Important for auth
          });

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Failed to upload file:', errorText);
            alert('Verification created but file upload failed');
          }
        }

        // Reset form
        setNewVerification({
          verification_method: '',
          description: '',
          evidence_type: 'document',
          document_name: '',
          document_date: new Date().toISOString().split('T')[0],
          collection_frequency: 'once',
          responsible_person: '',
          notes: '',
        });
        setSelectedFile(null);
        setShowAddForm(false);
        await fetchVerifications();
      } else {
        const errorData = await response.json();
        alert('Failed to add verification: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to add verification:', err);
      alert('Failed to add verification');
    }
  };

  const handleUpdateStatus = async (verificationId: number, status: string) => {
    try {
      const payload = {
        verification_status: status,
        verified_date: status === 'verified' ? new Date().toISOString().split('T')[0] : null,
      };

      const response = await authFetch(`/api/means-of-verification/${verificationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
      const response = await authFetch(`/api/means-of-verification/${verificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchVerifications();
      }
    } catch (err) {
      console.error('Failed to delete verification:', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
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
              Activity Verification & Evidence
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
          {/* Quick Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Total</span>
                <p className="text-2xl font-bold text-blue-600">{verifications.length}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Verified</span>
                <p className="text-2xl font-bold text-green-600">
                  {verifications.filter(v => v.verification_status === 'verified').length}
                </p>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Pending</span>
                <p className="text-2xl font-bold text-yellow-600">
                  {verifications.filter(v => v.verification_status === 'pending').length}
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
                  New Verification & Evidence
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedFile(null);
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Method *
                    </label>
                    <input
                      type="text"
                      value={newVerification.verification_method}
                      onChange={(e) => setNewVerification({ ...newVerification, verification_method: e.target.value })}
                      placeholder="e.g., Site Visit, Document Review, Photo Evidence"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence Type
                    </label>
                    <select
                      value={newVerification.evidence_type}
                      onChange={(e) => setNewVerification({ ...newVerification, evidence_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="document">Document</option>
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="report">Report</option>
                      <option value="attendance-sheet">Attendance Sheet</option>
                      <option value="interview">Interview Recording</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newVerification.description}
                    onChange={(e) => setNewVerification({ ...newVerification, description: e.target.value })}
                    placeholder="Describe the verification process and findings..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Name
                    </label>
                    <input
                      type="text"
                      value={newVerification.document_name}
                      onChange={(e) => setNewVerification({ ...newVerification, document_name: e.target.value })}
                      placeholder="Name of the evidence document"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Document Date
                    </label>
                    <input
                      type="date"
                      value={newVerification.document_date}
                      onChange={(e) => setNewVerification({ ...newVerification, document_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Person
                    </label>
                    <input
                      type="text"
                      value={newVerification.responsible_person}
                      onChange={(e) => setNewVerification({ ...newVerification, responsible_person: e.target.value })}
                      placeholder="Person responsible for verification"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Collection Frequency
                    </label>
                    <select
                      value={newVerification.collection_frequency}
                      onChange={(e) => setNewVerification({ ...newVerification, collection_frequency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📎 Upload Evidence Document
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      ✓ Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={newVerification.notes}
                    onChange={(e) => setNewVerification({ ...newVerification, notes: e.target.value })}
                    placeholder="Any additional notes or comments..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddVerification}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50"
                  >
                    ✅ Add Verification
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setSelectedFile(null);
                    }}
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
              <p className="text-gray-500 text-sm mt-2">Click "Add Verification" to create your first record with evidence</p>
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
                          {verification.evidence_type}
                        </span>
                        <select
                          value={verification.verification_status}
                          onChange={(e) => handleUpdateStatus(verification.id, e.target.value)}
                          className={`text-sm font-semibold rounded-lg px-3 py-1 border-0 cursor-pointer ${
                            verification.verification_status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : verification.verification_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                          <option value="needs-update">Needs Update</option>
                        </select>
                        {verification.document_date && (
                          <span className="text-sm text-gray-500">
                            📅 {new Date(verification.document_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium text-lg mb-2">{verification.verification_method}</p>
                      {verification.description && (
                        <p className="text-sm text-gray-600 mb-2">{verification.description}</p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        {verification.document_name && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <span className="text-xs font-medium text-gray-600">Document:</span>
                            <p className="text-sm text-gray-900">{verification.document_name}</p>
                          </div>
                        )}
                        {verification.responsible_person && (
                          <div className="bg-gray-50 rounded-lg p-2">
                            <span className="text-xs font-medium text-gray-600">Responsible:</span>
                            <p className="text-sm text-gray-900">{verification.responsible_person}</p>
                          </div>
                        )}
                      </div>
                      {verification.notes && (
                        <p className="text-sm text-gray-600 mt-2 p-3 bg-blue-50 rounded-lg">
                          💬 {verification.notes}
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
