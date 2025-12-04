/**
 * Beneficiaries Service
 * Manages beneficiary registration and information across all programs
 */

class BeneficiariesService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get all beneficiaries with optional filtering
     * @param {Object} filters - Filter criteria
     * @param {number} filters.program_module_id - Filter by program module
     * @param {string} filters.status - Filter by status (active, inactive, graduated, exited)
     * @param {string} filters.gender - Filter by gender
     * @param {string} filters.vulnerability_category - Filter by vulnerability category
     * @param {string} filters.search - Search by name, registration number, or phone
     * @param {number} filters.limit - Limit results
     * @param {number} filters.offset - Offset for pagination
     * @returns {Promise<Array>} List of beneficiaries
     */
    async getBeneficiaries(filters = {}) {
        let query = `
            SELECT
                b.*,
                u.name as registered_by_name,
                pm.name as program_module_name,
                COUNT(DISTINCT shg.id) as shg_memberships_count,
                COUNT(DISTINCT l.id) as active_loans_count
            FROM beneficiaries b
            LEFT JOIN users u ON b.registered_by = u.id
            LEFT JOIN program_modules pm ON b.program_module_id = pm.id
            LEFT JOIN shg_members shg ON b.id = shg.beneficiary_id AND shg.membership_status = 'active'
            LEFT JOIN loans l ON b.id = l.beneficiary_id AND l.loan_status IN ('active', 'disbursed')
            WHERE b.deleted_at IS NULL
        `;

        const params = [];

        if (filters.program_module_id) {
            query += ` AND b.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.status) {
            query += ` AND b.status = ?`;
            params.push(filters.status);
        }

        if (filters.gender) {
            query += ` AND b.gender = ?`;
            params.push(filters.gender);
        }

        if (filters.vulnerability_category) {
            query += ` AND b.vulnerability_category = ?`;
            params.push(filters.vulnerability_category);
        }

        if (filters.search) {
            query += ` AND (
                b.first_name LIKE ? OR
                b.last_name LIKE ? OR
                b.registration_number LIKE ? OR
                b.phone_number LIKE ? OR
                b.id_number LIKE ?
            )`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ` GROUP BY b.id ORDER BY b.created_at DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));

            if (filters.offset) {
                query += ` OFFSET ?`;
                params.push(parseInt(filters.offset));
            }
        }

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get beneficiary by ID
     * @param {number} id - Beneficiary ID
     * @returns {Promise<Object>} Beneficiary details
     */
    async getBeneficiaryById(id) {
        const query = `
            SELECT
                b.*,
                u.name as registered_by_name,
                pm.name as program_module_name,
                COUNT(DISTINCT shg.id) as shg_memberships_count,
                COUNT(DISTINCT l.id) as total_loans_count,
                SUM(CASE WHEN l.loan_status IN ('active', 'disbursed') THEN 1 ELSE 0 END) as active_loans_count,
                SUM(CASE WHEN l.loan_status = 'completed' THEN 1 ELSE 0 END) as completed_loans_count
            FROM beneficiaries b
            LEFT JOIN users u ON b.registered_by = u.id
            LEFT JOIN program_modules pm ON b.program_module_id = pm.id
            LEFT JOIN shg_members shg ON b.id = shg.beneficiary_id
            LEFT JOIN loans l ON b.id = l.beneficiary_id
            WHERE b.id = ? AND b.deleted_at IS NULL
            GROUP BY b.id
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Get beneficiary by registration number
     * @param {string} registrationNumber - Registration number
     * @returns {Promise<Object>} Beneficiary details
     */
    async getBeneficiaryByRegistrationNumber(registrationNumber) {
        const query = `
            SELECT * FROM beneficiaries
            WHERE registration_number = ? AND deleted_at IS NULL
        `;

        const results = await this.db.query(query, [registrationNumber]);
        return results[0];
    }

    /**
     * Create a new beneficiary
     * @param {Object} beneficiaryData - Beneficiary information
     * @returns {Promise<number>} New beneficiary ID
     */
    async createBeneficiary(beneficiaryData) {
        // Generate registration number if not provided
        if (!beneficiaryData.registration_number) {
            beneficiaryData.registration_number = await this.generateRegistrationNumber(
                beneficiaryData.program_module_id
            );
        }

        // Validate required fields
        const required = ['first_name', 'last_name', 'gender', 'registration_date'];
        for (const field of required) {
            if (!beneficiaryData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Check if registration number already exists
        const existing = await this.getBeneficiaryByRegistrationNumber(
            beneficiaryData.registration_number
        );
        if (existing) {
            throw new Error(`Registration number already exists: ${beneficiaryData.registration_number}`);
        }

        const query = `
            INSERT INTO beneficiaries (
                registration_number, first_name, middle_name, last_name,
                date_of_birth, age, gender, id_number, phone_number,
                alternative_phone, email, county, sub_county, ward, village,
                gps_latitude, gps_longitude, household_size, household_head,
                marital_status, disability_status, disability_details,
                vulnerability_category, vulnerability_notes, eligible_programs,
                current_programs, photo_url, registration_date, registered_by,
                program_module_id, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            beneficiaryData.registration_number,
            beneficiaryData.first_name,
            beneficiaryData.middle_name || null,
            beneficiaryData.last_name,
            beneficiaryData.date_of_birth || null,
            beneficiaryData.age || null,
            beneficiaryData.gender,
            beneficiaryData.id_number || null,
            beneficiaryData.phone_number || null,
            beneficiaryData.alternative_phone || null,
            beneficiaryData.email || null,
            beneficiaryData.county || null,
            beneficiaryData.sub_county || null,
            beneficiaryData.ward || null,
            beneficiaryData.village || null,
            beneficiaryData.gps_latitude || null,
            beneficiaryData.gps_longitude || null,
            beneficiaryData.household_size || null,
            beneficiaryData.household_head || false,
            beneficiaryData.marital_status || null,
            beneficiaryData.disability_status || 'none',
            beneficiaryData.disability_details || null,
            beneficiaryData.vulnerability_category || null,
            beneficiaryData.vulnerability_notes || null,
            JSON.stringify(beneficiaryData.eligible_programs || []),
            JSON.stringify(beneficiaryData.current_programs || []),
            beneficiaryData.photo_url || null,
            beneficiaryData.registration_date,
            beneficiaryData.registered_by || null,
            beneficiaryData.program_module_id || null,
            beneficiaryData.status || 'active'
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update beneficiary information
     * @param {number} id - Beneficiary ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateBeneficiary(id, updateData) {
        const allowedFields = [
            'first_name', 'middle_name', 'last_name', 'date_of_birth', 'age',
            'gender', 'id_number', 'phone_number', 'alternative_phone', 'email',
            'county', 'sub_county', 'ward', 'village', 'gps_latitude', 'gps_longitude',
            'household_size', 'household_head', 'marital_status', 'disability_status',
            'disability_details', 'vulnerability_category', 'vulnerability_notes',
            'eligible_programs', 'current_programs', 'photo_url', 'status',
            'exit_date', 'exit_reason'
        ];

        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                // Handle JSON fields
                if (['eligible_programs', 'current_programs'].includes(key)) {
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
            UPDATE beneficiaries
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Soft delete a beneficiary
     * @param {number} id - Beneficiary ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteBeneficiary(id) {
        const query = `
            UPDATE beneficiaries
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Generate unique registration number
     * @param {number} programModuleId - Program module ID
     * @returns {Promise<string>} Registration number
     */
    async generateRegistrationNumber(programModuleId) {
        const prefix = programModuleId ? `MOD${programModuleId}` : 'BEN';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        return `${prefix}-${timestamp}-${random}`;
    }

    /**
     * Get beneficiary statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getBeneficiaryStatistics(filters = {}) {
        let whereClause = 'WHERE b.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND b.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        const query = `
            SELECT
                COUNT(DISTINCT b.id) as total_beneficiaries,
                SUM(CASE WHEN b.gender = 'male' THEN 1 ELSE 0 END) as male_count,
                SUM(CASE WHEN b.gender = 'female' THEN 1 ELSE 0 END) as female_count,
                SUM(CASE WHEN b.age < 18 THEN 1 ELSE 0 END) as children_count,
                SUM(CASE WHEN b.age BETWEEN 18 AND 35 THEN 1 ELSE 0 END) as youth_count,
                SUM(CASE WHEN b.status = 'active' THEN 1 ELSE 0 END) as active_count,
                SUM(CASE WHEN b.status = 'graduated' THEN 1 ELSE 0 END) as graduated_count,
                SUM(CASE WHEN b.disability_status != 'none' THEN 1 ELSE 0 END) as pwd_count,
                COUNT(DISTINCT b.vulnerability_category) as vulnerability_categories_count
            FROM beneficiaries b
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }

    /**
     * Get beneficiaries by program
     * @param {string} programType - Program type (seep, gender_youth, relief, food_security)
     * @returns {Promise<Array>} List of beneficiaries
     */
    async getBeneficiariesByProgram(programType) {
        const query = `
            SELECT b.* FROM beneficiaries b
            WHERE JSON_CONTAINS(b.current_programs, ?)
            AND b.deleted_at IS NULL
            ORDER BY b.registration_date DESC
        `;

        const results = await this.db.query(query, [JSON.stringify(programType)]);
        return results;
    }
}

module.exports = BeneficiariesService;
