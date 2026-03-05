import { Router } from "express";
import { getPublicServices } from "../controllers/services.controller.js";
import { getAdminServices } from "../controllers/services.controller.js";
import { deleteService } from "../controllers/services.controller.js";
import { addService } from "../controllers/services.controller.js";
const router = Router();

router.get("/services", getPublicServices);

router.get("/admin/services", getAdminServices);

router.delete("/admin/services/:id", deleteService);

router.post("/admin/services", addService);

export default router;