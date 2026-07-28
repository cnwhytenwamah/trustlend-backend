import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { bookingController } from "../../controllers/booking.controller";
import {
  createBookingSchema,
  bookingIdParamSchema,
  cancelBookingSchema,
  declineBookingSchema,
} from "../../validators/booking.validator";

const router = Router();

// Renter actions
router.post("/bookings", requireAuth, validate(createBookingSchema), asyncHandler(bookingController.create));
router.get("/bookings/my", requireAuth, asyncHandler(bookingController.getMyBookings));
router.get("/bookings/:id", requireAuth, validate(bookingIdParamSchema, "params"), asyncHandler(bookingController.getById));
router.patch("/bookings/:id/cancel", requireAuth, validate(bookingIdParamSchema, "params"), validate(cancelBookingSchema), asyncHandler(bookingController.cancel));

// Owner actions
router.get("/owner/bookings", requireAuth, asyncHandler(bookingController.getOwnerBookings));
router.patch("/bookings/:id/accept", requireAuth, validate(bookingIdParamSchema, "params"), asyncHandler(bookingController.accept));
router.patch("/bookings/:id/decline", requireAuth, validate(bookingIdParamSchema, "params"), validate(declineBookingSchema), asyncHandler(bookingController.decline));
router.patch("/bookings/:id/start", requireAuth, validate(bookingIdParamSchema, "params"), asyncHandler(bookingController.start));
router.patch("/bookings/:id/complete", requireAuth, validate(bookingIdParamSchema, "params"), asyncHandler(bookingController.complete));

export default router;