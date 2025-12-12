import React, { useState, useEffect } from 'react';
import { authFetch } from '../config/api';

interface Activity {
  id: number;
  name: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  budget_allocated: number;
  budget_spent: number;
  description: string;
  status: string;
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
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    actual_beneficiaries: 0,
    budget_spent: 0,
    outcome_notes: '',
    challenges_faced: '',
    lessons_learned: '',
    recommendations: '',
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
          actual_beneficiaries: data.data.actual_beneficiaries || 0,
          budget_spent: data.data.budget_spent || 0,
          outcome_notes: data.data.outcome_notes || '',
          challenges_faced: data.data.challenges_faced || '',
          lessons_learned: data.data.lessons_learned || '',
          recommendations: data.data.recommendations || '',
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch activity:', err);
      setLoading(false);
    }
  };

  const handleSaveOutcome = async () => {
    try {
      const response = await authFetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Outcome data saved successfully!');
        await fetchActivity();
        onClose();
      } else {
        const errorData = await response.json();
        alert('Failed to save outcome: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to save outcome:', err);
      alert('Failed to save outcome');
    }
  };

  const calculateAchievementPercentage = (actual: number, target: number): number => {
    if (target === 0) return 0;
    return Math.round((actual / target) * 100);
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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : !activity ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <span className="text-6xl mb-4 block">⚠️</span>
              <p className="text-gray-600 text-lg font-medium">Failed to load activity data</p>
            </div>
          ) : (
            <>
              {/* Target vs Actual Measurements */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  Performance Against Targets
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Beneficiaries */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span>👥</span> Beneficiaries
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Target:</span>
                        <span className="text-lg font-bold text-gray-900">{activity.target_beneficiaries || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Actual:</span>
                        <input
                          type="number"
                          value={formData.actual_beneficiaries}
                          onChange={(e) => setFormData({ ...formData, actual_beneficiaries: parseInt(e.target.value) || 0 })}
                          className="w-32 px-3 py-1 border border-gray-300 rounded-lg text-right font-bold text-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Achievement:</span>
                          <span className={`text-xl font-bold ${
                            calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 100
                              ? 'text-green-600'
                              : calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 75
                              ? 'text-blue-600'
                              : calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}>
                            {calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 100
                                ? 'bg-green-600'
                                : calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 75
                                ? 'bg-blue-600'
                                : calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries) >= 50
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(calculateAchievementPercentage(formData.actual_beneficiaries, activity.target_beneficiaries), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span>💰</span> Budget
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Allocated:</span>
                        <span className="text-lg font-bold text-gray-900">${activity.budget_allocated?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Spent:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.budget_spent}
                            onChange={(e) => setFormData({ ...formData, budget_spent: parseFloat(e.target.value) || 0 })}
                            className="w-32 px-3 py-1 border border-gray-300 rounded-lg text-right font-bold text-lg focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Utilization:</span>
                          <span className={`text-xl font-bold ${
                            calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated) > 100
                              ? 'text-red-600'
                              : calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated) >= 90
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}>
                            {calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated) > 100
                                ? 'bg-red-600'
                                : calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated) >= 90
                                ? 'bg-yellow-600'
                                : 'bg-green-600'
                            }`}
                            style={{ width: `${Math.min(calculateAchievementPercentage(formData.budget_spent, activity.budget_allocated), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Qualitative Outcome Data */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 mb-6 border-2 border-green-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Outcome Notes & Learnings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Outcome Notes
                    </label>
                    <textarea
                      value={formData.outcome_notes}
                      onChange={(e) => setFormData({ ...formData, outcome_notes: e.target.value })}
                      placeholder="Describe the key outcomes and results achieved..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      rows={3}
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
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveOutcome}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  💾 Save Outcome Data
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

export default ActivityOutcomeModal;
