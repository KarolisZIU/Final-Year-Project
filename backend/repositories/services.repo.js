import { pool } from "../database.js";

export async function getActiveServices() {
  return pool.query(
    `SELECT service_id, service_name, service_price, service_duration
     FROM services
     WHERE is_active = true
     ORDER BY service_id`
  );
}

export async function getAllStaff(){
  return pool.query(
    `SELECT staff_id, staff_name
     FROM staff
     ORDER BY staff_id`
  );
}

export async function getServiceById(serviceId) {
  return pool.query(
    `SELECT service_duration
    FROM services
    WHERE service_id = $1`,
    [serviceId]
  );
}