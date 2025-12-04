/**
 * Loans API Routes
 * Endpoints for managing microfinance loans and repayments
 */

const express = require('express');
const router = express.Router();

module.exports = (loansService, shgService) => {
    const db = loansService.db;

    // ==================== LOANS ====================

    /**
     * GET /api/loans
     * Get all loans with optional filtering
     */
    router.get('/', async (req, res) => {
        try {
            const filters = {
                shg_group_id: req.query.shg_group_id,
                beneficiary_id: req.query.beneficiary_id,
                loan_status: req.query.loan_status,
                repayment_status: req.query.repayment_status,
                loan_type: req.query.loan_type,
                overdue: req.query.overdue === 'true',
                limit: req.query.limit
            };

            const loans = await loansService.getLoans(filters);

            // Filter by user's assigned modules if not admin
            let filteredLoans = loans;
            if (!req.user.is_system_admin && req.user.module_assignments?.length > 0) {
                // Get group's program module ID for each loan
                const assignedModuleIds = req.user.module_assignments
                    .filter(m => m.can_view)
                    .map(m => m.module_id);

                // We need to check the program_module_id from the shg_groups
                // For now, we'll trust the data or add a JOIN in the service
                // This is a simplified check - consider enhancing the service query
                filteredLoans = loans;
            }

            res.json({
                success: true,
                data: filteredLoans,
                count: filteredLoans.length
            });
        } catch (error) {
            console.error('Error fetching loans:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/loans/statistics
     * Get loans statistics
     */
    router.get('/statistics', async (req, res) => {
        try {
            const filters = {
                shg_group_id: req.query.shg_group_id,
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

            const stats = await loansService.getStatistics(filters);

            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            console.error('Error fetching loan statistics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/loans/overdue
     * Get overdue loans report
     */
    router.get('/overdue', async (req, res) => {
        try {
            const filters = {
                shg_group_id: req.query.shg_group_id,
                program_module_id: req.query.program_module_id
            };

            const overdueLoans = await loansService.getOverdueLoans(filters);

            res.json({
                success: true,
                data: overdueLoans,
                count: overdueLoans.length
            });
        } catch (error) {
            console.error('Error fetching overdue loans:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * GET /api/loans/:id
     * Get loan by ID with full details
     */
    router.get('/:id', async (req, res) => {
        try {
            const loan = await loansService.getLoanById(req.params.id);

            if (!loan) {
                return res.status(404).json({
                    success: false,
                    error: 'Loan not found'
                });
            }

            // Check if user has access (get the group to check module)
            const group = await shgService.getGroupById(loan.shg_group_id);

            if (!req.user.is_system_admin && group) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this loan'
                    });
                }
            }

            res.json({
                success: true,
                data: loan
            });
        } catch (error) {
            console.error('Error fetching loan:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/loans
     * Create a new loan
     */
    router.post('/', async (req, res) => {
        try {
            const loanData = req.body;

            // Check if user has permission to create loans in this group's module
            const group = await shgService.getGroupById(loanData.shg_group_id);

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
                        error: 'You do not have permission to create loans in this group'
                    });
                }
            }

            const id = await loansService.createLoan(loanData);

            res.status(201).json({
                success: true,
                id,
                message: 'Loan application created successfully'
            });
        } catch (error) {
            console.error('Error creating loan:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/loans/:id/approve
     * Approve a loan
     */
    router.post('/:id/approve', async (req, res) => {
        try {
            const loan = await loansService.getLoanById(req.params.id);

            if (!loan) {
                return res.status(404).json({
                    success: false,
                    error: 'Loan not found'
                });
            }

            // Check if user has permission to approve loans
            const group = await shgService.getGroupById(loan.shg_group_id);

            if (!req.user.is_system_admin && group) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_approve
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to approve loans'
                    });
                }
            }

            await loansService.approveLoan(req.params.id, req.user.id);

            res.json({
                success: true,
                message: 'Loan approved successfully'
            });
        } catch (error) {
            console.error('Error approving loan:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/loans/:id/disburse
     * Disburse a loan
     */
    router.post('/:id/disburse', async (req, res) => {
        try {
            const loan = await loansService.getLoanById(req.params.id);

            if (!loan) {
                return res.status(404).json({
                    success: false,
                    error: 'Loan not found'
                });
            }

            // Check if user has permission to disburse loans
            const group = await shgService.getGroupById(loan.shg_group_id);

            if (!req.user.is_system_admin && group) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && (m.can_approve || m.can_create)
                );

                if (!hasPermission) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to disburse loans'
                    });
                }
            }

            await loansService.disburseLoan(
                req.params.id,
                req.user.id,
                req.body.disbursement_date
            );

            res.json({
                success: true,
                message: 'Loan disbursed successfully'
            });
        } catch (error) {
            console.error('Error disbursing loan:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    // ==================== LOAN REPAYMENTS ====================

    /**
     * GET /api/loans/:id/repayments
     * Get loan repayments
     */
    router.get('/:id/repayments', async (req, res) => {
        try {
            const loan = await loansService.getLoanById(req.params.id);

            if (!loan) {
                return res.status(404).json({
                    success: false,
                    error: 'Loan not found'
                });
            }

            // Check access
            const group = await shgService.getGroupById(loan.shg_group_id);

            if (!req.user.is_system_admin && group) {
                const hasAccess = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && m.can_view
                );
                if (!hasAccess) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have access to this loan'
                    });
                }
            }

            const repayments = await loansService.getLoanRepayments(req.params.id);

            res.json({
                success: true,
                data: repayments,
                count: repayments.length
            });
        } catch (error) {
            console.error('Error fetching loan repayments:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/loans/:id/repayments
     * Record loan repayment
     */
    router.post('/:id/repayments', async (req, res) => {
        try {
            const loan = await loansService.getLoanById(req.params.id);

            if (!loan) {
                return res.status(404).json({
                    success: false,
                    error: 'Loan not found'
                });
            }

            // Check if user has permission to record repayments
            const group = await shgService.getGroupById(loan.shg_group_id);

            if (!req.user.is_system_admin && group) {
                const hasPermission = req.user.module_assignments?.some(
                    m => m.module_id === group.program_module_id && (m.can_create || m.can_edit)
                );

                const isFacilitator = group.facilitator_id === req.user.id;

                if (!hasPermission && !isFacilitator) {
                    return res.status(403).json({
                        success: false,
                        error: 'You do not have permission to record repayments for this loan'
                    });
                }
            }

            const repaymentData = req.body;
            repaymentData.recorded_by = req.user.id;

            const id = await loansService.recordRepayment(req.params.id, repaymentData);

            res.status(201).json({
                success: true,
                id,
                message: 'Loan repayment recorded successfully'
            });
        } catch (error) {
            console.error('Error recording loan repayment:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    /**
     * POST /api/loans/calculate
     * Calculate loan financials (utility endpoint)
     */
    router.post('/calculate', async (req, res) => {
        try {
            const { loan_amount, interest_rate, loan_tenure_months } = req.body;

            if (!loan_amount || !interest_rate || !loan_tenure_months) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required parameters: loan_amount, interest_rate, loan_tenure_months'
                });
            }

            const calculations = loansService.calculateLoanFinancials(
                parseFloat(loan_amount),
                parseFloat(interest_rate),
                parseInt(loan_tenure_months)
            );

            res.json({
                success: true,
                data: calculations
            });
        } catch (error) {
            console.error('Error calculating loan financials:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });

    return router;
};
