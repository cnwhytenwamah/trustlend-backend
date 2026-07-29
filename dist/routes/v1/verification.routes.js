"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const verification_controller_1 = require("../../controllers/verification.controller");
const verification_validator_1 = require("../../validators/verification.validator");
const router = (0, express_1.Router)();
// --------------------
// Identity Verification
// --------------------
router.post('/verifications', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(verification_validator_1.createVerificationSchema), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.create));
router.get('/verifications/me', auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.me));
router.patch('/verifications/me', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(verification_validator_1.updateVerificationSchema), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.update));
// --------------------
// Admin Verification Management
// --------------------
router.get('/admin/verifications', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.list));
router.patch('/admin/verifications/:id/approve', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.approve));
router.patch('/admin/verifications/:id/reject', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('admin'), (0, validate_middleware_1.validate)(verification_validator_1.rejectVerificationSchema), (0, asyncHandler_1.asyncHandler)(verification_controller_1.verificationController.reject));
exports.default = router;
//# sourceMappingURL=verification.routes.js.map