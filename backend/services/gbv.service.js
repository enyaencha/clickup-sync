/**
 * GBV Case Management Service
 * Handles Gender-Based Violence case tracking with privacy controls
 * NOTE: This service handles sensitive data - access is restricted
 */

class GBVService {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get all GBV cases with strict access control
     * @param {Object} filters - Filter criteria
     * @param {Object} user - Current user for access control
     * @returns {Promise<Array>} List of cases (limited fields for privacy)
     */
    async getCases(filters = {}, user = null) {
        // Only authorized roles can view GBV cases
        if (!user) {
            throw new Error('Authentication required to access GBV cases');
        }

        // Restrict access to GBV counselors, case workers, and admins
        const hasAccess = user.is_system_admin ||
                         user.roles?.some(r => ['me_director', 'me_manager', 'module_manager', 'case_worker'].includes(r.name));

        if (!hasAccess) {
            throw new Error('You do not have permission to access GBV case data');
        }

        let query = `
            SELECT
                gc.id,
                gc.case_number,
                gc.survivor_code,
                gc.age_group,
                gc.gender,
                gc.incident_date,
                gc.incident_type,
                gc.location_type,
                gc.intake_date,
                gc.case_status,
                gc.risk_level,
                gc.counseling_sessions,
                gc.medical_referral,
                gc.legal_referral,
                gc.shelter_provided,
                gc.economic_support,
                gc.education_support,
                gc.last_contact_date,
                gc.next_followup_date,
                u.name as case_worker_name,
                pm.name as program_module_name
            FROM gbv_cases gc
            LEFT JOIN users u ON gc.case_worker_id = u.id
            LEFT JOIN program_modules pm ON gc.program_module_id = pm.id
            WHERE gc.deleted_at IS NULL
        `;

        const params = [];

        if (filters.program_module_id) {
            query += ` AND gc.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.case_status) {
            query += ` AND gc.case_status = ?`;
            params.push(filters.case_status);
        }

        if (filters.risk_level) {
            query += ` AND gc.risk_level = ?`;
            params.push(filters.risk_level);
        }

        if (filters.case_worker_id) {
            query += ` AND gc.case_worker_id = ?`;
            params.push(filters.case_worker_id);
        }

        // Non-admin users only see their own cases
        if (!user.is_system_admin) {
            query += ` AND gc.case_worker_id = ?`;
            params.push(user.id);
        }

        query += ` ORDER BY gc.intake_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get case by ID (full details - highly restricted)
     * @param {number} id - Case ID
     * @param {Object} user - Current user for access control
     * @returns {Promise<Object>} Case details
     */
    async getCaseById(id, user = null) {
        if (!user) {
            throw new Error('Authentication required');
        }

        const query = `
            SELECT
                gc.*,
                u.name as case_worker_name,
                pm.name as program_module_name,
                creator.name as created_by_name
            FROM gbv_cases gc
            LEFT JOIN users u ON gc.case_worker_id = u.id
            LEFT JOIN program_modules pm ON gc.program_module_id = pm.id
            LEFT JOIN users creator ON gc.created_by = creator.id
            WHERE gc.id = ? AND gc.deleted_at IS NULL
        `;

        const results = await this.db.query(query, [id]);
        const caseData = results[0];

        if (!caseData) {
            return null;
        }

        // Check access: only case worker or admin can view full details
        const hasAccess = user.is_system_admin ||
                         caseData.case_worker_id === user.id ||
                         caseData.created_by === user.id;

        if (!hasAccess) {
            throw new Error('You do not have permission to access this case');
        }

        return caseData;
    }

    /**
     * Create new GBV case
     * @param {Object} caseData - Case information
     * @param {Object} user - Current user
     * @returns {Promise<number>} New case ID
     */
    async createCase(caseData, user) {
        // Generate survivor code if not provided
        if (!caseData.survivor_code) {
            caseData.survivor_code = await this.generateSurvivorCode();
        }

        // Generate case number if not provided
        if (!caseData.case_number) {
            caseData.case_number = await this.generateCaseNumber();
        }

        // Validate required fields
        const required = ['age_group', 'gender', 'incident_type', 'intake_date'];
        for (const field of required) {
            if (!caseData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const query = `
            INSERT INTO gbv_cases (
                case_number, survivor_code, beneficiary_id, age_group, gender,
                incident_date, incident_type, incident_description, location_type,
                intake_date, case_status, risk_level,
                counseling_sessions, medical_referral, legal_referral,
                shelter_provided, economic_support, education_support,
                referred_to, referral_outcome, last_contact_date, next_followup_date,
                program_module_id, case_worker_id, created_by, notes,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            caseData.case_number,
            caseData.survivor_code,
            caseData.beneficiary_id || null,
            caseData.age_group,
            caseData.gender,
            caseData.incident_date || null,
            caseData.incident_type,
            caseData.incident_description || null,
            caseData.location_type || null,
            caseData.intake_date,
            caseData.case_status || 'open',
            caseData.risk_level || 'medium',
            caseData.counseling_sessions || 0,
            caseData.medical_referral || false,
            caseData.legal_referral || false,
            caseData.shelter_provided || false,
            caseData.economic_support || false,
            caseData.education_support || false,
            caseData.referred_to || null,
            caseData.referral_outcome || null,
            caseData.last_contact_date || null,
            caseData.next_followup_date || null,
            caseData.program_module_id || null,
            caseData.case_worker_id || user.id,
            user.id,
            caseData.notes || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update GBV case
     * @param {number} id - Case ID
     * @param {Object} updateData - Fields to update
     * @param {Object} user - Current user
     * @returns {Promise<boolean>} Success status
     */
    async updateCase(id, updateData, user) {
        // Verify access
        const existingCase = await this.getCaseById(id, user);
        if (!existingCase) {
            throw new Error('Case not found or access denied');
        }

        const allowedFields = [
            'case_status', 'risk_level', 'counseling_sessions',
            'medical_referral', 'legal_referral', 'shelter_provided',
            'economic_support', 'education_support', 'referred_to',
            'referral_outcome', 'last_contact_date', 'next_followup_date',
            'case_closure_date', 'closure_reason', 'notes'
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
            UPDATE gbv_cases
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Add case note (sensitive information)
     * @param {number} caseId - Case ID
     * @param {Object} noteData - Note information
     * @param {Object} user - Current user
     * @returns {Promise<number>} New note ID
     */
    async addCaseNote(caseId, noteData, user) {
        // Verify case access
        const existingCase = await this.getCaseById(caseId, user);
        if (!existingCase) {
            throw new Error('Case not found or access denied');
        }

        const query = `
            INSERT INTO gbv_case_notes (
                case_id, note_date, note_type, note_content,
                services_provided, next_action, next_contact_date,
                recorded_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            caseId,
            noteData.note_date || new Date().toISOString().split('T')[0],
            noteData.note_type,
            noteData.note_content,
            noteData.services_provided || null,
            noteData.next_action || null,
            noteData.next_contact_date || null,
            user.id
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Get case notes
     * @param {number} caseId - Case ID
     * @param {Object} user - Current user
     * @returns {Promise<Array>} List of notes
     */
    async getCaseNotes(caseId, user) {
        // Verify case access
        const existingCase = await this.getCaseById(caseId, user);
        if (!existingCase) {
            throw new Error('Case not found or access denied');
        }

        const query = `
            SELECT
                n.*,
                u.name as recorded_by_name
            FROM gbv_case_notes n
            LEFT JOIN users u ON n.recorded_by = u.id
            WHERE n.case_id = ? AND n.deleted_at IS NULL
            ORDER BY n.note_date DESC
        `;

        const results = await this.db.query(query, [caseId]);
        return results;
    }

    /**
     * Get GBV statistics
     * @param {Object} filters - Filter criteria
     * @param {Object} user - Current user
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}, user = null) {
        if (!user) {
            throw new Error('Authentication required');
        }

        let whereClause = 'WHERE gc.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND gc.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        // Non-admin users only see their own cases in stats
        if (!user.is_system_admin) {
            whereClause += ` AND gc.case_worker_id = ?`;
            params.push(user.id);
        }

        const query = `
            SELECT
                COUNT(DISTINCT gc.id) as total_cases,
                SUM(CASE WHEN gc.case_status = 'open' THEN 1 ELSE 0 END) as open_cases,
                SUM(CASE WHEN gc.case_status = 'ongoing_support' THEN 1 ELSE 0 END) as ongoing_cases,
                SUM(CASE WHEN gc.case_status = 'closed' THEN 1 ELSE 0 END) as closed_cases,
                SUM(CASE WHEN gc.risk_level = 'critical' THEN 1 ELSE 0 END) as critical_risk_cases,
                SUM(CASE WHEN gc.risk_level = 'high' THEN 1 ELSE 0 END) as high_risk_cases,
                SUM(CASE WHEN gc.medical_referral = 1 THEN 1 ELSE 0 END) as medical_referrals,
                SUM(CASE WHEN gc.legal_referral = 1 THEN 1 ELSE 0 END) as legal_referrals,
                SUM(CASE WHEN gc.shelter_provided = 1 THEN 1 ELSE 0 END) as shelter_provided_count,
                AVG(gc.counseling_sessions) as avg_counseling_sessions
            FROM gbv_cases gc
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }

    /**
     * Generate unique survivor code (anonymous identifier)
     * @returns {Promise<string>} Survivor code
     */
    async generateSurvivorCode() {
        const prefix = 'SV';
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        return `${prefix}-${timestamp}-${random}`;
    }

    /**
     * Generate unique case number
     * @returns {Promise<string>} Case number
     */
    async generateCaseNumber() {
        const prefix = 'GBV';
        const year = new Date().getFullYear();
        const timestamp = Date.now().toString().slice(-6);

        return `${prefix}-${year}-${timestamp}`;
    }

    /**
     * Soft delete case (restricted to admin only)
     * @param {number} id - Case ID
     * @param {Object} user - Current user
     * @returns {Promise<boolean>} Success status
     */
    async deleteCase(id, user) {
        if (!user.is_system_admin) {
            throw new Error('Only system administrators can delete GBV cases');
        }

        const query = `
            UPDATE gbv_cases
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }
}

module.exports = GBVService;
