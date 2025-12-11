import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Outcome {
  id: number;
  activity_id: number;
  outcome_type: string;
  outcome_description: string;
  impact_level: string;
  beneficiaries_reached: number;
  success_indicators: string;
  challenges_faced: string;
  lessons_learned: string;
  recommendations: string;
  created_at: string;
  updated_at: string;
}

interface ActivityOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number;
  activityName: string;
}

const ActivityOutcomeModal: React.FC<ActivityOutcomeModalProps> = ({
  isOpen,
  onClose,
  activityId,
  activityName,
}) => {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    outcome_type: 'immediate',
    outcome_description: '',
    impact_level: 'medium',
    beneficiaries_reached: 0,
    success_indicators: '',
    challenges_faced: '',
    lessons_learned: '',
    recommendations: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchOutcomes();
    }
  }, [isOpen, activityId]);

  const fetchOutcomes = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/activities/${activityId}/outcomes`);
      if (response.ok) {
        const data = await response.json();
        setOutcomes(data.data || []);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch outcomes:', err);
      setLoading(false);
    }
  };

  const handleSaveOutcome = async () => {
    if (!formData.outcome_description.trim()) {
      alert('Please enter outcome description');
      return;
    }

    try {
      const url = editingId
        ? `/api/activities/${activityId}/outcomes/${editingId}`
        : `/api/activities/${activityId}/outcomes`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        resetForm();
        await fetchOutcomes();
      } else {
        alert('Failed to save outcome');
      }
    } catch (err) {
      console.error('Failed to save outcome:', err);
      alert('Failed to save outcome');
    }
  };

  const handleEdit = (outcome: Outcome) => {
    setEditingId(outcome.id);
    setFormData({
      outcome_type: outcome.outcome_type,
      outcome_description: outcome.outcome_description,
      impact_level: outcome.impact_level,
      beneficiaries_reached: outcome.beneficiaries_reached,
      success_indicators: outcome.success_indicators,
      challenges_faced: outcome.challenges_faced,
      lessons_learned: outcome.lessons_learned,
      recommendations: outcome.recommendations,
    });
  };

  const handleDelete = async (outcomeId: number) => {
    if (!confirm('Delete this outcome record?')) return;

    try {
      const response = await authFetch(`/api/activities/${activityId}/outcomes/${outcomeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchOutcomes();
      }
    } catch (err) {
      console.error('Failed to delete outcome:', err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      outcome_type: 'immediate',
      outcome_description: '',
      impact_level: 'medium',
      beneficiaries_reached: 0,
      success_indicators: '',
      challenges_faced: '',
      lessons_learned: '',
      recommendations: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Activity Outcomes & Impact
            </h2>
            <p className="text-green-100 text-sm mt-1">{activityName}</p>
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
          {/* Add/Edit Outcome Form */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border-2 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">{editingId ? '✏️' : '➕'}</span>
              {editingId ? 'Edit Outcome' : 'Add New Outcome'}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcome Type *
                  </label>
                  <select
                    value={formData.outcome_type}
                    onChange={(e) => setFormData({ ...formData, outcome_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="short-term">Short-term</option>
                    <option value="long-term">Long-term</option>
                    <option value="unexpected">Unexpected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact Level *
                  </label>
                  <select
                    value={formData.impact_level}
                    onChange={(e) => setFormData({ ...formData, impact_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="transformative">Transformative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiaries Reached
                  </label>
                  <input
                    type="number"
                    value={formData.beneficiaries_reached}
                    onChange={(e) => setFormData({ ...formData, beneficiaries_reached: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outcome Description *
                </label>
                <textarea
                  value={formData.outcome_description}
                  onChange={(e) => setFormData({ ...formData, outcome_description: e.target.value })}
                  placeholder="Describe the key outcomes and results achieved..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Success Indicators
                </label>
                <textarea
                  value={formData.success_indicators}
                  onChange={(e) => setFormData({ ...formData, success_indicators: e.target.value })}
                  placeholder="What indicators show this activity was successful?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Challenges Faced
                </label>
                <textarea
                  value={formData.challenges_faced}
                  onChange={(e) => setFormData({ ...formData, challenges_faced: e.target.value })}
                  placeholder="What challenges were encountered during implementation?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lessons Learned
                </label>
                <textarea
                  value={formData.lessons_learned}
                  onChange={(e) => setFormData({ ...formData, lessons_learned: e.target.value })}
                  placeholder="What lessons can be drawn from this activity?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendations
                </label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="What recommendations do you have for future activities?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveOutcome}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  {editingId ? '💾 Update Outcome' : '➕ Add Outcome'}
                </button>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Outcomes List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : outcomes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">📊</span>
              <p className="text-gray-600 text-lg font-medium">No outcomes recorded yet</p>
              <p className="text-gray-500 text-sm mt-2">Document the results and impact of this activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg mb-4">
                Recorded Outcomes ({outcomes.length})
              </h3>
              {outcomes.map((outcome, index) => (
                <div
                  key={outcome.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <span className={`text-xs font-semibold rounded-lg px-3 py-1 uppercase ${
                          outcome.outcome_type === 'immediate' ? 'bg-blue-100 text-blue-800' :
                          outcome.outcome_type === 'short-term' ? 'bg-purple-100 text-purple-800' :
                          outcome.outcome_type === 'long-term' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {outcome.outcome_type}
                        </span>
                        <span className={`text-xs font-semibold rounded-lg px-3 py-1 uppercase ${
                          outcome.impact_level === 'transformative' ? 'bg-red-100 text-red-800' :
                          outcome.impact_level === 'high' ? 'bg-orange-100 text-orange-800' :
                          outcome.impact_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {outcome.impact_level} Impact
                        </span>
                        {outcome.beneficiaries_reached > 0 && (
                          <span className="text-sm text-gray-600 font-medium">
                            👥 {outcome.beneficiaries_reached} beneficiaries
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium text-lg mb-4">{outcome.outcome_description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {outcome.success_indicators && (
                          <div className="bg-green-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                              <span>✓</span> Success Indicators
                            </h4>
                            <p className="text-sm text-gray-600">{outcome.success_indicators}</p>
                          </div>
                        )}
                        {outcome.challenges_faced && (
                          <div className="bg-red-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                              <span>⚠️</span> Challenges
                            </h4>
                            <p className="text-sm text-gray-600">{outcome.challenges_faced}</p>
                          </div>
                        )}
                        {outcome.lessons_learned && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                              <span>💡</span> Lessons Learned
                            </h4>
                            <p className="text-sm text-gray-600">{outcome.lessons_learned}</p>
                          </div>
                        )}
                        {outcome.recommendations && (
                          <div className="bg-purple-50 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                              <span>📝</span> Recommendations
                            </h4>
                            <p className="text-sm text-gray-600">{outcome.recommendations}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(outcome)}
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Edit outcome"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(outcome.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete outcome"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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

export default ActivityOutcomeModal;
