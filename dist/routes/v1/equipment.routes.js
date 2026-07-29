"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const equipment_controller_1 = require("../../controllers/equipment.controller");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const _stub_1 = require("../../controllers/_stub");
const equipment_validator_1 = require("../../validators/equipment.validator");
const router = (0, express_1.Router)();
// --------------------
// Equipment CRUD
// --------------------
router.post("/equipment", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(equipment_validator_1.createEquipmentSchema), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.create));
router.get("/equipment", (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.listEquipment));
router.get("/equipment/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.myListings));
// --- Equipment photos ---
router.get("/equipment/:id", (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.getById));
router.patch("/equipment/:id", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(equipment_validator_1.updateEquipmentSchema), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.update));
router.delete("/equipment/:id", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.delete));
// --------------------
// Equipment Photos
// --------------------
router.post("/equipment/:id/photos", auth_middleware_1.requireAuth, upload_middleware_1.upload.array("photos", 10), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.addPhotos));
router.delete("/equipment/:id/photos/:photoId", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.deletePhoto));
router.patch("/equipment/:id/photos/:photoId/primary", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.setPrimaryPhoto));
// --------------------
// Availability
// --------------------
router.get("/equipment/:id/availability", (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("equipment.getAvailability")));
router.patch("/equipment/:id/availability", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("equipment.updateAvailability")));
router.post("/equipment/:id/block-dates", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("equipment.blockDates")));
router.delete("/equipment/:id/block-dates/:blockId", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)((0, _stub_1.notImplemented)("equipment.unblockDates")));
// --------------------
// Admin Moderation
// --------------------
router.get("/admin/equipment", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.getAllEquipment));
router.patch("/admin/equipment/:id/approve", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.approveEquipment));
router.patch("/admin/equipment/:id/reject", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.rejectEquipment));
router.delete("/admin/equipment/:id", auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)("admin"), (0, asyncHandler_1.asyncHandler)(equipment_controller_1.equipmentController.adminDeleteEquipment));
exports.default = router;
//# sourceMappingURL=equipment.routes.js.map