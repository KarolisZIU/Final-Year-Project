import express from "express";
import cors from "cors";
import { pool } from "./database.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
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

// crud
// GET(return all services)
app.get("/api/admin/services", async (req, res) => {
  try{
    const result = await pool.query(
      "SELECT * FROM services ORDER BY service_id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin services" });
  }
});

// POST(create new service)
app.post("/api/admin/services", async (req, res) => {
  try {
    const { service_name, service_price, service_duration, is_active } = req.body;

    if (!service_name || service_price == null || service_duration == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO services (service_name, service_price, service_duration, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING service_id, service_name, service_price, service_duration, is_active`,
      [service_name.trim(), service_price, service_duration, is_active ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create service" });
  }
});
// Edit/modify service
// getting a service by id to pre-fill the edit form
app.get("/api/admin/services/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT service_id, service_name, service_price, service_duration, is_active FROM services WHERE service_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch service" });
  }
});

// POST(update service)
app.put("/api/admin/services/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, service_price, service_duration, is_active } = req.body;

    if (!service_name || service_price == null || service_duration == null || is_active == null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await pool.query(
      `UPDATE services
       SET service_name = $1,
           service_price = $2,
           service_duration = $3,
           is_active = $4
       WHERE service_id = $5
       RETURNING service_id, service_name, service_price, service_duration, is_active`,
      [service_name.trim(), service_price, service_duration, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update service" });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});