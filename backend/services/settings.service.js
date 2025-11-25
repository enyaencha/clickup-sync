/**
 * Settings Service
 * Manages application workflow and configuration settings
 */

const fs = require('fs').promises;
const path = require('path');

class SettingsService {
    constructor() {
        this.settingsPath = path.join(__dirname, '../config/workflow-settings.json');
        this.defaultSettings = {
            // Activity Workflow Settings
            lock_rejected_activities: true,
            lock_approved_activities: false,
            allow_status_change_after_approval: true,
            require_approval_before_completion: false,
            allow_draft_editing_only: false,

            // Approval Workflow Settings
            allow_self_approval: false,
            require_submission_before_approval: true,
            auto_complete_on_approval: false,

            // General Settings
            enable_activity_locking: true,
            enable_strict_workflow: false,

            // Notification Settings (for future use)
            notify_on_status_change: true,
            notify_on_approval_request: true,
            notify_on_rejection: true
        };
    }

    async getSettings() {
        try {
            const data = await fs.readFile(this.settingsPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist, create it with defaults
            if (error.code === 'ENOENT') {
                await this.saveSettings(this.defaultSettings);
                return this.defaultSettings;
            }
            throw error;
        }
    }

    async saveSettings(settings) {
        // Merge with defaults to ensure all keys exist
        const mergedSettings = { ...this.defaultSettings, ...settings };

        // Ensure config directory exists
        const configDir = path.dirname(this.settingsPath);
        try {
            await fs.mkdir(configDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }

        await fs.writeFile(
            this.settingsPath,
            JSON.stringify(mergedSettings, null, 2),
            'utf8'
        );

        return mergedSettings;
    }

    async updateSetting(key, value) {
        const settings = await this.getSettings();
        settings[key] = value;
        return await this.saveSettings(settings);
    }

    async resetToDefaults() {
        return await this.saveSettings(this.defaultSettings);
    }

    /**
     * Check if an activity can be edited based on current workflow settings
     */
    async canEditActivity(activity, settings = null) {
        if (!settings) {
            settings = await this.getSettings();
        }

        // Check if rejected activities are locked
        if (settings.lock_rejected_activities && activity.approval_status === 'rejected') {
            return {
                allowed: false,
                reason: 'Cannot edit rejected activities. This is locked by workflow settings.'
            };
        }

        // Check if approved activities are locked
        if (settings.lock_approved_activities && activity.approval_status === 'approved') {
            return {
                allowed: false,
                reason: 'Cannot edit approved activities. This is locked by workflow settings.'
            };
        }

        // Check if only draft editing is allowed
        if (settings.allow_draft_editing_only && activity.approval_status !== 'draft') {
            return {
                allowed: false,
                reason: 'Only draft activities can be edited. This activity has been submitted.'
            };
        }

        return { allowed: true };
    }

    /**
     * Check if activity status can be changed
     */
    async canChangeStatus(activity, settings = null) {
        if (!settings) {
            settings = await this.getSettings();
        }

        // Check if rejected activities are locked
        if (settings.lock_rejected_activities && activity.approval_status === 'rejected') {
            return {
                allowed: false,
                reason: 'Cannot change status of rejected activities. Please get approval first.'
            };
        }

        // Check if status changes are allowed after approval
        if (!settings.allow_status_change_after_approval && activity.approval_status === 'approved') {
            return {
                allowed: false,
                reason: 'Status changes are not allowed for approved activities.'
            };
        }

        // Check if completion requires approval
        if (settings.require_approval_before_completion &&
            activity.approval_status !== 'approved') {
            return {
                allowed: false,
                reason: 'Activity must be approved before it can be marked as completed.'
            };
        }

        return { allowed: true };
    }

    /**
     * Check if activity can be submitted for approval
     */
    async canSubmitForApproval(activity, settings = null) {
        if (!settings) {
            settings = await this.getSettings();
        }

        if (activity.approval_status === 'submitted') {
            return {
                allowed: false,
                reason: 'Activity is already submitted for approval.'
            };
        }

        if (activity.approval_status === 'approved') {
            return {
                allowed: false,
                reason: 'Activity is already approved.'
            };
        }

        return { allowed: true };
    }

    /**
     * Check if activity can be approved
     */
    async canApprove(activity, settings = null) {
        if (!settings) {
            settings = await this.getSettings();
        }

        if (settings.require_submission_before_approval &&
            activity.approval_status !== 'submitted') {
            return {
                allowed: false,
                reason: 'Activity must be submitted before it can be approved.'
            };
        }

        if (activity.approval_status === 'approved') {
            return {
                allowed: false,
                reason: 'Activity is already approved.'
            };
        }

        return { allowed: true };
    }
}

module.exports = SettingsService;
