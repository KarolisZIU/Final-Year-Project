import { Router } from "express";
import * as servicesController from "../controllers/services.controller.js";

const router = Router();

router.get("/services", servicesController.getPublicServices);
router.get("/staff", servicesController.getAllStaff);

export default router;