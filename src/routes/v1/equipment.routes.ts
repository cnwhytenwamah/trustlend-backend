import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { equipmentController } from "../../controllers/equipment.controller";
import { validate } from "../../middlewares/validate.middleware";
import { notImplemented } from "../../controllers/_stub";
import {
  createEquipmentSchema,
  updateEquipmentSchema,
} from "../../validators/equipment.validator";
import { availabilityController } from "../../controllers/availability.controller";

const router = Router();

// --------------------
// Equipment CRUD
// --------------------

router.post(
  "/equipment",
  requireAuth,
  validate(createEquipmentSchema),
  asyncHandler(equipmentController.create)
);

router.get(
  "/equipment",
  asyncHandler(equipmentController.listEquipment)
);

router.get(
  "/equipment/my",
  requireAuth,
  asyncHandler(equipmentController.myListings)
);


// --- Equipment photos ---
router.get(
  "/equipment/:id",
  asyncHandler(equipmentController.getById)
);

router.patch(
  "/equipment/:id",
  requireAuth,
  validate(updateEquipmentSchema),
  asyncHandler(equipmentController.update)
);

router.delete(
  "/equipment/:id",
  requireAuth,
  asyncHandler(equipmentController.delete)
);

// --------------------
// Equipment Photos
// --------------------

router.post(
  "/equipment/:id/photos",
  requireAuth,
  upload.array("photos", 10),
  asyncHandler(equipmentController.addPhotos)
);

router.delete(
  "/equipment/:id/photos/:photoId",
  requireAuth,
  asyncHandler(equipmentController.deletePhoto)
);

router.patch(
  "/equipment/:id/photos/:photoId/primary",
  requireAuth,
  asyncHandler(equipmentController.setPrimaryPhoto),
);


// --------------------
// Availability
// --------------------

router.get(
  "/equipment/:id/availability",
  asyncHandler(availabilityController.getAvailability)
);

router.patch(
  "/equipment/:id/availability",
  requireAuth,
  asyncHandler(availabilityController.updateAvailability)
);

router.post(
  "/equipment/:id/block-dates",
  requireAuth,
  asyncHandler(availabilityController.blockDates)
);

router.delete(
  "/equipment/:id/block-dates/:blockId",
  requireAuth,
  asyncHandler(availabilityController.deleteBlock)
);

// --------------------
// Admin Moderation
// --------------------

router.get(
  "/admin/equipment",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.getAllEquipment)
);

router.patch(
  "/admin/equipment/:id/approve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.approveEquipment)
);

router.patch(
  "/admin/equipment/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.rejectEquipment)
);

router.delete(
  "/admin/equipment/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.adminDeleteEquipment)
);

export default router;