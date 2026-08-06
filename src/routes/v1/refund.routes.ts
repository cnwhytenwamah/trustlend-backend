import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { refundController } from "../../controllers/refund.controller";

const router = Router();

router.get("/admin/refunds", requireAuth, requireRole("admin"), asyncHandler(refundController.getRefunds));
router.patch(
  "/admin/refunds/:id/process",
  requireAuth,
  requireRole("admin"),
  asyncHandler(refundController.approveRefund),
);
router.patch(
  "/admin/refunds/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(refundController.rejectRefund),
);

export default router;
