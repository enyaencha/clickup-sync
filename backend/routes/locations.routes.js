/**
 * Locations API Routes
 * Endpoints for hierarchical locations (Country → County → Sub-County → Ward → Parish)
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
    /**
     * GET /api/locations
     * Get all locations
     */
    router.get('/', async (req, res) => {
        try {
            const query = `
                SELECT
                    id,
                    name,
                    type,
                    parent_id,
                    coordinates,
                    boundary_data,
                    is_active,
                    created_at
                FROM locations
                WHERE is_active = 1
                ORDER BY
                    FIELD(type, 'country', 'county', 'sub_county', 'ward', 'parish'),
                    name
            `;

            const results = await db.query(query);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching locations:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch locations'
            });
        }
    });

    /**
     * GET /api/locations/:id
     * Get a specific location with its hierarchy
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            // Get the location
            const [location] = await db.query(
                'SELECT * FROM locations WHERE id = ? AND is_active = 1',
                [id]
            );

            if (!location) {
                return res.status(404).json({
                    success: false,
                    error: 'Location not found'
                });
            }

            // Get the full hierarchy
            const hierarchy = [location];
            let current = location;

            while (current.parent_id) {
                const [parent] = await db.query(
                    'SELECT * FROM locations WHERE id = ?',
                    [current.parent_id]
                );
                if (parent) {
                    hierarchy.unshift(parent);
                    current = parent;
                } else {
                    break;
                }
            }

            res.json({
                success: true,
                data: {
                    location,
                    hierarchy
                }
            });
        } catch (error) {
            console.error('Error fetching location:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch location'
            });
        }
    });

    /**
     * GET /api/locations/children/:parentId
     * Get child locations of a parent
     */
    router.get('/children/:parentId', async (req, res) => {
        try {
            const { parentId } = req.params;

            const query = `
                SELECT *
                FROM locations
                WHERE parent_id = ? AND is_active = 1
                ORDER BY name
            `;

            const results = await db.query(query, [parentId]);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching child locations:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch child locations'
            });
        }
    });

    /**
     * GET /api/locations/type/:type
     * Get all locations of a specific type
     */
    router.get('/type/:type', async (req, res) => {
        try {
            const { type } = req.params;

            const validTypes = ['country', 'county', 'sub_county', 'ward', 'parish'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid location type'
                });
            }

            const query = `
                SELECT *
                FROM locations
                WHERE type = ? AND is_active = 1
                ORDER BY name
            `;

            const results = await db.query(query, [type]);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching locations by type:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch locations'
            });
        }
    });

    return router;
};
