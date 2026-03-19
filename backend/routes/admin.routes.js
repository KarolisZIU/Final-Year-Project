import { Router } from "express";
import {
  getAdminServices,
  deleteService,
  addService,
  editService,
  getAllStaff,
  deleteStaff,
  addStaff,
  addSchedule,
  updateStaff
} from "../controllers/admin.controller.js";

import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();
const isAdmin = [requireAuth, requireRole("admin")];

router.get("/services", ...isAdmin, getAdminServices);
router.post("/services", ...isAdmin, addService);
router.put("/services/:id", ...isAdmin, editService);
router.delete("/services/:id", ...isAdmin, deleteService);

router.get("/staff", ...isAdmin, getAllStaff);
router.delete("/staff/:id", ...isAdmin, deleteStaff);
router.post("/staff", ...isAdmin, addStaff);
router.post("/staff/:id/schedule", ...isAdmin, addSchedule);
router.put("/staff/:id", ...isAdmin, updateStaff);
export default router;
