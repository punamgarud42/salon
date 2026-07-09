import mongoose from 'mongoose';

const academyHighlightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('AcademyHighlight', academyHighlightSchema);
