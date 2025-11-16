/**
 * Program Controller
 * HTTP request handlers for program endpoints
 */

const programService = require('./program.service');
const Response = require('../../core/utils/response');
const logger = require('../../core/utils/logger');

class ProgramController {
    /**
     * GET /api/programs
     * List all programs
     */
    async list(req, res) {
        try {
            const filters = {
                status: req.query.status,
                code: req.query.code,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                offset: ((parseInt(req.query.page) || 1) - 1) * (parseInt(req.query.limit) || 20)
            };

            const result = await programService.getAllPrograms(filters);

            return Response.paginated(
                res,
                result.programs,
                {
                    page: result.page,
                    limit: result.limit,
                    totalItems: result.total
                },
                'Programs fetched successfully'
            );
        } catch (error) {
            logger.error('Error in program list controller:', error);
            return Response.error(res, error.message);
        }
    }

    /**
     * GET /api/programs/:id
     * Get program by ID
     */
    async getById(req, res) {
        try {
            const { id } = req.params;
            const program = await programService.getProgramById(id);

            return Response.success(res, program, 'Program fetched successfully');
        } catch (error) {
            logger.error('Error in program getById controller:', error);
            if (error.message === 'Program not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * GET /api/programs/:id/projects
     * Get program with its projects
     */
    async getWithProjects(req, res) {
        try {
            const { id } = req.params;
            const program = await programService.getProgramWithProjects(id);

            return Response.success(res, program, 'Program with projects fetched successfully');
        } catch (error) {
            logger.error('Error in program getWithProjects controller:', error);
            if (error.message === 'Program not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * GET /api/programs/:id/stats
     * Get program statistics
     */
    async getStats(req, res) {
        try {
            const { id } = req.params;
            const stats = await programService.getProgramStats(id);

            return Response.success(res, stats, 'Program statistics fetched successfully');
        } catch (error) {
            logger.error('Error in program getStats controller:', error);
            if (error.message === 'Program not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * POST /api/programs
     * Create new program
     */
    async create(req, res) {
        try {
            const programData = req.body;
            const program = await programService.createProgram(programData);

            return Response.created(res, program, 'Program created successfully');
        } catch (error) {
            logger.error('Error in program create controller:', error);
            if (error.message.includes('already exists')) {
                return Response.conflict(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * PUT /api/programs/:id
     * Update program
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const programData = req.body;
            const program = await programService.updateProgram(id, programData);

            return Response.success(res, program, 'Program updated successfully');
        } catch (error) {
            logger.error('Error in program update controller:', error);
            if (error.message === 'Program not found') {
                return Response.notFound(res, error.message);
            }
            if (error.message.includes('already exists')) {
                return Response.conflict(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * DELETE /api/programs/:id
     * Delete program
     */
    async delete(req, res) {
        try {
            const { id } = req.params;
            await programService.deleteProgram(id);

            return Response.success(res, null, 'Program deleted successfully');
        } catch (error) {
            logger.error('Error in program delete controller:', error);
            if (error.message === 'Program not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    /**
     * GET /api/programs/dashboard
     * Get programs dashboard
     */
    async dashboard(req, res) {
        try {
            const dashboard = await programService.getDashboard();

            return Response.success(res, dashboard, 'Dashboard data fetched successfully');
        } catch (error) {
            logger.error('Error in program dashboard controller:', error);
            return Response.error(res, error.message);
        }
    }
}

module.exports = new ProgramController();
