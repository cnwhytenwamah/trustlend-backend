"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../../utils/asyncHandler");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const booking_controller_1 = require("../../controllers/booking.controller");
const booking_validator_1 = require("../../validators/booking.validator");
const router = (0, express_1.Router)();
// Renter actions
router.post("/bookings", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.createBookingSchema), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.create));
router.get("/bookings/my", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.getMyBookings));
router.get("/bookings/:id", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.getById));
router.patch("/bookings/:id/cancel", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, validate_middleware_1.validate)(booking_validator_1.cancelBookingSchema), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.cancel));
// Owner actions
router.get("/owner/bookings", auth_middleware_1.requireAuth, (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.getOwnerBookings));
router.patch("/bookings/:id/accept", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.accept));
router.patch("/bookings/:id/decline", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, validate_middleware_1.validate)(booking_validator_1.declineBookingSchema), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.decline));
router.patch("/bookings/:id/start", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.start));
router.patch("/bookings/:id/complete", auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(booking_validator_1.bookingIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(booking_controller_1.bookingController.complete));
exports.default = router;
//# sourceMappingURL=booking.routes.js.map