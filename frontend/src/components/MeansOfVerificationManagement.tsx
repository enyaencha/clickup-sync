import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Verification {
  id: number;
  verification_method: string;
  description: string;
  evidence_type: string;
  document_name: string;
  document_path: string;
  document_date: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'needs-update';
  verified_by: number | null;
  verified_date: string | null;
  responsible_person: string;
  entity_name?: string;
}

const MeansOfVerificationManagement: React.FC = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerifications();
  }, [entityType, entityId]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      let url = entityType && entityId
        ? `/api/means-of-verification/entity/${entityType}/${entityId}`
        : '/api/means-of-verification';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch verifications');

      const data = await response.json();
      setVerifications(data.data || []);
    } catch (err) {
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs-update': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Means of Verification</h1>
              <p className="text-gray-600 mt-1">Evidence sources and verification methods</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {verifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No verification methods found</p>
              <p className="text-gray-400 text-sm mt-2">Verification methods will appear here</p>
            </div>
          ) : (
            verifications.map((verification) => (
              <div key={verification.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(verification.verification_status)}`}>
                      {verification.verification_status.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {verification.evidence_type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{verification.verification_method}</h3>
                {verification.description && (
                  <p className="text-gray-600 mb-3">{verification.description}</p>
                )}

                {verification.document_name && (
                  <div className="p-3 bg-gray-50 rounded mb-3">
                    <p className="text-sm font-medium text-gray-700">Document: {verification.document_name}</p>
                    {verification.document_date && (
                      <p className="text-xs text-gray-500">Date: {new Date(verification.document_date).toLocaleDateString()}</p>
                    )}
                  </div>
                )}

                {verification.responsible_person && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Responsible:</span> {verification.responsible_person}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeansOfVerificationManagement;
