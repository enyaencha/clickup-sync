/**
 * Activity Checklist Routes
 * API endpoints for activity checklist management
 */

const express = require('express');
const router = express.Router();
const checklistService = require('../services/activity-checklist.service');

// Get all checklist items for an activity
router.get('/activity/:activityId', async (req, res) => {
    try {
        const items = await checklistService.getByActivityId(req.params.activityId);
        res.json({ success: true, data: items });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get checklist completion status for an activity
router.get('/activity/:activityId/status', async (req, res) => {
    try {
        const status = await checklistService.getCompletionStatus(req.params.activityId);
        res.json({ success: true, data: status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new checklist item
router.post('/', async (req, res) => {
    try {
        const id = await checklistService.create(req.body);
        res.json({ success: true, data: { id }, message: 'Checklist item created' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Bulk create checklist items
router.post('/activity/:activityId/bulk', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items array required' });
        }
        const ids = await checklistService.bulkCreate(req.params.activityId, items);
        res.json({ success: true, data: { ids }, message: `${ids.length} items created` });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Update a checklist item
router.put('/:id', async (req, res) => {
    try {
        const updated = await checklistService.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Checklist item not found' });
        }
        res.json({ success: true, message: 'Checklist item updated' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Toggle checklist item completion
router.post('/:id/toggle', async (req, res) => {
    try {
        const { userId } = req.body;
        const updated = await checklistService.toggleComplete(req.params.id, userId);
        if (!updated) {
            return res.status(404).json({ success: false, error: 'Checklist item not found' });
        }
        res.json({ success: true, message: 'Checklist item toggled' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Reorder checklist items
router.post('/activity/:activityId/reorder', async (req, res) => {
    try {
        const { itemIds } = req.body;
        if (!itemIds || !Array.isArray(itemIds)) {
            return res.status(400).json({ success: false, error: 'Item IDs array required' });
        }
        await checklistService.reorder(req.params.activityId, itemIds);
        res.json({ success: true, message: 'Checklist items reordered' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// Delete a checklist item
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await checklistService.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, error: 'Checklist item not found' });
        }
        res.json({ success: true, message: 'Checklist item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete all checklist items for an activity
router.delete('/activity/:activityId', async (req, res) => {
    try {
        await checklistService.deleteByActivityId(req.params.activityId);
        res.json({ success: true, message: 'All checklist items deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
