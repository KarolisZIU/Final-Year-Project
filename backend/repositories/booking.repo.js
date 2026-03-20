import { pool } from "../database.js";

export async function getBookingsForStaffOnDay(staffId, date) {
  return pool.query(
    `SELECT booking_start_time, booking_end_time
     FROM bookings
     WHERE staff_id = $1
     AND DATE(booking_start_time) = $2`,
    [staffId, date]
  );
}

export async function createBooking(serviceId, staffId, customerId, startTime, endTime) {
  return pool.query(
    `INSERT INTO bookings (service_id, staff_id, customer_id, booking_start_time, booking_end_time)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING booking_id`,
    [serviceId, staffId, customerId, startTime, endTime]
  );
}