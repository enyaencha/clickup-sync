/**
 * Self-Help Groups (SHG) Service
 * Manages SHG groups, members, meetings, and activities
 */

class SHGService {
    constructor(db) {
        this.db = db;
    }

    // ==================== SHG GROUPS ====================

    /**
     * Get all SHG groups with optional filtering
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of SHG groups
     */
    async getGroups(filters = {}) {
        let query = `
            SELECT
                sg.*,
                u.full_name as facilitator_name,
                pm.name as program_module_name,
                b1.first_name as chairperson_first_name,
                b1.last_name as chairperson_last_name,
                b2.first_name as secretary_first_name,
                b2.last_name as secretary_last_name,
                b3.first_name as treasurer_first_name,
                b3.last_name as treasurer_last_name
            FROM shg_groups sg
            LEFT JOIN users u ON sg.facilitator_id = u.id
            LEFT JOIN program_modules pm ON sg.program_module_id = pm.id
            LEFT JOIN beneficiaries b1 ON sg.chairperson_id = b1.id
            LEFT JOIN beneficiaries b2 ON sg.secretary_id = b2.id
            LEFT JOIN beneficiaries b3 ON sg.treasurer_id = b3.id
            WHERE sg.deleted_at IS NULL
        `;

        const params = [];

        if (filters.program_module_id) {
            query += ` AND sg.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        if (filters.status) {
            query += ` AND sg.status = ?`;
            params.push(filters.status);
        }

        if (filters.registration_status) {
            query += ` AND sg.registration_status = ?`;
            params.push(filters.registration_status);
        }

        if (filters.county) {
            query += ` AND sg.county = ?`;
            params.push(filters.county);
        }

        if (filters.search) {
            query += ` AND (sg.group_name LIKE ? OR sg.group_code LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ` ORDER BY sg.formation_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get SHG group by ID with detailed information
     * @param {number} id - Group ID
     * @returns {Promise<Object>} Group details
     */
    async getGroupById(id) {
        const query = `
            SELECT
                sg.*,
                u.full_name as facilitator_name,
                pm.name as program_module_name,
                COUNT(DISTINCT sm.id) as actual_members_count,
                COUNT(DISTINCT l.id) as total_loans_count,
                SUM(CASE WHEN l.loan_status IN ('active', 'disbursed') THEN 1 ELSE 0 END) as active_loans_count
            FROM shg_groups sg
            LEFT JOIN users u ON sg.facilitator_id = u.id
            LEFT JOIN program_modules pm ON sg.program_module_id = pm.id
            LEFT JOIN shg_members sm ON sg.id = sm.shg_group_id AND sm.membership_status = 'active'
            LEFT JOIN loans l ON sg.id = l.shg_group_id
            WHERE sg.id = ? AND sg.deleted_at IS NULL
            GROUP BY sg.id
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create a new SHG group
     * @param {Object} groupData - Group information
     * @returns {Promise<number>} New group ID
     */
    async createGroup(groupData) {
        // Generate group code if not provided
        if (!groupData.group_code) {
            groupData.group_code = await this.generateGroupCode(groupData.program_module_id);
        }

        // Validate required fields
        const required = ['group_name', 'program_module_id', 'formation_date'];
        for (const field of required) {
            if (!groupData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const query = `
            INSERT INTO shg_groups (
                group_code, group_name, program_module_id, formation_date,
                registration_status, registration_number, registration_authority,
                county, sub_county, ward, village, meeting_venue,
                gps_latitude, gps_longitude, meeting_frequency, meeting_day,
                share_value, loan_interest_rate, facilitator_id, status, notes,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            groupData.group_code,
            groupData.group_name,
            groupData.program_module_id,
            groupData.formation_date,
            groupData.registration_status || 'forming',
            groupData.registration_number || null,
            groupData.registration_authority || null,
            groupData.county || null,
            groupData.sub_county || null,
            groupData.ward || null,
            groupData.village || null,
            groupData.meeting_venue || null,
            groupData.gps_latitude || null,
            groupData.gps_longitude || null,
            groupData.meeting_frequency || 'monthly',
            groupData.meeting_day || null,
            groupData.share_value || 0,
            groupData.loan_interest_rate || 10.00,
            groupData.facilitator_id || null,
            groupData.status || 'active',
            groupData.notes || null
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Update SHG group
     * @param {number} id - Group ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateGroup(id, updateData) {
        const allowedFields = [
            'group_name', 'registration_status', 'registration_number', 'registration_authority',
            'county', 'sub_county', 'ward', 'village', 'meeting_venue',
            'gps_latitude', 'gps_longitude', 'meeting_frequency', 'meeting_day',
            'last_meeting_date', 'share_value', 'loan_interest_rate',
            'chairperson_id', 'secretary_id', 'treasurer_id', 'facilitator_id', 'status', 'notes'
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
            UPDATE shg_groups
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);
        return true;
    }

    /**
     * Delete SHG group (soft delete)
     * @param {number} id - Group ID
     * @returns {Promise<boolean>} Success status
     */
    async deleteGroup(id) {
        const query = `
            UPDATE shg_groups
            SET deleted_at = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);
        return true;
    }

    /**
     * Generate unique group code
     * @param {number} programModuleId - Program module ID
     * @returns {Promise<string>} Group code
     */
    async generateGroupCode(programModuleId) {
        const prefix = programModuleId ? `SHG${programModuleId}` : 'SHG';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

        return `${prefix}-${timestamp}${random}`;
    }

    // ==================== SHG MEMBERS ====================

    /**
     * Get members of an SHG group
     * @param {number} groupId - Group ID
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} List of members
     */
    async getGroupMembers(groupId, filters = {}) {
        let query = `
            SELECT
                sm.*,
                b.first_name, b.middle_name, b.last_name,
                b.gender, b.age, b.phone_number,
                b.disability_status,
                COUNT(DISTINCT l.id) as total_loans,
                SUM(CASE WHEN l.loan_status IN ('active', 'disbursed') THEN 1 ELSE 0 END) as active_loans
            FROM shg_members sm
            INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
            LEFT JOIN loans l ON sm.beneficiary_id = l.beneficiary_id AND sm.shg_group_id = l.shg_group_id
            WHERE sm.shg_group_id = ? AND sm.deleted_at IS NULL
        `;

        const params = [groupId];

        if (filters.membership_status) {
            query += ` AND sm.membership_status = ?`;
            params.push(filters.membership_status);
        }

        if (filters.position) {
            query += ` AND sm.position = ?`;
            params.push(filters.position);
        }

        query += ` GROUP BY sm.id ORDER BY sm.join_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Add member to SHG group
     * @param {Object} memberData - Member information
     * @returns {Promise<number>} New member ID
     */
    async addMember(memberData) {
        // Validate required fields
        const required = ['shg_group_id', 'beneficiary_id', 'join_date'];
        for (const field of required) {
            if (!memberData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Check if beneficiary is already a member
        const existing = await this.db.query(
            'SELECT id FROM shg_members WHERE shg_group_id = ? AND beneficiary_id = ? AND deleted_at IS NULL',
            [memberData.shg_group_id, memberData.beneficiary_id]
        );

        if (existing.length > 0) {
            throw new Error('Beneficiary is already a member of this group');
        }

        const query = `
            INSERT INTO shg_members (
                shg_group_id, beneficiary_id, join_date, membership_status,
                position, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            memberData.shg_group_id,
            memberData.beneficiary_id,
            memberData.join_date,
            memberData.membership_status || 'active',
            memberData.position || 'member',
            memberData.notes || null
        ];

        const result = await this.db.query(query, params);

        // Update group member counts
        await this.updateGroupMemberCounts(memberData.shg_group_id);

        return result.insertId;
    }

    /**
     * Update SHG member
     * @param {number} id - Member ID
     * @param {Object} updateData - Fields to update
     * @returns {Promise<boolean>} Success status
     */
    async updateMember(id, updateData) {
        const allowedFields = [
            'membership_status', 'exit_date', 'exit_reason', 'position',
            'total_savings', 'total_shares', 'current_loan_balance',
            'trainings_attended', 'last_training_date', 'notes'
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
            UPDATE shg_members
            SET ${updates.join(', ')}
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, params);

        // Get group ID to update counts
        const member = await this.db.query('SELECT shg_group_id FROM shg_members WHERE id = ?', [id]);
        if (member[0]) {
            await this.updateGroupMemberCounts(member[0].shg_group_id);
        }

        return true;
    }

    /**
     * Remove member from group (soft delete)
     * @param {number} id - Member ID
     * @returns {Promise<boolean>} Success status
     */
    async removeMember(id) {
        // Get member details first
        const member = await this.db.query(
            'SELECT shg_group_id, membership_status FROM shg_members WHERE id = ? AND deleted_at IS NULL',
            [id]
        );

        if (member.length === 0) {
            throw new Error('Member not found');
        }

        const query = `
            UPDATE shg_members
            SET deleted_at = NOW(), membership_status = 'exited', exit_date = NOW()
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [id]);

        // Update group member counts
        await this.updateGroupMemberCounts(member[0].shg_group_id);

        return true;
    }

    /**
     * Update group member counts based on current members
     * @param {number} groupId - Group ID
     * @returns {Promise<void>}
     */
    async updateGroupMemberCounts(groupId) {
        const query = `
            UPDATE shg_groups sg
            SET
                total_members = (
                    SELECT COUNT(*) FROM shg_members sm
                    INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
                    WHERE sm.shg_group_id = sg.id
                    AND sm.membership_status = 'active'
                    AND sm.deleted_at IS NULL
                ),
                male_members = (
                    SELECT COUNT(*) FROM shg_members sm
                    INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
                    WHERE sm.shg_group_id = sg.id
                    AND sm.membership_status = 'active'
                    AND b.gender = 'male'
                    AND sm.deleted_at IS NULL
                ),
                female_members = (
                    SELECT COUNT(*) FROM shg_members sm
                    INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
                    WHERE sm.shg_group_id = sg.id
                    AND sm.membership_status = 'active'
                    AND b.gender = 'female'
                    AND sm.deleted_at IS NULL
                ),
                youth_members = (
                    SELECT COUNT(*) FROM shg_members sm
                    INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
                    WHERE sm.shg_group_id = sg.id
                    AND sm.membership_status = 'active'
                    AND b.age < 35
                    AND sm.deleted_at IS NULL
                ),
                pwd_members = (
                    SELECT COUNT(*) FROM shg_members sm
                    INNER JOIN beneficiaries b ON sm.beneficiary_id = b.id
                    WHERE sm.shg_group_id = sg.id
                    AND sm.membership_status = 'active'
                    AND b.disability_status != 'none'
                    AND sm.deleted_at IS NULL
                )
            WHERE sg.id = ?
        `;

        await this.db.query(query, [groupId]);
    }

    // ==================== SHG MEETINGS ====================

    /**
     * Get meetings for an SHG group
     * @param {number} groupId - Group ID
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} List of meetings
     */
    async getMeetings(groupId, filters = {}) {
        let query = `
            SELECT
                m.*,
                u.full_name as facilitator_name,
                r.full_name as recorded_by_name
            FROM shg_meetings m
            LEFT JOIN users u ON m.facilitator_id = u.id
            LEFT JOIN users r ON m.recorded_by = r.id
            WHERE m.shg_group_id = ? AND m.deleted_at IS NULL
        `;

        const params = [groupId];

        if (filters.meeting_type) {
            query += ` AND m.meeting_type = ?`;
            params.push(filters.meeting_type);
        }

        if (filters.from_date) {
            query += ` AND m.meeting_date >= ?`;
            params.push(filters.from_date);
        }

        if (filters.to_date) {
            query += ` AND m.meeting_date <= ?`;
            params.push(filters.to_date);
        }

        query += ` ORDER BY m.meeting_date DESC`;

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Create a new meeting record
     * @param {Object} meetingData - Meeting information
     * @returns {Promise<number>} New meeting ID
     */
    async createMeeting(meetingData) {
        // Validate required fields
        const required = ['shg_group_id', 'meeting_date', 'meeting_type'];
        for (const field of required) {
            if (!meetingData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const query = `
            INSERT INTO shg_meetings (
                shg_group_id, meeting_date, meeting_type, venue, facilitator_id,
                total_members, members_present, attendance_percentage,
                savings_collected, loans_disbursed, loan_repayments, fines_collected,
                agenda, resolutions, challenges, next_meeting_date,
                minutes_document_url, recorded_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            meetingData.shg_group_id,
            meetingData.meeting_date,
            meetingData.meeting_type,
            meetingData.venue || null,
            meetingData.facilitator_id || null,
            meetingData.total_members || 0,
            meetingData.members_present || 0,
            meetingData.attendance_percentage || 0,
            meetingData.savings_collected || 0,
            meetingData.loans_disbursed || 0,
            meetingData.loan_repayments || 0,
            meetingData.fines_collected || 0,
            meetingData.agenda || null,
            meetingData.resolutions || null,
            meetingData.challenges || null,
            meetingData.next_meeting_date || null,
            meetingData.minutes_document_url || null,
            meetingData.recorded_by || null
        ];

        const result = await this.db.query(query, params);

        // Update last_meeting_date in shg_groups
        await this.db.query(
            'UPDATE shg_groups SET last_meeting_date = ? WHERE id = ?',
            [meetingData.meeting_date, meetingData.shg_group_id]
        );

        return result.insertId;
    }

    /**
     * Get SHG statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}) {
        let whereClause = 'WHERE sg.deleted_at IS NULL';
        const params = [];

        if (filters.program_module_id) {
            whereClause += ` AND sg.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        const query = `
            SELECT
                COUNT(DISTINCT sg.id) as total_groups,
                SUM(CASE WHEN sg.status = 'active' THEN 1 ELSE 0 END) as active_groups,
                SUM(sg.total_members) as total_members,
                SUM(sg.male_members) as total_male_members,
                SUM(sg.female_members) as total_female_members,
                SUM(sg.total_savings) as total_savings,
                SUM(sg.total_loans_disbursed) as total_loans_disbursed,
                SUM(sg.total_loans_outstanding) as total_loans_outstanding
            FROM shg_groups sg
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }
}

module.exports = SHGService;
