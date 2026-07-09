import mongoose from 'mongoose';

/**
 * Enrollment — one document per academy application. `amount` (Phase 9)
 * is the course fee at the time of application — see the same note on
 * Booking.model.js for why this is captured here instead of re-derived
 * from the Course document at payment time.
 */
const enrollmentSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    courseName: { type: String, required: true },
    amount: { type: Number, default: 0 },
    batchId: { type: String, required: true },
    batchLabel: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    age: { type: Number, required: true },
    qualification: { type: String, default: '' },
    address: { type: String, default: '' },
    referenceNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  },
  { timestamps: true }
);

export default mongoose.model('Enrollment', enrollmentSchema);
