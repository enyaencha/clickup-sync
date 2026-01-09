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
                    SUM(pb.total_budget) as total_budget,
                    SUM(pb.allocated_budget) as allocated_budget,
                    SUM(pb.spent_budget) as spent_budget,
                    SUM(pb.committed_budget) as committed_budget,
                    SUM(pb.total_budget - pb.spent_budget - pb.committed_budget) as remaining_budget
                FROM program_budgets pb
                LEFT JOIN program_modules pm ON pb.program_module_id = pm.id
                WHERE pb.deleted_at IS NULL
                AND pb.status IN ('submitted', 'approved', 'active')
                ${moduleFilter}
                GROUP BY pb.program_module_id, pm.name
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
                'SELECT program_budget_id, requested_amount, request_type FROM finance_approvals WHERE id = ? AND deleted_at IS NULL',
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
                'SELECT program_budget_id, request_type FROM finance_approvals WHERE id = ? AND deleted_at IS NULL',
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
