import { useEffect, useState } from 'react';
import { getAllBatches } from '../data/batches.js';
import { DEFAULT_COURSES, findCourseById } from '../data/courses.js';
import { seatsLeft, seatStatus, getLocalEnrollmentCounts } from '../lib/enrollment.js';
import { apiGet } from '../lib/api.js';

/**
 * useBatchAvailability — returns { batches, loading }, where each batch is
 * enriched with courseName, seatsLeft and status ('open' | 'filling-fast' |
 * 'full'). Tries the backend's live count first (GET /api/batches, which
 * joins real enrollment counts); falls back to counting localStorage
 * enrollments if the backend isn't reachable — same fallback shape used by
 * booking availability in Phase 3.
 */
export function useBatchAvailability() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await apiGet('/batches');
        if (!cancelled) setBatches(res);
      } catch (err) {
        console.warn('[useBatchAvailability] backend unreachable, using local data:', err.message);
        const localCounts = getLocalEnrollmentCounts();
        const enriched = getAllBatches().map((b) => {
          const enrolledCount = localCounts[b.id] ?? 0;
          const course = findCourseById(DEFAULT_COURSES, b.courseId);
          return {
            ...b,
            courseName: course?.name ?? 'Unknown Course',
            enrolledCount,
            seatsLeft: seatsLeft(b.totalSeats, enrolledCount),
            status: seatStatus(b.totalSeats, enrolledCount),
          };
        });
        if (!cancelled) setBatches(enriched);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { batches, loading };
}
