"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const _stub_1 = require("../../controllers/_stub");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"));
router.get("/admin/users", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("admin.users.list")));
router.get("/admin/users/:id", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("admin.users.getById")));
router.patch("/admin/users/:id/status", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("admin.users.updateStatus")));
router.patch("/admin/users/:id/verify", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("admin.users.verify")));
router.delete("/admin/users/:id", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("admin.users.delete")));
exports.default = router;
//# sourceMappingURL=admin.routes.js.map