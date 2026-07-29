import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { notificationController } from "../../controllers/notification.controller";
import { notificationIdParamSchema } from "../../validators/notification.validator";

const router = Router();

router.get(
  "/notifications",
  requireAuth,
  asyncHandler(notificationController.getMyNotifications)
);

router.patch(
  "/notifications/:id/read",
  requireAuth,
  validate(notificationIdParamSchema, "params"),
  asyncHandler(notificationController.markAsRead)
);

router.patch(
  "/notifications/read-all",
  requireAuth,
  asyncHandler(notificationController.markAllAsRead)
);

export default router;