import { pool } from "../database.js";

export async function adminGetAllServices() {
  return pool.query(
    `SELECT *
     FROM services
     ORDER BY service_id`
  );
}

export async function adminDeleteService(serviceId) {
  return pool.query(
    `DELETE FROM services
     WHERE service_id = $1`,
    [serviceId]
  );
}

export async function adminAddService(name, price, duration) {
  return pool.query(
    `INSERT INTO services (service_name, service_price, service_duration, is_active)
     VALUES ($1, $2, $3, true)`,
    [name, price, duration]
  );
}

export async function adminEditService(serviceId, name, price, duration, isActive) {
  return pool.query(
    `UPDATE services
     SET service_name = $2, service_price = $3, service_duration = $4, is_active = $5
     WHERE service_id = $1`,
    [serviceId, name, price, duration, isActive]
  );
}

export async function adminGetAllStaff() {
  return pool.query(
    `SELECT staff_id, staff_name, staff_role
     FROM staff
     ORDER BY staff_id`
  );
}

export async function adminDeleteStaff(staffId) {
  return pool.query(
    `DELETE FROM staff
     WHERE staff_id = $1`,
    [staffId]
  );
}

export async function getStaffById(staffId) {
  return pool.query(`SELECT * FROM staff 
    WHERE staff_id = $1`, [staffId]);
}

export async function countAdmins(){
  return pool.query(`SELECT COUNT(*) FROM staff WHERE staff_role = 'admin'`);
}
