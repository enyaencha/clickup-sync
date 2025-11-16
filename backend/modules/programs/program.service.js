/**
 * Program Service
 * Business logic for program management
 */

const programRepository = require('./program.repository');
const syncService = require('../sync/sync.service');
const logger = require('../../core/utils/logger');

class ProgramService {
    /**
     * Get all programs with optional filters
     */
    async getAllPrograms(filters = {}) {
        try {
            const programs = await programRepository.findAll(filters);
            const total = await programRepository.count(filters);

            return {
                programs,
                total,
                page: filters.page || 1,
                limit: filters.limit || programs.length
            };
        } catch (error) {
            logger.error('Error fetching programs:', { error: error.message });
            throw error;
        }
    }

    /**
     * Get program by ID
     */
    async getProgramById(id) {
        try {
            const program = await programRepository.findById(id);
            if (!program) {
                throw new Error('Program not found');
            }
            return program;
        } catch (error) {
            logger.error('Error fetching program:', { id, error: error.message });
            throw error;
        }
    }

    /**
     * Get program with projects
     */
    async getProgramWithProjects(id) {
        try {
            const program = await programRepository.findWithProjects(id);
            if (!program) {
                throw new Error('Program not found');
            }
            return program;
        } catch (error) {
            logger.error('Error fetching program with projects:', { id, error: error.message });
            throw error;
        }
    }

    /**
     * Get program statistics
     */
    async getProgramStats(id) {
        try {
            const stats = await programRepository.getStats(id);
            if (!stats) {
                throw new Error('Program not found');
            }
            return stats;
        } catch (error) {
            logger.error('Error fetching program stats:', { id, error: error.message });
            throw error;
        }
    }

    /**
     * Create new program
     */
    async createProgram(programData) {
        try {
            // Validate unique code
            const existing = await programRepository.findByCode(programData.code);
            if (existing) {
                throw new Error(`Program with code '${programData.code}' already exists`);
            }

            // Create program locally
            const programId = await programRepository.create(programData);

            // Queue for sync to ClickUp
            await syncService.queueOperation({
                entity_type: 'program',
                entity_id: programId,
                operation_type: 'create',
                direction: 'push',
                priority: 3
            });

            logger.info('Program created successfully:', { programId });

            // Return created program
            return await programRepository.findById(programId);
        } catch (error) {
            logger.error('Error creating program:', { error: error.message });
            throw error;
        }
    }

    /**
     * Update program
     */
    async updateProgram(id, programData) {
        try {
            // Check if program exists
            const existing = await programRepository.findById(id);
            if (!existing) {
                throw new Error('Program not found');
            }

            // If updating code, check uniqueness
            if (programData.code && programData.code !== existing.code) {
                const codeExists = await programRepository.findByCode(programData.code);
                if (codeExists) {
                    throw new Error(`Program with code '${programData.code}' already exists`);
                }
            }

            // Update program
            programData.sync_status = 'pending'; // Mark as pending sync
            const updated = await programRepository.update(id, programData);

            if (!updated) {
                throw new Error('Failed to update program');
            }

            // Queue for sync
            await syncService.queueOperation({
                entity_type: 'program',
                entity_id: id,
                operation_type: 'update',
                direction: 'push',
                priority: 5
            });

            logger.info('Program updated successfully:', { id });

            return await programRepository.findById(id);
        } catch (error) {
            logger.error('Error updating program:', { id, error: error.message });
            throw error;
        }
    }

    /**
     * Delete program
     */
    async deleteProgram(id) {
        try {
            const existing = await programRepository.findById(id);
            if (!existing) {
                throw new Error('Program not found');
            }

            // Soft delete
            const deleted = await programRepository.delete(id);

            if (!deleted) {
                throw new Error('Failed to delete program');
            }

            // Queue for sync (delete in ClickUp)
            await syncService.queueOperation({
                entity_type: 'program',
                entity_id: id,
                operation_type: 'delete',
                direction: 'push',
                priority: 3
            });

            logger.info('Program deleted successfully:', { id });

            return true;
        } catch (error) {
            logger.error('Error deleting program:', { id, error: error.message });
            throw error;
        }
    }

    /**
     * Sync program to ClickUp
     */
    async syncProgramToClickUp(programId) {
        try {
            const program = await programRepository.findById(programId);
            if (!program) {
                throw new Error('Program not found');
            }

            // This will be called by the sync engine
            // For now, just update sync status
            await programRepository.updateSyncStatus(programId, 'synced');

            logger.info('Program synced to ClickUp:', { programId });

            return true;
        } catch (error) {
            logger.error('Error syncing program to ClickUp:', { programId, error: error.message });
            throw error;
        }
    }

    /**
     * Get program dashboard data
     */
    async getDashboard() {
        try {
            const programs = await programRepository.findAll();

            const dashboard = {
                total_programs: programs.length,
                active_programs: programs.filter(p => p.status === 'active').length,
                total_budget: programs.reduce((sum, p) => sum + (p.budget || 0), 0),
                by_status: {},
                programs: []
            };

            // Group by status
            programs.forEach(program => {
                if (!dashboard.by_status[program.status]) {
                    dashboard.by_status[program.status] = 0;
                }
                dashboard.by_status[program.status]++;
            });

            // Get stats for each program
            for (const program of programs) {
                const stats = await programRepository.getStats(program.id);
                dashboard.programs.push({
                    ...program,
                    stats
                });
            }

            return dashboard;
        } catch (error) {
            logger.error('Error fetching program dashboard:', { error: error.message });
            throw error;
        }
    }
}

module.exports = new ProgramService();
