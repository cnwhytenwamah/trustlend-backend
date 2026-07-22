import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

router.post("/reviews", requireAuth, asyncHandler(notImplemented("reviews.create")));
router.get("/reviews/equipment/:equipmentId", asyncHandler(notImplemented("reviews.byEquipment"))); // public
router.get("/reviews/user/:userId", asyncHandler(notImplemented("reviews.byUser"))); // public
router.patch("/reviews/:id", requireAuth, asyncHandler(notImplemented("reviews.update")));
router.delete("/reviews/:id", requireAuth, asyncHandler(notImplemented("reviews.delete")));

export default router;
