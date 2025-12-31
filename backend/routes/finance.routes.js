/**
 * Finance Management API Routes
 * Endpoints for managing budgets, transactions, and approvals
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // ==================== BUDGET SUMMARY ====================

    /**
     * GET /api/finance/budget-summary
     * Get budget summary for all programs
     */
    router.get('/budget-summary', async (req, res) => {
        try {
            const query = `
                SELECT
                    pb.program_module_id,
                    pm.name as program_name,
                    SUM(pb.total_budget) as total_budget,
                    SUM(pb.allocated_budget) as allocated_budget,
                    SUM(pb.spent_budget) as spent_budget,
                    SUM(pb.committed_budget) as committed_budget,
                    SUM(pb.total_budget - pb.spent_budget - pb.committed_budget) as remaining_budget
                FROM program_budgets pb
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                WHERE pb.deleted_at IS NULL
                AND pb.status IN ('approved', 'active')
                GROUP BY pb.program_module_id, pm.name
                ORDER BY pm.name
            `;

            const results = await db.query(query);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching budget summary:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch budget summary'
            });
        }
    });

    // ==================== BUDGETS ====================

    /**
     * GET /api/finance/budgets
     * Get all program budgets with optional filtering
     */
    router.get('/budgets', async (req, res) => {
        try {
            const {
                program_module_id,
                fiscal_year,
                status
            } = req.query;

            // Safely parse limit and offset with defaults
            const limit = Math.max(1, parseInt(req.query.limit) || 50);
            const offset = Math.max(0, parseInt(req.query.offset) || 0);

            let query = `
                SELECT
                    pb.*,
                    pm.name as program_module_name,
                    p.name as sub_program_name,
                    u1.full_name as submitted_by_name,
                    u2.full_name as approved_by_name
                FROM program_budgets pb
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                LEFT JOIN programs p ON pb.sub_program_id = p.id
                LEFT JOIN users u1 ON pb.submitted_by = u1.id
                LEFT JOIN users u2 ON pb.approved_by = u2.id
                WHERE pb.deleted_at IS NULL
            `;

            const params = [];

            if (program_module_id) {
                query += ` AND pb.program_module_id = ?`;
                params.push(program_module_id);
            }

            if (fiscal_year) {
                query += ` AND pb.fiscal_year = ?`;
                params.push(fiscal_year);
            }

            if (status) {
                query += ` AND pb.status = ?`;
                params.push(status);
            }

            query += ` ORDER BY pb.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching budgets:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch budgets'
            });
        }
    });

    /**
     * POST /api/finance/budgets
     * Create a new program budget
     */
    router.post('/budgets', async (req, res) => {
        try {
            const {
                program_module_id,
                sub_program_id,
                fiscal_year,
                total_budget,
                operational_budget,
                program_budget,
                capital_budget,
                donor,
                funding_source,
                grant_number,
                budget_start_date,
                budget_end_date,
                notes
            } = req.body;

            // Convert sub_program_id to null if not provided or invalid
            let subProgramId = sub_program_id && parseInt(sub_program_id) > 0
                ? parseInt(sub_program_id)
                : null;

            // Validate that sub_program_id exists if provided
            if (subProgramId) {
                const checkSubProgram = await db.query(
                    'SELECT id FROM programs WHERE id = ? AND deleted_at IS NULL',
                    [subProgramId]
                );

                if (checkSubProgram.length === 0) {
                    // Sub-program doesn't exist, set to null instead of failing
                    console.warn(`Sub-program ID ${subProgramId} not found, setting to null`);
                    subProgramId = null;
                }
            }

            const query = `
                INSERT INTO program_budgets (
                    program_module_id, sub_program_id, fiscal_year,
                    total_budget, operational_budget, program_budget, capital_budget,
                    donor, funding_source, grant_number,
                    budget_start_date, budget_end_date,
                    status, submitted_by, submitted_at, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', ?, NOW(), ?)
            `;

            const result = await db.query(query, [
                program_module_id, subProgramId, fiscal_year,
                total_budget, operational_budget, program_budget, capital_budget,
                donor, funding_source, grant_number,
                budget_start_date, budget_end_date,
                req.user.id, notes
            ]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId },
                message: 'Budget created successfully'
            });
        } catch (error) {
            console.error('Error creating budget:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create budget'
            });
        }
    });

    // ==================== TRANSACTIONS ====================

    /**
     * GET /api/finance/transactions
     * Get all financial transactions with optional filtering
     */
    router.get('/transactions', async (req, res) => {
        try {
            const {
                program_budget_id,
                approval_status,
                verification_status,
                start_date,
                end_date
            } = req.query;

            // Safely parse limit and offset with defaults
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const offset = Math.max(0, parseInt(req.query.offset) || 0);

            let query = `
                SELECT
                    ft.*,
                    pb.fiscal_year,
                    pm.name as program_module_name,
                    u1.full_name as requested_by_name,
                    u2.full_name as approved_by_name,
                    u3.full_name as verified_by_name
                FROM financial_transactions ft
                LEFT JOIN program_budgets pb ON ft.program_budget_id = pb.id
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                LEFT JOIN users u1 ON ft.requested_by = u1.id
                LEFT JOIN users u2 ON ft.approved_by = u2.id
                LEFT JOIN users u3 ON ft.verified_by = u3.id
                WHERE ft.deleted_at IS NULL
            `;

            const params = [];

            if (program_budget_id) {
                query += ` AND ft.program_budget_id = ?`;
                params.push(program_budget_id);
            }

            if (approval_status) {
                query += ` AND ft.approval_status = ?`;
                params.push(approval_status);
            }

            if (verification_status) {
                query += ` AND ft.verification_status = ?`;
                params.push(verification_status);
            }

            if (start_date) {
                query += ` AND ft.transaction_date >= ?`;
                params.push(start_date);
            }

            if (end_date) {
                query += ` AND ft.transaction_date <= ?`;
                params.push(end_date);
            }

            query += ` ORDER BY ft.transaction_date DESC, ft.created_at DESC LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching transactions:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch transactions'
            });
        }
    });

    /**
     * POST /api/finance/transactions
     * Record a new financial transaction
     */
    router.post('/transactions', async (req, res) => {
        try {
            const {
                program_budget_id,
                component_budget_id,
                activity_id,
                transaction_date,
                transaction_type,
                amount,
                expense_category,
                expense_subcategory,
                budget_line,
                payment_method,
                payment_reference,
                receipt_number,
                invoice_number,
                payee_name,
                payee_type,
                payee_id_number,
                description,
                purpose
            } = req.body;

            // Generate transaction number
            const transactionNumber = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const query = `
                INSERT INTO financial_transactions (
                    transaction_number, program_budget_id, component_budget_id, activity_id,
                    transaction_date, transaction_type, amount,
                    expense_category, expense_subcategory, budget_line,
                    payment_method, payment_reference, receipt_number, invoice_number,
                    payee_name, payee_type, payee_id_number,
                    description, purpose,
                    approval_status, requested_by, requested_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
            `;

            const result = await db.query(query, [
                transactionNumber, program_budget_id, component_budget_id, activity_id,
                transaction_date, transaction_type, amount,
                expense_category, expense_subcategory, budget_line,
                payment_method, payment_reference, receipt_number, invoice_number,
                payee_name, payee_type, payee_id_number,
                description, purpose,
                req.user.id
            ]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId, transaction_number: transactionNumber },
                message: 'Transaction recorded successfully'
            });
        } catch (error) {
            console.error('Error recording transaction:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to record transaction'
            });
        }
    });

    // ==================== APPROVALS ====================

    /**
     * GET /api/finance/approvals
     * Get all finance approvals with optional filtering
     */
    router.get('/approvals', async (req, res) => {
        try {
            const {
                status,
                request_type,
                priority
            } = req.query;

            // Safely parse limit and offset with defaults
            const limit = Math.max(1, parseInt(req.query.limit) || 50);
            const offset = Math.max(0, parseInt(req.query.offset) || 0);

            let query = `
                SELECT
                    fa.*,
                    u1.full_name as requester_name,
                    u2.full_name as reviewer_name,
                    u3.full_name as approver_name,
                    pb.fiscal_year,
                    pm.name as program_module_name
                FROM finance_approvals fa
                LEFT JOIN users u1 ON fa.requested_by = u1.id
                LEFT JOIN users u2 ON fa.reviewed_by = u2.id
                LEFT JOIN users u3 ON fa.approved_by = u3.id
                LEFT JOIN program_budgets pb ON fa.program_budget_id = pb.id
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                WHERE fa.deleted_at IS NULL
            `;

            const params = [];

            if (status) {
                query += ` AND fa.status = ?`;
                params.push(status);
            }

            if (request_type) {
                query += ` AND fa.request_type = ?`;
                params.push(request_type);
            }

            if (priority) {
                query += ` AND fa.priority = ?`;
                params.push(priority);
            }

            query += ` ORDER BY
                FIELD(fa.priority, 'urgent', 'high', 'medium', 'low'),
                fa.requested_at DESC
                LIMIT ? OFFSET ?`;
            params.push(limit, offset);

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching approvals:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch approvals'
            });
        }
    });

    /**
     * POST /api/finance/approvals
     * Create a new finance approval request
     */
    router.post('/approvals', async (req, res) => {
        try {
            const {
                request_type,
                program_budget_id,
                transaction_id,
                requested_amount,
                request_title,
                request_description,
                justification,
                priority
            } = req.body;

            // Generate approval number
            const approvalNumber = `FIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const query = `
                INSERT INTO finance_approvals (
                    approval_number, request_type, program_budget_id, transaction_id,
                    requested_amount, request_title, request_description, justification,
                    priority, status, requested_by, requested_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
            `;

            const result = await db.query(query, [
                approvalNumber, request_type, program_budget_id, transaction_id,
                requested_amount, request_title, request_description, justification,
                priority || 'medium',
                req.user.id
            ]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId, approval_number: approvalNumber },
                message: 'Approval request created successfully'
            });
        } catch (error) {
            console.error('Error creating approval:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create approval'
            });
        }
    });

    /**
     * PUT /api/finance/approvals/:id/approve
     * Approve a finance approval request
     */
    router.put('/approvals/:id/approve', async (req, res) => {
        try {
            const { id } = req.params;
            const { approved_amount, finance_notes } = req.body;

            const query = `
                UPDATE finance_approvals
                SET
                    status = 'approved',
                    approved_amount = ?,
                    finance_notes = ?,
                    approved_by = ?,
                    approved_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [approved_amount, finance_notes, req.user.id, id]);

            res.json({
                success: true,
                message: 'Approval approved successfully'
            });
        } catch (error) {
            console.error('Error approving approval:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to approve approval'
            });
        }
    });

    /**
     * PUT /api/finance/approvals/:id/reject
     * Reject a finance approval request
     */
    router.put('/approvals/:id/reject', async (req, res) => {
        try {
            const { id } = req.params;
            const { rejection_reason } = req.body;

            const query = `
                UPDATE finance_approvals
                SET
                    status = 'rejected',
                    rejection_reason = ?,
                    approved_by = ?,
                    approved_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [rejection_reason, req.user.id, id]);

            res.json({
                success: true,
                message: 'Approval rejected'
            });
        } catch (error) {
            console.error('Error rejecting approval:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to reject approval'
            });
        }
    });

    return router;
};
