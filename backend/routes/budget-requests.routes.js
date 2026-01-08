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

            // Get request details
            const requestQuery = `SELECT activity_id, approved_amount FROM activity_budget_requests WHERE id = ?`;
            const [request] = await db.query(requestQuery, [id]);

            if (request) {
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
            }

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
     * Change the status of a budget request (for under_review management)
     */
    router.put('/:id/status', async (req, res) => {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;

            const validStatuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'returned_for_amendment'];

            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid status'
                });
            }

            let query = `UPDATE activity_budget_requests SET status = ?`;
            const params = [status];

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

    return router;
};
