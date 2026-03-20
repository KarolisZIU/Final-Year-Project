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

export async function countAdmins(){
  return pool.query(`SELECT COUNT(*) FROM staff WHERE staff_role = 'admin'`);
}

export async function addStaff(name, username, password, role){
  return pool.query(
    `INSERT INTO staff (staff_name, staff_username, staff_password_hash, staff_role)
     VALUES ($1, $2, $3, $4)
     RETURNING staff_id`,
    [name, username, password, role]
  );
}

export async function addSchedule(staffId, dayOfWeek, startTime, endTime) {
  return pool.query(
    `INSERT INTO staff_schedule (staff_id, day_of_week, start_time, end_time)
     VALUES ($1, $2, $3, $4)`,
    [staffId, dayOfWeek, startTime, endTime]
  );
}

export async function getStaffById(staffId){
  return pool.query(`SELECT staff_name, staff_username, staff_role
    FROM staff
    WHERE staff_id = $1`, [staffId]);
}

export async function updateStaff(staffId, name, username, role){
  return pool.query(
    `UPDATE staff
     SET staff_name = $2, staff_username = $3, staff_role = $4
     WHERE staff_id = $1`,
    [staffId, name, username, role]
  );
}

export async function getStaffSchedule(staffId){
  return pool.query(
    `SELECT day_of_week, start_time, end_time
     FROM staff_schedule
     WHERE staff_id = $1
     ORDER BY CASE day_of_week
       WHEN 'Monday' THEN 1
       WHEN 'Tuesday' THEN 2
       WHEN 'Wednesday' THEN 3
       WHEN 'Thursday' THEN 4
       WHEN 'Friday' THEN 5
       WHEN 'Saturday' THEN 6
       WHEN 'Sunday' THEN 7
     END`,
    [staffId]
  );
}

export async function deleteStaffSchedule(staffId){
  return pool.query(
    `DELETE FROM staff_schedule
     WHERE staff_id = $1`,
    [staffId]
  );
}