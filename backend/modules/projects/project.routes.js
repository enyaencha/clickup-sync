/**
 * Project Routes
 */

const express = require('express');
const router = express.Router();
const controller = require('./project.controller');

router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.get('/:id/activities', controller.getWithActivities.bind(controller));
router.get('/:id/progress', controller.getProgress.bind(controller));
router.post('/', controller.create.bind(controller));
router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

module.exports = router;
