import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { equipmentController } from "../../controllers/equipment.controller";
import { notImplemented } from "../../controllers/_stub";
import { validate } from "../../middlewares/validate.middleware";
import { createEquipmentSchema } from "../../validators/equipment.validator";

const router = Router();

// --- Equipment CRUD ---
router.post(
  "/equipment",
  requireAuth,
  validate(createEquipmentSchema),
  asyncHandler(equipmentController.create)
);
router.get("/equipment", asyncHandler(equipmentController.listEquipment));// public search/browse
router.get(
  "/equipment/my",
  requireAuth,
  asyncHandler(equipmentController.myListings)
);
router.get("/equipment/:id", asyncHandler(notImplemented("equipment.getById"))); // public
router.patch("/equipment/:id", requireAuth, asyncHandler(notImplemented("equipment.update")));
router.delete("/equipment/:id", requireAuth, asyncHandler(notImplemented("equipment.delete")));

// --- Equipment photos ---
router.post(
  "/equipment/:id/photos",
  requireAuth,
  upload.array("photos", 10),
  asyncHandler(notImplemented("equipment.addPhotos")),
);
router.delete(
  "/equipment/:id/photos/:photoId",
  requireAuth,
  asyncHandler(notImplemented("equipment.deletePhoto")),
);
router.patch(
  "/equipment/:id/photos/:photoId/primary",
  requireAuth,
  asyncHandler(notImplemented("equipment.setPrimaryPhoto")),
);

// --- Availability ---
router.get("/equipment/:id/availability", asyncHandler(notImplemented("equipment.getAvailability"))); // public
router.patch(
  "/equipment/:id/availability",
  requireAuth,
  asyncHandler(notImplemented("equipment.updateAvailability")),
);
router.post(
  "/equipment/:id/block-dates",
  requireAuth,
  asyncHandler(notImplemented("equipment.blockDates")),
);
router.delete(
  "/equipment/:id/block-dates/:blockId",
  requireAuth,
  asyncHandler(notImplemented("equipment.unblockDates")),
);

// --- Admin moderation ---
router.get(
  "/admin/equipment",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("equipment.adminList")),
);
router.patch(
  "/admin/equipment/:id/approve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("equipment.approve")),
);
router.patch(
  "/admin/equipment/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("equipment.reject")),
);
router.delete(
  "/admin/equipment/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(notImplemented("equipment.adminDelete")),
);

export default router;
