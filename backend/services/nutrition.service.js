/**
 * Nutrition Assessment Service
 * Manages household diet diversity and nutrition monitoring
 */

class NutritionService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get all nutrition assessments
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of assessments
     */
    async getAssessments(filters = {}) {
        let query = `
            SELECT
                na.*,
                b.first_name,
                b.last_name,
                b.gender,
                b.age,
                pm.name as program_module_name,
                u.full_name as assessed_by_name
            FROM nutrition_assessments na
            INNER JOIN beneficiaries b ON na.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON na.program_module_id = pm.id
            LEFT JOIN users u ON na.assessed_by = u.id
            WHERE na.deleted_at IS NULL
        `;

        const params = [];

        if (filters.beneficiary_id) {
            query += ` AND na.beneficiary_id = ?`;
            params.push(filters.beneficiary_id);
        }

        if (filters.program_module_id) {
            query += ` AND na.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.assessment_type) {
            query += ` AND na.assessment_type = ?`;
            params.push(filters.assessment_type);
        }

        if (filters.food_security_status) {
            query += ` AND na.food_security_status = ?`;
            params.push(filters.food_security_status);
        }

        if (filters.nutrition_status) {
            query += ` AND na.nutrition_status = ?`;
            params.push(filters.nutrition_status);
        }

        if (filters.from_date) {
            query += ` AND na.assessment_date >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            query += ` AND na.assessment_date <= ?`;
            params.push(filters.to_date);
        }

        query += ` ORDER BY na.assessment_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get assessment by ID
     * @param {number} id - Assessment ID
     * @returns {Promise<Object>} Assessment details
     */
    async getAssessmentById(id) {
        const query = `
            SELECT
                na.*,
                b.first_name,
                b.last_name,
                b.gender,
                b.age,
                b.household_size,
                pm.name as program_module_name,
                u.full_name as assessed_by_name
            FROM nutrition_assessments na
            INNER JOIN beneficiaries b ON na.beneficiary_id = b.id
            LEFT JOIN program_modules pm ON na.program_module_id = pm.id
            LEFT JOIN users u ON na.assessed_by = u.id
            WHERE na.id = ? AND na.deleted_at IS NULL
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create new assessment
     * @param {Object} assessmentData - Assessment information
     * @returns {Promise<number>} New assessment ID
     */
    async createAssessment(assessmentData) {
        // Validate required fields
        const required = ['beneficiary_id', 'assessment_date', 'program_module_id', 'food_security_status'];
        for (const field of required) {
            if (!assessmentData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Calculate HDDS score (count of food groups consumed)
        const hddsScore = [
            assessmentData.cereals,
            assessmentData.tubers,
            assessmentData.vegetables,
            assessmentData.fruits,
            assessmentData.meat,
            assessmentData.eggs,
            assessmentData.fish,
            assessmentData.legumes,
            assessmentData.dairy,
            assessmentData.oils_fats,
            assessmentData.sugar,
            assessmentData.condiments
        ].filter(Boolean).length;

        const query = `
            INSERT INTO nutrition_assessments (
                beneficiary_id, household_id, assessment_date, assessment_type,
                program_module_id, cereals, tubers, vegetables, fruits,
                meat, eggs, fish, legumes, dairy, oils_fats, sugar, condiments,
                hdds_score, meals_per_day, children_meals_per_day,
                food_security_status, hunger_score,
                child_weight_kg, child_height_cm, muac_mm, nutrition_status,
                nutrition_education_received, supplementary_feeding, cash_transfer_received,
                assessed_by, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            assessmentData.beneficiary_id,
            assessmentData.household_id || null,
            assessmentData.assessment_date,
            assessmentData.assessment_type || 'routine_monitoring',
            assessmentData.program_module_id,
            assessmentData.cereals || false,
            assessmentData.tubers || false,
            assessmentData.vegetables || false,
            assessmentData.fruits || false,
            assessmentData.meat || false,
            assessmentData.eggs || false,
            assessmentData.fish || false,
            assessmentData.legumes || false,
            assessmentData.dairy || false,
            assessmentData.oils_fats || false,
            assessmentData.sugar || false,
            assessmentData.condiments || false,
            hddsScore,
            assessmentData.meals_per_day || null,
            assessmentData.children_meals_per_day || null,
            assessmentData.food_security_status,
            assessmentData.hunger_score || null,
            assessmentData.child_weight_kg || null,
            assessmentData.child_height_cm || null,
            assessmentData.muac_mm || null,
            assessmentData.nutrition_status || null,
            assessmentData.nutrition_education_received || false,
            assessmentData.supplementary_feeding || false,
            assessmentData.cash_transfer_received || false,
            assessmentData.assessed_by || null,
            assessmentData.notes || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update assessment
     * @param {number} id - Assessment ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateAssessment(id, updateData) {
        const allowedFields = [
            'cereals', 'tubers', 'vegetables', 'fruits', 'meat', 'eggs', 'fish',
            'legumes', 'dairy', 'oils_fats', 'sugar', 'condiments',
            'meals_per_day', 'children_meals_per_day', 'food_security_status',
            'hunger_score', 'child_weight_kg', 'child_height_cm', 'muac_mm',
            'nutrition_status', 'nutrition_education_received',
            'supplementary_feeding', 'cash_transfer_received', 'notes'
        ];

        const updates = [];
        const params = [];

        for (const [key, value] of Object.entries(updateData)) {
            if (allowedFields.includes(key)) {
                updates.push(`${key} = ?`);
                params.push(value);
            }
        }

        // Recalculate HDDS score if food groups changed
        const foodGroupFields = ['cereals', 'tubers', 'vegetables', 'fruits', 'meat', 'eggs', 'fish', 'legumes', 'dairy', 'oils_fats', 'sugar', 'condiments'];
        const hasFoodGroupChanges = foodGroupFields.some(field => updateData.hasOwnProperty(field));

        if (hasFoodGroupChanges) {
            // Get current values
            const current = await this.getAssessmentById(id);
            const hddsScore = foodGroupFields.filter(field => {
                const value = updateData.hasOwnProperty(field) ? updateData[field] : current[field];
                return Boolean(value);
            }).length;

            updates.push('hdds_score = ?');
            params.push(hddsScore);
        }

        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        updates.push('updated_at = NOW()');
        params.push(id);

        const query = `
            UPDATE nutrition_assessments
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Delete assessment (soft delete)
     * @param {number} id - Assessment ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteAssessment(id) {
        const query = `
            UPDATE nutrition_assessments
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Get beneficiary assessment history
     * @param {number} beneficiaryId - Beneficiary ID
     * @returns {Promise<Array>} Assessment history
     */
    async getBeneficiaryHistory(beneficiaryId) {
        const query = `
            SELECT
                na.*,
                u.full_name as assessed_by_name
            FROM nutrition_assessments na
            LEFT JOIN users u ON na.assessed_by = u.id
            WHERE na.beneficiary_id = ? AND na.deleted_at IS NULL
            ORDER BY na.assessment_date DESC
        `;

        const results = await this.db.query(query, [beneficiaryId]);
        return results;
    }

    /**
     * Get nutrition statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}) {
        let whereClause = 'WHERE na.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND na.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.from_date) {
            whereClause += ` AND na.assessment_date >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            whereClause += ` AND na.assessment_date <= ?`;
            params.push(filters.to_date);
        }

        const query = `
            SELECT
                COUNT(DISTINCT na.id) as total_assessments,
                COUNT(DISTINCT na.beneficiary_id) as unique_beneficiaries,
                AVG(na.hdds_score) as avg_hdds_score,
                SUM(CASE WHEN na.food_security_status = 'food_secure' THEN 1 ELSE 0 END) as food_secure_count,
                SUM(CASE WHEN na.food_security_status = 'severely_insecure' THEN 1 ELSE 0 END) as severely_insecure_count,
                SUM(CASE WHEN na.nutrition_status = 'sam' THEN 1 ELSE 0 END) as sam_cases,
                SUM(CASE WHEN na.nutrition_status = 'mam' THEN 1 ELSE 0 END) as mam_cases,
                SUM(CASE WHEN na.nutrition_education_received = 1 THEN 1 ELSE 0 END) as nutrition_education_count,
                SUM(CASE WHEN na.supplementary_feeding = 1 THEN 1 ELSE 0 END) as supplementary_feeding_count
            FROM nutrition_assessments na
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }
}

module.exports = NutritionService;
