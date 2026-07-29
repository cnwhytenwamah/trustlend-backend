"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const availability_controller_1 = require("../../controllers/availability.controller");
const availability_validator_1 = require("../../validators/availability.validator");
const router = (0, express_1.Router)();
router.get("/equipment/:id/availability", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(availability_validator_1.availabilityParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(availability_controller_1.availabilityController.getAvailability));
router.patch("/equipment/:id/availability", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(availability_validator_1.availabilityParamSchema, "params"), (0, validate_middleware_1.validate)(availability_validator_1.updateAvailabilitySchema), (0, asyncHandler_1.asyncHandler)(availability_controller_1.availabilityController.updateAvailability));
router.post("/equipment/:id/block-dates", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(availability_validator_1.availabilityParamSchema, "params"), (0, validate_middleware_1.validate)(availability_validator_1.blockDatesSchema), (0, asyncHandler_1.asyncHandler)(availability_controller_1.availabilityController.blockDates));
router.delete("/equipment/:id/block-dates/:blockId", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(availability_validator_1.blockIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(availability_controller_1.availabilityController.deleteBlock));
exports.default = router;
//# sourceMappingURL=availability.routes.js.map