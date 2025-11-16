/**
 * Standardized API Response Helper
 * Ensures consistent response format across all endpoints
 */

class ResponseHelper {
    /**
     * Success response
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Created response
     */
    static created(res, data = null, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * Error response
     */
    static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Bad request response
     */
    static badRequest(res, message = 'Bad request', errors = null) {
        return this.error(res, message, 400, errors);
    }

    /**
     * Unauthorized response
     */
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }

    /**
     * Forbidden response
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }

    /**
     * Not found response
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }

    /**
     * Conflict response
     */
    static conflict(res, message = 'Resource conflict', errors = null) {
        return this.error(res, message, 409, errors);
    }

    /**
     * Paginated response
     */
    static paginated(res, data, pagination, message = 'Success') {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                totalItems: pagination.totalItems,
                totalPages: Math.ceil(pagination.totalItems / pagination.limit),
                hasNext: pagination.page < Math.ceil(pagination.totalItems / pagination.limit),
                hasPrev: pagination.page > 1
            },
            timestamp: new Date().toISOString()
        });
    }
}

module.exports = ResponseHelper;
