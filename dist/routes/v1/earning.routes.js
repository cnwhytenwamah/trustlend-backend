"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const earning_controller_1 = require("../../controllers/earning.controller");
const router = (0, express_1.Router)();
router.get("/earnings", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(earning_controller_1.earningController.getEarnings));
router.get("/earnings/summary", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(earning_controller_1.earningController.getEarningsSummary));
router.get("/earnings/transactions", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(earning_controller_1.earningController.getEarningTransactions));
exports.default = router;
//# sourceMappingURL=earning.routes.js.map