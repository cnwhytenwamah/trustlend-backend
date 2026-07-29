"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
/**
 * Wraps an async controller function so any thrown error (or rejected
 * promise) is automatically passed to next() and handled by the global
 * error middleware, instead of crashing the process or requiring a
 * try/catch in every single controller.
 *
 * Usage:
 *   router.get('/', asyncHandler(controller.list));
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=asyncHandler.js.map