/**
 * Project Service
 * Business logic for project management
 */

const projectRepository = require('./project.repository');
const programRepository = require('../programs/program.repository');
const syncService = require('../sync/sync.service');
const logger = require('../../core/utils/logger');

class ProjectService {
    async getAllProjects(filters = {}) {
        try {
            const projects = await projectRepository.findAll(filters);
            const total = await projectRepository.count(filters);

            return {
                projects,
                total,
                page: filters.page || 1,
                limit: filters.limit || projects.length
            };
        } catch (error) {
            logger.error('Error fetching projects:', { error: error.message });
            throw error;
        }
    }

    async getProjectById(id) {
        try {
            const project = await projectRepository.findById(id);
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        } catch (error) {
            logger.error('Error fetching project:', { id, error: error.message });
            throw error;
        }
    }

    async getProjectWithActivities(id) {
        try {
            const project = await projectRepository.findWithActivities(id);
            if (!project) {
                throw new Error('Project not found');
            }
            return project;
        } catch (error) {
            logger.error('Error fetching project with activities:', { id, error: error.message });
            throw error;
        }
    }

    async getProjectProgress(id) {
        try {
            const progress = await projectRepository.getProgress(id);
            if (!progress) {
                throw new Error('Project not found');
            }
            return progress;
        } catch (error) {
            logger.error('Error fetching project progress:', { id, error: error.message });
            throw error;
        }
    }

    async createProject(projectData) {
        try {
            // Validate program exists
            const program = await programRepository.findById(projectData.program_id);
            if (!program) {
                throw new Error('Program not found');
            }

            // Validate unique code
            const existing = await projectRepository.findByCode(projectData.code);
            if (existing) {
                throw new Error(`Project with code '${projectData.code}' already exists`);
            }

            const projectId = await projectRepository.create(projectData);

            // Queue for sync
            await syncService.queueOperation({
                entity_type: 'project',
                entity_id: projectId,
                operation_type: 'create',
                direction: 'push',
                priority: 3
            });

            logger.info('Project created successfully:', { projectId });

            return await projectRepository.findById(projectId);
        } catch (error) {
            logger.error('Error creating project:', { error: error.message });
            throw error;
        }
    }

    async updateProject(id, projectData) {
        try {
            const existing = await projectRepository.findById(id);
            if (!existing) {
                throw new Error('Project not found');
            }

            if (projectData.code && projectData.code !== existing.code) {
                const codeExists = await projectRepository.findByCode(projectData.code);
                if (codeExists) {
                    throw new Error(`Project with code '${projectData.code}' already exists`);
                }
            }

            projectData.sync_status = 'pending';
            const updated = await projectRepository.update(id, projectData);

            if (!updated) {
                throw new Error('Failed to update project');
            }

            // Queue for sync
            await syncService.queueOperation({
                entity_type: 'project',
                entity_id: id,
                operation_type: 'update',
                direction: 'push',
                priority: 5
            });

            logger.info('Project updated successfully:', { id });

            return await projectRepository.findById(id);
        } catch (error) {
            logger.error('Error updating project:', { id, error: error.message });
            throw error;
        }
    }

    async deleteProject(id) {
        try {
            const existing = await projectRepository.findById(id);
            if (!existing) {
                throw new Error('Project not found');
            }

            const deleted = await projectRepository.delete(id);

            if (!deleted) {
                throw new Error('Failed to delete project');
            }

            // Queue for sync
            await syncService.queueOperation({
                entity_type: 'project',
                entity_id: id,
                operation_type: 'delete',
                direction: 'push',
                priority: 3
            });

            logger.info('Project deleted successfully:', { id });

            return true;
        } catch (error) {
            logger.error('Error deleting project:', { id, error: error.message });
            throw error;
        }
    }
}

module.exports = new ProjectService();
