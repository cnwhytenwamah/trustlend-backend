import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();
router.use(requireAuth, requireRole("admin"));

router.get("/admin/users", asyncHandler(notImplemented("admin.users.list")));
router.get("/admin/users/:id", asyncHandler(notImplemented("admin.users.getById")));
router.patch("/admin/users/:id/status", asyncHandler(notImplemented("admin.users.updateStatus")));
router.patch("/admin/users/:id/verify", asyncHandler(notImplemented("admin.users.verify")));
router.delete("/admin/users/:id", asyncHandler(notImplemented("admin.users.delete")));

export default router;
