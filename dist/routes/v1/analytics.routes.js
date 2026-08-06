"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const _stub_1 = require("../../controllers/_stub");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"));
router.get("/admin/analytics/dashboard", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("analytics.dashboard")));
router.get("/admin/analytics/revenue", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("analytics.revenue")));
router.get("/admin/analytics/bookings", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("analytics.bookings")));
router.get("/admin/analytics/users", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("analytics.users")));
router.get("/admin/analytics/equipment", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("analytics.equipment")));
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map