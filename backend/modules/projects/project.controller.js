/**
 * Project Controller
 */

const projectService = require('./project.service');
const Response = require('../../core/utils/response');
const logger = require('../../core/utils/logger');

class ProjectController {
    async list(req, res) {
        try {
            const filters = {
                program_id: req.query.program_id,
                status: req.query.status,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 20,
                offset: ((parseInt(req.query.page) || 1) - 1) * (parseInt(req.query.limit) || 20)
            };

            const result = await projectService.getAllProjects(filters);

            return Response.paginated(res, result.projects, {
                page: result.page,
                limit: result.limit,
                totalItems: result.total
            }, 'Projects fetched successfully');
        } catch (error) {
            logger.error('Error in project list controller:', error);
            return Response.error(res, error.message);
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectById(id);
            return Response.success(res, project, 'Project fetched successfully');
        } catch (error) {
            if (error.message === 'Project not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    async getWithActivities(req, res) {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectWithActivities(id);
            return Response.success(res, project, 'Project with activities fetched successfully');
        } catch (error) {
            if (error.message === 'Project not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    async getProgress(req, res) {
        try {
            const { id } = req.params;
            const progress = await projectService.getProjectProgress(id);
            return Response.success(res, progress, 'Project progress fetched successfully');
        } catch (error) {
            if (error.message === 'Project not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    async create(req, res) {
        try {
            const project = await projectService.createProject(req.body);
            return Response.created(res, project, 'Project created successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                return Response.conflict(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const project = await projectService.updateProject(id, req.body);
            return Response.success(res, project, 'Project updated successfully');
        } catch (error) {
            if (error.message === 'Project not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await projectService.deleteProject(id);
            return Response.success(res, null, 'Project deleted successfully');
        } catch (error) {
            if (error.message === 'Project not found') {
                return Response.notFound(res, error.message);
            }
            return Response.error(res, error.message);
        }
    }
}

module.exports = new ProjectController();
