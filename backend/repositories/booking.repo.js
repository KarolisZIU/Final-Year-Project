import { pool } from "../database.js";

export async function getBookingsForStaffOnDay(staffId, date) {
  return pool.query(
    `SELECT booking_start_time, booking_end_time
     FROM bookings
     WHERE staff_id = $1
     AND DATE(booking_start_time) = $2
     AND booking_status = 'pending'`,
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

export async function getBookingsByEmail(email) {
  return pool.query(
    `SELECT b.booking_id, b.booking_start_time, b.booking_end_time, b.booking_status,
            s.service_name, st.staff_name
     FROM bookings b
     JOIN customers c ON b.customer_id = c.customer_id
     JOIN services s ON b.service_id = s.service_id
     JOIN staff st ON b.staff_id = st.staff_id
     WHERE c.customer_email = $1
     AND b.booking_status = 'pending'`,
    [email]
  );
}

export async function cancelBooking(bookingId) {
  return pool.query(
    `UPDATE bookings
     SET booking_status = 'cancelled'
     WHERE booking_id = $1`,
    [bookingId]
  );
}