/**
 * Results Chain Service
 * Manages explicit linkages between hierarchy levels for results tracking
 */

const logger = require('../core/utils/logger');

class ResultsChainService {
    constructor(db) {
        this.db = db;
    }

    // ==============================================
    // CREATE
    // ==============================================

    async createLink(data) {
        try {
            // Validate the link direction
            this.validateLinkDirection(data.from_entity_type, data.to_entity_type);

            const result = await this.db.query(`
                INSERT INTO results_chain (
                    from_entity_type, from_entity_id,
                    to_entity_type, to_entity_id,
                    contribution_description, contribution_weight,
                    notes, created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                data.from_entity_type,
                data.from_entity_id,
                data.to_entity_type,
                data.to_entity_id,
                data.contribution_description || null,
                data.contribution_weight || 100,
                data.notes || null,
                data.created_by || null
            ]);

            const linkId = result.insertId;
            logger.info(`Created results chain link ${linkId}: ${data.from_entity_type} ${data.from_entity_id} → ${data.to_entity_type} ${data.to_entity_id}`);

            return linkId;
        } catch (error) {
            logger.error('Error creating results chain link:', error);
            throw error;
        }
    }

    async createBulkLinks(links) {
        try {
            const results = [];
            for (const link of links) {
                const id = await this.createLink(link);
                results.push(id);
            }
            logger.info(`Created ${results.length} results chain links`);
            return results;
        } catch (error) {
            logger.error('Error creating bulk results chain links:', error);
            throw error;
        }
    }

    // ==============================================
    // READ
    // ==============================================

    async getLinkById(id) {
        try {
            const links = await this.db.query(`
                SELECT * FROM results_chain
                WHERE id = ?
            `, [id]);

            return links.length > 0 ? links[0] : null;
        } catch (error) {
            logger.error(`Error fetching results chain link ${id}:`, error);
            throw error;
        }
    }

    async getLinksFromEntity(entityType, entityId) {
        try {
            const links = await this.db.query(`
                SELECT rc.*,
                    CASE rc.to_entity_type
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.to_entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.to_entity_id)
                        WHEN 'module' THEN (SELECT name FROM program_modules WHERE id = rc.to_entity_id)
                    END as to_entity_name
                FROM results_chain rc
                WHERE rc.from_entity_type = ? AND rc.from_entity_id = ?
                ORDER BY rc.created_at DESC
            `, [entityType, entityId]);

            return links;
        } catch (error) {
            logger.error(`Error fetching links from ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getLinksToEntity(entityType, entityId) {
        try {
            const links = await this.db.query(`
                SELECT rc.*,
                    CASE rc.from_entity_type
                        WHEN 'activity' THEN (SELECT name FROM activities WHERE id = rc.from_entity_id)
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.from_entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.from_entity_id)
                    END as from_entity_name
                FROM results_chain rc
                WHERE rc.to_entity_type = ? AND rc.to_entity_id = ?
                ORDER BY rc.created_at DESC
            `, [entityType, entityId]);

            return links;
        } catch (error) {
            logger.error(`Error fetching links to ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getAllLinks() {
        try {
            const links = await this.db.query(`
                SELECT rc.*,
                    CASE rc.from_entity_type
                        WHEN 'activity' THEN (SELECT name FROM activities WHERE id = rc.from_entity_id)
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.from_entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.from_entity_id)
                    END as from_entity_name,
                    CASE rc.to_entity_type
                        WHEN 'component' THEN (SELECT name FROM project_components WHERE id = rc.to_entity_id)
                        WHEN 'sub_program' THEN (SELECT name FROM sub_programs WHERE id = rc.to_entity_id)
                        WHEN 'module' THEN (SELECT name FROM program_modules WHERE id = rc.to_entity_id)
                    END as to_entity_name
                FROM results_chain rc
                ORDER BY rc.created_at DESC
            `);

            return links;
        } catch (error) {
            logger.error('Error fetching all results chain links:', error);
            throw error;
        }
    }

    async getFullChain(entityType, entityId) {
        try {
            // Get the complete results chain for an entity (both upstream and downstream)
            const upstreamLinks = await this.getLinksFromEntity(entityType, entityId);
            const downstreamLinks = await this.getLinksToEntity(entityType, entityId);

            return {
                upstream: upstreamLinks,   // What this contributes to
                downstream: downstreamLinks  // What contributes to this
            };
        } catch (error) {
            logger.error(`Error fetching full chain for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    async getResultsHierarchy(moduleId) {
        try {
            // Get complete results chain for a module (top-down)
            const hierarchy = await this.db.query(`
                WITH RECURSIVE chain AS (
                    -- Start with module
                    SELECT
                        'module' as level,
                        pm.id as entity_id,
                        pm.name as entity_name,
                        NULL as parent_id,
                        0 as depth
                    FROM program_modules pm
                    WHERE pm.id = ?

                    UNION ALL

                    -- Get sub-programs
                    SELECT
                        'sub_program' as level,
                        sp.id as entity_id,
                        sp.name as entity_name,
                        sp.module_id as parent_id,
                        1 as depth
                    FROM sub_programs sp
                    WHERE sp.module_id = ?

                    UNION ALL

                    -- Get components
                    SELECT
                        'component' as level,
                        pc.id as entity_id,
                        pc.name as entity_name,
                        pc.sub_program_id as parent_id,
                        2 as depth
                    FROM project_components pc
                    JOIN sub_programs sp ON pc.sub_program_id = sp.id
                    WHERE sp.module_id = ?

                    UNION ALL

                    -- Get activities
                    SELECT
                        'activity' as level,
                        a.id as entity_id,
                        a.name as entity_name,
                        a.component_id as parent_id,
                        3 as depth
                    FROM activities a
                    JOIN project_components pc ON a.component_id = pc.id
                    JOIN sub_programs sp ON pc.sub_program_id = sp.id
                    WHERE sp.module_id = ?
                )
                SELECT * FROM chain
                ORDER BY depth, entity_name
            `, [moduleId, moduleId, moduleId, moduleId]);

            return hierarchy;
        } catch (error) {
            logger.error(`Error fetching results hierarchy for module ${moduleId}:`, error);
            throw error;
        }
    }

    // ==============================================
    // UPDATE
    // ==============================================

    async updateLink(id, data) {
        try {
            const updates = [];
            const params = [];

            const fields = ['contribution_description', 'contribution_weight', 'notes'];

            fields.forEach(field => {
                if (data[field] !== undefined) {
                    updates.push(`${field} = ?`);
                    params.push(data[field]);
                }
            });

            if (updates.length === 0) {
                throw new Error('No fields to update');
            }

            params.push(id);

            await this.db.query(`
                UPDATE results_chain
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE id = ?
            `, params);

            logger.info(`Updated results chain link ${id}`);
            return id;
        } catch (error) {
            logger.error(`Error updating results chain link ${id}:`, error);
            throw error;
        }
    }

    // ==============================================
    // DELETE
    // ==============================================

    async deleteLink(id) {
        try {
            await this.db.query(`
                DELETE FROM results_chain
                WHERE id = ?
            `, [id]);

            logger.info(`Deleted results chain link ${id}`);
            return true;
        } catch (error) {
            logger.error(`Error deleting results chain link ${id}:`, error);
            throw error;
        }
    }

    async deleteLinksForEntity(entityType, entityId) {
        try {
            const result = await this.db.query(`
                DELETE FROM results_chain
                WHERE (from_entity_type = ? AND from_entity_id = ?)
                   OR (to_entity_type = ? AND to_entity_id = ?)
            `, [entityType, entityId, entityType, entityId]);

            logger.info(`Deleted ${result.affectedRows} results chain links for ${entityType} ${entityId}`);
            return result.affectedRows;
        } catch (error) {
            logger.error(`Error deleting links for ${entityType} ${entityId}:`, error);
            throw error;
        }
    }

    // ==============================================
    // VALIDATION & UTILITIES
    // ==============================================

    validateLinkDirection(fromType, toType) {
        const validLinks = {
            'activity': ['component'],
            'component': ['sub_program'],
            'sub_program': ['module']
        };

        if (!validLinks[fromType]) {
            throw new Error(`Invalid from_entity_type: ${fromType}`);
        }

        if (!validLinks[fromType].includes(toType)) {
            throw new Error(`Invalid link: ${fromType} cannot link to ${toType}`);
        }

        return true;
    }

    async getStatistics(moduleId) {
        try {
            // Get statistics about results chain completeness for a module
            const stats = await this.db.query(`
                SELECT
                    (SELECT COUNT(*) FROM activities a
                     JOIN project_components pc ON a.component_id = pc.id
                     JOIN sub_programs sp ON pc.sub_program_id = sp.id
                     WHERE sp.module_id = ?) as total_activities,

                    (SELECT COUNT(DISTINCT rc.from_entity_id)
                     FROM results_chain rc
                     JOIN activities a ON rc.from_entity_id = a.id
                     JOIN project_components pc ON a.component_id = pc.id
                     JOIN sub_programs sp ON pc.sub_program_id = sp.id
                     WHERE rc.from_entity_type = 'activity'
                       AND sp.module_id = ?) as linked_activities,

                    (SELECT COUNT(*) FROM project_components pc
                     JOIN sub_programs sp ON pc.sub_program_id = sp.id
                     WHERE sp.module_id = ?) as total_components,

                    (SELECT COUNT(DISTINCT rc.from_entity_id)
                     FROM results_chain rc
                     JOIN project_components pc ON rc.from_entity_id = pc.id
                     JOIN sub_programs sp ON pc.sub_program_id = sp.id
                     WHERE rc.from_entity_type = 'component'
                       AND sp.module_id = ?) as linked_components,

                    (SELECT COUNT(*) FROM sub_programs WHERE module_id = ?) as total_sub_programs,

                    (SELECT COUNT(DISTINCT rc.from_entity_id)
                     FROM results_chain rc
                     JOIN sub_programs sp ON rc.from_entity_id = sp.id
                     WHERE rc.from_entity_type = 'sub_program'
                       AND sp.module_id = ?) as linked_sub_programs
            `, [moduleId, moduleId, moduleId, moduleId, moduleId, moduleId]);

            const stat = stats[0];
            stat.activity_linkage_percentage = stat.total_activities > 0
                ? (stat.linked_activities / stat.total_activities * 100).toFixed(2)
                : 0;
            stat.component_linkage_percentage = stat.total_components > 0
                ? (stat.linked_components / stat.total_components * 100).toFixed(2)
                : 0;
            stat.sub_program_linkage_percentage = stat.total_sub_programs > 0
                ? (stat.linked_sub_programs / stat.total_sub_programs * 100).toFixed(2)
                : 0;

            return stat;
        } catch (error) {
            logger.error(`Error getting results chain statistics for module ${moduleId}:`, error);
            throw error;
        }
    }
}

module.exports = ResultsChainService;
