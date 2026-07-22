import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

// --- Identity verification (self-service) ---
router.post("/verifications", requireAuth, asyncHandler(notImplemented("verifications.submit")));
router.get("/verifications/me", requireAuth, asyncHandler(notImplemented("verifications.getMine")));
router.patch("/verifications/me", requireAuth, asyncHandler(notImplemented("verifications.updateMine")));

// --- Admin review ---
router.get(
  "/admin/verifications",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("verifications.adminList")),
);
router.patch(
  "/admin/verifications/:id/approve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("verifications.approve")),
);
router.patch(
  "/admin/verifications/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("verifications.reject")),
);

export default router;
