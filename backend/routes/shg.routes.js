/**
 * Self-Help Groups (SHG) API Routes
 * Endpoints for managing SHG groups, members, and meetings
 */

const express = require('express');
const router = express.Router();

module.exports = (shgService) => {
    const db = shgService.db;

    // ==================== SHG GROUPS ====================

    /**
     * GET /api/shg/groups
     * Get all SHG groups with optional filtering
     */
    router.get('/groups', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                status: req.query.status,
                registration_status: req.query.registration_status,
                county: req.query.county,
                search: req.query.search
            };

            // Apply module filtering for non-admin users
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                if (filters.program_module_id) {
                    const hasAccess = req.user.module_assignments.some(
                        m => m.module_id === parseInt(filters.program_module_id) && m.can_view
                    );
                    if (!hasAccess) {
                        return res.status(403).json({
                            success: false,
                            error: 'You do not have access to this module'
                        });
                    }
                }
            }

            const groups = await shgService.getGroups(filters);

            // Filter by user's assigned modules
            let filteredGroups = groups;
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                const assignedModuleIds = req.user.module_assignments
                    .filter(m => m.can_view)
                    .map(m => m.module_id);

                filteredGroups = groups.filter(g =>
                    assignedModuleIds.includes(g.program_module_id)
                );
            }

            res.json({
                success: true,
                data: filteredGroups,
                count: filteredGroups.length
            });
        } catch (error) {
            console.error('Error fetching SHG groups:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/shg/groups/:id
     * Get SHG group by ID with detailed information
     */
    router.get('/groups/:id', async (req, res) => {
        try {
            const group = await shgService.getGroupById(req.params.id);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            // Check if user has access to this group's module
            if (!req.user.is_system_admin) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this group'
                    });
                }
            }

            res.json({
                success: true,
                data: group
            });
        } catch (error) {
            console.error('Error fetching SHG group:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/shg/groups
     * Create a new SHG group
     */
    router.post('/groups', async (req, res) => {
        try {
            const groupData = req.body;

            // Check if user has permission to create in this module
            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === parseInt(groupData.program_module_id) && m.can_create
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to create SHG groups in this module'
                    });
                }
            }

            // Set facilitator_id to current user if not specified
            if (!groupData.facilitator_id) {
                groupData.facilitator_id = req.user.id;
            }

            const id = await shgService.createGroup(groupData);

            res.status(201).json({
                success: true,
                id,
                message: 'SHG group created successfully'
            });
        } catch (error) {
            console.error('Error creating SHG group:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/shg/groups/:id
     * Update SHG group
     */
    router.put('/groups/:id', async (req, res) => {
        try {
            const group = await shgService.getGroupById(req.params.id);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            // Check if user has permission to edit in this module
            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_edit
                );

                // Also allow if user is the facilitator
                const isFacilitator = group.facilitator_id === req.user.id;

                if (!hasPermission && !isFacilitator) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to edit this group'
                    });
                }
            }

            await shgService.updateGroup(req.params.id, req.body);

            res.json({
                success: true,
                message: 'SHG group updated successfully'
            });
        } catch (error) {
            console.error('Error updating SHG group:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/shg/groups/:id
     * Delete SHG group (soft delete)
     */
    router.delete('/groups/:id', async (req, res) => {
        try {
            const group = await shgService.getGroupById(req.params.id);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            // Check if user has permission to delete in this module
            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_delete
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to delete this group'
                    });
                }
            }

            await shgService.deleteGroup(req.params.id);

            res.json({
                success: true,
                message: 'SHG group deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting SHG group:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/shg/statistics
     * Get SHG statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id
            };

            // Apply module filtering for non-admin users
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                if (filters.program_module_id) {
                    const hasAccess = req.user.module_assignments.some(
                        m => m.module_id === parseInt(filters.program_module_id) && m.can_view
                    );
                    if (!hasAccess) {
                        return res.status(403).json({
                            success: false,
                            error: 'You do not have access to this module'
                        });
                    }
                }
            }

            const stats = await shgService.getStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching SHG statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==================== SHG MEMBERS ====================

    /**
     * GET /api/shg/groups/:groupId/members
     * Get members of an SHG group
     */
    router.get('/groups/:groupId/members', async (req, res) => {
        try {
            // Check group access
            const group = await shgService.getGroupById(req.params.groupId);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            if (!req.user.is_system_admin) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this group'
                    });
                }
            }

            const filters = {
                membership_status: req.query.membership_status,
                position: req.query.position
            };

            const members = await shgService.getGroupMembers(req.params.groupId, filters);

            res.json({
                success: true,
                data: members,
                count: members.length
            });
        } catch (error) {
            console.error('Error fetching SHG members:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/shg/members
     * Add member to SHG group
     */
    router.post('/members', async (req, res) => {
        try {
            const memberData = req.body;

            // Check group access and permission
            const group = await shgService.getGroupById(memberData.shg_group_id);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_create
                );

                const isFacilitator = group.facilitator_id === req.user.id;

                if (!hasPermission && !isFacilitator) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to add members to this group'
                    });
                }
            }

            const id = await shgService.addMember(memberData);

            res.status(201).json({
                success: true,
                id,
                message: 'Member added to SHG group successfully'
            });
        } catch (error) {
            console.error('Error adding SHG member:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/shg/members/:id
     * Update SHG member
     */
    router.put('/members/:id', async (req, res) => {
        try {
            await shgService.updateMember(req.params.id, req.body);

            res.json({
                success: true,
                message: 'SHG member updated successfully'
            });
        } catch (error) {
            console.error('Error updating SHG member:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/shg/members/:id
     * Remove member from group
     */
    router.delete('/members/:id', async (req, res) => {
        try {
            await shgService.removeMember(req.params.id);

            res.json({
                success: true,
                message: 'Member removed from SHG group successfully'
            });
        } catch (error) {
            console.error('Error removing SHG member:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==================== SHG MEETINGS ====================

    /**
     * GET /api/shg/groups/:groupId/meetings
     * Get meetings for an SHG group
     */
    router.get('/groups/:groupId/meetings', async (req, res) => {
        try {
            // Check group access
            const group = await shgService.getGroupById(req.params.groupId);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            if (!req.user.is_system_admin) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this group'
                    });
                }
            }

            const filters = {
                meeting_type: req.query.meeting_type,
                from_date: req.query.from_date,
                to_date: req.query.to_date
            };

            const meetings = await shgService.getMeetings(req.params.groupId, filters);

            res.json({
                success: true,
                data: meetings,
                count: meetings.length
            });
        } catch (error) {
            console.error('Error fetching SHG meetings:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/shg/meetings
     * Create a new meeting record
     */
    router.post('/meetings', async (req, res) => {
        try {
            const meetingData = req.body;

            // Check group access and permission
            const group = await shgService.getGroupById(meetingData.shg_group_id);

            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'SHG group not found'
                });
            }

            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_create
                );

                const isFacilitator = group.facilitator_id === req.user.id;

                if (!hasPermission && !isFacilitator) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to record meetings for this group'
                    });
                }
            }

            // Set recorded_by to current user
            meetingData.recorded_by = req.user.id;

            const id = await shgService.createMeeting(meetingData);

            res.status(201).json({
                success: true,
                id,
                message: 'Meeting recorded successfully'
            });
        } catch (error) {
            console.error('Error creating SHG meeting:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
