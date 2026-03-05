import { pool } from "../database.js";


export async function getActiveServices() {
  return pool.query(
    `SELECT service_id, service_name, service_price, service_duration
     FROM services
     WHERE is_active = true
     ORDER BY service_id`
  );
}
export function adminGetAllServices(){
  return pool.query(
    `SELECT *
     FROM services
     ORDER BY service_id`
  );
}