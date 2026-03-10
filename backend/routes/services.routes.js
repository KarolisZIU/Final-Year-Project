import { Router } from "express";
import { getPublicServices } from "../controllers/services.controller.js";

const router = Router();

router.get("/services", getPublicServices);

export default router;