import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authFetch } from '../config/api';

interface Statistics {
  indicators: {
    total: number;
    on_track: number;
    at_risk: number;
    off_track: number;
    avg_achievement: number;
  };
  assumptions: {
    total: number;
    critical_risk: number;
    high_risk: number;
    valid: number;
    needs_review: number;
  };
  verification: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  results_chain: {
    total_activities: number;
    linked_activities: number;
    activity_linkage_percentage: number;
  };
}

interface Module {
  id: number;
  name: string;
  code: string;
  description: string;
}

const LogframeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId?: string }>();
  const { user } = useAuth();

  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchStatistics(selectedModule);
    }
  }, [selectedModule]);

  const fetchModules = async () => {
    try {
      const response = await authFetch('/api/programs');
      if (!response.ok) throw new Error('Failed to fetch modules');

      const data = await response.json();

      // Filter modules based on user's module assignments
      let filteredModules = data.data || [];
      if (user && !user.is_system_admin && user.module_assignments && user.module_assignments.length > 0) {
        const assignedModuleIds = user.module_assignments.map(m => m.module_id);
        filteredModules = (data.data || []).filter((m: Module) => assignedModuleIds.includes(m.id));
      }

      setModules(filteredModules);

      if (moduleId) {
        setSelectedModule(parseInt(moduleId));
      } else if (filteredModules.length > 0) {
        setSelectedModule(filteredModules[0].id);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching modules:', err);
      setLoading(false);
    }
  };

  const fetchStatistics = async (modId: number) => {
    try {
      const [indicatorsRes, assumptionsRes, movRes, chainRes] = await Promise.all([
        fetch(`/api/indicators/statistics/module/${modId}`),
        fetch(`/api/assumptions/statistics/module/${modId}`),
        fetch(`/api/means-of-verification/statistics/module/${modId}`),
        fetch(`/api/results-chain/statistics/module/${modId}`)
      ]);

      const [indicators, assumptions, verification, results_chain] = await Promise.all([
        indicatorsRes.json(),
        assumptionsRes.json(),
        movRes.json(),
        chainRes.json()
      ]);

      setStatistics({
        indicators: indicators.data || {
          total: 0,
          on_track: 0,
          at_risk: 0,
          off_track: 0,
          avg_achievement: 0
        },
        assumptions: assumptions.data || {
          total: 0,
          critical_risk: 0,
          high_risk: 0,
          valid: 0,
          needs_review: 0
        },
        verification: verification.data || {
          total: 0,
          verified: 0,
          pending: 0,
          rejected: 0
        },
        results_chain: results_chain.data || {
          total_activities: 0,
          linked_activities: 0,
          activity_linkage_percentage: 0
        }
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Logframe Dashboard</h1>
              <p className="text-gray-600 mt-1">Results-Based Management & Monitoring</p>
            </div>

            {/* Module Selector */}
            <select
              value={selectedModule || ''}
              onChange={(e) => setSelectedModule(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 text-lg"
            >
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.code} - {module.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedModule && statistics && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button
                onClick={() => navigate(`/logframe/indicators/module/${selectedModule}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Indicators</h3>
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-sm text-gray-600">Manage SMART indicators</p>
              </button>

              <button
                onClick={() => navigate(`/logframe/assumptions/module/${selectedModule}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Assumptions</h3>
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-sm text-gray-600">Track risks & assumptions</p>
              </button>

              <button
                onClick={() => navigate(`/logframe/verification/module/${selectedModule}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Verification</h3>
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-sm text-gray-600">Evidence & verification</p>
              </button>

              <button
                onClick={() => navigate(`/logframe/results-chain/module/${selectedModule}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Results Chain</h3>
                  <span className="text-3xl">🔗</span>
                </div>
                <p className="text-sm text-gray-600">View linkages</p>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Indicators Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Indicators Overview</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Indicators</span>
                    <span className="text-2xl font-bold text-blue-600">{statistics.indicators.total}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Average Achievement</span>
                    <span className="text-2xl font-bold text-green-600">
                      {Number(statistics.indicators.avg_achievement || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-800">On Track</span>
                    <span className="font-bold text-green-800">{statistics.indicators.on_track}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm font-medium text-yellow-800">At Risk</span>
                    <span className="font-bold text-yellow-800">{statistics.indicators.at_risk}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium text-red-800">Off Track</span>
                    <span className="font-bold text-red-800">{statistics.indicators.off_track}</span>
                  </div>
                </div>
              </div>

              {/* Assumptions & Risk Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Management</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Assumptions</span>
                    <span className="text-2xl font-bold text-blue-600">{statistics.assumptions.total}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                    <span className="text-sm font-medium text-red-800">Critical Risk</span>
                    <span className="font-bold text-red-800">{statistics.assumptions.critical_risk}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                    <span className="text-sm font-medium text-orange-800">High Risk</span>
                    <span className="font-bold text-orange-800">{statistics.assumptions.high_risk}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-800">Valid</span>
                    <span className="font-bold text-green-800">{statistics.assumptions.valid}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-800">Needs Review</span>
                    <span className="font-bold text-gray-800">{statistics.assumptions.needs_review}</span>
                  </div>
                </div>
              </div>

              {/* Verification Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Means of Verification</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Evidence</span>
                    <span className="text-2xl font-bold text-blue-600">{statistics.verification.total}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium text-green-800">Verified</span>
                    <span className="font-bold text-green-800">{statistics.verification.verified}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm font-medium text-yellow-800">Pending</span>
                    <span className="font-bold text-yellow-800">{statistics.verification.pending}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium text-red-800">Rejected</span>
                    <span className="font-bold text-red-800">{statistics.verification.rejected}</span>
                  </div>
                </div>
              </div>

              {/* Results Chain Statistics */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Results Chain</h2>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Total Activities</span>
                    <span className="text-2xl font-bold text-blue-600">{statistics.results_chain.total_activities}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Linked Activities</span>
                    <span className="text-2xl font-bold text-green-600">{statistics.results_chain.linked_activities}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Linkage Completeness</span>
                    <span className="font-semibold">
                      {Number(statistics.results_chain.activity_linkage_percentage || 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        parseFloat(statistics.results_chain.activity_linkage_percentage) >= 80 ? 'bg-green-500' :
                        parseFloat(statistics.results_chain.activity_linkage_percentage) >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(parseFloat(statistics.results_chain.activity_linkage_percentage) || 0, 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                  Tracks how many activities are explicitly linked to their contributing outputs
                </p>
              </div>
            </div>

            {/* Logframe Explanation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-3">About the Logframe</h2>
              <p className="text-blue-800 mb-4">
                The Logical Framework (Logframe) is a results-based management tool that helps plan, monitor, and evaluate programs.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">📊 Indicators</h3>
                  <p className="text-blue-800">SMART indicators to measure progress at Impact, Outcome, Output, and Process levels.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">⚠️ Assumptions</h3>
                  <p className="text-blue-800">External conditions that must hold true for success. Track risks and mitigation strategies.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">✓ Means of Verification</h3>
                  <p className="text-blue-800">Evidence sources to verify indicator achievements (surveys, reports, photos, etc.).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">🔗 Results Chain</h3>
                  <p className="text-blue-800">Explicit linkages showing how Activities → Outputs → Outcomes → Impact.</p>
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedModule && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No program modules found</p>
            <p className="text-gray-400 text-sm mt-2">Create a program module first to start using the logframe</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogframeDashboard;
