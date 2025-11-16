/**
 * Program Validator
 * Request validation middleware for program endpoints
 */

const Response = require('../../core/utils/response');

class ProgramValidator {
    /**
     * Validate program creation
     */
    validateCreate(req, res, next) {
        const { name, code, start_date } = req.body;
        const errors = [];

        if (!name || name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!code || code.trim().length === 0) {
            errors.push('Code is required');
        } else if (!/^[A-Z0-9_-]+$/.test(code)) {
            errors.push('Code must contain only uppercase letters, numbers, underscores, and hyphens');
        }

        if (!start_date) {
            errors.push('Start date is required');
        } else if (!this.isValidDate(start_date)) {
            errors.push('Start date must be a valid date (YYYY-MM-DD)');
        }

        if (req.body.end_date && !this.isValidDate(req.body.end_date)) {
            errors.push('End date must be a valid date (YYYY-MM-DD)');
        }

        if (req.body.budget && (isNaN(req.body.budget) || req.body.budget < 0)) {
            errors.push('Budget must be a positive number');
        }

        if (req.body.status && !['planning', 'active', 'on-hold', 'completed', 'cancelled'].includes(req.body.status)) {
            errors.push('Status must be one of: planning, active, on-hold, completed, cancelled');
        }

        if (req.body.manager_email && !this.isValidEmail(req.body.manager_email)) {
            errors.push('Manager email must be valid');
        }

        if (errors.length > 0) {
            return Response.badRequest(res, 'Validation failed', errors);
        }

        next();
    }

    /**
     * Validate program update
     */
    validateUpdate(req, res, next) {
        const errors = [];

        if (req.body.name !== undefined && req.body.name.trim().length === 0) {
            errors.push('Name cannot be empty');
        }

        if (req.body.code !== undefined) {
            if (req.body.code.trim().length === 0) {
                errors.push('Code cannot be empty');
            } else if (!/^[A-Z0-9_-]+$/.test(req.body.code)) {
                errors.push('Code must contain only uppercase letters, numbers, underscores, and hyphens');
            }
        }

        if (req.body.start_date && !this.isValidDate(req.body.start_date)) {
            errors.push('Start date must be a valid date (YYYY-MM-DD)');
        }

        if (req.body.end_date && !this.isValidDate(req.body.end_date)) {
            errors.push('End date must be a valid date (YYYY-MM-DD)');
        }

        if (req.body.budget !== undefined && (isNaN(req.body.budget) || req.body.budget < 0)) {
            errors.push('Budget must be a positive number');
        }

        if (req.body.status && !['planning', 'active', 'on-hold', 'completed', 'cancelled'].includes(req.body.status)) {
            errors.push('Status must be one of: planning, active, on-hold, completed, cancelled');
        }

        if (req.body.manager_email && !this.isValidEmail(req.body.manager_email)) {
            errors.push('Manager email must be valid');
        }

        if (errors.length > 0) {
            return Response.badRequest(res, 'Validation failed', errors);
        }

        next();
    }

    /**
     * Validate ID parameter
     */
    validateId(req, res, next) {
        const { id } = req.params;

        if (!id || isNaN(id) || parseInt(id) <= 0) {
            return Response.badRequest(res, 'Invalid program ID');
        }

        next();
    }

    /**
     * Helper: Validate date format
     */
    isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Helper: Validate email
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}

module.exports = new ProgramValidator();
