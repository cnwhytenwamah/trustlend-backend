import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.get("/earnings", requireAuth, asyncHandler(notImplemented("earnings.list")));
router.get("/earnings/summary", requireAuth, asyncHandler(notImplemented("earnings.summary")));
router.get("/earnings/transactions", requireAuth, asyncHandler(notImplemented("earnings.transactions")));

export default router;
