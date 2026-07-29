"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
/**
 * Verifies the "Authorization: Bearer <token>" header and attaches
 * the decoded { userId, role } payload to req.user.
 *
 * Use on any route that requires a logged-in user:
 *   router.get('/me', requireAuth, controller.me);
 */
function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        throw AppError_1.AppError.unauthorized('Missing or invalid Authorization header');
    }
    const token = header.split(' ')[1];
    try {
        req.user = (0, jwt_1.verifyAccessToken)(token);
        next();
    }
    catch {
        throw AppError_1.AppError.unauthorized('Invalid or expired token');
    }
}
/**
 * Restricts a route to specific roles. Must run AFTER requireAuth.
 *
 *   router.get('/admin/users', requireAuth, requireRole('admin'), controller.list);
 */
function requireRole(...allowedRoles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw AppError_1.AppError.unauthorized('Authentication required');
        }
        if (!allowedRoles.includes(req.user.role)) {
            throw AppError_1.AppError.forbidden('You do not have permission to perform this action');
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map