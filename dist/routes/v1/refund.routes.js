"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const _stub_1 = require("../../controllers/_stub");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"));
router.get("/admin/refunds", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("refunds.adminList")));
router.patch("/admin/refunds/:id/process", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("refunds.process")));
router.patch("/admin/refunds/:id/reject", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("refunds.reject")));
exports.default = router;
//# sourceMappingURL=refund.routes.js.map