import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    startDate: { type: String, required: true }, // "YYYY-MM-DD"
    endDate: { type: String, required: true },
    totalSeats: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
