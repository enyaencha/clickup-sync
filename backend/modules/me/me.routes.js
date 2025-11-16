/**
 * M&E Routes
 */

const express = require('express');
const router = express.Router();
const controller = require('./me.controller');

router.get('/dashboard', controller.getDashboard.bind(controller));
router.get('/indicators', controller.listIndicators.bind(controller));
router.get('/indicators/:id', controller.getIndicator.bind(controller));
router.get('/indicators/:id/performance', controller.getPerformance.bind(controller));
router.post('/indicators', controller.createIndicator.bind(controller));
router.post('/results', controller.recordResult.bind(controller));
router.post('/reports', controller.generateReport.bind(controller));

module.exports = router;
