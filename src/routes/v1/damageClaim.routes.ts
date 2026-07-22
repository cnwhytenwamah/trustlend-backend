import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.post(
  "/damage-claims",
  requireAuth,
  upload.array("photos", 10),
  asyncHandler(notImplemented("damageClaims.create")),
);
router.get("/damage-claims/my", requireAuth, asyncHandler(notImplemented("damageClaims.mine")));

router.get(
  "/admin/damage-claims",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("damageClaims.adminList")),
);
router.patch(
  "/admin/damage-claims/:id/approve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("damageClaims.approve")),
);
router.patch(
  "/admin/damage-claims/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("damageClaims.reject")),
);

export default router;
