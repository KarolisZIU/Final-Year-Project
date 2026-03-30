import express from "express";
import * as bookingController from "../controllers/booking.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();
const isStaff = [authMiddleware.requireAuth, authMiddleware.requireRole("staff")];
router.get("/slots", bookingController.getAvailableSlots);
router.post("/", bookingController.createBooking);
router.get("/customer-bookings", bookingController.getBookingsByEmail);
router.patch("/:bookingId/cancel", bookingController.cancelBooking);
router.get("/staff-bookings", isStaff, bookingController.getBookingsForStaffForDay);
router.patch("/:bookingId/complete", isStaff, bookingController.completeBooking);

export default router;