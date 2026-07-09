import mongoose from 'mongoose';

/**
 * Booking — one document per appointment.
 *
 * `amount` (added in Phase 9) is the service's price *at the time of
 * booking*, sent by the frontend and stored here rather than re-looked-up
 * from the Service document when payment happens later. This is
 * deliberate: if the owner changes a service's price after someone has
 * already booked at the old price, that customer should still pay what
 * they were quoted, not whatever the price happens to be by the time they
 * click "Pay Now".
 */
const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    amount: { type: Number, default: 0 }, // price at time of booking — see Phase 9 note below
    date: { type: String, required: true },          // "YYYY-MM-DD", matches <input type="date">
    startMinutes: { type: Number, required: true },  // minutes since midnight, matches lib/booking.js
    timeLabel: { type: String, required: true },      // display string, e.g. "2:30 PM"
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    notes: { type: String, default: '' },
    referenceNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  },
  { timestamps: true }
);

// The actual double-booking guard: two confirmed bookings can't share a
// service+date+start time. Cancelled bookings free the slot back up.
bookingSchema.index(
  { serviceId: 1, date: 1, startMinutes: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

export default mongoose.model('Booking', bookingSchema);
