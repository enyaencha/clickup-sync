/**
 * Agriculture Monitoring Service
 * Manages agricultural plot tracking and crop production monitoring
 */

class AgricultureService {
    constructor(db) {
        this.db = db;
    }

    // ==================== AGRICULTURAL PLOTS ====================

    /**
     * Get all agricultural plots
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of plots
     */
    async getPlots(filters = {}) {
        let query = `
            SELECT
                ap.*,
                b.first_name,
                b.last_name,
                b.phone_number,
                pm.name as program_module_name,
                u.full_name as facilitator_name
            FROM agricultural_plots ap
            INNER JOIN beneficiaries b ON ap.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON ap.program_module_id = pm.id
            LEFT JOIN users u ON ap.facilitator_id = u.id
            WHERE ap.deleted_at IS NULL
        `;

        const params = [];

        if (filters.beneficiary_id) {
            query += ` AND ap.beneficiary_id = ?`;
            params.push(filters.beneficiary_id);
        }

        if (filters.program_module_id) {
            query += ` AND ap.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.county) {
            query += ` AND ap.county = ?`;
            params.push(filters.county);
        }

        if (filters.sub_county) {
            query += ` AND ap.sub_county = ?`;
            params.push(filters.sub_county);
        }

        if (filters.status) {
            query += ` AND ap.status = ?`;
            params.push(filters.status);
        }

        query += ` ORDER BY ap.created_at DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get plot by ID
     * @param {number} id - Plot ID
     * @returns {Promise<Object>} Plot details
     */
    async getPlotById(id) {
        const query = `
            SELECT
                ap.*,
                b.first_name,
                b.last_name,
                b.phone_number,
                b.village as beneficiary_village,
                pm.name as program_module_name,
                u.full_name as facilitator_name,
                COUNT(DISTINCT cp.id) as production_records_count
            FROM agricultural_plots ap
            INNER JOIN beneficiaries b ON ap.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON ap.program_module_id = pm.id
            LEFT JOIN users u ON ap.facilitator_id = u.id
            LEFT JOIN crop_production cp ON ap.id = cp.plot_id
            WHERE ap.id = ? AND ap.deleted_at IS NULL
            GROUP BY ap.id
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create new plot
     * @param {Object} plotData - Plot information
     * @returns {Promise<number>} New plot ID
     */
    async createPlot(plotData) {
        // Generate plot code if not provided
        if (!plotData.plot_code) {
            plotData.plot_code = await this.generatePlotCode();
        }

        // Validate required fields
        const required = ['beneficiary_id', 'land_size_acres', 'county', 'sub_county', 'gps_latitude', 'gps_longitude', 'program_module_id'];
        for (const field of required) {
            if (!plotData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const query = `
            INSERT INTO agricultural_plots (
                plot_code, beneficiary_id, plot_name, land_size_acres,
                land_ownership, soil_type, water_source,
                county, sub_county, ward, village,
                gps_latitude, gps_longitude, gps_boundary,
                main_crops, intercropping, irrigation_available,
                climate_smart_practices, trees_planted, tree_species,
                soil_conservation_measures, program_module_id, facilitator_id,
                status, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            plotData.plot_code,
            plotData.beneficiary_id,
            plotData.plot_name || null,
            plotData.land_size_acres,
            plotData.land_ownership || 'owned',
            plotData.soil_type || null,
            plotData.water_source || null,
            plotData.county,
            plotData.sub_county,
            plotData.ward || null,
            plotData.village || null,
            plotData.gps_latitude,
            plotData.gps_longitude,
            plotData.gps_boundary ? JSON.stringify(plotData.gps_boundary) : null,
            plotData.main_crops || null,
            plotData.intercropping || false,
            plotData.irrigation_available || false,
            plotData.climate_smart_practices || null,
            plotData.trees_planted || 0,
            plotData.tree_species || null,
            plotData.soil_conservation_measures || null,
            plotData.program_module_id,
            plotData.facilitator_id || null,
            plotData.status || 'active',
            plotData.notes || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update plot
     * @param {number} id - Plot ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updatePlot(id, updateData) {
        const allowedFields = [
            'plot_name', 'land_size_acres', 'land_ownership', 'soil_type', 'water_source',
            'ward', 'village', 'gps_latitude', 'gps_longitude', 'gps_boundary',
            'main_crops', 'intercropping', 'irrigation_available', 'climate_smart_practices',
            'trees_planted', 'tree_species', 'soil_conservation_measures',
            'facilitator_id', 'status', 'notes'
        ];

        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                // Handle JSON fields
                if (key === 'gps_boundary' && value) {
                    params.push(JSON.stringify(value));
                } else {
                    params.push(value);
                }
            }
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        updates.push('updated_at = NOW()');
        params.push(id);

        const query = `
            UPDATE agricultural_plots
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Delete plot (soft delete)
     * @param {number} id - Plot ID
     * @returns {Promise<boolean>} Success status
     */
    async deletePlot(id) {
        const query = `
            UPDATE agricultural_plots
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Generate unique plot code
     * @returns {Promise<string>} Plot code
     */
    async generatePlotCode() {
        const prefix = 'PLT';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        return `${prefix}-${timestamp}-${random}`;
    }

    // ==================== CROP PRODUCTION ====================

    /**
     * Get crop production records
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of production records
     */
    async getProduction(filters = {}) {
        let query = `
            SELECT
                cp.*,
                ap.plot_code,
                ap.plot_name,
                b.first_name,
                b.last_name,
                pm.name as program_module_name,
                u.full_name as recorded_by_name
            FROM crop_production cp
            INNER JOIN agricultural_plots ap ON cp.plot_id = ap.id
            INNER JOIN beneficiaries b ON ap.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON cp.program_module_id = pm.id
            LEFT JOIN users u ON cp.recorded_by = u.id
            WHERE cp.deleted_at IS NULL
        `;

        const params = [];

        if (filters.plot_id) {
            query += ` AND cp.plot_id = ?`;
            params.push(filters.plot_id);
        }

        if (filters.program_module_id) {
            query += ` AND cp.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.season) {
            query += ` AND cp.season = ?`;
            params.push(filters.season);
        }

        if (filters.season_year) {
            query += ` AND cp.season_year = ?`;
            params.push(filters.season_year);
        }

        if (filters.crop_type) {
            query += ` AND cp.crop_type = ?`;
            params.push(filters.crop_type);
        }

        query += ` ORDER BY cp.season_year DESC, cp.planting_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get production record by ID
     * @param {number} id - Production ID
     * @returns {Promise<Object>} Production details
     */
    async getProductionById(id) {
        const query = `
            SELECT
                cp.*,
                ap.plot_code,
                ap.plot_name,
                ap.land_size_acres as plot_total_size,
                b.first_name,
                b.last_name,
                pm.name as program_module_name,
                u.full_name as recorded_by_name
            FROM crop_production cp
            INNER JOIN agricultural_plots ap ON cp.plot_id = ap.id
            INNER JOIN beneficiaries b ON ap.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON cp.program_module_id = pm.id
            LEFT JOIN users u ON cp.recorded_by = u.id
            WHERE cp.id = ? AND cp.deleted_at IS NULL
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create new production record
     * @param {Object} productionData - Production information
     * @returns {Promise<number>} New production ID
     */
    async createProduction(productionData) {
        // Validate required fields
        const required = ['plot_id', 'season', 'season_year', 'crop_type', 'land_area_acres', 'program_module_id'];
        for (const field of required) {
            if (!productionData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Calculate yield per acre if actual yield is provided
        let yieldPerAcre = null;
        if (productionData.actual_yield_kg && productionData.land_area_acres) {
            yieldPerAcre = productionData.actual_yield_kg / productionData.land_area_acres;
        }

        const query = `
            INSERT INTO crop_production (
                plot_id, season, season_year, planting_date, harvest_date,
                crop_type, crop_variety, land_area_acres,
                seed_source, fertilizer_used, fertilizer_type, pesticide_used,
                expected_yield_kg, actual_yield_kg, yield_per_acre,
                quantity_consumed_kg, quantity_sold_kg, quantity_stored_kg, revenue_generated,
                pest_damage, disease_damage, drought_impact, flood_impact, challenges_description,
                program_module_id, recorded_by, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            productionData.plot_id,
            productionData.season,
            productionData.season_year,
            productionData.planting_date || null,
            productionData.harvest_date || null,
            productionData.crop_type,
            productionData.crop_variety || null,
            productionData.land_area_acres,
            productionData.seed_source || null,
            productionData.fertilizer_used || false,
            productionData.fertilizer_type || null,
            productionData.pesticide_used || false,
            productionData.expected_yield_kg || null,
            productionData.actual_yield_kg || null,
            yieldPerAcre,
            productionData.quantity_consumed_kg || null,
            productionData.quantity_sold_kg || null,
            productionData.quantity_stored_kg || null,
            productionData.revenue_generated || null,
            productionData.pest_damage || false,
            productionData.disease_damage || false,
            productionData.drought_impact || false,
            productionData.flood_impact || false,
            productionData.challenges_description || null,
            productionData.program_module_id,
            productionData.recorded_by || null,
            productionData.notes || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update production record
     * @param {number} id - Production ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateProduction(id, updateData) {
        const allowedFields = [
            'planting_date', 'harvest_date', 'crop_variety', 'seed_source',
            'fertilizer_used', 'fertilizer_type', 'pesticide_used',
            'expected_yield_kg', 'actual_yield_kg',
            'quantity_consumed_kg', 'quantity_sold_kg', 'quantity_stored_kg', 'revenue_generated',
            'pest_damage', 'disease_damage', 'drought_impact', 'flood_impact',
            'challenges_description', 'notes'
        ];

        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                params.push(value);
            }
        }

        // Recalculate yield per acre if actual yield or land area changed
        if (updateData.actual_yield_kg !== undefined) {
            const current = await this.getProductionById(id);
            if (current && current.land_area_acres) {
                const yieldPerAcre = updateData.actual_yield_kg / current.land_area_acres;
                updates.push('yield_per_acre = ?');
                params.push(yieldPerAcre);
            }
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        updates.push('updated_at = NOW()');
        params.push(id);

        const query = `
            UPDATE crop_production
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Delete production record (soft delete)
     * @param {number} id - Production ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteProduction(id) {
        const query = `
            UPDATE crop_production
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Get agriculture statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}) {
        let whereClause = 'WHERE cp.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND cp.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.season_year) {
            whereClause += ` AND cp.season_year = ?`;
            params.push(filters.season_year);
        }

        const query = `
            SELECT
                COUNT(DISTINCT ap.id) as total_plots,
                COUNT(DISTINCT ap.beneficiary_id) as unique_farmers,
                SUM(ap.land_size_acres) as total_land_acres,
                SUM(ap.trees_planted) as total_trees_planted,
                COUNT(DISTINCT cp.id) as total_production_records,
                SUM(cp.actual_yield_kg) as total_yield_kg,
                AVG(cp.yield_per_acre) as avg_yield_per_acre,
                SUM(cp.revenue_generated) as total_revenue,
                SUM(CASE WHEN cp.fertilizer_used = 1 THEN 1 ELSE 0 END) as fertilizer_adoption,
                SUM(CASE WHEN cp.pest_damage = 1 OR cp.disease_damage = 1 THEN 1 ELSE 0 END) as pest_disease_cases,
                SUM(CASE WHEN cp.drought_impact = 1 THEN 1 ELSE 0 END) as drought_affected
            FROM crop_production cp
            INNER JOIN agricultural_plots ap ON cp.plot_id = ap.id
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }
}

module.exports = AgricultureService;
