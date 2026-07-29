"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controllers/auth.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const auth_validator_1 = require("../../validators/auth.validator");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_middleware_1.validate)(auth_validator_1.registerSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.register));
router.post('/login', (0, validate_middleware_1.validate)(auth_validator_1.loginSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.login));
router.post('/logout', (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.logout));
router.post('/refresh-token', (0, validate_middleware_1.validate)(auth_validator_1.refreshTokenSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.refreshToken));
router.post('/forgot-password', (0, validate_middleware_1.validate)(auth_validator_1.forgotPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.forgotPassword));
router.post('/reset-password', (0, validate_middleware_1.validate)(auth_validator_1.resetPasswordSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.resetPassword));
router.post('/verify-email', (0, validate_middleware_1.validate)(auth_validator_1.verifyEmailSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.verifyEmail));
router.post('/resend-verification', (0, validate_middleware_1.validate)(auth_validator_1.resendVerificationSchema), (0, asyncHandler_1.asyncHandler)(auth_controller_1.authController.resendVerification));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map