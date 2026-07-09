import Booking from '../models/Booking.model.js';

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I ambiguity, matches frontend's genRefNumber

function generateReferenceNumber() {
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `BK-${suffix}`;
}

/**
 * GET /api/bookings/availability?serviceId=...&date=YYYY-MM-DD
 * Returns the start-times (in minutes since midnight) already booked for
 * that service on that date, so the frontend can grey them out. This is
 * the real source of truth the frontend calls before showing slots — the
 * localStorage-based fallback in the frontend only kicks in if this
 * request fails (backend not running).
 */
export async function getAvailability(req, res) {
  const { serviceId, date } = req.query;
  if (!serviceId || !date) {
    return res.status(400).json({ error: 'serviceId and date are both required.' });
  }

  try {
    const bookings = await Booking.find({ serviceId, date, status: 'confirmed' }, 'startMinutes');
    res.json({ bookedStartMinutes: bookings.map((b) => b.startMinutes) });
  } catch (err) {
    console.error('[bookings] getAvailability failed:', err);
    res.status(500).json({ error: 'Could not check availability.' });
  }
}

/**
 * POST /api/bookings
 * Creates a booking with a server-generated reference number (the source
 * of truth — the frontend only generates its own reference number if this
 * request fails entirely, as a last-resort fallback). Retries reference
 * number generation on the rare collision; relies on the DB's unique
 * compound index (serviceId+date+startMinutes) as the real double-booking
 * guard, not just the availability check the frontend already did (which
 * can race between two visitors booking the same slot at once).
 */
export async function createBooking(req, res) {
  const { serviceId, serviceName, amount, date, startMinutes, timeLabel, name, phone, email, notes } = req.body;

  if (!serviceId || !serviceName || !date || startMinutes === undefined || !timeLabel || !name || !phone) {
    return res.status(400).json({ error: 'Missing required booking fields.' });
  }

  const MAX_ATTEMPTS = 5;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const booking = await Booking.create({
        serviceId, serviceName, amount: amount || 0, date, startMinutes, timeLabel,
        name, phone, email, notes,
        referenceNumber: generateReferenceNumber(),
      });
      return res.status(201).json(booking);
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key: could be the reference number (retry) or, more
        // meaningfully, someone else just took this exact slot.
        const isSlotConflict = err.keyPattern && 'startMinutes' in err.keyPattern;
        if (isSlotConflict) {
          return res.status(409).json({ error: 'That slot was just booked by someone else. Please pick another.' });
        }
        continue; // reference number collision — try again with a new one
      }
      console.error('[bookings] createBooking failed:', err);
      return res.status(500).json({ error: 'Could not create booking. Please try again.' });
    }
  }

  res.status(500).json({ error: 'Could not generate a unique reference number. Please try again.' });
}

/**
 * GET /api/bookings
 * Owner-only in Phase 8. Lists all bookings for the admin dashboard's
 * appointments view.
 */
export async function listBookings(req, res) {
  try {
    const bookings = await Booking.find().sort({ date: 1, startMinutes: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('[bookings] listBookings failed:', err);
    res.status(500).json({ error: 'Could not load bookings.' });
  }
}

/**
 * PUT /api/bookings/:id/status
 * Owner-only. Lets the admin mark a booking as completed or cancelled.
 * Cancelling frees the slot back up automatically — the partial unique
 * index on Booking only applies to status: 'confirmed' — so a cancelled
 * booking's slot becomes bookable again with no extra code needed.
 */
export async function updateBookingStatus(req, res) {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json(booking);
  } catch (err) {
    console.error('[bookings] updateBookingStatus failed:', err);
    res.status(500).json({ error: 'Could not update booking status.' });
  }
}
