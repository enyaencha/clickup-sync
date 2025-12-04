/**
 * Loans Service
 * Manages microfinance loans, repayments, and related financial tracking
 */

class LoansService {
    constructor(db) {
        this.db = db;
    }

    // ==================== LOANS ====================

    /**
     * Get all loans with optional filtering
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of loans
     */
    async getLoans(filters = {}) {
        let query = `
            SELECT
                l.*,
                sg.group_name,
                sg.group_code,
                b.first_name,
                b.last_name,
                b.phone_number,
                g1.first_name as guarantor1_first_name,
                g1.last_name as guarantor1_last_name,
                g2.first_name as guarantor2_first_name,
                g2.last_name as guarantor2_last_name,
                u1.name as approved_by_name,
                u2.name as disbursed_by_name
            FROM loans l
            INNER JOIN shg_groups sg ON l.shg_group_id = sg.id
            INNER JOIN beneficiaries b ON l.beneficiary_id = b.id
            LEFT JOIN shg_members sm1 ON l.guarantor1_id = sm1.id
            LEFT JOIN beneficiaries g1 ON sm1.beneficiary_id = g1.id
            LEFT JOIN shg_members sm2 ON l.guarantor2_id = sm2.id
            LEFT JOIN beneficiaries g2 ON sm2.beneficiary_id = g2.id
            LEFT JOIN users u1 ON l.approved_by = u1.id
            LEFT JOIN users u2 ON l.disbursed_by = u2.id
            WHERE l.deleted_at IS NULL
        `;

        const params = [];

        if (filters.shg_group_id) {
            query += ` AND l.shg_group_id = ?`;
            params.push(filters.shg_group_id);
        }

        if (filters.beneficiary_id) {
            query += ` AND l.beneficiary_id = ?`;
            params.push(filters.beneficiary_id);
        }

        if (filters.loan_status) {
            query += ` AND l.loan_status = ?`;
            params.push(filters.loan_status);
        }

        if (filters.repayment_status) {
            query += ` AND l.repayment_status = ?`;
            params.push(filters.repayment_status);
        }

        if (filters.loan_type) {
            query += ` AND l.loan_type = ?`;
            params.push(filters.loan_type);
        }

        if (filters.overdue) {
            query += ` AND l.repayment_status = 'overdue'`;
        }

        query += ` ORDER BY l.application_date DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        const results = await this.db.query(query, params);
        return results;
    }

    /**
     * Get loan by ID with full details
     * @param {number} id - Loan ID
     * @returns {Promise<Object>} Loan details
     */
    async getLoanById(id) {
        const query = `
            SELECT
                l.*,
                sg.group_name,
                sg.group_code,
                b.first_name,
                b.last_name,
                b.phone_number,
                b.id_number,
                COUNT(DISTINCT lr.id) as repayment_count,
                SUM(lr.amount_paid) as total_repaid
            FROM loans l
            INNER JOIN shg_groups sg ON l.shg_group_id = sg.id
            INNER JOIN beneficiaries b ON l.beneficiary_id = b.id
            LEFT JOIN loan_repayments lr ON l.id = lr.loan_id
            WHERE l.id = ? AND l.deleted_at IS NULL
            GROUP BY l.id
        `;

        const results = await this.db.query(query, [id]);
        return results[0];
    }

    /**
     * Create a new loan
     * @param {Object} loanData - Loan information
     * @returns {Promise<number>} New loan ID
     */
    async createLoan(loanData) {
        // Generate loan number if not provided
        if (!loanData.loan_number) {
            loanData.loan_number = await this.generateLoanNumber(loanData.shg_group_id);
        }

        // Validate required fields
        const required = ['shg_group_id', 'member_id', 'beneficiary_id', 'loan_amount',
                         'interest_rate', 'loan_tenure_months', 'application_date', 'loan_purpose'];
        for (const field of required) {
            if (!loanData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Calculate loan financials
        const calculations = this.calculateLoanFinancials(
            loanData.loan_amount,
            loanData.interest_rate,
            loanData.loan_tenure_months
        );

        const query = `
            INSERT INTO loans (
                loan_number, shg_group_id, member_id, beneficiary_id,
                loan_type, loan_amount, interest_rate, loan_tenure_months,
                repayment_frequency, application_date, loan_purpose,
                business_plan_url, total_interest, total_repayable, outstanding_balance,
                guarantor1_id, guarantor2_id, loan_status, repayment_status,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            loanData.loan_number,
            loanData.shg_group_id,
            loanData.member_id,
            loanData.beneficiary_id,
            loanData.loan_type || 'individual_loan',
            loanData.loan_amount,
            loanData.interest_rate,
            loanData.loan_tenure_months,
            loanData.repayment_frequency || 'monthly',
            loanData.application_date,
            loanData.loan_purpose,
            loanData.business_plan_url || null,
            calculations.total_interest,
            calculations.total_repayable,
            calculations.total_repayable, // Initially, outstanding = total_repayable
            loanData.guarantor1_id || null,
            loanData.guarantor2_id || null,
            'pending', // Initial status
            'on_track', // Initial repayment status
        ];

        const result = await this.db.query(query, params);
        return result.insertId;
    }

    /**
     * Approve a loan
     * @param {number} id - Loan ID
     * @param {number} approvedBy - User ID approving the loan
     * @returns {Promise<boolean>} Success status
     */
    async approveLoan(id, approvedBy) {
        const query = `
            UPDATE loans
            SET
                loan_status = 'approved',
                approval_date = NOW(),
                approved_by = ?
            WHERE id = ? AND loan_status = 'pending' AND deleted_at IS NULL
        `;

        await this.db.query(query, [approvedBy, id]);
        return true;
    }

    /**
     * Disburse a loan
     * @param {number} id - Loan ID
     * @param {number} disbursedBy - User ID disbursing the loan
     * @param {string} disbursementDate - Disbursement date
     * @returns {Promise<boolean>} Success status
     */
    async disburseLoan(id, disbursedBy, disbursementDate = null) {
        const loan = await this.getLoanById(id);

        if (!loan) {
            throw new Error('Loan not found');
        }

        if (loan.loan_status !== 'approved') {
            throw new Error('Loan must be approved before disbursement');
        }

        // Calculate expected completion date
        const disburseDate = disbursementDate ? new Date(disbursementDate) : new Date();
        const completionDate = new Date(disburseDate);
        completionDate.setMonth(completionDate.getMonth() + loan.loan_tenure_months);

        const query = `
            UPDATE loans
            SET
                loan_status = 'disbursed',
                disbursement_date = ?,
                expected_completion_date = ?,
                disbursed_by = ?
            WHERE id = ? AND deleted_at IS NULL
        `;

        await this.db.query(query, [
            disbursementDate || new Date(),
            completionDate,
            disbursedBy,
            id
        ]);

        // Update group total loans disbursed
        await this.updateGroupLoanTotals(loan.shg_group_id);

        // Update member loan stats
        await this.updateMemberLoanStats(loan.member_id);

        return true;
    }

    /**
     * Record loan repayment
     * @param {number} loanId - Loan ID
     * @param {Object} repaymentData - Repayment information
     * @returns {Promise<number>} New repayment ID
     */
    async recordRepayment(loanId, repaymentData) {
        const loan = await this.getLoanById(loanId);

        if (!loan) {
            throw new Error('Loan not found');
        }

        if (!['disbursed', 'active'].includes(loan.loan_status)) {
            throw new Error('Cannot record repayment for loan with status: ' + loan.loan_status);
        }

        // Validate required fields
        const required = ['repayment_date', 'amount_paid', 'principal_paid', 'interest_paid'];
        for (const field of required) {
            if (repaymentData[field] === undefined) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Create repayment record
        const query = `
            INSERT INTO loan_repayments (
                loan_id, repayment_date, amount_paid, principal_paid,
                interest_paid, penalty_paid, payment_method, payment_reference,
                receipt_number, recorded_by, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        const params = [
            loanId,
            repaymentData.repayment_date,
            repaymentData.amount_paid,
            repaymentData.principal_paid,
            repaymentData.interest_paid,
            repaymentData.penalty_paid || 0,
            repaymentData.payment_method || 'cash',
            repaymentData.payment_reference || null,
            repaymentData.receipt_number || null,
            repaymentData.recorded_by || null,
            repaymentData.notes || null
        ];

        const result = await this.db.query(query, params);

        // Update loan totals
        await this.updateLoanRepaymentTotals(loanId);

        // Update group totals
        await this.updateGroupLoanTotals(loan.shg_group_id);

        // Update member loan stats
        await this.updateMemberLoanStats(loan.member_id);

        return result.insertId;
    }

    /**
     * Update loan repayment totals and status
     * @param {number} loanId - Loan ID
     * @returns {Promise<void>}
     */
    async updateLoanRepaymentTotals(loanId) {
        // Get total repayments
        const totals = await this.db.query(`
            SELECT
                SUM(amount_paid) as total_repaid,
                SUM(principal_paid) as total_principal,
                SUM(interest_paid) as total_interest
            FROM loan_repayments
            WHERE loan_id = ? AND deleted_at IS NULL
        `, [loanId]);

        const totalRepaid = totals[0].total_repaid || 0;

        // Get loan details
        const loan = await this.getLoanById(loanId);
        const outstandingBalance = loan.total_repayable - totalRepaid;

        // Determine loan status
        let loanStatus = loan.loan_status;
        let repaymentStatus = loan.repayment_status;

        if (outstandingBalance <= 0) {
            loanStatus = 'completed';
            repaymentStatus = 'completed';
        } else if (loan.expected_completion_date) {
            const today = new Date();
            const expectedDate = new Date(loan.expected_completion_date);
            const daysOverdue = Math.floor((today - expectedDate) / (1000 * 60 * 60 * 24));

            if (daysOverdue > 0) {
                repaymentStatus = 'overdue';
                if (daysOverdue > 90) {
                    repaymentStatus = 'defaulted';
                }
            } else {
                repaymentStatus = 'on_track';
            }
        }

        // Update loan
        const updateQuery = `
            UPDATE loans
            SET
                amount_repaid = ?,
                outstanding_balance = ?,
                loan_status = ?,
                repayment_status = ?,
                actual_completion_date = CASE WHEN ? <= 0 THEN NOW() ELSE actual_completion_date END
            WHERE id = ?
        `;

        await this.db.query(updateQuery, [
            totalRepaid,
            outstandingBalance,
            loanStatus,
            repaymentStatus,
            outstandingBalance,
            loanId
        ]);
    }

    /**
     * Update group loan totals
     * @param {number} groupId - Group ID
     * @returns {Promise<void>}
     */
    async updateGroupLoanTotals(groupId) {
        const query = `
            UPDATE shg_groups sg
            SET
                total_loans_disbursed = (
                    SELECT COALESCE(SUM(loan_amount), 0)
                    FROM loans
                    WHERE shg_group_id = sg.id
                    AND loan_status IN ('disbursed', 'active', 'completed')
                    AND deleted_at IS NULL
                ),
                total_loans_outstanding = (
                    SELECT COALESCE(SUM(outstanding_balance), 0)
                    FROM loans
                    WHERE shg_group_id = sg.id
                    AND loan_status IN ('disbursed', 'active')
                    AND deleted_at IS NULL
                )
            WHERE sg.id = ?
        `;

        await this.db.query(query, [groupId]);
    }

    /**
     * Update member loan statistics
     * @param {number} memberId - Member ID
     * @returns {Promise<void>}
     */
    async updateMemberLoanStats(memberId) {
        const query = `
            UPDATE shg_members sm
            SET
                loans_taken = (
                    SELECT COUNT(*)
                    FROM loans
                    WHERE member_id = sm.id
                    AND loan_status IN ('disbursed', 'active', 'completed')
                    AND deleted_at IS NULL
                ),
                loans_repaid = (
                    SELECT COUNT(*)
                    FROM loans
                    WHERE member_id = sm.id
                    AND loan_status = 'completed'
                    AND deleted_at IS NULL
                ),
                current_loan_balance = (
                    SELECT COALESCE(SUM(outstanding_balance), 0)
                    FROM loans
                    WHERE member_id = sm.id
                    AND loan_status IN ('disbursed', 'active')
                    AND deleted_at IS NULL
                )
            WHERE sm.id = ?
        `;

        await this.db.query(query, [memberId]);
    }

    /**
     * Calculate loan financials (simple interest)
     * @param {number} principal - Loan amount
     * @param {number} interestRate - Annual interest rate (percentage)
     * @param {number} tenureMonths - Loan tenure in months
     * @returns {Object} Calculated financials
     */
    calculateLoanFinancials(principal, interestRate, tenureMonths) {
        const totalInterest = (principal * interestRate * tenureMonths) / (12 * 100);
        const totalRepayable = principal + totalInterest;
        const monthlyPayment = totalRepayable / tenureMonths;

        return {
            total_interest: parseFloat(totalInterest.toFixed(2)),
            total_repayable: parseFloat(totalRepayable.toFixed(2)),
            monthly_payment: parseFloat(monthlyPayment.toFixed(2))
        };
    }

    /**
     * Generate unique loan number
     * @param {number} groupId - Group ID
     * @returns {Promise<string>} Loan number
     */
    async generateLoanNumber(groupId) {
        const prefix = `LN${groupId}`;
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

        return `${prefix}-${timestamp}${random}`;
    }

    /**
     * Get loan repayments
     * @param {number} loanId - Loan ID
     * @returns {Promise<Array>} List of repayments
     */
    async getLoanRepayments(loanId) {
        const query = `
            SELECT
                lr.*,
                u.name as recorded_by_name
            FROM loan_repayments lr
            LEFT JOIN users u ON lr.recorded_by = u.id
            WHERE lr.loan_id = ? AND lr.deleted_at IS NULL
            ORDER BY lr.repayment_date DESC
        `;

        const results = await this.db.query(query, [loanId]);
        return results;
    }

    /**
     * Get loans statistics
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Object>} Statistics
     */
    async getStatistics(filters = {}) {
        let whereClause = 'WHERE l.deleted_at IS NULL';
        const params = [];

        if (filters.shg_group_id) {
            whereClause += ` AND l.shg_group_id = ?`;
            params.push(filters.shg_group_id);
        }

        if (filters.program_module_id) {
            whereClause += ` AND sg.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        const query = `
            SELECT
                COUNT(DISTINCT l.id) as total_loans,
                SUM(CASE WHEN l.loan_status = 'pending' THEN 1 ELSE 0 END) as pending_loans,
                SUM(CASE WHEN l.loan_status = 'approved' THEN 1 ELSE 0 END) as approved_loans,
                SUM(CASE WHEN l.loan_status IN ('disbursed', 'active') THEN 1 ELSE 0 END) as active_loans,
                SUM(CASE WHEN l.loan_status = 'completed' THEN 1 ELSE 0 END) as completed_loans,
                SUM(CASE WHEN l.repayment_status = 'overdue' THEN 1 ELSE 0 END) as overdue_loans,
                SUM(CASE WHEN l.repayment_status = 'defaulted' THEN 1 ELSE 0 END) as defaulted_loans,
                COALESCE(SUM(CASE WHEN l.loan_status IN ('disbursed', 'active', 'completed') THEN l.loan_amount ELSE 0 END), 0) as total_disbursed,
                COALESCE(SUM(l.amount_repaid), 0) as total_repaid,
                COALESCE(SUM(CASE WHEN l.loan_status IN ('disbursed', 'active') THEN l.outstanding_balance ELSE 0 END), 0) as total_outstanding
            FROM loans l
            INNER JOIN shg_groups sg ON l.shg_group_id = sg.id
            ${whereClause}
        `;

        const results = await this.db.query(query, params);
        return results[0];
    }

    /**
     * Get overdue loans report
     * @param {Object} filters - Filter criteria
     * @returns {Promise<Array>} List of overdue loans
     */
    async getOverdueLoans(filters = {}) {
        let query = `
            SELECT
                l.*,
                sg.group_name,
                b.first_name,
                b.last_name,
                b.phone_number,
                DATEDIFF(NOW(), l.expected_completion_date) as days_overdue
            FROM loans l
            INNER JOIN shg_groups sg ON l.shg_group_id = sg.id
            INNER JOIN beneficiaries b ON l.beneficiary_id = b.id
            WHERE l.repayment_status IN ('overdue', 'defaulted')
            AND l.deleted_at IS NULL
        `;

        const params = [];

        if (filters.shg_group_id) {
            query += ` AND l.shg_group_id = ?`;
            params.push(filters.shg_group_id);
        }

        if (filters.program_module_id) {
            query += ` AND sg.program_module_id = ?`;
            params.push(filters.program_module_id);
        }

        query += ` ORDER BY days_overdue DESC`;

        const results = await this.db.query(query, params);
        return results;
    }
}

module.exports = LoansService;
