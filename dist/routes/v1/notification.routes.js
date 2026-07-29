"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const notification_controller_1 = require("../../controllers/notification.controller");
const notification_validator_1 = require("../../validators/notification.validator");
const router = (0, express_1.Router)();
router.get("/notifications", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.getMyNotifications));
router.patch("/notifications/:id/read", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(notification_validator_1.notificationIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.markAsRead));
router.patch("/notifications/read-all", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(notification_controller_1.notificationController.markAllAsRead));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map