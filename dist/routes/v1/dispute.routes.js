"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const _stub_1 = require("../../controllers/_stub");
const router = (0, express_1.Router)();
router.post("/disputes", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.create")));
router.get("/disputes/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.mine")));
router.get("/admin/disputes", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.adminList")));
router.get("/admin/disputes/:id", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.adminGetById")));
router.patch("/admin/disputes/:id/resolve", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.resolve")));
router.patch("/admin/disputes/:id/close", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("disputes.close")));
exports.default = router;
//# sourceMappingURL=dispute.routes.js.map