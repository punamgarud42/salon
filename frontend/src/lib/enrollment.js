import { getItem } from './storage.js';

/**
 * seatsLeft / seatStatus — pure functions, easy to reuse server-side logic
 * conceptually even though the backend does its own authoritative count.
 */
export function seatsLeft(totalSeats, enrolledCount) {
  return Math.max(0, totalSeats - enrolledCount);
}

export function seatStatus(totalSeats, enrolledCount) {
  const left = seatsLeft(totalSeats, enrolledCount);
  if (left <= 0) return 'full';
  if (left / totalSeats <= 0.25) return 'filling-fast';
  return 'open';
}

export const SEAT_STATUS_LABEL = {
  open: 'Seats Open',
  'filling-fast': 'Filling Fast',
  full: 'Full',
};

/**
 * getLocalEnrollmentCounts — fallback used when the backend isn't
 * reachable: counts confirmed enrollments per batch from localStorage, so
 * seat availability still updates correctly in a frontend-only demo.
 */
export function getLocalEnrollmentCounts() {
  const enrollments = getItem('enrollments', []);
  const counts = {};
  for (const e of enrollments) {
    if (e.status && e.status !== 'confirmed') continue;
    counts[e.batchId] = (counts[e.batchId] ?? 0) + 1;
  }
  return counts;
}
