import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    discountLabel: { type: String, required: true },
    code: { type: String, required: true },
    category: { type: String, required: true },
    endsAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
