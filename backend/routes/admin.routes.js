import { Router } from "express";
import {
  getAdminServices,
  deleteService,
  addService,
  editService,
  getAllStaff,
  deleteStaff,
} from "../controllers/admin.controller.js";

const router = Router();

router.get("/services", getAdminServices);
router.post("/services", addService);
router.put("/services/:id", editService);
router.delete("/services/:id", deleteService);

router.get("/staff", getAllStaff);
router.delete("/staff/:id", deleteStaff);

export default router;
