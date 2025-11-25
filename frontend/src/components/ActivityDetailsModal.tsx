import React, { useState, useEffect } from 'react';
import ActivityChecklist from './ActivityChecklist';

interface Activity {
  id: number;
  code: string;
  name: string;
  description: string;
  activity_date: string;
  start_date: string;
  end_date: string;
  location_details: string;
  parish: string;
  ward: string;
  county: string;
  duration_hours: number;
  facilitators: string;
  staff_assigned: string;
  target_beneficiaries: number;
  actual_beneficiaries: number;
  beneficiary_type: string;
  budget_allocated: number;
  budget_spent: number;
  status: string;
  approval_status: string;
  priority: string;
}

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: number | null;
  onSuccess: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  isOpen,
  onClose,
  activityId,
  onSuccess,
}) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Activity>>({});

  useEffect(() => {
    if (isOpen && activityId) {
      fetchActivity();
    }
  }, [isOpen, activityId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${activityId}`);
      if (!response.ok) throw new Error('Failed to fetch activity');

      const data = await response.json();
      setActivity(data.data);
      setFormData(data.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update activity');

      setIsEditing(false);
      await fetchActivity();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update activity');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!activity) return;

    // Validate if editing is allowed
    try {
      const validationRes = await fetch('/api/settings/validate/can-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activity })
      });
      const validationData = await validationRes.json();

      if (!validationData.data.allowed) {
        alert(validationData.data.reason || 'Cannot edit this activity');
        return;
      }

      setIsEditing(true);
    } catch (err) {
      console.error('Validation error:', err);
      setIsEditing(true); // Allow editing if validation fails
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete activity');

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete activity');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Activity' : 'Activity Details'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {activity && !loading && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Code
                  </label>
                  <input
                    type="text"
                    value={activity.code}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? formData.name : activity.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={isEditing ? formData.description : activity.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Date
                  </label>
                  <input
                    type="date"
                    name="activity_date"
                    value={isEditing ? formData.activity_date : activity.activity_date}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={isEditing ? formData.start_date : activity.start_date}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={isEditing ? formData.end_date : activity.end_date}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Details
                  </label>
                  <input
                    type="text"
                    name="location_details"
                    value={isEditing ? formData.location_details : activity.location_details}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parish
                  </label>
                  <input
                    type="text"
                    name="parish"
                    value={isEditing ? formData.parish : activity.parish}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Beneficiaries */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="target_beneficiaries"
                    value={isEditing ? formData.target_beneficiaries : activity.target_beneficiaries}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actual Beneficiaries
                  </label>
                  <input
                    type="number"
                    name="actual_beneficiaries"
                    value={isEditing ? formData.actual_beneficiaries : activity.actual_beneficiaries}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beneficiary Type
                  </label>
                  <input
                    type="text"
                    name="beneficiary_type"
                    value={isEditing ? formData.beneficiary_type : activity.beneficiary_type}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Allocated
                  </label>
                  <input
                    type="number"
                    name="budget_allocated"
                    value={isEditing ? formData.budget_allocated : activity.budget_allocated}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Spent
                  </label>
                  <input
                    type="number"
                    name="budget_spent"
                    value={isEditing ? formData.budget_spent : activity.budget_spent}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={isEditing ? formData.status : activity.status}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="blocked">Blocked</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Status
                  </label>
                  <input
                    type="text"
                    value={activity.approval_status}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={isEditing ? formData.priority : activity.priority}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-50"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Activity Checklist */}
              <div className="mt-6 pt-6 border-t">
                <ActivityChecklist
                  activityId={activity.id}
                  activityApprovalStatus={activity.approval_status}
                  readOnly={!isEditing}
                  onChecklistChange={fetchActivity}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <div>
            {!isEditing && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
              >
                🗑️ Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(activity || {});
                  }}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                >
                  Close
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ✏️ Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
