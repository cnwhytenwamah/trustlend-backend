import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.get("/deposits/my", requireAuth, asyncHandler(notImplemented("deposits.myDeposits")));
router.get("/deposits/:id", requireAuth, asyncHandler(notImplemented("deposits.getById")));
router.patch("/deposits/:id/refund", requireAuth, asyncHandler(notImplemented("deposits.refund")));
router.patch("/deposits/:id/hold", requireAuth, asyncHandler(notImplemented("deposits.hold")));
router.patch("/deposits/:id/release", requireAuth, asyncHandler(notImplemented("deposits.release")));

export default router;
