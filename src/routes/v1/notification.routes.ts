import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.get("/notifications", requireAuth, asyncHandler(notImplemented("notifications.list")));
router.patch("/notifications/:id/read", requireAuth, asyncHandler(notImplemented("notifications.markRead")));
router.patch("/notifications/read-all", requireAuth, asyncHandler(notImplemented("notifications.markAllRead")));

export default router;
