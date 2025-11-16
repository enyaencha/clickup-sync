/**
 * Sync Routes
 */

const express = require('express');
const router = express.Router();
const controller = require('./sync.controller');

router.get('/status', controller.getStatus.bind(controller));
router.get('/queue', controller.getPendingQueue.bind(controller));
router.post('/pull', controller.triggerPull.bind(controller));
router.post('/push', controller.triggerPush.bind(controller));

module.exports = router;
