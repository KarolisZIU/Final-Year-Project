import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import * as bookingController from "../controllers/booking.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = Router();
const isAdmin = [
  authMiddleware.requireAuth,
  authMiddleware.requireRole("admin"),
];

router.get("/services", ...isAdmin, adminController.getAdminServices);
router.post("/services", ...isAdmin, adminController.addService);
router.put("/services/:id", ...isAdmin, adminController.editService);
router.delete("/services/:id", ...isAdmin, adminController.deleteService);

router.get("/staff", ...isAdmin, adminController.getAllStaff);
router.get("/staff/:id", ...isAdmin, adminController.getStaffById);
router.delete("/staff/:id", ...isAdmin, adminController.deleteStaff);
router.post("/staff", ...isAdmin, adminController.addStaff);
router.post("/staff/:id/schedule", ...isAdmin, adminController.addSchedule);
router.put("/staff/:id", ...isAdmin, adminController.updateStaff);
router.get("/all-bookings", ...isAdmin, bookingController.getAllBookingsForDay);
export default router;
