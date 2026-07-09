import Enrollment from '../models/Enrollment.model.js';
import Batch from '../models/Batch.model.js';

const REF_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateReferenceNumber() {
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  }
  return `EN-${suffix}`;
}

/**
 * POST /api/enrollments
 * Re-checks batch capacity at write time (not just trusting whatever the
 * frontend saw when it rendered the form) — this is the actual guard
 * against two applicants racing for the last seat. Not a hard DB-level
 * unique constraint like bookings' compound index (seat capacity is a
 * counted limit, not a single unique slot), so there's a small theoretical
 * race window between the count and the insert; acceptable for a
 * single-location salon's enrollment volume, but worth knowing about if
 * this ever needs to scale to a high-concurrency admissions rush.
 */
export async function createEnrollment(req, res) {
  const { courseId, courseName, amount, batchId, batchLabel, name, phone, email, age, qualification, address } = req.body;

  if (!courseId || !courseName || !batchId || !batchLabel || !name || !phone || !age) {
    return res.status(400).json({ error: 'Missing required enrollment fields.' });
  }

  try {
    const batch = await Batch.findById(batchId).catch(() => null);
    if (batch) {
      const enrolledCount = await Enrollment.countDocuments({ batchId, status: 'confirmed' });
      if (enrolledCount >= batch.totalSeats) {
        return res.status(409).json({ error: 'This batch is full. Please choose another batch.' });
      }
    }
    // If the batch isn't found by ObjectId (e.g. frontend fell back to its
    // local static batch IDs because the backend was unreachable when the
    // page loaded), we still record the enrollment rather than blocking a
    // real applicant — just without the live capacity re-check.

    let attempt = 0;
    while (attempt < 5) {
      try {
        const enrollment = await Enrollment.create({
          courseId, courseName, amount: amount || 0, batchId, batchLabel,
          name, phone, email, age, qualification, address,
          referenceNumber: generateReferenceNumber(),
        });
        return res.status(201).json(enrollment);
      } catch (err) {
        if (err.code === 11000) { attempt++; continue; } // reference number collision, retry
        throw err;
      }
    }
    res.status(500).json({ error: 'Could not generate a unique reference number. Please try again.' });
  } catch (err) {
    console.error('[enrollments] createEnrollment failed:', err);
    res.status(500).json({ error: 'Could not submit application. Please try again.' });
  }
}

/**
 * GET /api/enrollments
 * Owner-only in Phase 8. Lists all applications for the admin dashboard.
 */
export async function listEnrollments(req, res) {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error('[enrollments] listEnrollments failed:', err);
    res.status(500).json({ error: 'Could not load enrollments.' });
  }
}

/**
 * PUT /api/enrollments/:id/status
 * Owner-only. Cancelling frees the seat back up automatically, since seat
 * counts are computed by counting status: 'confirmed' enrollments live —
 * no separate seat-count field to keep in sync.
 */
export async function updateEnrollmentStatus(req, res) {
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found.' });
    res.json(enrollment);
  } catch (err) {
    console.error('[enrollments] updateEnrollmentStatus failed:', err);
    res.status(500).json({ error: 'Could not update enrollment status.' });
  }
}
