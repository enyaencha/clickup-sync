/**
 * Budget Request Workflow API Routes
 * Endpoints for managing activity budget requests and allocations
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
    // ==================== BUDGET REQUESTS ====================

    /**
     * GET /api/budget-requests
     * Get all budget requests with filtering
     */
    router.get('/', async (req, res) => {
        try {
            const { status, activity_id, priority } = req.query;

            let query = `
                SELECT
                    abr.*,
                    a.name as activity_name,
                    a.code as activity_code,
                    u1.full_name as requested_by_name,
                    u2.full_name as reviewed_by_name
                FROM activity_budget_requests abr
                LEFT JOIN activities a ON abr.activity_id = a.id
                LEFT JOIN users u1 ON abr.requested_by = u1.id
                LEFT JOIN users u2 ON abr.reviewed_by = u2.id
                WHERE abr.deleted_at IS NULL
            `;

            const params = [];

            if (status) {
                query += ` AND abr.status = ?`;
                params.push(status);
            }

            if (activity_id) {
                query += ` AND abr.activity_id = ?`;
                params.push(activity_id);
            }

            if (priority) {
                query += ` AND abr.priority = ?`;
                params.push(priority);
            }

            query += ` ORDER BY
                FIELD(abr.priority, 'urgent', 'high', 'medium', 'low'),
                abr.submitted_at DESC`;

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching budget requests:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch budget requests'
            });
        }
    });

    /**
     * POST /api/budget-requests
     * Create a new budget request
     */
    router.post('/', async (req, res) => {
        try {
            const {
                activity_id,
                requested_amount,
                justification,
                breakdown,
                priority
            } = req.body;

            // Generate request number
            const requestNumber = `BRQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const query = `
                INSERT INTO activity_budget_requests (
                    activity_id,
                    request_number,
                    requested_amount,
                    justification,
                    breakdown,
                    priority,
                    status,
                    requested_by,
                    submitted_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'submitted', ?, NOW())
            `;

            const result = await db.query(query, [
                activity_id,
                requestNumber,
                requested_amount,
                justification,
                JSON.stringify(breakdown || {}),
                priority || 'medium',
                req.user.id
            ]);

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    request_number: requestNumber
                },
                message: 'Budget request created successfully'
            });
        } catch (error) {
            console.error('Error creating budget request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create budget request'
            });
        }
    });

    /**
     * PUT /api/budget-requests/:id/approve
     * Approve a budget request
     */
    router.put('/:id/approve', async (req, res) => {
        try {
            const { id } = req.params;
            const {
                approved_amount,
                finance_notes
            } = req.body;

            // Get request details including requestor and activity info
            const requestQuery = `
                SELECT
                    abr.activity_id,
                    abr.approved_amount as previous_amount,
                    abr.requested_by,
                    abr.request_number,
                    a.name as activity_name,
                    a.project_id,
                    p.program_id
                FROM activity_budget_requests abr
                LEFT JOIN activities a ON abr.activity_id = a.id
                LEFT JOIN projects p ON a.project_id = p.id
                WHERE abr.id = ?
            `;
            const [request] = await db.query(requestQuery, [id]);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    error: 'Budget request not found'
                });
            }

            // Update request status
            const updateQuery = `
                UPDATE activity_budget_requests
                SET
                    status = 'approved',
                    approved_amount = ?,
                    finance_notes = ?,
                    reviewed_by = ?,
                    reviewed_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(updateQuery, [
                approved_amount,
                finance_notes || null,
                req.user.id,
                id
            ]);

            // Update activity budget
            const budgetQuery = `
                INSERT INTO activity_budgets (
                    activity_id,
                    allocated_budget,
                    approved_budget,
                    budget_source,
                    last_allocation_date,
                    last_updated_by
                ) VALUES (?, ?, ?, 'request', CURDATE(), ?)
                ON DUPLICATE KEY UPDATE
                    approved_budget = approved_budget + VALUES(approved_budget),
                    allocated_budget = allocated_budget + VALUES(allocated_budget),
                    last_allocation_date = VALUES(last_allocation_date),
                    last_updated_by = VALUES(last_updated_by)
            `;

            await db.query(budgetQuery, [
                request.activity_id,
                approved_amount,
                approved_amount,
                req.user.id
            ]);

            // Deduct from program budget if program_id exists
            if (request.program_id) {
                const deductQuery = `
                    UPDATE program_budgets
                    SET allocated_budget = allocated_budget + ?
                    WHERE program_module_id = ?
                    AND status = 'active'
                    AND budget_start_date <= CURDATE()
                    AND budget_end_date >= CURDATE()
                    ORDER BY id DESC
                    LIMIT 1
                `;
                await db.query(deductQuery, [approved_amount, request.program_id]);
            }

            // Create notification for the requestor
            const notificationQuery = `
                INSERT INTO notifications (
                    user_id,
                    type,
                    title,
                    message,
                    entity_type,
                    entity_id,
                    action_url
                ) VALUES (?, 'budget_approved', ?, ?, 'budget_request', ?, ?)
            `;

            await db.query(notificationQuery, [
                request.requested_by,
                'Budget Request Approved',
                `Your budget request #${request.request_number} for "${request.activity_name}" has been approved with an amount of KES ${approved_amount.toLocaleString()}${finance_notes ? '. Finance notes: ' + finance_notes : '.'}`,
                id,
                `/my-budget-requests`
            ]);

            res.json({
                success: true,
                message: 'Budget request approved successfully'
            });
        } catch (error) {
            console.error('Error approving budget request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to approve budget request'
            });
        }
    });

    /**
     * PUT /api/budget-requests/:id/reject
     * Reject a budget request
     */
    router.put('/:id/reject', async (req, res) => {
        try {
            const { id } = req.params;
            const { rejection_reason } = req.body;

            if (!rejection_reason) {
                return res.status(400).json({
                    success: false,
                    error: 'Rejection reason is required'
                });
            }

            const query = `
                UPDATE activity_budget_requests
                SET
                    status = 'rejected',
                    rejection_reason = ?,
                    reviewed_by = ?,
                    reviewed_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [
                rejection_reason,
                req.user.id,
                id
            ]);

            res.json({
                success: true,
                message: 'Budget request rejected'
            });
        } catch (error) {
            console.error('Error rejecting budget request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to reject budget request'
            });
        }
    });

    /**
     * PUT /api/budget-requests/:id/return
     * Return request for amendments
     */
    router.put('/:id/return', async (req, res) => {
        try {
            const { id } = req.params;
            const { amendment_notes } = req.body;

            if (!amendment_notes) {
                return res.status(400).json({
                    success: false,
                    error: 'Amendment notes are required'
                });
            }

            const query = `
                UPDATE activity_budget_requests
                SET
                    status = 'returned_for_amendment',
                    amendment_notes = ?,
                    reviewed_by = ?,
                    reviewed_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [
                amendment_notes,
                req.user.id,
                id
            ]);

            res.json({
                success: true,
                message: 'Budget request returned for amendments'
            });
        } catch (error) {
            console.error('Error returning budget request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to return budget request'
            });
        }
    });

    /**
     * PUT /api/budget-requests/:id/edit
     * Finance team edits the budget request
     */
    router.put('/:id/edit', async (req, res) => {
        try {
            const { id } = req.params;
            const {
                requested_amount,
                justification,
                finance_notes
            } = req.body;

            const query = `
                UPDATE activity_budget_requests
                SET
                    requested_amount = COALESCE(?, requested_amount),
                    justification = COALESCE(?, justification),
                    finance_notes = ?,
                    status = 'under_review'
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [
                requested_amount,
                justification,
                finance_notes || null,
                id
            ]);

            res.json({
                success: true,
                message: 'Budget request updated successfully'
            });
        } catch (error) {
            console.error('Error editing budget request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to edit budget request'
            });
        }
    });

    // ==================== BUDGET ALLOCATIONS ====================

    /**
     * POST /api/budget-requests/allocate
     * Allocate budget from one level to another
     */
    router.post('/allocate', async (req, res) => {
        try {
            const {
                source_type,
                source_id,
                target_type,
                target_id,
                allocated_amount,
                allocation_notes
            } = req.body;

            // Validate that source has enough budget
            // (Implementation depends on your budget structure)

            const query = `
                INSERT INTO budget_allocations (
                    source_type,
                    source_id,
                    target_type,
                    target_id,
                    allocated_amount,
                    allocation_date,
                    allocation_notes,
                    allocated_by
                ) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?)
            `;

            const result = await db.query(query, [
                source_type,
                source_id,
                target_type,
                target_id,
                allocated_amount,
                allocation_notes || null,
                req.user.id
            ]);

            // Update target budget
            if (target_type === 'activity') {
                const budgetQuery = `
                    INSERT INTO activity_budgets (
                        activity_id,
                        allocated_budget,
                        approved_budget,
                        budget_source,
                        last_allocation_date,
                        last_updated_by
                    ) VALUES (?, ?, ?, ?, CURDATE(), ?)
                    ON DUPLICATE KEY UPDATE
                        allocated_budget = allocated_budget + VALUES(allocated_budget),
                        approved_budget = approved_budget + VALUES(approved_budget),
                        last_allocation_date = VALUES(last_allocation_date),
                        last_updated_by = VALUES(last_updated_by)
                `;

                await db.query(budgetQuery, [
                    target_id,
                    allocated_amount,
                    allocated_amount,
                    source_type,
                    req.user.id
                ]);
            }

            res.status(201).json({
                success: true,
                data: { id: result.insertId },
                message: 'Budget allocated successfully'
            });
        } catch (error) {
            console.error('Error allocating budget:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to allocate budget'
            });
        }
    });

    /**
     * GET /api/budget-requests/activity/:activityId/budget
     * Get activity budget summary
     */
    router.get('/activity/:activityId/budget', async (req, res) => {
        try {
            const { activityId } = req.params;

            const query = `
                SELECT
                    ab.*,
                    a.name as activity_name,
                    a.code as activity_code
                FROM activity_budgets ab
                LEFT JOIN activities a ON ab.activity_id = a.id
                WHERE ab.activity_id = ?
            `;

            const [budget] = await db.query(query, [activityId]);

            res.json({
                success: true,
                data: budget || {
                    activity_id: activityId,
                    allocated_budget: 0,
                    approved_budget: 0,
                    spent_budget: 0,
                    committed_budget: 0,
                    remaining_budget: 0
                }
            });
        } catch (error) {
            console.error('Error fetching activity budget:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch activity budget'
            });
        }
    });

    // ==================== NOTIFICATIONS ====================

    /**
     * GET /api/budget-requests/notifications
     * Get budget requests with unread message counts for user's activities
     */
    router.get('/notifications', async (req, res) => {
        try {
            const userId = req.user.id;

            // Get all budget requests the user has access to with unread comment counts
            // Access rules:
            // 1. Finance team (module_id = 6) can see all requests
            // 2. Activity users can see requests they created (requested_by = user_id)
            const query = `
                SELECT DISTINCT
                    abr.id as request_id,
                    abr.request_number,
                    abr.status,
                    a.name as activity_name,
                    (
                        SELECT MAX(c.created_at)
                        FROM comments c
                        WHERE c.entity_type = 'budget_request'
                        AND c.entity_id = abr.id
                        AND c.deleted_at IS NULL
                    ) as last_message_at,
                    (
                        SELECT COUNT(*)
                        FROM comments c
                        WHERE c.entity_type = 'budget_request'
                        AND c.entity_id = abr.id
                        AND c.deleted_at IS NULL
                        AND c.created_by != ?
                        AND c.created_at > COALESCE(
                            (SELECT MAX(c2.created_at)
                             FROM comments c2
                             WHERE c2.entity_type = 'budget_request'
                             AND c2.entity_id = abr.id
                             AND c2.created_by = ?
                             AND c2.deleted_at IS NULL),
                            '2000-01-01'
                        )
                    ) as unread_count
                FROM activity_budget_requests abr
                LEFT JOIN activities a ON abr.activity_id = a.id
                WHERE abr.deleted_at IS NULL
                AND abr.status IN ('submitted', 'under_review', 'returned_for_amendment')
                AND (
                    EXISTS (
                        SELECT 1 FROM user_module_assignments uma
                        WHERE uma.user_id = ? AND uma.module_id = 6
                    )
                    OR abr.requested_by = ?
                )
                HAVING last_message_at IS NOT NULL OR abr.status = 'returned_for_amendment'
                ORDER BY unread_count DESC, last_message_at DESC
            `;

            const notifications = await db.query(query, [userId, userId, userId, userId]);

            res.json({
                success: true,
                data: notifications || []
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            console.error('Error details:', error.message, error.stack);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch notifications',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // ==================== COMMENTS / CONVERSATION ====================

    /**
     * GET /api/budget-requests/:id/comments
     * Get all comments for a budget request
     */
    router.get('/:id/comments', async (req, res) => {
        try {
            const { id } = req.params;

            // Simplified query without modules table dependency
            // is_finance_team will be determined on frontend based on user context
            const query = `
                SELECT
                    c.id,
                    c.comment_text,
                    c.created_at,
                    c.created_by as created_by_id,
                    u.full_name as created_by_name,
                    0 as is_finance_team
                FROM comments c
                LEFT JOIN users u ON c.created_by = u.id
                WHERE c.entity_type = 'budget_request'
                AND c.entity_id = ?
                AND c.deleted_at IS NULL
                ORDER BY c.created_at ASC
            `;

            const comments = await db.query(query, [id]);

            res.json({
                success: true,
                data: comments || []
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
            console.error('Error details:', error.message, error.stack);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch comments',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    /**
     * POST /api/budget-requests/:id/comments
     * Add a comment to a budget request
     */
    router.post('/:id/comments', async (req, res) => {
        try {
            const { id } = req.params;
            const { comment_text } = req.body;

            console.log('Adding comment for budget request:', id);
            console.log('User ID:', req.user?.id);
            console.log('Comment text:', comment_text);

            if (!comment_text || !comment_text.trim()) {
                return res.status(400).json({
                    success: false,
                    error: 'Comment text is required'
                });
            }

            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    error: 'User not authenticated'
                });
            }

            const query = `
                INSERT INTO comments (
                    entity_type,
                    entity_id,
                    comment_text,
                    created_by,
                    created_at
                ) VALUES ('budget_request', ?, ?, ?, NOW())
            `;

            const result = await db.query(query, [id, comment_text, req.user.id]);

            console.log('Comment added successfully, ID:', result.insertId);

            res.json({
                success: true,
                data: {
                    id: result.insertId,
                    message: 'Comment added successfully'
                }
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            console.error('Error details:', error.message, error.stack);
            res.status(500).json({
                success: false,
                error: 'Failed to add comment',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    /**
     * PUT /api/budget-requests/:id/status
     * Change the status of a budget request (for under_review management and resubmission)
     */
    router.put('/:id/status', async (req, res) => {
        try {
            const { id } = req.params;
            const { status, notes, requested_amount, justification, breakdown, priority } = req.body;

            const validStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'returned_for_amendment'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status'
                });
            }

            let query = `UPDATE activity_budget_requests SET status = ?`;
            const params = [status];

            // Allow updating request details when resubmitting (status = submitted)
            if (status === 'submitted') {
                if (requested_amount !== undefined) {
                    query += `, requested_amount = ?`;
                    params.push(requested_amount);
                }
                if (justification !== undefined) {
                    query += `, justification = ?`;
                    params.push(justification);
                }
                if (breakdown !== undefined) {
                    query += `, breakdown = ?`;
                    params.push(JSON.stringify(breakdown));
                }
                if (priority !== undefined) {
                    query += `, priority = ?`;
                    params.push(priority);
                }
                // Clear amendment notes and reset review fields when resubmitting
                query += `, amendment_notes = NULL, rejection_reason = NULL, reviewed_by = NULL, reviewed_at = NULL, submitted_at = NOW()`;
            }

            if (notes) {
                query += `, finance_notes = ?`;
                params.push(notes);
            }

            if (status !== 'under_review' && status !== 'submitted') {
                query += `, reviewed_by = ?, reviewed_at = NOW()`;
                params.push(req.user.id);
            }

            query += ` WHERE id = ?`;
            params.push(id);

            await db.query(query, params);

            res.json({
                success: true,
                message: `Status updated to ${status}`
            });
        } catch (error) {
            console.error('Error updating status:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update status'
            });
        }
    });

    // ==================== BUDGET REVISION ====================

    /**
     * PUT /api/budget-requests/:id/revise
     * Revise an approved budget (finance team only)
     */
    router.put('/:id/revise', async (req, res) => {
        try {
            const { id } = req.params;
            const { new_amount, revision_reason } = req.body;

            if (!new_amount || !revision_reason) {
                return res.status(400).json({
                    success: false,
                    error: 'New amount and revision reason are required'
                });
            }

            // Get current budget request
            const requestQuery = `
                SELECT
                    abr.approved_amount as previous_amount,
                    abr.activity_id,
                    abr.requested_by,
                    abr.request_number,
                    a.name as activity_name,
                    a.project_id,
                    p.program_id
                FROM activity_budget_requests abr
                LEFT JOIN activities a ON abr.activity_id = a.id
                LEFT JOIN projects p ON a.project_id = p.id
                WHERE abr.id = ? AND abr.status = 'approved'
            `;
            const [request] = await db.query(requestQuery, [id]);

            if (!request) {
                return res.status(404).json({
                    success: false,
                    error: 'Approved budget request not found'
                });
            }

            const difference = new_amount - request.previous_amount;

            // Record revision history
            const historyQuery = `
                INSERT INTO budget_revision_history (
                    budget_request_id,
                    previous_amount,
                    new_amount,
                    revision_reason,
                    revised_by
                ) VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(historyQuery, [id, request.previous_amount, new_amount, revision_reason, req.user.id]);

            // Update budget request
            const updateQuery = `
                UPDATE activity_budget_requests
                SET approved_amount = ?, finance_notes = CONCAT(COALESCE(finance_notes, ''), '\n\nREVISION: ', ?)
                WHERE id = ?
            `;
            await db.query(updateQuery, [new_amount, revision_reason, id]);

            // Update activity budget
            const budgetQuery = `
                UPDATE activity_budgets
                SET
                    approved_budget = approved_budget + ?,
                    allocated_budget = allocated_budget + ?,
                    last_allocation_date = CURDATE(),
                    last_updated_by = ?
                WHERE activity_id = ?
            `;
            await db.query(budgetQuery, [difference, difference, req.user.id, request.activity_id]);

            // Update program budget
            if (request.program_id) {
                const programQuery = `
                    UPDATE program_budgets
                    SET allocated_budget = allocated_budget + ?
                    WHERE program_module_id = ?
                    AND status = 'active'
                    AND budget_start_date <= CURDATE()
                    AND budget_end_date >= CURDATE()
                    ORDER BY id DESC
                    LIMIT 1
                `;
                await db.query(programQuery, [difference, request.program_id]);
            }

            // Notify the requestor
            const notificationQuery = `
                INSERT INTO notifications (
                    user_id,
                    type,
                    title,
                    message,
                    entity_type,
                    entity_id,
                    action_url
                ) VALUES (?, 'budget_revised', ?, ?, 'budget_request', ?, ?)
            `;
            await db.query(notificationQuery, [
                request.requested_by,
                'Budget Revised',
                `Your approved budget #${request.request_number} for "${request.activity_name}" has been revised from KES ${request.previous_amount.toLocaleString()} to KES ${new_amount.toLocaleString()}. Reason: ${revision_reason}`,
                id,
                `/my-budget-requests`
            ]);

            res.json({
                success: true,
                message: 'Budget revised successfully',
                data: {
                    previous_amount: request.previous_amount,
                    new_amount,
                    difference
                }
            });
        } catch (error) {
            console.error('Error revising budget:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to revise budget'
            });
        }
    });

    // ==================== EXPENDITURE TRACKING ====================

    /**
     * GET /api/budget-requests/activity/:activityId/expenditures
     * Get all expenditures for an activity
     */
    router.get('/activity/:activityId/expenditures', async (req, res) => {
        try {
            const { activityId } = req.params;

            const query = `
                SELECT
                    ae.*,
                    u1.full_name as submitted_by_name,
                    u2.full_name as approved_by_name,
                    abr.request_number
                FROM activity_expenditures ae
                LEFT JOIN users u1 ON ae.submitted_by = u1.id
                LEFT JOIN users u2 ON ae.approved_by = u2.id
                LEFT JOIN activity_budget_requests abr ON ae.budget_request_id = abr.id
                WHERE ae.activity_id = ?
                AND ae.deleted_at IS NULL
                ORDER BY ae.expense_date DESC, ae.created_at DESC
            `;

            const expenditures = await db.query(query, [activityId]);

            res.json({
                success: true,
                data: expenditures || []
            });
        } catch (error) {
            console.error('Error fetching expenditures:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch expenditures'
            });
        }
    });

    /**
     * POST /api/budget-requests/expenditures
     * Create new expenditure record
     */
    router.post('/expenditures', async (req, res) => {
        try {
            const {
                activity_id,
                budget_request_id,
                expense_date,
                expense_category,
                description,
                amount,
                receipt_number,
                vendor_name,
                payment_method,
                notes
            } = req.body;

            const query = `
                INSERT INTO activity_expenditures (
                    activity_id,
                    budget_request_id,
                    expense_date,
                    expense_category,
                    description,
                    amount,
                    receipt_number,
                    vendor_name,
                    payment_method,
                    notes,
                    submitted_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(query, [
                activity_id,
                budget_request_id || null,
                expense_date,
                expense_category,
                description,
                amount,
                receipt_number || null,
                vendor_name || null,
                payment_method || 'cash',
                notes || null,
                req.user.id
            ]);

            // Update activity budget spent amount
            const updateBudgetQuery = `
                UPDATE activity_budgets
                SET spent_budget = spent_budget + ?
                WHERE activity_id = ?
            `;
            await db.query(updateBudgetQuery, [amount, activity_id]);

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId
                },
                message: 'Expenditure recorded successfully'
            });
        } catch (error) {
            console.error('Error creating expenditure:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to record expenditure'
            });
        }
    });

    /**
     * PUT /api/budget-requests/expenditures/:id/approve
     * Approve an expenditure
     */
    router.put('/expenditures/:id/approve', async (req, res) => {
        try {
            const { id } = req.params;
            const { notes } = req.body;

            const query = `
                UPDATE activity_expenditures
                SET
                    status = 'approved',
                    approved_by = ?,
                    approved_at = NOW(),
                    notes = CONCAT(COALESCE(notes, ''), '\n\nAPPROVAL NOTE: ', ?)
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [req.user.id, notes || 'Approved', id]);

            res.json({
                success: true,
                message: 'Expenditure approved successfully'
            });
        } catch (error) {
            console.error('Error approving expenditure:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to approve expenditure'
            });
        }
    });

    // ==================== USER NOTIFICATIONS ====================

    /**
     * GET /api/budget-requests/user/notifications
     * Get notifications for current user
     */
    router.get('/user/notifications', async (req, res) => {
        try {
            const userId = req.user.id;
            const { unread_only } = req.query;

            let query = `
                SELECT *
                FROM notifications
                WHERE user_id = ?
                AND deleted_at IS NULL
            `;

            const params = [userId];

            if (unread_only === 'true') {
                query += ` AND is_read = 0`;
            }

            query += ` ORDER BY created_at DESC LIMIT 50`;

            const notifications = await db.query(query, params);

            res.json({
                success: true,
                data: notifications || []
            });
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch notifications'
            });
        }
    });

    /**
     * PUT /api/budget-requests/notifications/:id/read
     * Mark notification as read
     */
    router.put('/notifications/:id/read', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                UPDATE notifications
                SET is_read = 1, read_at = NOW()
                WHERE id = ? AND user_id = ?
            `;

            await db.query(query, [id, req.user.id]);

            res.json({
                success: true,
                message: 'Notification marked as read'
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to mark notification as read'
            });
        }
    });

    return router;
};
