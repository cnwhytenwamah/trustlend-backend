import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { refundController } from "../../controllers/refund.controller";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/admin/refunds", asyncHandler(refundController.getRefunds));
router.patch("/admin/refunds/:id/process", asyncHandler(refundController.approveRefund));
router.patch("/admin/refunds/:id/reject", asyncHandler(refundController.rejectRefund));

export default router;
