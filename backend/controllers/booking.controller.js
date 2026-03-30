import * as bookingService from "../services/booking.service.js";

export async function getAvailableSlots(req, res) {
  try {
    const { staffId, serviceId, date } = req.query;

    if (!staffId || !serviceId || !date) {
      return res.status(400).json({ error: "staffId, serviceId and date are required" });
    }

    const slots = await bookingService.getAvailableSlots(staffId, serviceId, date);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function createBooking(req, res) {
  try {
    const { serviceId, staffId, customerName, customerEmail, slotTime, date } = req.body;

    if (!serviceId || !staffId || !customerName || !customerEmail || !slotTime || !date) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const booking = await bookingService.createBooking(
      serviceId,
      staffId,
      customerName,
      customerEmail,
      slotTime,
      date
    );

    res.status(201).json({ bookingId: booking.booking_id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function getBookingsByEmail(req, res){
  try{
    const { email } = req.query;
    if(!email){
      return res.status(400).json({ error: "Email is required" });
    }
    const bookings = await bookingService.getBookingsByEmail(email);
    res.json(bookings);
    } catch (err){
      console.error(err);
      res.status(400).json({ error: err.message });
    }
}

export async function cancelBooking(req, res) {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    await bookingService.cancelBooking(bookingId);
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function getBookingsForStaffForDay(req, res) {
  try {
    const staffId = req.user.staffId;
    const date = req.query.date
    const bookings = await bookingService.getBookingsForStaffForDay(staffId, date);
    res.json(bookings);
  }
  catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}

export async function completeBooking(req, res) {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }
    await bookingService.completeBooking(bookingId);
    res.json({ message: "Booking marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
}
