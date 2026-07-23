import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { earningController } from "../../controllers/earning.controller";

const router = Router();

router.get("/earnings", requireAuth, asyncHandler(earningController.getEarnings));
router.get("/earnings/summary", requireAuth, asyncHandler(earningController.getEarningsSummary));
router.get("/earnings/transactions", requireAuth, asyncHandler(earningController.getEarningTransactions));

export default router;
