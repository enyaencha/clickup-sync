import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Activity {
  id: number;
  name: string;
  immediate_objectives: string;
  expected_results: string;
  description: string;
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
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    immediate_objectives: '',
    expected_results: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchActivity();
    }
  }, [isOpen, activityId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data.data);
        setFormData({
          immediate_objectives: data.data.immediate_objectives || '',
          expected_results: data.data.expected_results || '',
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      setLoading(false);
    }
  };

  const handleSaveObjectives = async () => {
    if (!activity) return;

    try {
      // Merge objectives data with existing activity data - PUT requires ALL fields
      const payload = {
        ...activity, // Start with all existing fields
        // Override only objectives-related fields with proper null handling
        immediate_objectives: formData.immediate_objectives.trim() || null,
        expected_results: formData.expected_results.trim() || null,
      };

      const response = await authFetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Objectives saved successfully!');
        await fetchActivity();
        onClose();
      } else {
        const errorData = await response.json();
        alert('Failed to save objectives: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to save objectives:', err);
      alert('Failed to save objectives');
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
              Activity Objectives
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : !activity ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">⚠️</span>
              <p className="text-gray-600 text-lg font-medium">Failed to load activity data</p>
            </div>
          ) : (
            <>
              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Define the <strong>immediate objectives</strong> and <strong>expected results</strong> for this activity.
                      This is for activity planning and tracking, separate from M&E indicators.
                    </p>
                  </div>
                </div>
              </div>

              {/* Objectives Form */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                  <span className="text-2xl">🎯</span>
                  Activity Objectives & Expected Results
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Immediate Objectives
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      What are the immediate goals this activity aims to achieve? (e.g., "Train 50 farmers on sustainable agriculture", "Distribute 200 hygiene kits to vulnerable families")
                    </p>
                    <textarea
                      value={formData.immediate_objectives}
                      onChange={(e) => setFormData({ ...formData, immediate_objectives: e.target.value })}
                      placeholder="Describe the immediate objectives of this activity..."
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Expected Results / Deliverables
                    </label>
                    <p className="text-xs text-gray-600 mb-2">
                      What specific results or deliverables do you expect from this activity? (e.g., "50 farmers trained and certified", "200 hygiene kits distributed with usage demonstration")
                    </p>
                    <textarea
                      value={formData.expected_results}
                      onChange={(e) => setFormData({ ...formData, expected_results: e.target.value })}
                      placeholder="List the expected results and deliverables..."
                      className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Current Values Display */}
              {(activity.immediate_objectives || activity.expected_results) && (
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Current Objectives (Saved)
                  </h4>
                  <div className="space-y-3">
                    {activity.immediate_objectives && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Immediate Objectives:</p>
                        <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                          {activity.immediate_objectives}
                        </p>
                      </div>
                    )}
                    {activity.expected_results && (
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1">Expected Results:</p>
                        <p className="text-sm text-gray-800 bg-white p-3 rounded-lg border border-gray-200">
                          {activity.expected_results}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveObjectives}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  💾 Save Objectives
                </button>
              </div>
            </>
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
