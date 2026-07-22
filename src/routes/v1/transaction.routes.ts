import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.get("/transactions/my", requireAuth, asyncHandler(notImplemented("transactions.mine")));
router.get(
  "/admin/transactions",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("transactions.adminList")),
);
router.get(
  "/admin/transactions/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("transactions.adminGetById")),
);

export default router;
