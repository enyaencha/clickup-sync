/**
 * Resource Management API Routes
 * Endpoints for managing resources, requests, and maintenance
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
    const createNotification = async (notification) => {
        const {
            user_id,
            title,
            message,
            entity_type = 'resource_request',
            entity_id = null,
            action_url = null
        } = notification;

        if (!user_id) return;

        await db.query(
            `INSERT INTO notifications (user_id, type, title, message, entity_type, entity_id, action_url)
             VALUES (?, 'general', ?, ?, ?, ?, ?)`,
            [user_id, title, message, entity_type, entity_id, action_url]
        );
    };

    const overlapClause = `
        AND rr.start_date <= ?
        AND rr.end_date >= ?
    `;

    const overlapParams = (startDate, endDate) => ([
        endDate,
        startDate
    ]);

    // ==================== RESOURCE TYPES ====================

    /**
     * GET /api/resources/types
     * Get all resource types
     */
    router.get('/types', async (req, res) => {
        try {
            const query = `
                SELECT * FROM resource_types
                WHERE is_active = TRUE
                ORDER BY category, name
            `;

            const results = await db.query(query);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching resource types:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch resource types'
            });
        }
    });

    /**
     * POST /api/resources/types
     * Create a new resource type
     */
    router.post('/types', async (req, res) => {
        try {
            const { name, category, description } = req.body;

            const query = `
                INSERT INTO resource_types (name, category, description)
                VALUES (?, ?, ?)
            `;

            const result = await db.query(query, [name, category, description]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId },
                message: 'Resource type created successfully'
            });
        } catch (error) {
            console.error('Error creating resource type:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create resource type'
            });
        }
    });

    /**
     * PUT /api/resources/types/:id
     * Update a resource type
     */
    router.put('/types/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { name, category, description } = req.body;

            const query = `
                UPDATE resource_types
                SET name = ?, category = ?, description = ?
                WHERE id = ?
            `;

            await db.query(query, [name, category, description, id]);

            res.json({
                success: true,
                message: 'Resource type updated successfully'
            });
        } catch (error) {
            console.error('Error updating resource type:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update resource type'
            });
        }
    });

    /**
     * DELETE /api/resources/types/:id
     * Soft delete a resource type (set is_active to FALSE)
     */
    router.delete('/types/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                UPDATE resource_types
                SET is_active = FALSE
                WHERE id = ?
            `;

            await db.query(query, [id]);

            res.json({
                success: true,
                message: 'Resource type deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting resource type:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete resource type'
            });
        }
    });

    // ==================== RESOURCE REQUESTS ====================

    /**
     * GET /api/resources/requests
     * Get all resource requests with optional filtering
     */
    router.get('/requests', async (req, res) => {
        try {
            const {
                status,
                request_type,
                program_module_id
            } = req.query;

            await db.query(`
                UPDATE resource_requests rr
                SET
                    rr.status = 'returned',
                    rr.actual_return_date = COALESCE(rr.actual_return_date, CURDATE())
                WHERE rr.status IN ('allocated', 'in_use')
                AND rr.end_date IS NOT NULL
                AND rr.end_date < CURDATE()
                AND rr.deleted_at IS NULL
            `);

            await db.query(`
                UPDATE resources r
                JOIN resource_requests rr ON rr.resource_id = r.id
                SET r.availability_status = 'in_use'
                WHERE rr.status = 'allocated'
                AND rr.start_date <= CURDATE()
                AND (rr.end_date IS NULL OR rr.end_date >= CURDATE())
                AND r.availability_status = 'reserved'
                AND rr.deleted_at IS NULL
            `);

            // Safely parse limit and offset with defaults
            const limit = Math.max(1, parseInt(req.query.limit) || 50);
            const offset = Math.max(0, parseInt(req.query.offset) || 0);

            let query = `
                SELECT
                    rr.*,
                    rr.resource_id,
                    r.name as resource_name,
                    r.resource_code,
                    r.availability_status as resource_status,
                    rt.name as resource_type_name,
                    u.full_name as requester_name,
                    pm.name as program_module_name,
                    u2.full_name as approved_by_name,
                    u3.full_name as fulfilled_by_name
                FROM resource_requests rr
                LEFT JOIN resources r ON rr.resource_id = r.id
                LEFT JOIN resource_types rt ON rr.resource_type_id = rt.id
                LEFT JOIN users u ON rr.requested_by = u.id
                LEFT JOIN program_modules pm ON rr.program_module_id = pm.id
                LEFT JOIN users u2 ON rr.approved_by = u2.id
                LEFT JOIN users u3 ON rr.fulfilled_by = u3.id
                WHERE rr.deleted_at IS NULL
            `;

            const params = [];

            if (status) {
                query += ` AND rr.status = ?`;
                params.push(status);
            }

            if (request_type) {
                query += ` AND rr.request_type = ?`;
                params.push(request_type);
            }

            if (program_module_id) {
                query += ` AND rr.program_module_id = ?`;
                params.push(program_module_id);
            }

            query += ` ORDER BY
                FIELD(rr.priority, 'urgent', 'high', 'medium', 'low'),
                rr.created_at DESC
                LIMIT ${limit} OFFSET ${offset}`;

            const results = await db.query(query, params);

            const enriched = await Promise.all(results.map(async (request) => {
                if (!request.resource_id || !request.start_date || !request.end_date) {
                    return {
                        ...request,
                        has_conflict: false,
                        queue_position: null,
                        conflict_details: null
                    };
                }

                // Conflict checks are only needed for pending requests.
                // This avoids expensive N+1 queries for historical approved/returned rows.
                if (request.status !== 'pending') {
                    return {
                        ...request,
                        has_conflict: false,
                        queue_position: null,
                        conflict_details: null
                    };
                }

                const conflictQuery = `
                    SELECT
                        rr.id,
                        rr.request_number,
                        rr.status,
                        rr.start_date,
                        rr.end_date,
                        u.full_name as requester_name
                    FROM resource_requests rr
                    LEFT JOIN users u ON rr.requested_by = u.id
                    WHERE rr.resource_id = ?
                    AND rr.id <> ?
                    AND rr.status IN ('approved', 'allocated', 'in_use')
                    AND rr.deleted_at IS NULL
                    ${overlapClause}
                    ORDER BY rr.start_date ASC
                    LIMIT 1
                `;

                const conflicts = await db.query(conflictQuery, [
                    request.resource_id,
                    request.id,
                    ...overlapParams(request.start_date, request.end_date)
                ]);

                const queueQuery = `
                    SELECT COUNT(*) as queue_count
                    FROM resource_requests rr
                    WHERE rr.resource_id = ?
                    AND rr.status = 'pending'
                    AND rr.deleted_at IS NULL
                    ${overlapClause}
                    AND rr.created_at < ?
                `;

                const queueResults = await db.query(queueQuery, [
                    request.resource_id,
                    ...overlapParams(request.start_date, request.end_date),
                    request.created_at
                ]);

                return {
                    ...request,
                    has_conflict: conflicts.length > 0,
                    conflict_details: conflicts.length > 0 ? conflicts[0] : null,
                    queue_position: (queueResults[0]?.queue_count || 0) + 1
                };
            }));

            res.json({
                success: true,
                data: enriched
            });
        } catch (error) {
            console.error('Error fetching resource requests:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch resource requests'
            });
        }
    });

    /**
     * POST /api/resources/requests
     * Create a new resource request with conflict detection
     */
    router.post('/requests', async (req, res) => {
        try {
            const {
                resource_id,
                resource_type_id,
                program_module_id,
                activity_id,
                request_type,
                quantity_requested,
                purpose,
                start_date,
                end_date,
                priority
            } = req.body;

            // Check for date conflicts with approved/allocated requests
            let hasConflict = false;
            let conflictDetails = null;
            let queuePosition = null;

            if (resource_id && start_date && end_date) {
                const conflictQuery = `
                    SELECT
                        rr.id,
                        rr.request_number,
                        rr.start_date,
                        rr.end_date,
                        u.full_name as requester_name
                    FROM resource_requests rr
                    LEFT JOIN users u ON rr.requested_by = u.id
                    WHERE rr.resource_id = ?
                    AND rr.status IN ('approved', 'allocated', 'in_use')
                    AND rr.deleted_at IS NULL
                    ${overlapClause}
                    LIMIT 1
                `;

                const conflicts = await db.query(conflictQuery, [
                    resource_id,
                    ...overlapParams(start_date, end_date)
                ]);

                if (conflicts.length > 0) {
                    hasConflict = true;
                    conflictDetails = conflicts[0];
                }

                const queueQuery = `
                    SELECT COUNT(*) as queue_count
                    FROM resource_requests rr
                    WHERE rr.resource_id = ?
                    AND rr.status = 'pending'
                    AND rr.deleted_at IS NULL
                    ${overlapClause}
                `;

                const queueResults = await db.query(queueQuery, [
                    resource_id,
                    ...overlapParams(start_date, end_date)
                ]);

                queuePosition = (queueResults[0]?.queue_count || 0) + 1;
            }

            // Generate request number
            const requestNumber = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            // Calculate duration if dates provided
            let durationDays = null;
            if (start_date && end_date) {
                const start = new Date(start_date);
                const end = new Date(end_date);
                durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }

            const query = `
                INSERT INTO resource_requests (
                    request_number, resource_id, resource_type_id,
                    program_module_id, activity_id,
                    request_type, quantity_requested, purpose,
                    start_date, end_date, duration_days,
                    expected_return_date,
                    priority, status, requested_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
            `;

            const result = await db.query(query, [
                requestNumber,
                resource_id || null,
                resource_type_id || null,
                program_module_id || null,
                activity_id || null,
                request_type,
                quantity_requested || 1,
                purpose,
                start_date || null,
                end_date || null,
                durationDays,
                end_date || null,
                priority || 'medium',
                req.user.id
            ]);

            if (hasConflict || (queuePosition && queuePosition > 1)) {
                await createNotification({
                    user_id: req.user.id,
                    title: 'Resource request queued',
                    message: hasConflict
                        ? `Your request ${requestNumber} conflicts with an existing booking and is queued for review.`
                        : `Your request ${requestNumber} has been placed in the queue (position ${queuePosition}).`,
                    entity_id: result.insertId
                });
            }

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    request_number: requestNumber,
                    has_conflict: hasConflict,
                    conflict_details: conflictDetails,
                    queue_position: queuePosition
                },
                message: hasConflict
                    ? '⚠️ Request created but conflicts with an existing approved booking. Review required.'
                    : 'Resource request created successfully'
            });
        } catch (error) {
            console.error('Error creating resource request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create resource request'
            });
        }
    });

    /**
     * PUT /api/resources/requests/:id/approve
     * Approve a resource request
     */
    router.put('/requests/:id/approve', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                UPDATE resource_requests
                SET
                    status = 'approved',
                    approved_by = ?,
                    approved_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [req.user.id, id]);

            const requestRows = await db.query(
                `SELECT requested_by, request_number FROM resource_requests WHERE id = ?`,
                [id]
            );

            if (requestRows.length > 0) {
                await createNotification({
                    user_id: requestRows[0].requested_by,
                    title: 'Resource request approved',
                    message: `Your resource request ${requestRows[0].request_number} has been approved.`,
                    entity_id: id
                });
            }

            res.json({
                success: true,
                message: 'Resource request approved successfully'
            });
        } catch (error) {
            console.error('Error approving resource request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to approve resource request'
            });
        }
    });

    /**
     * PUT /api/resources/requests/:id/reject
     * Reject a resource request
     */
    router.put('/requests/:id/reject', async (req, res) => {
        try {
            const { id } = req.params;
            const { rejection_reason } = req.body;

            const query = `
                UPDATE resource_requests
                SET
                    status = 'rejected',
                    rejection_reason = ?,
                    approved_by = ?,
                    approved_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [rejection_reason, req.user.id, id]);

            const requestRows = await db.query(
                `SELECT requested_by, request_number FROM resource_requests WHERE id = ?`,
                [id]
            );

            if (requestRows.length > 0) {
                await createNotification({
                    user_id: requestRows[0].requested_by,
                    title: 'Resource request rejected',
                    message: `Your resource request ${requestRows[0].request_number} was rejected. ${rejection_reason || ''}`.trim(),
                    entity_id: id
                });
            }

            res.json({
                success: true,
                message: 'Resource request rejected'
            });
        } catch (error) {
            console.error('Error rejecting resource request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to reject resource request'
            });
        }
    });

    /**
     * PUT /api/resources/requests/:id/allocate
     * Allocate a resource for an approved request
     */
    router.put('/requests/:id/allocate', async (req, res) => {
        try {
            const { id } = req.params;

            const requestRows = await db.query(
                `SELECT * FROM resource_requests WHERE id = ? AND deleted_at IS NULL`,
                [id]
            );

            if (requestRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource request not found'
                });
            }

            const request = requestRows[0];

            if (request.status !== 'approved') {
                return res.status(400).json({
                    success: false,
                    error: 'Only approved requests can be allocated'
                });
            }

            if (!request.resource_id) {
                return res.status(400).json({
                    success: false,
                    error: 'Request must specify a resource before allocation'
                });
            }

            if (!request.start_date || !request.end_date) {
                return res.status(400).json({
                    success: false,
                    error: 'Start and end dates are required for allocation'
                });
            }

            const conflictQuery = `
                SELECT rr.id
                FROM resource_requests rr
                WHERE rr.resource_id = ?
                AND rr.id <> ?
                AND rr.status IN ('allocated', 'in_use')
                AND rr.deleted_at IS NULL
                ${overlapClause}
                LIMIT 1
            `;

            const conflicts = await db.query(conflictQuery, [
                request.resource_id,
                request.id,
                ...overlapParams(request.start_date, request.end_date)
            ]);

            if (conflicts.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'Resource is already allocated for the selected dates'
                });
            }

            const [resource] = await db.query(
                `SELECT id FROM resources WHERE id = ? AND deleted_at IS NULL`,
                [request.resource_id]
            );

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }

            const allocationStatusQuery = `
                UPDATE resource_requests
                SET
                    status = 'allocated',
                    fulfilled_by = ?,
                    fulfilled_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(allocationStatusQuery, [req.user.id, id]);

            const availabilityStatus = new Date(request.start_date) > new Date()
                ? 'reserved'
                : 'in_use';

            await db.query(
                `UPDATE resources
                 SET
                    availability_status = ?,
                    assigned_to_program = ?,
                    assignment_date = CURDATE(),
                    updated_at = NOW()
                 WHERE id = ?`,
                [availabilityStatus, request.program_module_id || null, request.resource_id]
            );

            await createNotification({
                user_id: request.requested_by,
                title: 'Resource allocated',
                message: `Your resource request ${request.request_number} has been allocated.`,
                entity_id: id
            });

            res.json({
                success: true,
                message: 'Resource allocated successfully'
            });
        } catch (error) {
            console.error('Error allocating resource request:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to allocate resource request'
            });
        }
    });

    /**
     * PUT /api/resources/requests/:id/return
     * Confirm return of an allocated resource
     */
    router.put('/requests/:id/return', async (req, res) => {
        try {
            const { id } = req.params;
            const { return_condition, return_notes } = req.body || {};

            const requestRows = await db.query(
                `SELECT * FROM resource_requests WHERE id = ? AND deleted_at IS NULL`,
                [id]
            );

            if (requestRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource request not found'
                });
            }

            const request = requestRows[0];

            if (!['allocated', 'in_use', 'returned'].includes(request.status)) {
                return res.status(400).json({
                    success: false,
                    error: 'Request is not in a returnable state'
                });
            }

            await db.query(
                `UPDATE resource_requests
                 SET
                    status = 'returned',
                    actual_return_date = CURDATE(),
                    return_condition = COALESCE(?, return_condition),
                    return_notes = COALESCE(?, return_notes),
                    updated_at = NOW()
                 WHERE id = ? AND deleted_at IS NULL`,
                [return_condition || null, return_notes || null, id]
            );

            if (request.resource_id) {
                await db.query(
                    `UPDATE resources
                     SET
                        availability_status = 'available',
                        assigned_to_program = NULL,
                        assignment_date = NULL,
                        updated_at = NOW()
                     WHERE id = ?`,
                    [request.resource_id]
                );
            }

            await createNotification({
                user_id: request.requested_by,
                title: 'Resource returned',
                message: `Resource request ${request.request_number} has been marked as returned.`,
                entity_id: id
            });

            res.json({
                success: true,
                message: 'Resource return confirmed'
            });
        } catch (error) {
            console.error('Error returning resource:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to confirm resource return'
            });
        }
    });

    /**
     * GET /api/resources/requests/:id/comments
     * Get comments for a resource request
     */
    router.get('/requests/:id/comments', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                SELECT
                    c.id,
                    c.comment_text,
                    c.created_at,
                    c.updated_at,
                    c.created_by as created_by_id,
                    u.full_name as created_by_name
                FROM comments c
                LEFT JOIN users u ON c.created_by = u.id
                WHERE c.entity_type = 'resource_request'
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
            console.error('Error fetching resource request comments:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch comments'
            });
        }
    });

    /**
     * POST /api/resources/requests/:id/comments
     * Add comment to a resource request
     */
    router.post('/requests/:id/comments', async (req, res) => {
        try {
            const { id } = req.params;
            const { comment_text } = req.body;

            if (!comment_text || !comment_text.trim()) {
                return res.status(400).json({
                    success: false,
                    error: 'Comment text is required'
                });
            }

            const insertQuery = `
                INSERT INTO comments (
                    entity_type,
                    entity_id,
                    comment_text,
                    created_by,
                    created_at
                ) VALUES ('resource_request', ?, ?, ?, NOW())
            `;

            const result = await db.query(insertQuery, [id, comment_text, req.user.id]);

            const requestRows = await db.query(
                `SELECT requested_by, request_number FROM resource_requests WHERE id = ?`,
                [id]
            );

            if (requestRows.length > 0 && requestRows[0].requested_by !== req.user.id) {
                await createNotification({
                    user_id: requestRows[0].requested_by,
                    title: 'New comment on resource request',
                    message: `A new comment was added to request ${requestRows[0].request_number}.`,
                    entity_id: id
                });
            }

            res.json({
                success: true,
                data: { id: result.insertId },
                message: 'Comment added successfully'
            });
        } catch (error) {
            console.error('Error adding resource request comment:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add comment'
            });
        }
    });

    // ==================== RESOURCES ====================

    /**
     * GET /api/resources
     * Get all resources with optional filtering
     */
    router.get('/', async (req, res) => {
        try {
            const {
                category,
                availability_status,
                condition_status,
                assigned_to_program,
                search
            } = req.query;

            // Safely parse limit and offset with defaults
            const limit = Math.max(1, parseInt(req.query.limit) || 100);
            const offset = Math.max(0, parseInt(req.query.offset) || 0);

            let query = `
                SELECT
                    r.*,
                    rt.name as resource_type_name,
                    u.full_name as assigned_to_user_name,
                    pm.name as assigned_to_program_name
                FROM resources r
                LEFT JOIN resource_types rt ON r.resource_type_id = rt.id
                LEFT JOIN users u ON r.assigned_to_user = u.id
                LEFT JOIN program_modules pm ON r.assigned_to_program = pm.id
                WHERE r.deleted_at IS NULL
            `;

            const params = [];

            if (category) {
                query += ` AND r.category = ?`;
                params.push(category);
            }

            if (availability_status) {
                query += ` AND r.availability_status = ?`;
                params.push(availability_status);
            }

            if (condition_status) {
                query += ` AND r.condition_status = ?`;
                params.push(condition_status);
            }

            if (assigned_to_program) {
                query += ` AND r.assigned_to_program = ?`;
                params.push(assigned_to_program);
            }

            if (search) {
                query += ` AND (r.name LIKE ? OR r.resource_code LIKE ? OR r.description LIKE ?)`;
                const searchTerm = `%${search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ` ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

            const results = await db.query(query, params);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching resources:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch resources'
            });
        }
    });

    /**
     * GET /api/resources/:id
     * Get a specific resource by ID
     */
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                SELECT
                    r.*,
                    rt.name as resource_type_name,
                    u.full_name as assigned_to_user_name,
                    pm.name as assigned_to_program_name,
                    u2.full_name as created_by_name
                FROM resources r
                LEFT JOIN resource_types rt ON r.resource_type_id = rt.id
                LEFT JOIN users u ON r.assigned_to_user = u.id
                LEFT JOIN program_modules pm ON r.assigned_to_program = pm.id
                LEFT JOIN users u2 ON r.created_by = u2.id
                WHERE r.id = ? AND r.deleted_at IS NULL
            `;

            const results = await db.query(query, [id]);

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }

            res.json({
                success: true,
                data: results[0]
            });
        } catch (error) {
            console.error('Error fetching resource:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch resource'
            });
        }
    });

    /**
     * POST /api/resources
     * Create a new resource
     */
    router.post('/', async (req, res) => {
        try {
            const {
                resource_type_id,
                name,
                description,
                category,
                acquisition_date,
                acquisition_cost,
                acquisition_method,
                supplier,
                serial_number,
                model,
                manufacturer,
                quantity,
                unit_of_measure,
                location,
                current_location,
                condition_status,
                availability_status,
                current_value
            } = req.body;

            // Generate resource code
            const resourceCode = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const query = `
                INSERT INTO resources (
                    resource_code, resource_type_id, name, description, category,
                    acquisition_date, acquisition_cost, acquisition_method, supplier,
                    serial_number, model, manufacturer,
                    quantity, unit_of_measure,
                    location, current_location,
                    condition_status, availability_status, current_value,
                    created_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(query, [
                resourceCode, resource_type_id, name, description, category,
                acquisition_date, acquisition_cost, acquisition_method, supplier,
                serial_number, model, manufacturer,
                quantity || 1, unit_of_measure,
                location, current_location,
                condition_status || 'good', availability_status || 'available', current_value,
                req.user.id
            ]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId, resource_code: resourceCode },
                message: 'Resource created successfully'
            });
        } catch (error) {
            console.error('Error creating resource:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create resource'
            });
        }
    });

    /**
     * PUT /api/resources/:id
     * Update a resource
     */
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const {
                name,
                description,
                condition_status,
                availability_status,
                current_location,
                assigned_to_user,
                assigned_to_program,
                quantity,
                current_value,
                notes
            } = req.body;

            // Convert empty strings to null for database
            const sanitize = (value) => {
                if (value === '' || value === undefined) return null;
                return value;
            };

            const query = `
                UPDATE resources
                SET
                    name = COALESCE(?, name),
                    description = COALESCE(?, description),
                    condition_status = COALESCE(?, condition_status),
                    availability_status = COALESCE(?, availability_status),
                    current_location = COALESCE(?, current_location),
                    assigned_to_user = ?,
                    assigned_to_program = ?,
                    quantity = COALESCE(?, quantity),
                    current_value = COALESCE(?, current_value),
                    notes = COALESCE(?, notes),
                    updated_at = NOW()
                WHERE id = ? AND deleted_at IS NULL
            `;

            await db.query(query, [
                sanitize(name),
                sanitize(description),
                sanitize(condition_status),
                sanitize(availability_status),
                sanitize(current_location),
                sanitize(assigned_to_user),
                sanitize(assigned_to_program),
                sanitize(quantity),
                sanitize(current_value),
                sanitize(notes),
                id
            ]);

            res.json({
                success: true,
                message: 'Resource updated successfully'
            });
        } catch (error) {
            console.error('Error updating resource:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update resource'
            });
        }
    });

    // ==================== MAINTENANCE ====================

    /**
     * GET /api/resources/:id/maintenance
     * Get maintenance history for a specific resource
     */
    router.get('/:id/maintenance', async (req, res) => {
        try {
            const { id } = req.params;

            const query = `
                SELECT
                    rm.*,
                    u.full_name as performed_by_name
                FROM resource_maintenance rm
                LEFT JOIN users u ON rm.performed_by = u.id
                WHERE rm.resource_id = ?
                ORDER BY rm.maintenance_date DESC
            `;

            const results = await db.query(query, [id]);

            res.json({
                success: true,
                data: results
            });
        } catch (error) {
            console.error('Error fetching maintenance records:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch maintenance records'
            });
        }
    });

    /**
     * POST /api/resources/:id/maintenance
     * Record maintenance for a resource
     */
    router.post('/:id/maintenance', async (req, res) => {
        try {
            const { id } = req.params;
            const {
                maintenance_date,
                maintenance_type,
                issue_description,
                work_performed,
                service_provider,
                technician_name,
                cost,
                downtime_start,
                downtime_end,
                parts_replaced,
                parts_cost,
                next_maintenance_date,
                notes
            } = req.body;

            // Calculate downtime hours if provided
            let downtimeHours = null;
            if (downtime_start && downtime_end) {
                const start = new Date(downtime_start);
                const end = new Date(downtime_end);
                downtimeHours = (end - start) / (1000 * 60 * 60);
            }

            const query = `
                INSERT INTO resource_maintenance (
                    resource_id, maintenance_date, maintenance_type,
                    issue_description, work_performed,
                    service_provider, technician_name,
                    cost, downtime_start, downtime_end, downtime_hours,
                    parts_replaced, parts_cost, next_maintenance_date,
                    performed_by, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(query, [
                id, maintenance_date, maintenance_type,
                issue_description, work_performed,
                service_provider, technician_name,
                cost, downtime_start, downtime_end, downtimeHours,
                parts_replaced, parts_cost, next_maintenance_date,
                req.user.id, notes
            ]);

            // Update resource's last and next maintenance dates
            await db.query(`
                UPDATE resources
                SET
                    last_maintenance_date = ?,
                    next_maintenance_date = ?
                WHERE id = ?
            `, [maintenance_date, next_maintenance_date, id]);

            res.status(201).json({
                success: true,
                data: { id: result.insertId },
                message: 'Maintenance record created successfully'
            });
        } catch (error) {
            console.error('Error creating maintenance record:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create maintenance record'
            });
        }
    });

    return router;
};
