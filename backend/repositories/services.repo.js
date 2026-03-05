import { pool } from "../database.js";


export async function getActiveServices() {
  return pool.query(
    `SELECT service_id, service_name, service_price, service_duration
     FROM services
     WHERE is_active = true
     ORDER BY service_id`
  );
}

export async function adminGetAllServices() {
  return pool.query("SELECT * FROM services ORDER BY service_id");
}

export async function adminCreateService({ service_name, service_price, service_duration, is_active }) {
  return pool.query(
    `INSERT INTO services (service_name, service_price, service_duration, is_active)
     VALUES ($1, $2, $3, $4)
     RETURNING service_id, service_name, service_price, service_duration, is_active`,
    [service_name, service_price, service_duration, is_active]
  );
}

export async function adminGetServiceById(id) {
  return pool.query(
    "SELECT service_id, service_name, service_price, service_duration, is_active FROM services WHERE service_id = $1",
    [id]
  );
}

export async function adminUpdateService(id, { service_name, service_price, service_duration, is_active }) {
  return pool.query(
    `UPDATE services
     SET service_name = $1, service_price = $2, service_duration = $3, is_active = $4
     WHERE service_id = $5
     RETURNING service_id, service_name, service_price, service_duration, is_active`,
    [service_name, service_price, service_duration, is_active, id]
  );
}

export async function adminDeleteService(id) {
  return pool.query(
    "DELETE FROM services WHERE service_id = $1 RETURNING service_id",
    [id]
  );
}