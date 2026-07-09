import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    fee: { type: Number, required: true },
    duration: { type: String, required: true },
    mode: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: 'leaf' },
    eligibility: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
