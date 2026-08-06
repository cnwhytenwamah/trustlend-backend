"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notImplemented = notImplemented;
/**
 * Placeholder handler for endpoints whose repository/service/controller
 * haven't been built yet. Returns a clear 501 instead of a 404, so the
 * frontend/mobile teams know the route exists and is just pending.
 *
 * Replace it by writing the real controller method following the
 * pattern in src/controllers/auth.controller.ts and src/controllers/user.controller.ts:
 *   1. Repository  -> src/repositories/<entity>.repository.ts   (already scaffolded)
 *   2. Service      -> src/services/<entity>.service.ts          (business logic)
 *   3. Controller   -> src/controllers/<entity>.controller.ts    (req/res only)
 *   4. Route        -> swap this stub import for the real controller method
 */
function notImplemented(label) {
    return (_req, res) => {
        res.status(501).json({
            success: false,
            message: `Not implemented yet: ${label}`,
        });
    };
}
//# sourceMappingURL=_stub.js.map