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

    return router;
};
