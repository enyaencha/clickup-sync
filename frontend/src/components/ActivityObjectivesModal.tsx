import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Indicator {
  id: number;
  activity_id: number;
  name: string;
  description: string;
  baseline_value: number;
  target_value: number;
  current_value: number;
  achievement_percentage: number;
  unit_of_measure: string;
  status: string;
  type: string;
}

interface ActivityObjectivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number;
  activityName: string;
}

const ActivityObjectivesModal: React.FC<ActivityObjectivesModalProps> = ({
  isOpen,
  onClose,
  activityId,
  activityName,
}) => {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [newIndicator, setNewIndicator] = useState({
    name: '',
    description: '',
    baseline_value: 0,
    target_value: 0,
    unit_of_measure: '',
    type: 'output',
  });

  useEffect(() => {
    if (isOpen) {
      fetchIndicators();
    }
  }, [isOpen, activityId]);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/indicators/entity/activity/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setIndicators(data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch indicators:', err);
      setLoading(false);
    }
  };

  const handleAddIndicator = async () => {
    if (!newIndicator.name.trim()) {
      alert('Please enter indicator name');
      return;
    }

    try {
      // Prepare payload with proper null handling - NO undefined values allowed
      const payload = {
        name: newIndicator.name.trim(),
        description: newIndicator.description.trim() || null,
        baseline_value: newIndicator.baseline_value || null,
        target_value: newIndicator.target_value || null,
        unit_of_measure: newIndicator.unit_of_measure.trim() || null,
        type: newIndicator.type || 'output',
        activity_id: activityId,
        code: `IND-${activityId}-${Date.now()}`,
        current_value: newIndicator.baseline_value || 0,
        status: 'not-started',
        // Additional required fields with null defaults
        program_id: null,
        project_id: null,
        module_id: null,
        sub_program_id: null,
        component_id: null,
        category: null,
        baseline_date: null,
        target_date: null,
        collection_frequency: 'monthly',
        data_source: null,
        verification_method: null,
        responsible_person: null,
        notes: null,
        clickup_custom_field_id: null,
      };

      const response = await authFetch(`/api/indicators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setNewIndicator({
          name: '',
          description: '',
          baseline_value: 0,
          target_value: 0,
          unit_of_measure: '',
          type: 'output',
        });
        await fetchIndicators();
      } else {
        const errorData = await response.json();
        alert('Failed to add indicator: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to add indicator:', err);
      alert('Failed to add indicator');
    }
  };

  const handleUpdateCurrentValue = async (indicatorId: number, currentValue: number) => {
    try {
      const response = await authFetch(`/api/indicators/${indicatorId}/value`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: currentValue,
          measurement_date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        await fetchIndicators();
      }
    } catch (err) {
      console.error('Failed to update current value:', err);
    }
  };

  const handleDeleteIndicator = async (indicatorId: number) => {
    if (!confirm('Delete this indicator?')) return;

    try {
      const response = await authFetch(`/api/indicators/${indicatorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchIndicators();
      }
    } catch (err) {
      console.error('Failed to delete indicator:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              Activity Indicators & Objectives
            </h2>
            <p className="text-purple-100 text-sm mt-1">{activityName}</p>
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
          {/* Add New Indicator */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">➕</span>
              Add New Indicator
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indicator Name *
                </label>
                <input
                  type="text"
                  value={newIndicator.name}
                  onChange={(e) => setNewIndicator({ ...newIndicator, name: e.target.value })}
                  placeholder="e.g., Number of farmers trained"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newIndicator.description}
                  onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
                  placeholder="Describe how this indicator is measured..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit of Measure
                  </label>
                  <input
                    type="text"
                    value={newIndicator.unit_of_measure}
                    onChange={(e) => setNewIndicator({ ...newIndicator, unit_of_measure: e.target.value })}
                    placeholder="e.g., farmers, %, sessions"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Baseline Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIndicator.baseline_value}
                    onChange={(e) => setNewIndicator({ ...newIndicator, baseline_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newIndicator.target_value}
                    onChange={(e) => setNewIndicator({ ...newIndicator, target_value: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleAddIndicator}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                ➕ Add Indicator
              </button>
            </div>
          </div>

          {/* Indicators List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : indicators.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">🎯</span>
              <p className="text-gray-600 text-lg font-medium">No indicators added yet</p>
              <p className="text-gray-500 text-sm mt-2">Start by adding your first indicator above</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">
                Activity Indicators ({indicators.length})
              </h3>
              {indicators.map((indicator, index) => (
                <div
                  key={indicator.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded uppercase">
                          {indicator.type}
                        </span>
                        {indicator.unit_of_measure && (
                          <span className="text-sm text-gray-600">
                            Unit: {indicator.unit_of_measure}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium text-lg mb-2">{indicator.name}</p>
                      {indicator.description && (
                        <p className="text-sm text-gray-600 mb-3">{indicator.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteIndicator(indicator.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors ml-3"
                      title="Delete indicator"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Baseline</label>
                      <p className="text-lg font-bold text-gray-900">{indicator.baseline_value}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Target</label>
                      <p className="text-lg font-bold text-purple-700">{indicator.target_value}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Current Value</label>
                      <input
                        type="number"
                        step="0.01"
                        value={indicator.current_value}
                        onChange={(e) => handleUpdateCurrentValue(indicator.id, parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-lg font-bold text-green-700 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Achievement Progress:</span>
                      <span className={`text-xl font-bold ${
                        (indicator.achievement_percentage || 0) >= 100
                          ? 'text-green-600'
                          : (indicator.achievement_percentage || 0) >= 75
                          ? 'text-blue-600'
                          : (indicator.achievement_percentage || 0) >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {indicator.achievement_percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (indicator.achievement_percentage || 0) >= 100
                            ? 'bg-green-600'
                            : (indicator.achievement_percentage || 0) >= 75
                            ? 'bg-blue-600'
                            : (indicator.achievement_percentage || 0) >= 50
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${Math.min(indicator.achievement_percentage || 0, 100)}%` }}
                      ></div>
                    </div>
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

export default ActivityObjectivesModal;
