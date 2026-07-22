import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.post(
  "/issues",
  requireAuth,
  upload.array("photos", 5),
  asyncHandler(notImplemented("issues.create")),
);
router.get("/issues/my", requireAuth, asyncHandler(notImplemented("issues.mine")));
router.get("/issues/:id", requireAuth, asyncHandler(notImplemented("issues.getById")));
router.patch("/issues/:id", requireAuth, asyncHandler(notImplemented("issues.update")));

export default router;
