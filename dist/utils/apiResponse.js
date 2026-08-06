"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
/**
 * Every successful response in the API follows this shape, so the
 * frontend/mobile teams can rely on one consistent contract:
 *
 * {
 *   "success": true,
 *   "message": "Booking created",
 *   "data": { ... },
 *   "meta": { "page": 1, "limit": 20, "total": 42 }   // only for list endpoints
 * }
 */
function sendSuccess(res, { statusCode = 200, message = 'Success', data = null, meta, }) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        ...(meta ? { meta } : {}),
    });
}
//# sourceMappingURL=apiResponse.js.map