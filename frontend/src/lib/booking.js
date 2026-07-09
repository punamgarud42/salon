/**
 * booking.js — pure functions for turning "a service + a date" into a list
 * of real, bookable time slots. No React here on purpose, so it's easy to
 * unit test and easy to port server-side later if you want the backend to
 * be the sole source of truth for availability instead of computing it
 * client-side against fetched bookings.
 */

export const BUSINESS_HOURS = { openMinutes: 10 * 60, closeMinutes: 20 * 60 }; // 10:00–20:00
export const SLOT_STEP_MINUTES = 30;

function minutesToLabel(mins) {
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * generateDaySlots — every possible start time for a service of the given
 * duration within business hours, stepped every SLOT_STEP_MINUTES. Does
 * NOT know about existing bookings or "today" — see filterAvailableSlots
 * for that.
 */
export function generateDaySlots(durationMinutes) {
  const slots = [];
  const lastPossibleStart = BUSINESS_HOURS.closeMinutes - durationMinutes;

  for (let start = BUSINESS_HOURS.openMinutes; start <= lastPossibleStart; start += SLOT_STEP_MINUTES) {
    slots.push({ startMinutes: start, label: minutesToLabel(start) });
  }
  return slots;
}

/**
 * filterAvailableSlots — removes slots that are already booked (by start
 * time, for this service+date) or that fall in the past if `dateStr` is
 * today.
 *
 * bookedStartMinutes: array of numbers — start-of-day minutes already
 * taken for this service on this date (from local bookings and/or the
 * backend's /api/bookings/availability response).
 */
export function filterAvailableSlots(slots, { dateStr, bookedStartMinutes = [] }) {
  const now = new Date();
  const isToday = dateStr === toDateInputValue(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.map((slot) => ({
    ...slot,
    isBooked: bookedStartMinutes.includes(slot.startMinutes),
    isPast: isToday && slot.startMinutes <= nowMinutes,
  }));
}

/** toDateInputValue — Date -> "YYYY-MM-DD", matching <input type="date"> values. */
export function toDateInputValue(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** todayInputValue / maxBookableInputValue — bounds for the date picker. */
export function todayInputValue() {
  return toDateInputValue(new Date());
}

export function maxBookableInputValue(daysAhead = 60) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return toDateInputValue(d);
}
