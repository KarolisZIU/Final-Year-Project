import { pool } from "../database.js";


export async function getActiveServices() {
  return pool.query(
    `SELECT service_id, service_name, service_price, service_duration
     FROM services
     WHERE is_active = true
     ORDER BY service_id`
  );
}
export async function adminGetAllServices(){
  return pool.query(
    `SELECT *
     FROM services
     ORDER BY service_id`
  );
}

export async function adminDeleteService(serviceId){
  return pool.query(
    `DELETE FROM services
     WHERE service_id = $1`, [serviceId]
  );
}

export async function adminAddService(name, price, duration){
  return pool.query(
    `INSERT INTO services (service_name, service_price, service_duration, is_active)
     VALUES ($1, $2, $3, true)`, [name, price, duration]
  );
}

export async function adminGetAllStaff(){
  return pool.query(
    `SELECT staff_id, staff_name, staff_role
     FROM staff
     ORDER BY staff_id`
  );
}