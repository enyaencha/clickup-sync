/**
 * Relief Distribution Service
 * Manages relief assistance distribution tracking
 */

class ReliefService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get all relief distributions
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of distributions
     */
    async getDistributions(filters = {}) {
        let query = `
            SELECT
                rd.*,
                pm.name as program_module_name,
                u1.name as distributed_by_name,
                u2.name as verified_by_name
            FROM relief_distributions rd
            LEFT JOIN program_modules pm ON rd.program_module_id = pm.id
            LEFT JOIN users u1 ON rd.distributed_by = u1.id
            LEFT JOIN users u2 ON rd.verified_by = u2.id
            WHERE rd.deleted_at IS NULL
        `;

        const params = [];

        if (filters.program_module_id) {
            query += ` AND rd.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.distribution_type) {
            query += ` AND rd.distribution_type = ?`;
            params.push(filters.distribution_type);
        }

        if (filters.county) {
            query += ` AND rd.county = ?`;
            params.push(filters.county);
        }

        if (filters.from_date) {
            query += ` AND rd.distribution_date >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            query += ` AND rd.distribution_date <= ?`;
            params.push(filters.to_date);
        }

        query += ` ORDER BY rd.distribution_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get distribution by ID
     * @param {number} id - Distribution ID
     * @returns {Promise<Object>} Distribution details
     */
    async getDistributionById(id) {
        const query = `
            SELECT
                rd.*,
                pm.name as program_module_name,
                u1.name as distributed_by_name,
                u2.name as verified_by_name,
                COUNT(DISTINCT rb.id) as actual_beneficiaries_count
            FROM relief_distributions rd
            LEFT JOIN program_modules pm ON rd.program_module_id = pm.id
            LEFT JOIN users u1 ON rd.distributed_by = u1.id
            LEFT JOIN users u2 ON rd.verified_by = u2.id
            LEFT JOIN relief_beneficiaries rb ON rd.id = rb.distribution_id
            WHERE rd.id = ? AND rd.deleted_at IS NULL
            GROUP BY rd.id
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create new distribution
     * @param {Object} distributionData - Distribution information
     * @returns {Promise<number>} New distribution ID
     */
    async createDistribution(distributionData) {
        // Generate distribution code if not provided
        if (!distributionData.distribution_code) {
            distributionData.distribution_code = await this.generateDistributionCode();
        }

        // Validate required fields
        const required = ['distribution_date', 'program_module_id', 'distribution_type', 'location', 'item_description'];
        for (const field of required) {
            if (!distributionData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const query = `
            INSERT INTO relief_distributions (
                distribution_code, distribution_date, program_module_id,
                distribution_type, location, ward, sub_county, county,
                item_description, quantity_distributed, unit_of_measure, total_value,
                total_beneficiaries, male_beneficiaries, female_beneficiaries, children_beneficiaries,
                donor, project_code, distributed_by, verified_by, notes,
                distribution_report_url, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            distributionData.distribution_code,
            distributionData.distribution_date,
            distributionData.program_module_id,
            distributionData.distribution_type,
            distributionData.location,
            distributionData.ward || null,
            distributionData.sub_county || null,
            distributionData.county || null,
            distributionData.item_description,
            distributionData.quantity_distributed || null,
            distributionData.unit_of_measure || null,
            distributionData.total_value || null,
            distributionData.total_beneficiaries || 0,
            distributionData.male_beneficiaries || 0,
            distributionData.female_beneficiaries || 0,
            distributionData.children_beneficiaries || 0,
            distributionData.donor || null,
            distributionData.project_code || null,
            distributionData.distributed_by || null,
            distributionData.verified_by || null,
            distributionData.notes || null,
            distributionData.distribution_report_url || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update distribution
     * @param {number} id - Distribution ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateDistribution(id, updateData) {
        const allowedFields = [
            'distribution_date', 'distribution_type', 'location', 'ward', 'sub_county', 'county',
            'item_description', 'quantity_distributed', 'unit_of_measure', 'total_value',
            'total_beneficiaries', 'male_beneficiaries', 'female_beneficiaries', 'children_beneficiaries',
            'donor', 'project_code', 'distributed_by', 'verified_by', 'notes', 'distribution_report_url'
        ];

        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                params.push(value);
            }
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        updates.push('updated_at = NOW()');
        params.push(id);

        const query = `
            UPDATE relief_distributions
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Delete distribution (soft delete)
     * @param {number} id - Distribution ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteDistribution(id) {
        const query = `
            UPDATE relief_distributions
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Add beneficiary to distribution
     * @param {number} distributionId - Distribution ID
     * @param {Object} beneficiaryData - Beneficiary receipt data
     * @returns {Promise<number>} New record ID
     */
    async addBeneficiary(distributionId, beneficiaryData) {
        const query = `
            INSERT INTO relief_beneficiaries (
                distribution_id, beneficiary_id, received_date,
                quantity_received, receipt_number, signature_captured,
                satisfaction_rating, feedback, recorded_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            distributionId,
            beneficiaryData.beneficiary_id,
            beneficiaryData.received_date || new Date().toISOString().split('T')[0],
            beneficiaryData.quantity_received || null,
            beneficiaryData.receipt_number || null,
            beneficiaryData.signature_captured || false,
            beneficiaryData.satisfaction_rating || null,
            beneficiaryData.feedback || null,
            beneficiaryData.recorded_by || null
        ];

        const result = await this.db.query(query, params);

        // Update distribution totals
        await this.updateDistributionTotals(distributionId);

        return result.insertId;
    }

    /**
     * Get beneficiaries for a distribution
     * @param {number} distributionId - Distribution ID
     * @returns {Promise<Array>} List of beneficiaries
     */
    async getDistributionBeneficiaries(distributionId) {
        const query = `
            SELECT
                rb.*,
                b.first_name,
                b.middle_name,
                b.last_name,
                b.gender,
                b.age,
                b.phone_number,
                u.name as recorded_by_name
            FROM relief_beneficiaries rb
            INNER JOIN beneficiaries b ON rb.beneficiary_id = b.id
            LEFT JOIN users u ON rb.recorded_by = u.id
            WHERE rb.distribution_id = ? AND rb.deleted_at IS NULL
            ORDER BY rb.received_date DESC
        `;

        const results = await this.db.query(query, [distributionId]);
        return results;
    }

    /**
     * Update distribution beneficiary counts
     * @param {number} distributionId - Distribution ID
     * @returns {Promise<void>}
     */
    async updateDistributionTotals(distributionId) {
        const query = `
            UPDATE relief_distributions rd
            SET
                total_beneficiaries = (
                    SELECT COUNT(DISTINCT rb.beneficiary_id)
                    FROM relief_beneficiaries rb
                    INNER JOIN beneficiaries b ON rb.beneficiary_id = b.id
                    WHERE rb.distribution_id = rd.id AND rb.deleted_at IS NULL
                ),
                male_beneficiaries = (
                    SELECT COUNT(DISTINCT rb.beneficiary_id)
                    FROM relief_beneficiaries rb
                    INNER JOIN beneficiaries b ON rb.beneficiary_id = b.id
                    WHERE rb.distribution_id = rd.id
                    AND b.gender = 'male'
                    AND rb.deleted_at IS NULL
                ),
                female_beneficiaries = (
                    SELECT COUNT(DISTINCT rb.beneficiary_id)
                    FROM relief_beneficiaries rb
                    INNER JOIN beneficiaries b ON rb.beneficiary_id = b.id
                    WHERE rb.distribution_id = rd.id
                    AND b.gender = 'female'
                    AND rb.deleted_at IS NULL
                ),
                children_beneficiaries = (
                    SELECT COUNT(DISTINCT rb.beneficiary_id)
                    FROM relief_beneficiaries rb
                    INNER JOIN beneficiaries b ON rb.beneficiary_id = b.id
                    WHERE rb.distribution_id = rd.id
                    AND b.age < 18
                    AND rb.deleted_at IS NULL
                )
            WHERE rd.id = ?
        `;

        await this.db.query(query, [distributionId]);
    }

    /**
     * Get relief statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}) {
        let whereClause = 'WHERE rd.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND rd.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.from_date) {
            whereClause += ` AND rd.distribution_date >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            whereClause += ` AND rd.distribution_date <= ?`;
            params.push(filters.to_date);
        }

        const query = `
            SELECT
                COUNT(DISTINCT rd.id) as total_distributions,
                SUM(rd.total_beneficiaries) as total_beneficiaries_reached,
                SUM(rd.male_beneficiaries) as total_male,
                SUM(rd.female_beneficiaries) as total_female,
                SUM(rd.children_beneficiaries) as total_children,
                SUM(rd.total_value) as total_value_distributed,
                COUNT(DISTINCT rd.donor) as unique_donors
            FROM relief_distributions rd
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }

    /**
     * Generate unique distribution code
     * @returns {Promise<string>} Distribution code
     */
    async generateDistributionCode() {
        const prefix = 'DIST';
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);

        return `${prefix}-${year}-${timestamp}`;
    }
}

module.exports = ReliefService;
