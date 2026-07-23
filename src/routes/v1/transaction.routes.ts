import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { transactionController } from "../../controllers/transaction.controller";

const router = Router();

router.get("/transactions/my", requireAuth, asyncHandler(transactionController.getMyTransactions));
router.get(
  "/admin/transactions",
  requireAuth,
  requireRole("admin"),
  asyncHandler(transactionController.getAllTransactions),
);
router.get(
  "/admin/transactions/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(transactionController.getTransactionById),
);

export default router;
