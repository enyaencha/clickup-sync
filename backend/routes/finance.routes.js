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
            // RBAC: Filter by user's assigned modules
            let moduleFilter = '';
            const params = [];

            if (!req.user.is_system_admin && req.user.module_assignments && req.user.module_assignments.length > 0) {
                const assignedModuleIds = req.user.module_assignments.map(m => m.module_id);
                moduleFilter = ` AND pb.program_module_id IN (${assignedModuleIds.map(() => '?').join(',')})`;
                params.push(...assignedModuleIds);
            }

            const query = `
                SELECT
                    pb.program_module_id,
                    pm.name as program_name,
                    COALESCE(SUM(pb.total_budget), 0) as total_budget,
                    COALESCE(SUM(pb.allocated_budget), 0) as allocated_budget,
                    COALESCE(
                        NULLIF(activity_finance_totals.spent_budget, 0),
                        module_expenditure_totals.total_spent,
                        0
                    ) as spent_budget,
                    CASE
                        WHEN COALESCE(activity_finance_totals.spent_budget, 0) = 0
                             AND COALESCE(module_expenditure_totals.total_spent, 0) > 0
                        THEN 0
                        ELSE COALESCE(activity_finance_totals.committed_budget, 0)
                    END as committed_budget,
                    (
                        COALESCE(SUM(pb.total_budget), 0) -
                        (
                            COALESCE(
                                NULLIF(activity_finance_totals.spent_budget, 0),
                                module_expenditure_totals.total_spent,
                                0
                            ) +
                            CASE
                                WHEN COALESCE(activity_finance_totals.spent_budget, 0) = 0
                                     AND COALESCE(module_expenditure_totals.total_spent, 0) > 0
                                THEN 0
                                ELSE COALESCE(activity_finance_totals.committed_budget, 0)
                            END
                        )
                    ) as remaining_budget
                FROM program_budgets pb
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                LEFT JOIN (
                    SELECT
                        sp.module_id,
                        COALESCE(SUM(ae.amount), 0) AS total_spent
                    FROM activity_expenditures ae
                    INNER JOIN activities a ON ae.activity_id = a.id AND a.deleted_at IS NULL
                    INNER JOIN project_components pc ON a.component_id = pc.id AND pc.deleted_at IS NULL
                    INNER JOIN sub_programs sp ON pc.sub_program_id = sp.id AND sp.deleted_at IS NULL
                    WHERE ae.deleted_at IS NULL
                    GROUP BY sp.module_id
                ) module_expenditure_totals ON module_expenditure_totals.module_id = pb.program_module_id
                LEFT JOIN (
                    SELECT
                        totals.module_id,
                        SUM(totals.spent_amount) as spent_budget,
                        SUM(totals.committed_amount) as committed_budget
                    FROM (
                        SELECT
                            sp.module_id as module_id,
                            CASE
                                WHEN LOWER(ae.status) = 'approved' THEN COALESCE(ae.amount, 0)
                                ELSE 0
                            END as spent_amount,
                            CASE
                                WHEN LOWER(ae.status) = 'pending' THEN COALESCE(ae.amount, 0)
                                ELSE 0
                            END as committed_amount
                        FROM activity_expenditures ae
                        LEFT JOIN activities a ON ae.activity_id = a.id
                        LEFT JOIN project_components pc ON a.component_id = pc.id
                        LEFT JOIN sub_programs sp ON pc.sub_program_id = sp.id
                        WHERE ae.deleted_at IS NULL

                        UNION ALL

                        SELECT
                            COALESCE(pbtx.program_module_id, sp2.module_id) as module_id,
                            CASE
                                WHEN LOWER(ft.approval_status) = 'approved' THEN COALESCE(ft.amount, 0)
                                ELSE 0
                            END as spent_amount,
                            CASE
                                WHEN LOWER(ft.approval_status) = 'pending' THEN COALESCE(ft.amount, 0)
                                ELSE 0
                            END as committed_amount
                        FROM financial_transactions ft
                        LEFT JOIN program_budgets pbtx ON ft.program_budget_id = pbtx.id
                        LEFT JOIN activities a2 ON ft.activity_id = a2.id
                        LEFT JOIN project_components pc2 ON a2.component_id = pc2.id
                        LEFT JOIN sub_programs sp2 ON pc2.sub_program_id = sp2.id
                        WHERE ft.deleted_at IS NULL
                    ) totals
                    WHERE totals.module_id IS NOT NULL
                    GROUP BY totals.module_id
                ) activity_finance_totals ON activity_finance_totals.module_id = pb.program_module_id
                WHERE pb.deleted_at IS NULL
                AND pb.status IN ('submitted', 'approved', 'active')
                ${moduleFilter}
                GROUP BY
                    pb.program_module_id,
                    pm.name,
                    module_expenditure_totals.total_spent,
                    activity_finance_totals.spent_budget,
                    activity_finance_totals.committed_budget
                ORDER BY pm.name
            `;

            console.log('📊 Budget Summary Query:', query);
            console.log('📊 Query Params:', params);
            console.log('📊 User Info:', {
                id: req.user.id,
                is_system_admin: req.user.is_system_admin,
                module_assignments: req.user.module_assignments
            });

            const results = await db.query(query, params);

            console.log(`📊 Budget Summary returned ${results.length} programs`);
            if (results.length > 0) {
                console.log('📊 Sample budget:', JSON.stringify(results[0], null, 2));
            } else {
                console.log('📊 No budget data found. Check:');
                console.log('   1. Are there budgets with status submitted/approved/active?');
                console.log('   2. Does user have module assignments?');
            }

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
                WHERE pb.deleted_at IS NULL`;

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

            query += `
                ORDER BY pb.created_at DESC
                LIMIT ${limit} OFFSET ${offset}`;

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
     * GET /api/finance/budgets/:id/activities
     * Get activities linked to a program budget (via program -> sub program -> component)
     */
    router.get('/budgets/:id/activities', async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.query;

            let query = `
                SELECT
                    a.id,
                    a.name,
                    a.code,
                    a.status,
                    a.approval_status
                FROM program_budgets pb
                LEFT JOIN sub_programs sp ON sp.module_id = pb.program_module_id
                LEFT JOIN project_components pc ON pc.sub_program_id = sp.id
                LEFT JOIN activities a ON a.component_id = pc.id AND a.deleted_at IS NULL
                WHERE pb.id = ? AND pb.deleted_at IS NULL
            `;

            const params = [id];

            if (!req.user.is_system_admin && req.user.module_assignments && req.user.module_assignments.length > 0) {
                const assignedModuleIds = req.user.module_assignments.map(m => m.module_id);
                query += ` AND pb.program_module_id IN (${assignedModuleIds.map(() => '?').join(',')})`;
                params.push(...assignedModuleIds);
            }

            if (status) {
                const statuses = status.split(',').map((value) => value.trim()).filter(Boolean);
                if (statuses.length > 0) {
                    query += ` AND a.status IN (${statuses.map(() => '?').join(',')})`;
                    params.push(...statuses);
                }
            }

            query += ` AND a.id IS NOT NULL ORDER BY a.activity_date DESC`;

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching budget activities:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch budget activities'
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

            // Get program module name for the approval title
            const [programModule] = await db.query(
                'SELECT name FROM program_modules WHERE id = ?',
                [program_module_id]
            );

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

            const budgetId = result.insertId;

            // Generate approval number
            const approvalNumber = `FIN-${Date.now()}-${budgetId}`;

            // Create approval request in finance_approvals table
            const approvalQuery = `
                INSERT INTO finance_approvals (
                    approval_number,
                    request_type,
                    program_budget_id,
                    requested_amount,
                    request_title,
                    request_description,
                    justification,
                    status,
                    priority,
                    requested_by,
                    requested_at
                ) VALUES (?, 'budget_allocation', ?, ?, ?, ?, ?, 'pending', 'medium', ?, NOW())
            `;

            const requestTitle = `Budget Allocation - ${programModule?.name || 'Program'} FY ${fiscal_year}`;
            const requestDescription = `Program budget request for ${programModule?.name || 'Program'} - Fiscal Year ${fiscal_year}. Total budget: KES ${total_budget?.toLocaleString() || '0'}`;
            const justification = notes || `Budget allocation for ${programModule?.name || 'Program'} operations and activities`;

            await db.query(approvalQuery, [
                approvalNumber,
                budgetId,
                total_budget,
                requestTitle,
                requestDescription,
                justification,
                req.user.id
            ]);

            res.status(201).json({
                success: true,
                data: { id: budgetId },
                message: 'Budget created successfully and submitted for approval'
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
                activity_id,
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
                WHERE ft.deleted_at IS NULL`;

            const params = [];

            // RBAC: Filter by user's assigned modules
            if (!req.user.is_system_admin && req.user.module_assignments && req.user.module_assignments.length > 0) {
                const assignedModuleIds = req.user.module_assignments.map(m => m.module_id);
                query += ` AND pb.program_module_id IN (${assignedModuleIds.map(() => '?').join(',')})`;
                params.push(...assignedModuleIds);
            }

            if (program_budget_id) {
                query += ` AND ft.program_budget_id = ?`;
                params.push(program_budget_id);
            }

            if (activity_id) {
                query += ` AND ft.activity_id = ?`;
                params.push(activity_id);
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

            query += `
                ORDER BY ft.transaction_date DESC, ft.created_at DESC
                LIMIT ${limit} OFFSET ${offset}`;

            const results = await db.query(query, params);

            console.log(`📊 Transactions query returned ${results.length} records`);
            if (results.length > 0) {
                console.log('Sample transaction:', JSON.stringify(results[0], null, 2));
            } else {
                console.log('No transactions found. Query params:', params);
            }

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
                purpose,
                verification_notes
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
                    description, purpose, verification_notes,
                    approval_status, requested_by, requested_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())
            `;

            const values = [
                transactionNumber, program_budget_id, component_budget_id, activity_id,
                transaction_date, transaction_type, amount,
                expense_category, expense_subcategory, budget_line,
                payment_method, payment_reference, receipt_number, invoice_number,
                payee_name, payee_type, payee_id_number,
                description, purpose, verification_notes,
                req.user.id
            ].map((value) => (value === undefined ? null : value));

            const result = await db.query(query, values);

            const transactionId = result.insertId;
            const approvalNumber = `FIN-${Date.now()}-${transactionId}`;
            const requestTitle = `Transaction - ${transaction_type || 'unspecified'} - ${payee_name || 'Unknown Payee'}`;
            const requestDescription = `Transaction ${transactionNumber} on ${transaction_date || 'unspecified date'} for KES ${amount?.toLocaleString() || '0'}.`;
            const justification = purpose || description || 'Transaction requires approval.';

            const approvalQuery = `
                INSERT INTO finance_approvals (
                    approval_number, request_type, program_budget_id, transaction_id,
                    requested_amount, request_title, request_description, justification,
                    priority, status, requested_by, requested_at
                ) VALUES (?, 'transaction', ?, ?, ?, ?, ?, ?, 'medium', 'pending', ?, NOW())
            `;

            await db.query(approvalQuery, [
                approvalNumber,
                program_budget_id,
                transactionId,
                amount,
                requestTitle,
                requestDescription,
                justification,
                req.user.id
            ].map((value) => (value === undefined ? null : value)));

            res.status(201).json({
                success: true,
                data: { id: transactionId, transaction_number: transactionNumber },
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

    /**
     * PUT /api/finance/transactions/:id/documents
     * Update transaction document URLs and verification notes
     */
    router.put('/transactions/:id/documents', async (req, res) => {
        try {
            const { id } = req.params;
            const { receipt_url, invoice_url, approval_document_url, verification_notes } = req.body;

            const fields = [];
            const params = [];

            if (receipt_url !== undefined) {
                fields.push('receipt_url = ?');
                params.push(receipt_url);
            }

            if (invoice_url !== undefined) {
                fields.push('invoice_url = ?');
                params.push(invoice_url);
            }

            if (approval_document_url !== undefined) {
                fields.push('approval_document_url = ?');
                params.push(approval_document_url);
            }

            if (verification_notes !== undefined) {
                fields.push('verification_notes = ?');
                params.push(verification_notes);
            }

            if (fields.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No document fields provided'
                });
            }

            const query = `
                UPDATE financial_transactions
                SET ${fields.join(', ')}, updated_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            params.push(id);

            await db.query(query, params);

            res.json({
                success: true,
                message: 'Transaction documents updated'
            });
        } catch (error) {
            console.error('Error updating transaction documents:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update transaction documents'
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

            // Get module filter for RBAC
            let moduleFilter = '';
            const moduleParams = [];
            if (!req.user.is_system_admin && req.user.module_assignments && req.user.module_assignments.length > 0) {
                const assignedModuleIds = req.user.module_assignments.map(m => m.module_id);
                moduleFilter = ` AND pb.program_module_id IN (${assignedModuleIds.map(() => '?').join(',')})`;
                moduleParams.push(...assignedModuleIds);
            }

            // Query for approvals from finance_approvals table
            let approvalQuery = `
                SELECT
                    fa.id,
                    fa.approval_number,
                    fa.request_type,
                    fa.program_budget_id,
                    fa.transaction_id,
                    fa.requested_amount,
                    fa.approved_amount,
                    fa.request_title,
                    fa.request_description,
                    fa.justification,
                    fa.status,
                    fa.priority,
                    fa.requested_by,
                    fa.requested_at,
                    fa.reviewed_by,
                    fa.reviewed_at,
                    u1.full_name as requester_name,
                    u2.full_name as reviewer_name,
                    u3.full_name as approver_name,
                    pb.fiscal_year,
                    pm.name as program_module_name,
                    'finance_approvals' as source_table
                FROM finance_approvals fa
                LEFT JOIN users u1 ON fa.requested_by = u1.id
                LEFT JOIN users u2 ON fa.reviewed_by = u2.id
                LEFT JOIN users u3 ON fa.approved_by = u3.id
                LEFT JOIN program_budgets pb ON fa.program_budget_id = pb.id
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                WHERE fa.deleted_at IS NULL
                ${moduleFilter}
            `;

            const approvalParams = [...moduleParams];

            if (status) {
                approvalQuery += ` AND fa.status = ?`;
                approvalParams.push(status);
            }

            if (request_type) {
                approvalQuery += ` AND fa.request_type = ?`;
                approvalParams.push(request_type);
            }

            if (priority) {
                approvalQuery += ` AND fa.priority = ?`;
                approvalParams.push(priority);
            }

            // Query for old program_budgets that don't have finance_approvals entries
            let legacyQuery = `
                SELECT
                    pb.id,
                    CONCAT('FIN-LEGACY-', pb.id) as approval_number,
                    'budget_allocation' as request_type,
                    pb.id as program_budget_id,
                    NULL as transaction_id,
                    pb.total_budget as requested_amount,
                    NULL as approved_amount,
                    CONCAT('Budget Allocation - ', pm.name, ' FY ', pb.fiscal_year) as request_title,
                    CONCAT('Program budget request for ', pm.name, ' - Fiscal Year ', pb.fiscal_year, '. Total budget: KES ', FORMAT(pb.total_budget, 0)) as request_description,
                    COALESCE(pb.notes, CONCAT('Budget allocation for ', pm.name, ' operations and activities')) as justification,
                    'pending' as status,
                    'medium' as priority,
                    pb.submitted_by as requested_by,
                    pb.submitted_at as requested_at,
                    NULL as reviewed_by,
                    NULL as reviewed_at,
                    u1.full_name as requester_name,
                    NULL as reviewer_name,
                    NULL as approver_name,
                    pb.fiscal_year,
                    pm.name as program_module_name,
                    'program_budgets' as source_table
                FROM program_budgets pb
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                LEFT JOIN users u1 ON pb.submitted_by = u1.id
                WHERE pb.deleted_at IS NULL
                AND pb.status = 'submitted'
                AND NOT EXISTS (
                    SELECT 1 FROM finance_approvals fa2
                    WHERE fa2.program_budget_id = pb.id
                    AND fa2.deleted_at IS NULL
                )
                ${moduleFilter}
            `;

            const legacyParams = [...moduleParams];

            // Only include legacy budgets if status is 'pending' or not specified
            const includeLegacy = !status || status === 'pending';

            // Combine results
            let combinedQuery;
            let combinedParams;

            if (includeLegacy) {
                combinedQuery = `
                    (${approvalQuery})
                    UNION ALL
                    (${legacyQuery})
                    ORDER BY FIELD(priority, 'urgent', 'high', 'medium', 'low'), requested_at DESC
                    LIMIT ${limit} OFFSET ${offset}
                `;
                combinedParams = [...approvalParams, ...legacyParams];
            } else {
                combinedQuery = `
                    ${approvalQuery}
                    ORDER BY FIELD(fa.priority, 'urgent', 'high', 'medium', 'low'), fa.requested_at DESC
                    LIMIT ${limit} OFFSET ${offset}
                `;
                combinedParams = approvalParams;
            }

            const results = await db.query(combinedQuery, combinedParams);

            console.log(`✅ Approvals query returned ${results.length} records (including legacy budgets)`);
            if (results.length > 0) {
                console.log('Sample approval:', JSON.stringify(results[0], null, 2));
            } else {
                console.log('No approvals found. Query params:', combinedParams);
            }

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

            // Check if this is a legacy budget (ID from program_budgets table)
            // Legacy budgets come through GET endpoint with id from program_budgets
            // First try to get from finance_approvals
            let approval = await db.query(
                'SELECT program_budget_id, requested_amount, request_type, transaction_id, approval_number FROM finance_approvals WHERE id = ? AND deleted_at IS NULL',
                [id]
            );

            let isLegacy = false;
            let programBudgetId = id;

            if (!approval || approval.length === 0) {
                // This might be a legacy budget - check program_budgets
                const legacyBudget = await db.query(
                    'SELECT id, total_budget, submitted_by FROM program_budgets WHERE id = ? AND status = "submitted" AND deleted_at IS NULL',
                    [id]
                );

                if (!legacyBudget || legacyBudget.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'Approval request not found'
                    });
                }

                // This is a legacy budget - create finance_approvals entry first
                isLegacy = true;
                const [budget] = legacyBudget;
                programBudgetId = budget.id;

                // Get program module name
                const [programModule] = await db.query(
                    'SELECT pm.name, pb.fiscal_year FROM program_budgets pb LEFT JOIN program_modules pm ON pb.program_module_id = pm.id WHERE pb.id = ?',
                    [programBudgetId]
                );

                const approvalNumber = `FIN-${Date.now()}-${programBudgetId}`;
                const requestTitle = `Budget Allocation - ${programModule?.name || 'Program'} FY ${programModule?.fiscal_year || ''}`;
                const requestDescription = `Program budget request for ${programModule?.name || 'Program'}. Total budget: KES ${budget.total_budget?.toLocaleString() || '0'}`;

                // Create finance_approvals entry
                const insertQuery = `
                    INSERT INTO finance_approvals (
                        approval_number,
                        request_type,
                        program_budget_id,
                        requested_amount,
                        approved_amount,
                        request_title,
                        request_description,
                        status,
                        priority,
                        requested_by,
                        requested_at,
                        finance_notes,
                        approved_by,
                        approved_at
                    ) VALUES (?, 'budget_allocation', ?, ?, ?, ?, ?, 'approved', 'medium', ?, NOW(), ?, ?, NOW())
                `;

                await db.query(insertQuery, [
                    approvalNumber,
                    programBudgetId,
                    budget.total_budget,
                    approved_amount || budget.total_budget,
                    requestTitle,
                    requestDescription,
                    budget.submitted_by,
                    finance_notes,
                    req.user.id
                ]);

                // Update program_budgets - set to 'active' so it can be allocated
                const budgetQuery = `
                    UPDATE program_budgets
                    SET
                        status = 'active',
                        allocated_budget = ?,
                        approved_by = ?,
                        approved_at = NOW()
                    WHERE id = ?
                `;

                await db.query(budgetQuery, [
                    approved_amount || budget.total_budget,
                    req.user.id,
                    programBudgetId
                ]);

            } else {
                // Normal approval flow - update existing finance_approvals entry
                const [approvalData] = approval;

                // Update approval request
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

                await db.query(query, [approved_amount || approvalData.requested_amount, finance_notes, req.user.id, id]);

                // If this is a budget allocation approval, update the program_budgets table
                if (approvalData.program_budget_id && approvalData.request_type === 'budget_allocation') {
                    const budgetQuery = `
                        UPDATE program_budgets
                        SET
                            status = 'active',
                            allocated_budget = ?,
                            approved_by = ?,
                            approved_at = NOW()
                        WHERE id = ?
                    `;

                    await db.query(budgetQuery, [
                        approved_amount || approvalData.requested_amount,
                        req.user.id,
                        approvalData.program_budget_id
                    ]);
                }

                if (approvalData.request_type === 'transaction') {
                    let transactionId = approvalData.transaction_id;

                    if (!transactionId && approvalData.approval_number) {
                        const parts = approvalData.approval_number.split('-');
                        const parsed = parseInt(parts[parts.length - 1], 10);
                        if (!Number.isNaN(parsed)) {
                            transactionId = parsed;
                        }
                    }

                    if (transactionId) {
                        const transactionQuery = `
                            UPDATE financial_transactions
                            SET
                                approval_status = 'approved',
                                approved_by = ?,
                                approved_at = NOW()
                            WHERE id = ?
                        `;

                        await db.query(transactionQuery, [req.user.id, transactionId]);
                    }
                }
            }

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

            // Check if this is a legacy budget (ID from program_budgets table)
            let approval = await db.query(
                'SELECT program_budget_id, request_type, transaction_id, approval_number FROM finance_approvals WHERE id = ? AND deleted_at IS NULL',
                [id]
            );

            let programBudgetId = id;

            if (!approval || approval.length === 0) {
                // This might be a legacy budget - check program_budgets
                const legacyBudget = await db.query(
                    'SELECT id, total_budget, submitted_by FROM program_budgets WHERE id = ? AND status = "submitted" AND deleted_at IS NULL',
                    [id]
                );

                if (!legacyBudget || legacyBudget.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: 'Approval request not found'
                    });
                }

                // This is a legacy budget - create finance_approvals entry as rejected
                const [budget] = legacyBudget;
                programBudgetId = budget.id;

                // Get program module name
                const [programModule] = await db.query(
                    'SELECT pm.name, pb.fiscal_year FROM program_budgets pb LEFT JOIN program_modules pm ON pb.program_module_id = pm.id WHERE pb.id = ?',
                    [programBudgetId]
                );

                const approvalNumber = `FIN-${Date.now()}-${programBudgetId}`;
                const requestTitle = `Budget Allocation - ${programModule?.name || 'Program'} FY ${programModule?.fiscal_year || ''}`;
                const requestDescription = `Program budget request for ${programModule?.name || 'Program'}. Total budget: KES ${budget.total_budget?.toLocaleString() || '0'}`;

                // Create finance_approvals entry as rejected
                const insertQuery = `
                    INSERT INTO finance_approvals (
                        approval_number,
                        request_type,
                        program_budget_id,
                        requested_amount,
                        request_title,
                        request_description,
                        status,
                        priority,
                        requested_by,
                        requested_at,
                        rejection_reason,
                        approved_by,
                        approved_at
                    ) VALUES (?, 'budget_allocation', ?, ?, ?, ?, 'rejected', 'medium', ?, NOW(), ?, ?, NOW())
                `;

                await db.query(insertQuery, [
                    approvalNumber,
                    programBudgetId,
                    budget.total_budget,
                    requestTitle,
                    requestDescription,
                    budget.submitted_by,
                    rejection_reason,
                    req.user.id
                ]);

                // Update program_budgets
                await db.query('UPDATE program_budgets SET status = "rejected" WHERE id = ?', [programBudgetId]);

            } else {
                // Normal rejection flow
                const [approvalData] = approval;

                // Update approval request
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

                // If this is a budget allocation approval, update the program_budgets table
                if (approvalData.program_budget_id && approvalData.request_type === 'budget_allocation') {
                    const budgetQuery = `
                        UPDATE program_budgets
                        SET status = 'rejected'
                        WHERE id = ?
                    `;

                    await db.query(budgetQuery, [approvalData.program_budget_id]);
                }

                if (approvalData.request_type === 'transaction') {
                    let transactionId = approvalData.transaction_id;

                    if (!transactionId && approvalData.approval_number) {
                        const parts = approvalData.approval_number.split('-');
                        const parsed = parseInt(parts[parts.length - 1], 10);
                        if (!Number.isNaN(parsed)) {
                            transactionId = parsed;
                        }
                    }

                    if (transactionId) {
                        const transactionQuery = `
                            UPDATE financial_transactions
                            SET
                                approval_status = 'rejected',
                                approved_by = ?,
                                approved_at = NOW()
                            WHERE id = ?
                        `;

                        await db.query(transactionQuery, [req.user.id, transactionId]);
                    }
                }
            }

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
