import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Objective {
  id: number;
  activity_id: number;
  objective_text: string;
  target_value: string;
  achieved_value: string;
  status: string;
  created_at: string;
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
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(false);
  const [newObjective, setNewObjective] = useState({
    objective_text: '',
    target_value: '',
    status: 'not-started',
  });

  useEffect(() => {
    if (isOpen) {
      fetchObjectives();
    }
  }, [isOpen, activityId]);

  const fetchObjectives = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/activities/${activityId}/objectives`);
      if (response.ok) {
        const data = await response.json();
        setObjectives(data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch objectives:', err);
      setLoading(false);
    }
  };

  const handleAddObjective = async () => {
    if (!newObjective.objective_text.trim()) {
      alert('Please enter an objective');
      return;
    }

    try {
      const response = await authFetch(`/api/activities/${activityId}/objectives`, {
        method: 'POST',
        body: JSON.stringify(newObjective),
      });

      if (response.ok) {
        setNewObjective({ objective_text: '', target_value: '', status: 'not-started' });
        await fetchObjectives();
      } else {
        alert('Failed to add objective');
      }
    } catch (err) {
      console.error('Failed to add objective:', err);
      alert('Failed to add objective');
    }
  };

  const handleUpdateObjective = async (objectiveId: number, updates: Partial<Objective>) => {
    try {
      const response = await authFetch(`/api/activities/${activityId}/objectives/${objectiveId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchObjectives();
      }
    } catch (err) {
      console.error('Failed to update objective:', err);
    }
  };

  const handleDeleteObjective = async (objectiveId: number) => {
    if (!confirm('Delete this objective?')) return;

    try {
      const response = await authFetch(`/api/activities/${activityId}/objectives/${objectiveId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchObjectives();
      }
    } catch (err) {
      console.error('Failed to delete objective:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
          {/* Add New Objective */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 mb-6 border-2 border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">➕</span>
              Add New Objective
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objective Description *
                </label>
                <textarea
                  value={newObjective.objective_text}
                  onChange={(e) => setNewObjective({ ...newObjective, objective_text: e.target.value })}
                  placeholder="e.g., Train 50 farmers on sustainable agriculture practices"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Value
                  </label>
                  <input
                    type="text"
                    value={newObjective.target_value}
                    onChange={(e) => setNewObjective({ ...newObjective, target_value: e.target.value })}
                    placeholder="e.g., 50 farmers, 100%, 10 sessions"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newObjective.status}
                    onChange={(e) => setNewObjective({ ...newObjective, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="achieved">Achieved</option>
                    <option value="partially-achieved">Partially Achieved</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddObjective}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                ➕ Add Objective
              </button>
            </div>
          </div>

          {/* Objectives List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : objectives.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">🎯</span>
              <p className="text-gray-600 text-lg font-medium">No objectives added yet</p>
              <p className="text-gray-500 text-sm mt-2">Start by adding your first objective above</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">
                Current Objectives ({objectives.length})
              </h3>
              {objectives.map((objective, index) => (
                <div
                  key={objective.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <select
                          value={objective.status}
                          onChange={(e) => handleUpdateObjective(objective.id, { status: e.target.value })}
                          className={`text-sm font-semibold rounded-lg px-3 py-1 border-0 cursor-pointer ${
                            objective.status === 'achieved'
                              ? 'bg-green-100 text-green-800'
                              : objective.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : objective.status === 'partially-achieved'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="achieved">Achieved</option>
                          <option value="partially-achieved">Partially Achieved</option>
                        </select>
                      </div>
                      <p className="text-gray-900 font-medium text-lg">{objective.objective_text}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteObjective(objective.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors ml-3"
                      title="Delete objective"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Target Value</label>
                      <input
                        type="text"
                        value={objective.target_value || ''}
                        onChange={(e) => handleUpdateObjective(objective.id, { target_value: e.target.value })}
                        placeholder="Set target"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Achieved Value</label>
                      <input
                        type="text"
                        value={objective.achieved_value || ''}
                        onChange={(e) => handleUpdateObjective(objective.id, { achieved_value: e.target.value })}
                        placeholder="Enter achieved"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
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
