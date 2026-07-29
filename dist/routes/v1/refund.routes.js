"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const refund_controller_1 = require("../../controllers/refund.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"));
router.get("/admin/refunds", (0, asyncHandler_1.asyncHandler)(refund_controller_1.refundController.getRefunds));
router.patch("/admin/refunds/:id/process", (0, asyncHandler_1.asyncHandler)(refund_controller_1.refundController.approveRefund));
router.patch("/admin/refunds/:id/reject", (0, asyncHandler_1.asyncHandler)(refund_controller_1.refundController.rejectRefund));
exports.default = router;
//# sourceMappingURL=refund.routes.js.map