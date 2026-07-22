import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { requireAuth } from "../../middlewares/auth.middleware";
import { notImplemented } from "../../controllers/_stub";

const router = Router();

// --- Renter actions ---
router.post("/bookings", requireAuth, asyncHandler(notImplemented("bookings.create")));
router.get("/bookings/my", requireAuth, asyncHandler(notImplemented("bookings.myBookings")));
router.get("/bookings/:id", requireAuth, asyncHandler(notImplemented("bookings.getById")));
router.patch("/bookings/:id/cancel", requireAuth, asyncHandler(notImplemented("bookings.cancel")));

// --- Owner actions ---
router.get("/owner/bookings", requireAuth, asyncHandler(notImplemented("bookings.ownerBookings")));
router.patch("/bookings/:id/accept", requireAuth, asyncHandler(notImplemented("bookings.accept")));
router.patch("/bookings/:id/decline", requireAuth, asyncHandler(notImplemented("bookings.decline")));
router.patch("/bookings/:id/start", requireAuth, asyncHandler(notImplemented("bookings.start")));
router.patch("/bookings/:id/complete", requireAuth, asyncHandler(notImplemented("bookings.complete")));

export default router;
