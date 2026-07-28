import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { reviewController } from "../../controllers/review.controller";
import {
  createReviewSchema,
  reviewIdParamSchema,
  updateReviewSchema,
  equipmentReviewsParamSchema,
  userReviewsParamSchema,
} from "../../validators/review.validator";

const router = Router();

router.post(
  "/reviews",
  requireAuth,
  validate(createReviewSchema),
  asyncHandler(reviewController.create)
);

router.get(
  "/reviews/equipment/:equipmentId",
  validate(equipmentReviewsParamSchema, "params"),
  asyncHandler(reviewController.getEquipmentReviews)
);

router.get(
  "/reviews/user/:userId",
  validate(userReviewsParamSchema, "params"),
  asyncHandler(reviewController.getUserReviews)
);

router.patch(
  "/reviews/:id",
  requireAuth,
  validate(reviewIdParamSchema, "params"),
  validate(updateReviewSchema),
  asyncHandler(reviewController.update)
);

router.delete(
  "/reviews/:id",
  requireAuth,
  validate(reviewIdParamSchema, "params"),
  asyncHandler(reviewController.delete)
);

export default router;