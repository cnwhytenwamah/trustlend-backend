"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
exports.notFoundMiddleware = notFoundMiddleware;
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
/**
 * Catches everything thrown anywhere in the request lifecycle
 * (including from asyncHandler-wrapped controllers) and turns it
 * into a consistent JSON error response.
 *
 * Must be registered LAST, after all routes, in app.ts.
 */
function errorMiddleware(err, _req, res, _next) {
    let statusCode = 500;
    let message = 'Something went wrong';
    let details;
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;
    }
    else if (err instanceof Error) {
        message = env_1.isDev ? err.message : message;
    }
    if (!(err instanceof AppError_1.AppError)) {
        // Unexpected error — log the full thing for debugging.
        console.error('Unhandled error:', err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(details ? { details } : {}),
        ...(env_1.isDev && err instanceof Error ? { stack: err.stack } : {}),
    });
}
/**
 * Registered before the error middleware to catch requests to
 * routes that don't exist.
 */
function notFoundMiddleware(req, res) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}
//# sourceMappingURL=error.middleware.js.map