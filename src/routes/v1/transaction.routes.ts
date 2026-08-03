import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { transactionController } from "../../controllers/transaction.controller";
import { paginationQuerySchema, transactionIdParamSchema } from "../../validators/transaction.validator";

const router = Router();

router.get(
  "/transactions/my",
  requireAuth,
  validate(paginationQuerySchema, "query"),
  asyncHandler(transactionController.getMyTransactions),
);
router.get(
  "/admin/transactions",
  requireAuth,
  requireRole("admin"),
  validate(paginationQuerySchema, "query"),
  asyncHandler(transactionController.getAllTransactions),
);
router.get(
  "/admin/transactions/:id",
  requireAuth,
  requireRole("admin"),
  validate(transactionIdParamSchema, "params"),
  asyncHandler(transactionController.getTransactionById),
);

export default router;
