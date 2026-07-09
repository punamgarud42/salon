import { getItem } from '../lib/storage';

/**
 * Upcoming batches per course. `totalSeats` is the cap; how many are
 * actually filled is NOT stored here — it's computed from real enrollment
 * records (lib/enrollment.js + the backend's /api/batches endpoint), so
 * seat counts are always live rather than a number someone has to
 * remember to update.
 */
const DEFAULT_BATCHES = [
  { id: 'batch-hd-jul', courseId: 'crs-hairdressing-diploma', startDate: '2026-07-20', endDate: '2027-01-20', totalSeats: 15 },
  { id: 'batch-hd-sep', courseId: 'crs-hairdressing-diploma', startDate: '2026-09-14', endDate: '2027-03-14', totalSeats: 15 },
  { id: 'batch-hf-jul', courseId: 'crs-hair-fundamentals', startDate: '2026-07-11', endDate: '2026-08-08', totalSeats: 12 },
  { id: 'batch-ma-aug', courseId: 'crs-makeup-artistry', startDate: '2026-08-02', endDate: '2026-10-25', totalSeats: 10 },
  { id: 'batch-sc-jul', courseId: 'crs-skincare-certificate', startDate: '2026-07-13', endDate: '2026-08-24', totalSeats: 14 },
  { id: 'batch-mm-jul', courseId: 'crs-mehendi-mastery', startDate: '2026-07-18', endDate: '2026-08-15', totalSeats: 18 },
  { id: 'batch-bs-aug', courseId: 'crs-bridal-styling', startDate: '2026-08-09', endDate: '2026-10-04', totalSeats: 10 },
];

export function getAllBatches() {
  return getItem('batches', DEFAULT_BATCHES);
}

export function getBatchesForCourse(courseId) {
  return getAllBatches().filter((b) => b.courseId === courseId);
}

export function getBatchById(id) {
  return getAllBatches().find((b) => b.id === id) ?? null;
}
