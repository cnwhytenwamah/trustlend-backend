import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/admin/analytics/dashboard", asyncHandler(notImplemented("analytics.dashboard")));
router.get("/admin/analytics/revenue", asyncHandler(notImplemented("analytics.revenue")));
router.get("/admin/analytics/bookings", asyncHandler(notImplemented("analytics.bookings")));
router.get("/admin/analytics/users", asyncHandler(notImplemented("analytics.users")));
router.get("/admin/analytics/equipment", asyncHandler(notImplemented("analytics.equipment")));

export default router;
