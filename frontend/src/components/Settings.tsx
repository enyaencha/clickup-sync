import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface WorkflowSettings {
  // Activity Workflow Settings
  lock_rejected_activities: boolean;
  lock_approved_activities: boolean;
  allow_status_change_after_approval: boolean;
  require_approval_before_completion: boolean;
  allow_draft_editing_only: boolean;

  // Approval Workflow Settings
  allow_self_approval: boolean;
  require_submission_before_approval: boolean;
  auto_complete_on_approval: boolean;

  // Checklist Workflow Settings
  require_checklist_completion_before_submission: boolean;
  require_checklist_completion_before_completion: boolean;
  show_checklist_progress_in_approvals: boolean;
  allow_checklist_edit_after_approval: boolean;
  allow_approver_to_complete_checklist: boolean;

  // Verification Approval Workflow Settings
  allow_edit_verified_items: boolean;
  show_verification_approval_on_original_page: boolean;

  // General Settings
  enable_activity_locking: boolean;
  enable_strict_workflow: boolean;

  // Notification Settings
  notify_on_status_change: boolean;
  notify_on_approval_request: boolean;
  notify_on_rejection: boolean;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<WorkflowSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data.data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof WorkflowSettings) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) throw new Error('Failed to save settings');
      const data = await response.json();
      setSettings(data.data);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/settings/reset', {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to reset settings');
      const data = await response.json();
      setSettings(data.data);
      setSuccessMessage('Settings reset to defaults!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Error</h2>
          <p className="text-red-600">{error || 'Failed to load settings'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Workflow Settings</h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">Configure activity workflow and approval rules</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Activity Workflow Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activity Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">Control how activities can be edited and their status changed</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Lock Rejected Activities</label>
                <p className="text-xs text-gray-600 mt-1">Prevent editing and status changes for rejected activities</p>
              </div>
              <ToggleSwitch
                checked={settings.lock_rejected_activities}
                onChange={() => handleToggle('lock_rejected_activities')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Lock Approved Activities</label>
                <p className="text-xs text-gray-600 mt-1">Prevent editing of approved activities</p>
              </div>
              <ToggleSwitch
                checked={settings.lock_approved_activities}
                onChange={() => handleToggle('lock_approved_activities')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Status Change After Approval</label>
                <p className="text-xs text-gray-600 mt-1">Allow status changes for approved activities</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_status_change_after_approval}
                onChange={() => handleToggle('allow_status_change_after_approval')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Require Approval Before Completion</label>
                <p className="text-xs text-gray-600 mt-1">Activities must be approved before they can be marked as completed</p>
              </div>
              <ToggleSwitch
                checked={settings.require_approval_before_completion}
                onChange={() => handleToggle('require_approval_before_completion')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Draft Editing Only</label>
                <p className="text-xs text-gray-600 mt-1">Only allow editing activities in draft status</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_draft_editing_only}
                onChange={() => handleToggle('allow_draft_editing_only')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Approval Workflow Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Approval Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">Configure approval process rules</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Self Approval</label>
                <p className="text-xs text-gray-600 mt-1">Allow users to approve their own activities</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_self_approval}
                onChange={() => handleToggle('allow_self_approval')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Require Submission Before Approval</label>
                <p className="text-xs text-gray-600 mt-1">Activities must be submitted before they can be approved</p>
              </div>
              <ToggleSwitch
                checked={settings.require_submission_before_approval}
                onChange={() => handleToggle('require_submission_before_approval')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Auto-Complete on Approval</label>
                <p className="text-xs text-gray-600 mt-1">Automatically mark activities as completed when approved</p>
              </div>
              <ToggleSwitch
                checked={settings.auto_complete_on_approval}
                onChange={() => handleToggle('auto_complete_on_approval')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Checklist Workflow Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Checklist Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">Configure activity checklist requirements and visibility</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Require Checklist Completion Before Submission</label>
                <p className="text-xs text-gray-600 mt-1">Activities cannot be submitted for approval unless all checklist items are completed</p>
              </div>
              <ToggleSwitch
                checked={settings.require_checklist_completion_before_submission}
                onChange={() => handleToggle('require_checklist_completion_before_submission')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Require Checklist Completion Before Completion</label>
                <p className="text-xs text-gray-600 mt-1">Activities cannot be marked as completed unless all checklist items are done (recommended)</p>
              </div>
              <ToggleSwitch
                checked={settings.require_checklist_completion_before_completion}
                onChange={() => handleToggle('require_checklist_completion_before_completion')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Show Checklist Progress in Approvals</label>
                <p className="text-xs text-gray-600 mt-1">Display checklist completion progress on the approvals page</p>
              </div>
              <ToggleSwitch
                checked={settings.show_checklist_progress_in_approvals}
                onChange={() => handleToggle('show_checklist_progress_in_approvals')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Checklist Edit After Approval</label>
                <p className="text-xs text-gray-600 mt-1">Allow checklist items to be edited/toggled after activity is approved</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_checklist_edit_after_approval}
                onChange={() => handleToggle('allow_checklist_edit_after_approval')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Approver to Complete Checklist</label>
                <p className="text-xs text-gray-600 mt-1">Allow approvers to check/complete checklist items during approval review</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_approver_to_complete_checklist}
                onChange={() => handleToggle('allow_approver_to_complete_checklist')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Verification Approval Workflow Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Verification Approval Workflow</h2>
            <p className="text-sm text-gray-600 mt-1">Configure verification evidence approval process</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Allow Editing Verified Items</label>
                <p className="text-xs text-gray-600 mt-1">Allow editing verification items after they have been verified (not recommended for data integrity)</p>
              </div>
              <ToggleSwitch
                checked={settings.allow_edit_verified_items}
                onChange={() => handleToggle('allow_edit_verified_items')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Show Approval Actions on Verification Page</label>
                <p className="text-xs text-gray-600 mt-1">Show Verify/Reject buttons on the Verification page. If disabled, approvals must be done from the Approvals page only</p>
              </div>
              <ToggleSwitch
                checked={settings.show_verification_approval_on_original_page}
                onChange={() => handleToggle('show_verification_approval_on_original_page')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Global workflow configuration</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Enable Activity Locking</label>
                <p className="text-xs text-gray-600 mt-1">Enable the activity locking system globally</p>
              </div>
              <ToggleSwitch
                checked={settings.enable_activity_locking}
                onChange={() => handleToggle('enable_activity_locking')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Enable Strict Workflow</label>
                <p className="text-xs text-gray-600 mt-1">Enforce strict workflow rules (recommended for production)</p>
              </div>
              <ToggleSwitch
                checked={settings.enable_strict_workflow}
                onChange={() => handleToggle('enable_strict_workflow')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
            <p className="text-sm text-gray-600 mt-1">Configure notification preferences (for future use)</p>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Notify on Status Change</label>
                <p className="text-xs text-gray-600 mt-1">Send notifications when activity status changes</p>
              </div>
              <ToggleSwitch
                checked={settings.notify_on_status_change}
                onChange={() => handleToggle('notify_on_status_change')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Notify on Approval Request</label>
                <p className="text-xs text-gray-600 mt-1">Send notifications when approval is requested</p>
              </div>
              <ToggleSwitch
                checked={settings.notify_on_approval_request}
                onChange={() => handleToggle('notify_on_approval_request')}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-900">Notify on Rejection</label>
                <p className="text-xs text-gray-600 mt-1">Send notifications when activities are rejected</p>
              </div>
              <ToggleSwitch
                checked={settings.notify_on_rejection}
                onChange={() => handleToggle('notify_on_rejection')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-lg shadow px-6 py-4">
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
