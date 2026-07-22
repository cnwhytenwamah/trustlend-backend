import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.post("/disputes", requireAuth, asyncHandler(notImplemented("disputes.create")));
router.get("/disputes/my", requireAuth, asyncHandler(notImplemented("disputes.mine")));

router.get(
  "/admin/disputes",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("disputes.adminList")),
);
router.get(
  "/admin/disputes/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("disputes.adminGetById")),
);
router.patch(
  "/admin/disputes/:id/resolve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("disputes.resolve")),
);
router.patch(
  "/admin/disputes/:id/close",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("disputes.close")),
);

export default router;
