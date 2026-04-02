import * as staffRepo from "../repositories/staff.repo.js";
import * as bookingRepo from "../repositories/booking.repo.js";
import * as customerRepo from "../repositories/customer.repo.js";
import * as servicesRepo from "../repositories/services.repo.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendConfirmationEmail(customerEmail, customerName, serviceName, staffName, slotStart, slotEnd) {
  const start = new Date(slotStart).toLocaleString("en-IE", { dateStyle: "full", timeStyle: "short" });
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

function generateSlots(startTime, endTime, date) {
  const slots = [];
  let current = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  while (current < end) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + 30);
  }
  return slots;
}

function filterAvailableSlots(slots, bookings, serviceDuration, workEnd) {
  return slots.filter(slot => {
    const slotEnd = new Date(slot.getTime() + serviceDuration * 60000);

    if (slotEnd > workEnd) return false;
    if (slot < new Date()) return false;
    return !bookings.some(booking =>
      new Date(booking.booking_start_time) < slotEnd &&
      new Date(booking.booking_end_time) > slot
    );
  });
}

export async function getAvailableSlots(staffId, serviceId, date) {
  const scheduleResult = await staffRepo.getScheduleForDay(staffId, date);
  const schedule = scheduleResult.rows[0];
  if (!schedule) return [];

  const allSlots = generateSlots(schedule.start_time, schedule.end_time, date);

  const bookingsResult = await bookingRepo.getBookingsForStaffOnDay(staffId, date);
  const bookings = bookingsResult.rows;

  const serviceResult = await servicesRepo.getServiceById(serviceId);
  const service = serviceResult.rows[0];
  if (!service) return [];

  const workEnd = new Date(`${date}T${schedule.end_time}`);
  return filterAvailableSlots(allSlots, bookings, service.service_duration, workEnd);
}

export async function createBooking(serviceId, staffId, customerName, customerEmail, slotTime, date) {
  // check 1 - staff is working that day and slot is within working hours
  const scheduleResult = await staffRepo.getScheduleForDay(staffId, date);
  const schedule = scheduleResult.rows[0];
  if (!schedule) throw new Error("Staff is not working on this day");

  const slotStart = new Date(slotTime);
  const workStart = new Date(`${date}T${schedule.start_time}`);
  const workEnd = new Date(`${date}T${schedule.end_time}`);
  if (slotStart < workStart || slotStart >= workEnd) {
    throw new Error("Selected time is outside working hours");
  }

  // check 2 - slot is not already booked
  const serviceResult = await servicesRepo.getServiceById(serviceId);
  const service = serviceResult.rows[0];
  if (!service) throw new Error("Service not found");

  const slotEnd = new Date(slotStart.getTime() + service.service_duration * 60000);
  const existingBookings = await bookingRepo.getBookingsForStaffOnDay(staffId, date);

  const isDoubleBooked = existingBookings.rows.some(booking =>
    new Date(booking.booking_start_time) < slotEnd &&
    new Date(booking.booking_end_time) > slotStart
  );
  if (isDoubleBooked) throw new Error("This slot is already booked");

  // all checks passed - create the booking
  let customerResult = await customerRepo.getCustomerByEmail(customerEmail);
  let customer = customerResult.rows[0];

  if (!customer) {
    const newCustomer = await customerRepo.createCustomer(customerName, customerEmail);
    customer = newCustomer.rows[0];
  }

  const booking = await bookingRepo.createBooking(
    serviceId,
    staffId,
    customer.customer_id,
    slotStart,
    slotEnd
  );

  const staffResult = await staffRepo.getStaffById(staffId);
  const staffName = staffResult.rows[0]?.staff_name || "your staff member";
  await sendConfirmationEmail(customerEmail, customerName, service.service_name, staffName, slotStart, slotEnd);

  return booking.rows[0];
}

export async function getBookingsByEmail(email){
  const result = await bookingRepo.getBookingsByEmail(email);
  return result.rows;
}

export async function cancelBooking(bookingId) {
  await bookingRepo.cancelBooking(bookingId);
}


export async function getBookingsForStaffForDay(staffId, date=new Date().toLocaleDateString("en-CA")) {

  const result = await bookingRepo.getBookingsForStaffForDay(staffId, date);
  return result.rows;
}

export async function getAllBookingsForDay(date = new Date().toLocaleDateString("en-CA")) {
  const result = await bookingRepo.getAllBookingsForDay(date);
  return result.rows;
}

export async function completeBooking(bookingId) {
  await bookingRepo.completeBooking(bookingId);
}