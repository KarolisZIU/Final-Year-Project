import { pool } from "../database.js";

export async function getAllStaff() {
  return pool.query(
    `SELECT staff_id, staff_name
     FROM staff
     WHERE is_active = true
     ORDER BY staff_id`
  );
}

export async function getScheduleForDay(staffId, date) {
  const dayOfWeek = new Date(date + "T00:00:00").getDay();
  return pool.query(
    `SELECT start_time, end_time
     FROM staff_schedule
     WHERE staff_id = $1
     AND day_of_week = $2`,
    [staffId, dayOfWeek]
  );
}