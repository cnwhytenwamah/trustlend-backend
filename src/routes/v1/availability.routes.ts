import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { availabilityController } from "../../controllers/availability.controller";
import { availabilityParamSchema, updateAvailabilitySchema, blockDatesSchema, blockIdParamSchema,} from "../../validators/availability.validator";

const router = Router();

router.get(
  "/equipment/:id/availability",
  requireAuth,
  validate(availabilityParamSchema, "params"),
  asyncHandler(availabilityController.getAvailability)
);

router.patch(
  "/equipment/:id/availability",
  requireAuth,
  validate(availabilityParamSchema, "params"),
  validate(updateAvailabilitySchema),
  asyncHandler(availabilityController.updateAvailability)
);

router.post(
  "/equipment/:id/block-dates",
  requireAuth,
  validate(availabilityParamSchema, "params"),
  validate(blockDatesSchema),
  asyncHandler(availabilityController.blockDates)
);

router.delete(
  "/equipment/:id/block-dates/:blockId",
  requireAuth,
  validate(blockIdParamSchema, "params"),
  asyncHandler(availabilityController.deleteBlock)
);

export default router;