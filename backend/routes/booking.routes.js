import express from "express";
import * as bookingController from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/slots", bookingController.getAvailableSlots);
router.post("/", bookingController.createBooking);
router.get("/customer-bookings", bookingController.getBookingsByEmail);
router.patch("/:bookingId/cancel", bookingController.cancelBooking);
export default router;