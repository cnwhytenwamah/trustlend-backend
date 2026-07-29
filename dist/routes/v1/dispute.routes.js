"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const dispute_controller_1 = require("../../controllers/dispute.controller");
const router = (0, express_1.Router)();
router.post("/disputes", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.createDispute));
router.get("/disputes/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.getMyDisputes));
router.get("/admin/disputes", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.getAllDisputes));
router.get("/admin/disputes/:id", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.getDisputeById));
router.patch("/admin/disputes/:id/resolve", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.resolveDispute));
router.patch("/admin/disputes/:id/close", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(dispute_controller_1.disputeController.closeDispute));
exports.default = router;
//# sourceMappingURL=dispute.routes.js.map