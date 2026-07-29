"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const transaction_controller_1 = require("../../controllers/transaction.controller");
const router = (0, express_1.Router)();
router.get("/transactions/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.getMyTransactions));
router.get("/admin/transactions", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.getAllTransactions));
router.get("/admin/transactions/:id", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(transaction_controller_1.transactionController.getTransactionById));
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map