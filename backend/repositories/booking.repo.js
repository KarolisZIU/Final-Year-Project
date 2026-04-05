import { pool } from "../database.js";

// Returns all bookings for staff on a specific day, used to check availability when creating a booking
export async function getBookingsForStaffOnDay(staffId, date) {
  return pool.query(
    `SELECT booking_start_time, booking_end_time
     FROM bookings
     WHERE staff_id = $1
     AND DATE(booking_start_time) = $2
     AND booking_status = 'pending'`,
    [staffId, date],
  );
}

// Create new booking entry in the database
export async function createBooking(
  serviceId,
  staffId,
  customerId,
  startTime,
  endTime,
) {
  return pool.query(
    `INSERT INTO bookings (service_id, staff_id, customer_id, booking_start_time, booking_end_time)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING booking_id`,
    [serviceId, staffId, customerId, startTime, endTime],
  );
}

// Return all bookings associated with an email address
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
    [email],
  );
}

// Cancel booking, set status to cancelled
export async function cancelBooking(bookingId) {
  return pool.query(
    `UPDATE bookings
     SET booking_status = 'cancelled'
     WHERE booking_id = $1`,
    [bookingId],
  );
}

// Change booking slot time, used for customer rescheduling booking
export async function modifyBooking(bookingId, startTime, endTime) {
  return pool.query(
    `UPDATE bookings
    SET booking_start_time = $1, booking_end_time = $2
    WHERE booking_id = $3`,
    [startTime, endTime, bookingId],
  );
}

// Return all bookings for a specific staff member on specific day, used for staff dashboard
export async function getBookingsForStaffForDay(staffId, date) {
  return pool.query(
    `SELECT b.booking_id, b.booking_start_time, s.service_name, s.service_duration, c.customer_name
    FROM bookings b 
    JOIN services s ON b.service_id= s.service_id
    JOIN customers c ON b.customer_id = c.customer_id
    WHERE staff_id = $1 AND DATE(booking_start_time) = $2 AND booking_status = 'pending'
    ORDER BY booking_start_time`,
    [staffId, date],
  );
}

// Returns all bookings across the application for a specific day, used for admin dashboard
export async function getAllBookingsForDay(date) {
  return pool.query(
    `SELECT b.booking_id, b.booking_start_time, s.service_name, s.service_duration, c.customer_name, st.staff_name
     FROM bookings b
     JOIN services s ON b.service_id = s.service_id
     JOIN customers c ON b.customer_id = c.customer_id
     JOIN staff st ON b.staff_id = st.staff_id
     WHERE DATE(b.booking_start_time) = $1 AND b.booking_status = 'pending'
     ORDER BY b.booking_start_time`,
    [date],
  );
}

// Change booking status to completed, used for admin/staff dashboard
export async function completeBooking(bookingId) {
  return pool.query(
    `UPDATE bookings SET booking_status = 'completed' WHERE booking_id = $1`,
    [bookingId],
  );
}

// Returns staffID and ServiceID for a specific booking, used for feeding info to modifyBooking function
export async function getBookingById(bookingId) {
  return pool.query(
    `SELECT staff_id, service_id, booking_start_time
     FROM bookings WHERE booking_id = $1`,
    [bookingId],
  );
}
