import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub/not-implemented.controller";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/admin/refunds", asyncHandler(notImplemented("refunds.adminList")));
router.patch("/admin/refunds/:id/process", asyncHandler(notImplemented("refunds.process")));
router.patch("/admin/refunds/:id/reject", asyncHandler(notImplemented("refunds.reject")));

export default router;