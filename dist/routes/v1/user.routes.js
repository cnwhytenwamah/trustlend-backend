"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// User profile routes
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user.controller");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const user_validator_1 = require("../../validators/user.validator");
const router = (0, express_1.Router)();
router.get('/me', auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getMe));
router.patch('/me', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(user_validator_1.updateProfileSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateMe));
router.patch('/me/profile-photo', auth_middleware_1.requireAuth, upload_middleware_1.upload.single('photo'), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.updateProfilePhoto));
router.delete('/me', auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.deleteMe));
router.get('/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(user_validator_1.userIdParamSchema, 'params'), (0, asyncHandler_1.asyncHandler)(user_controller_1.userController.getById));
exports.default = router;
//# sourceMappingURL=user.routes.js.map