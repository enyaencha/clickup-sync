/**
 * Program Routes
 * API routes for program management
 */

const express = require('express');
const router = express.Router();
const controller = require('./program.controller');
const validator = require('./program.validator');

// GET /api/programs/dashboard
router.get('/dashboard', controller.dashboard.bind(controller));

// GET /api/programs
router.get('/', controller.list.bind(controller));

// GET /api/programs/:id
router.get('/:id', validator.validateId.bind(validator), controller.getById.bind(controller));

// GET /api/programs/:id/projects
router.get('/:id/projects', validator.validateId.bind(validator), controller.getWithProjects.bind(controller));

// GET /api/programs/:id/stats
router.get('/:id/stats', validator.validateId.bind(validator), controller.getStats.bind(controller));

// POST /api/programs
router.post('/', validator.validateCreate.bind(validator), controller.create.bind(controller));

// PUT /api/programs/:id
router.put('/:id', validator.validateId.bind(validator), validator.validateUpdate.bind(validator), controller.update.bind(controller));

// DELETE /api/programs/:id
router.delete('/:id', validator.validateId.bind(validator), controller.delete.bind(controller));

module.exports = router;
