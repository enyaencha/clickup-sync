/**
 * Settings API Routes
 */

const express = require('express');
const router = express.Router();
const SettingsService = require('../services/settings.service');

const settingsService = new SettingsService();

// Get all settings
router.get('/', async (req, res) => {
    try {
        const settings = await settingsService.getSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update all settings
router.put('/', async (req, res) => {
    try {
        const settings = await settingsService.saveSettings(req.body);
        res.json({ success: true, data: settings, message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a single setting
router.patch('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const settings = await settingsService.updateSetting(key, value);
        res.json({ success: true, data: settings, message: `Setting '${key}' updated` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reset to default settings
router.post('/reset', async (req, res) => {
    try {
        const settings = await settingsService.resetToDefaults();
        res.json({ success: true, data: settings, message: 'Settings reset to defaults' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if activity can be edited
router.post('/validate/can-edit', async (req, res) => {
    try {
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ success: false, error: 'Activity object required' });
        }
        const result = await settingsService.canEditActivity(activity);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if activity status can be changed
router.post('/validate/can-change-status', async (req, res) => {
    try {
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ success: false, error: 'Activity object required' });
        }
        const result = await settingsService.canChangeStatus(activity);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if activity can be submitted for approval
router.post('/validate/can-submit', async (req, res) => {
    try {
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ success: false, error: 'Activity object required' });
        }
        const result = await settingsService.canSubmitForApproval(activity);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if activity can be approved
router.post('/validate/can-approve', async (req, res) => {
    try {
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ success: false, error: 'Activity object required' });
        }
        const result = await settingsService.canApprove(activity);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if verification can be edited
router.post('/validate/can-edit-verification', async (req, res) => {
    try {
        const { verification } = req.body;
        if (!verification) {
            return res.status(400).json({ success: false, error: 'Verification object required' });
        }
        const result = await settingsService.canEditVerification(verification);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Validate if verification approval actions should be shown
router.post('/validate/show-verification-approval', async (req, res) => {
    try {
        const result = await settingsService.showVerificationApprovalOnOriginalPage();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
