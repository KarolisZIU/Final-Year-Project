import express from "express";
import cors from "cors";

import servicesRoutes from "./routes/services.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", servicesRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Backend is running" }));


app.listen(3000, () => console.log("API running on http://localhost:3000"));