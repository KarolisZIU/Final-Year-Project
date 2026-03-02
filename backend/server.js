import express from "express";
import cors from "cors";
import { pool } from "./database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});

app.get("/api/services", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT service_id, service_name, service_price, service_duration FROM services WHERE is_active = TRUE ORDER BY service_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

app.get("/api/staff", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT staff_id, staff_name FROM staff WHERE is_active = TRUE ORDER BY staff_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});