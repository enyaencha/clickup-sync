import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ResultsChainLink {
  id: number;
  from_entity_type: string;
  from_entity_id: number;
  from_entity_name: string;
  to_entity_type: string;
  to_entity_id: number;
  to_entity_name: string;
  contribution_description: string;
  contribution_weight: number;
}

const ResultsChainVisualization: React.FC = () => {
  const { entityType, entityId } = useParams<{ entityType: string; entityId: string }>();

  const [links, setLinks] = useState<ResultsChainLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, [entityType, entityId]);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const url = '/api/results-chain';

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch results chain');

      const data = await response.json();
      setLinks(data.data || []);
    } catch (err) {
      console.error('Error fetching results chain:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEntityTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'module': '🎯 Module',
      'sub_program': '📂 Sub-Program',
      'component': '📋 Component',
      'activity': '✓ Activity'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results chain...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Results Chain</h1>
              <p className="text-gray-600 mt-1">Visualize how activities contribute to results</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to Read the Results Chain</h3>
          <p className="text-blue-800 text-sm">
            The results chain shows how lower-level activities contribute to higher-level results.
            Each link shows: Activity → Component → Sub-Program → Module (Goal)
          </p>
        </div>

        <div className="grid gap-4">
          {links.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No results chain links found</p>
              <p className="text-gray-400 text-sm mt-2">Links between activities and outputs will appear here</p>
            </div>
          ) : (
            links.map((link) => (
              <div key={link.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                        {getEntityTypeLabel(link.from_entity_type)}
                      </span>
                      <span className="text-2xl">→</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {getEntityTypeLabel(link.to_entity_type)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="font-medium text-gray-900">{link.from_entity_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">To</p>
                        <p className="font-medium text-gray-900">{link.to_entity_name}</p>
                      </div>
                    </div>

                    {link.contribution_description && (
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">{link.contribution_description}</p>
                      </div>
                    )}

                    {link.contribution_weight && link.contribution_weight !== 100 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Contribution Weight</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${link.contribution_weight}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{link.contribution_weight}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsChainVisualization;
