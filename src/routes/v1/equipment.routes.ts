import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { equipmentController } from "../../controllers/equipment.controller";

const router = Router();

// --- Equipment CRUD ---
router.post("/equipment", requireAuth, asyncHandler(equipmentController.createEquipment));
router.get("/equipment", asyncHandler(equipmentController.getEquipment)); // public search/browse
router.get("/equipment/my", requireAuth, asyncHandler(equipmentController.getMyEquipment));
router.get("/equipment/:id", asyncHandler(equipmentController.getEquipmentById)); // public
router.patch("/equipment/:id", requireAuth, asyncHandler(equipmentController.updateEquipment));
router.delete("/equipment/:id", requireAuth, asyncHandler(equipmentController.deleteEquipment));

// --- Equipment photos ---
router.post(
  "/equipment/:id/photos",
  requireAuth,
  upload.array("photos", 10),
  asyncHandler(equipmentController.addPhotos),
);
router.delete(
  "/equipment/:id/photos/:photoId",
  requireAuth,
  asyncHandler(equipmentController.deletePhoto),
);
router.patch(
  "/equipment/:id/photos/:photoId/primary",
  requireAuth,
  asyncHandler(equipmentController.setPrimaryPhoto),
);

// --- Availability ---
router.get("/equipment/:id/availability", asyncHandler(equipmentController.getAvailability)); // public
router.patch(
  "/equipment/:id/availability",
  requireAuth,
  asyncHandler(equipmentController.updateAvailability),
);
router.post(
  "/equipment/:id/block-dates",
  requireAuth,
  asyncHandler(equipmentController.blockDates),
);
router.delete(
  "/equipment/:id/block-dates/:blockId",
  requireAuth,
  asyncHandler(equipmentController.unblockDates),
);

// --- Admin moderation ---
router.get(
  "/admin/equipment",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.getAllEquipment),
);
router.patch(
  "/admin/equipment/:id/approve",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.approveEquipment),
);
router.patch(
  "/admin/equipment/:id/reject",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.rejectEquipment),
);
router.delete(
  "/admin/equipment/:id",
  requireAuth,
  requireRole("admin"),
  asyncHandler(equipmentController.adminDeleteEquipment),
);

export default router;
