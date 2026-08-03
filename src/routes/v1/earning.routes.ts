import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { earningController } from "../../controllers/earning.controller";
import { paginationQuerySchema } from "../../validators/earning.validator";

const router = Router();

router.get(
  "/earnings",
  requireAuth,
  validate(paginationQuerySchema, "query"),
  asyncHandler(earningController.getEarnings),
);
router.get("/earnings/summary", requireAuth, asyncHandler(earningController.getEarningsSummary));
router.get(
  "/earnings/transactions",
  requireAuth,
  validate(paginationQuerySchema, "query"),
  asyncHandler(earningController.getEarningTransactions),
);

export default router;
