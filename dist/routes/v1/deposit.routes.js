"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const deposit_controller_1 = require("../../controllers/deposit.controller");
const deposit_validator_1 = require("../../validators/deposit.validator");
const router = (0, express_1.Router)();
router.get('/deposits/my', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(deposit_validator_1.paginationQuerySchema, 'query'), (0, asyncHandler_1.asyncHandler)(deposit_controller_1.depositController.myDeposits));
router.get('/deposits/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(deposit_validator_1.depositIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(deposit_controller_1.depositController.getById));
// Admin-only: explicit refund path outside the normal release flow
// (e.g. a cancelled booking that never reached "completed").
router.patch('/deposits/:id/refund', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(deposit_validator_1.depositIdParamSchema, 'params'), (0, validate_middleware_1.validate)(deposit_validator_1.refundDepositSchema), (0, asyncHandler_1.asyncHandler)(deposit_controller_1.depositController.refund));
// Admin-only: manual re-hold, e.g. while a dispute/damage claim is under review.
router.patch('/deposits/:id/hold', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(deposit_validator_1.depositIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(deposit_controller_1.depositController.hold));
// Equipment owner (or admin) confirms no damage and releases the deposit.
router.patch('/deposits/:id/release', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(deposit_validator_1.depositIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(deposit_controller_1.depositController.release));
exports.default = router;
//# sourceMappingURL=deposit.routes.js.map