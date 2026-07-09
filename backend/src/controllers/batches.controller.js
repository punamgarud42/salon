import Batch from '../models/Batch.model.js';
import Course from '../models/Course.model.js';
import Enrollment from '../models/Enrollment.model.js';

const DEFAULT_BATCHES = [
  { courseSlug: 'Professional Hairdressing Diploma', startDate: '2026-07-20', endDate: '2027-01-20', totalSeats: 15 },
  { courseSlug: 'Professional Hairdressing Diploma', startDate: '2026-09-14', endDate: '2027-03-14', totalSeats: 15 },
  { courseSlug: 'Hair Cutting & Styling Fundamentals', startDate: '2026-07-11', endDate: '2026-08-08', totalSeats: 12 },
  { courseSlug: 'Advanced Makeup Artistry', startDate: '2026-08-02', endDate: '2026-10-25', totalSeats: 10 },
  { courseSlug: 'Certificate in Skincare & Facials', startDate: '2026-07-13', endDate: '2026-08-24', totalSeats: 14 },
  { courseSlug: 'Bridal Mehendi Mastery', startDate: '2026-07-18', endDate: '2026-08-15', totalSeats: 18 },
  { courseSlug: 'Bridal Styling & Draping', startDate: '2026-08-09', endDate: '2026-10-04', totalSeats: 10 },
];

function seatStatus(totalSeats, enrolledCount) {
  const left = Math.max(0, totalSeats - enrolledCount);
  if (left <= 0) return 'full';
  if (left / totalSeats <= 0.25) return 'filling-fast';
  return 'open';
}

/**
 * GET /api/batches?courseId=optional
 * Returns every batch (or just one course's) enriched with courseName,
 * enrolledCount, seatsLeft and status — this is the real, live source of
 * truth the frontend's useBatchAvailability hook calls before falling back
 * to localStorage counting.
 */
export async function getAllBatches(req, res) {
  try {
    let batches = await Batch.find().sort({ startDate: 1 });

    if (batches.length === 0) {
      // Seed courses first if needed (mirrors courses.controller's own seed
      // logic, in case /api/batches is called before /api/courses ever was).
      let courses = await Course.find();
      if (courses.length === 0) {
        return res.json([]); // nothing to seed batches against yet
      }
      const seedDocs = DEFAULT_BATCHES
        .map((b) => {
          const course = courses.find((c) => c.name === b.courseSlug);
          if (!course) return null;
          return { courseId: String(course._id), startDate: b.startDate, endDate: b.endDate, totalSeats: b.totalSeats };
        })
        .filter(Boolean);
      batches = await Batch.insertMany(seedDocs);
    }

    if (req.query.courseId) {
      batches = batches.filter((b) => b.courseId === req.query.courseId);
    }

    const courses = await Course.find();
    const enriched = await Promise.all(
      batches.map(async (batch) => {
        const enrolledCount = await Enrollment.countDocuments({ batchId: String(batch._id), status: 'confirmed' });
        const course = courses.find((c) => String(c._id) === batch.courseId);
        return {
          ...batch.toObject(),
          id: batch._id,
          courseName: course?.name ?? 'Unknown Course',
          enrolledCount,
          seatsLeft: Math.max(0, batch.totalSeats - enrolledCount),
          status: seatStatus(batch.totalSeats, enrolledCount),
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    console.error('[batches] getAllBatches failed:', err);
    res.status(500).json({ error: 'Could not load batches.' });
  }
}

export async function createBatch(req, res) {
  try {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
  } catch (err) {
    console.error('[batches] createBatch failed:', err);
    res.status(400).json({ error: 'Could not create batch.' });
  }
}

export async function updateBatch(req, res) {
  try {
    const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!batch) return res.status(404).json({ error: 'Batch not found.' });
    res.json(batch);
  } catch (err) {
    console.error('[batches] updateBatch failed:', err);
    res.status(400).json({ error: 'Could not update batch.' });
  }
}

export async function deleteBatch(req, res) {
  try {
    const batch = await Batch.findByIdAndDelete(req.params.id);
    if (!batch) return res.status(404).json({ error: 'Batch not found.' });
    res.json({ message: 'Batch deleted.' });
  } catch (err) {
    console.error('[batches] deleteBatch failed:', err);
    res.status(500).json({ error: 'Could not delete batch.' });
  }
}
