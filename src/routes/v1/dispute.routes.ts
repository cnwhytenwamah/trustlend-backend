import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { disputeController } from "../../controllers/dispute.controller";

const router = Router();

router.post("/disputes", requireAuth, asyncHandler(disputeController.createDispute));
router.get("/disputes/my", requireAuth, asyncHandler(disputeController.getMyDisputes));

router.get(
  "/admin/disputes",
  requireAuth,
  requireRole("admin"),
  asyncHandler(disputeController.getAllDisputes),
);
router.get(
  "/admin/disputes/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(disputeController.getDisputeById),
);
router.patch(
  "/admin/disputes/:id/resolve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(disputeController.resolveDispute),
);
router.patch(
  "/admin/disputes/:id/close",
  requireAuth,
  requireRole("admin"),
  asyncHandler(disputeController.closeDispute),
);

export default router;
