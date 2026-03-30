// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./database.js"; // your Postgres connection

// Import your routes
import servicesRoutes from "./routes/services.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api", servicesRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true, message: "Backend is running" }));

// Postgres DB test on startup (optional)
async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ DB connection successful:", res.rows);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}
testDB();

// __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vue frontend
app.use(express.static(path.join(__dirname, "frontend/myapp/dist")));

// Handle SPA routing — send index.html for all non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/myapp/dist/index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API + Frontend running on port ${PORT}`));