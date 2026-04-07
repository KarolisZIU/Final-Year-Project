import * as staffRepo from "../repositories/staff.repo.js";
import * as bookingRepo from "../repositories/booking.repo.js";
import * as customerRepo from "../repositories/customer.repo.js";
import * as servicesRepo from "../repositories/services.repo.js";
import nodemailer from "nodemailer";
import { fromZonedTime } from "date-fns-tz";

const TIMEZONE = "Europe/Dublin";

// Email transporter setup using Gmail credentials from environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Sends a confirmation email to the customer after a booking is created
async function sendConfirmationEmail(
  customerEmail,
  customerName,
  serviceName,
  staffName,
  slotStart,
  slotEnd,
) {
  const start = new Date(slotStart).toLocaleString("en-IE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: TIMEZONE,
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "Booking Confirmation",
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Hi ${customerName},</p>
      <p>Your booking has been confirmed. Here are your details:</p>
      <ul>
        <li><strong>Service:</strong> ${serviceName}</li>
        <li><strong>Staff:</strong> ${staffName}</li>
        <li><strong>Date & Time:</strong> ${start}</li>
      </ul>
      <p>To cancel your booking, visit the Manage Bookings page and enter your email address.</p>
    `,
  });
}

// Generates all 30-minute slots between a staff member's start and end time for a given date
function generateSlots(startTime, endTime, date) {
  const slots = [];
  let current = fromZonedTime(`${date}T${startTime}`, TIMEZONE);
  const end = fromZonedTime(`${date}T${endTime}`, TIMEZONE);

  while (current < end) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + 30);
  }
  return slots;
}

// Filters out slots that are in the past, would run over the end of the working day, or overlap an existing booking
function filterAvailableSlots(slots, bookings, serviceDuration, workEnd) {
  return slots.filter((slot) => {
    const slotEnd = new Date(slot.getTime() + serviceDuration * 60000);

    if (slotEnd > workEnd) return false;
    if (slot < new Date()) return false;
    return !bookings.some(
      (booking) =>
        new Date(booking.booking_start_time) < slotEnd &&
        new Date(booking.booking_end_time) > slot,
    );
  });
}

// Returns all available slots for a given staff member, service and date
export async function getAvailableSlots(staffId, serviceId, date) {
  const scheduleResult = await staffRepo.getScheduleForDay(staffId, date);
  const schedule = scheduleResult.rows[0];
  if (!schedule) return [];

  const allSlots = generateSlots(schedule.start_time, schedule.end_time, date);

  const bookingsResult = await bookingRepo.getBookingsForStaffOnDay(
    staffId,
    date,
  );
  const bookings = bookingsResult.rows;

  const serviceResult = await servicesRepo.getServiceById(serviceId);
  const service = serviceResult.rows[0];
  if (!service) return [];

  const workEnd = fromZonedTime(`${date}T${schedule.end_time}`, TIMEZONE);
  return filterAvailableSlots(
    allSlots,
    bookings,
    service.service_duration,
    workEnd,
  );
}

// Creates a new booking after validating working hours, double booking, then sends confirmation email
export async function createBooking(
  serviceId,
  staffId,
  customerName,
  customerEmail,
  slotTime,
  date,
) {
  // check 1 - staff is working that day and slot is within working hours
  const scheduleResult = await staffRepo.getScheduleForDay(staffId, date);
  const schedule = scheduleResult.rows[0];
  if (!schedule) throw new Error("Staff is not working on this day");

  const slotStart = new Date(slotTime);
  const workStart = fromZonedTime(`${date}T${schedule.start_time}`, TIMEZONE);
  const workEnd = fromZonedTime(`${date}T${schedule.end_time}`, TIMEZONE);
  if (slotStart < workStart || slotStart >= workEnd) {
    throw new Error("Selected time is outside working hours");
  }

  // check 2 - slot is not already booked
  const serviceResult = await servicesRepo.getServiceById(serviceId);
  const service = serviceResult.rows[0];
  if (!service) throw new Error("Service not found");

  const slotEnd = new Date(
    slotStart.getTime() + service.service_duration * 60000,
  );
  const existingBookings = await bookingRepo.getBookingsForStaffOnDay(
    staffId,
    date,
  );

  const isDoubleBooked = existingBookings.rows.some(
    (booking) =>
      new Date(booking.booking_start_time) < slotEnd &&
      new Date(booking.booking_end_time) > slotStart,
  );
  if (isDoubleBooked) throw new Error("This slot is already booked");

  // all checks passed - create the booking
  let customerResult = await customerRepo.getCustomerByEmail(customerEmail);
  let customer = customerResult.rows[0];

  if (!customer) {
    const newCustomer = await customerRepo.createCustomer(
      customerName,
      customerEmail,
    );
    customer = newCustomer.rows[0];
  }

  const booking = await bookingRepo.createBooking(
    serviceId,
    staffId,
    customer.customer_id,
    slotStart,
    slotEnd,
  );

  const staffResult = await staffRepo.getStaffById(staffId);
  const staffName = staffResult.rows[0]?.staff_name || "your staff member";
  await sendConfirmationEmail(
    customerEmail,
    customerName,
    service.service_name,
    staffName,
    slotStart,
    slotEnd,
  );

  return booking.rows[0];
}

// Returns all pending bookings for a customer by their email
export async function getBookingsByEmail(email) {
  const result = await bookingRepo.getBookingsByEmail(email);
  return result.rows;
}

// Cancels a booking by setting its status to cancelled
export async function cancelBooking(bookingId) {
  await bookingRepo.cancelBooking(bookingId);
}

// Returns all bookings for a staff member on a specific day, defaults to today
export async function getBookingsForStaffForDay(
  staffId,
  date = new Date().toLocaleDateString("en-CA"),
) {
  const result = await bookingRepo.getBookingsForStaffForDay(staffId, date);
  return result.rows;
}

// Returns all bookings across all staff for a specific day, defaults to today
export async function getAllBookingsForDay(
  date = new Date().toLocaleDateString("en-CA"),
) {
  const result = await bookingRepo.getAllBookingsForDay(date);
  return result.rows;
}

// Marks a booking as completed
export async function completeBooking(bookingId) {
  await bookingRepo.completeBooking(bookingId);
}

// Modifies a booking's time after validating the new slot is available
export async function modifyBooking(bookingId, startTime) {
  const bookingResult = await bookingRepo.getBookingById(bookingId);
  const booking = bookingResult.rows[0];
  if (!booking) throw new Error("Booking not found");

  const date = new Date(startTime).toISOString().split("T")[0];
  const availableSlots = await getAvailableSlots(
    booking.staff_id,
    booking.service_id,
    date,
  );
  const isAvailable = availableSlots.some(
    (slot) => new Date(slot).getTime() === new Date(startTime).getTime(),
  );
  if (!isAvailable) throw new Error("This slot is not available");
  const serviceResult = await servicesRepo.getServiceById(booking.service_id);
  const service = serviceResult.rows[0];
  if (!service) throw new Error("Service not found");

  const slotEnd = new Date(new Date(startTime).getTime() + service.service_duration * 60000);

  await bookingRepo.modifyBooking(bookingId, startTime, slotEnd);
}
