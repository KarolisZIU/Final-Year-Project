import { Router } from "express";
import { getPublicServices } from "../controllers/services.controller.js";
import { getAllStaff } from "../controllers/services.controller.js";

const router = Router();

router.get("/services", getPublicServices);
router.get("/staff", getAllStaff);

export default router;