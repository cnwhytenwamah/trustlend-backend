"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
/**
 * Standard operational error used across the app.
 * Throw this from services/controllers instead of a plain Error so the
 * global error middleware knows the status code and safe message to send.
 *
 * Example:
 *   throw new AppError('Booking not found', 404);
 *   throw new AppError('Email already in use', 409, { field: 'email' });
 */
class AppError extends Error {
    statusCode;
    isOperational;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details;
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
    static badRequest(message = 'Bad request', details) {
        return new AppError(message, 400, details);
    }
    static unauthorized(message = 'Unauthorized') {
        return new AppError(message, 401);
    }
    static forbidden(message = 'Forbidden') {
        return new AppError(message, 403);
    }
    static notFound(message = 'Resource not found') {
        return new AppError(message, 404);
    }
    static conflict(message = 'Resource conflict', details) {
        return new AppError(message, 409, details);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map