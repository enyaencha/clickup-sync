/**
 * Beneficiaries API Routes
 * Endpoints for managing beneficiary registration and information
 */

const express = require('express');
const router = express.Router();

module.exports = (beneficiariesService) => {
    const db = beneficiariesService.db;

    /**
     * GET /api/beneficiaries
     * Get all beneficiaries with optional filtering
     */
    router.get('/', async (req, res) => {
        try {
            const filters = {
                program_module_id: req.query.program_module_id,
                status: req.query.status,
                gender: req.query.gender,
                vulnerability_category: req.query.vulnerability_category,
                search: req.query.search,
                limit: req.query.limit,
                offset: req.query.offset
            };

            // Filter by user's module assignments if not system admin
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                // If user specified a module, check if they have access to it
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

            const beneficiaries = await beneficiariesService.getBeneficiaries(filters);

            // If user is not admin, filter results to their assigned modules
            let filteredBeneficiaries = beneficiaries;
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                const assignedModuleIds = req.user.module_assignments
                    .filter(m => m.can_view)
                    .map(m => m.module_id);

                filteredBeneficiaries = beneficiaries.filter(b =>
                    !b.program_module_id || assignedModuleIds.includes(b.program_module_id)
                );
            }

            res.json({
                success: true,
                data: filteredBeneficiaries,
                count: filteredBeneficiaries.length
            });
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/beneficiaries/statistics
     * Get beneficiary statistics
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

            const stats = await beneficiariesService.getBeneficiaryStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching beneficiary statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/beneficiaries/:id
     * Get beneficiary by ID
     */
    router.get('/:id', async (req, res) => {
        try {
            const beneficiary = await beneficiariesService.getBeneficiaryById(req.params.id);

            if (!beneficiary) {
                return res.status(404).json({
                    success: false,
                    error: 'Beneficiary not found'
                });
            }

            // Check if user has access to this beneficiary's module
            if (!req.user.is_system_admin && beneficiary.program_module_id) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === beneficiary.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this beneficiary'
                    });
                }
            }

            res.json({
                success: true,
                data: beneficiary
            });
        } catch (error) {
            console.error('Error fetching beneficiary:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/beneficiaries
     * Create a new beneficiary
     */
    router.post('/', async (req, res) => {
        try {
            const beneficiaryData = req.body;

            // Check if user has permission to create in this module
            if (beneficiaryData.program_module_id && !req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === parseInt(beneficiaryData.program_module_id) && m.can_create
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to create beneficiaries in this module'
                    });
                }
            }

            // Set registered_by to current user
            beneficiaryData.registered_by = req.user.id;

            // Set registration_date if not provided
            if (!beneficiaryData.registration_date) {
                beneficiaryData.registration_date = new Date().toISOString().split('T')[0];
            }

            const id = await beneficiariesService.createBeneficiary(beneficiaryData);

            res.status(201).json({
                success: true,
                id,
                message: 'Beneficiary registered successfully'
            });
        } catch (error) {
            console.error('Error creating beneficiary:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * PUT /api/beneficiaries/:id
     * Update beneficiary information
     */
    router.put('/:id', async (req, res) => {
        try {
            const beneficiary = await beneficiariesService.getBeneficiaryById(req.params.id);

            if (!beneficiary) {
                return res.status(404).json({
                    success: false,
                    error: 'Beneficiary not found'
                });
            }

            // Check if user has permission to edit in this module
            if (!req.user.is_system_admin && beneficiary.program_module_id) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === beneficiary.program_module_id && m.can_edit
                );

                // Also allow if user registered this beneficiary
                const isCreator = beneficiary.registered_by === req.user.id;

                if (!hasPermission && !isCreator) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to edit this beneficiary'
                    });
                }
            }

            await beneficiariesService.updateBeneficiary(req.params.id, req.body);

            res.json({
                success: true,
                message: 'Beneficiary updated successfully'
            });
        } catch (error) {
            console.error('Error updating beneficiary:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * DELETE /api/beneficiaries/:id
     * Delete beneficiary (soft delete)
     */
    router.delete('/:id', async (req, res) => {
        try {
            const beneficiary = await beneficiariesService.getBeneficiaryById(req.params.id);

            if (!beneficiary) {
                return res.status(404).json({
                    success: false,
                    error: 'Beneficiary not found'
                });
            }

            // Check if user has permission to delete in this module
            if (!req.user.is_system_admin) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === beneficiary.program_module_id && m.can_delete
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to delete this beneficiary'
                    });
                }
            }

            await beneficiariesService.deleteBeneficiary(req.params.id);

            res.json({
                success: true,
                message: 'Beneficiary deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting beneficiary:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/beneficiaries/program/:programType
     * Get beneficiaries by program type
     */
    router.get('/program/:programType', async (req, res) => {
        try {
            const beneficiaries = await beneficiariesService.getBeneficiariesByProgram(
                req.params.programType
            );

            // Filter by user's module assignments if not admin
            let filteredBeneficiaries = beneficiaries;
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                const assignedModuleIds = req.user.module_assignments
                    .filter(m => m.can_view)
                    .map(m => m.module_id);

                filteredBeneficiaries = beneficiaries.filter(b =>
                    !b.program_module_id || assignedModuleIds.includes(b.program_module_id)
                );
            }

            res.json({
                success: true,
                data: filteredBeneficiaries,
                count: filteredBeneficiaries.length
            });
        } catch (error) {
            console.error('Error fetching beneficiaries by program:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
