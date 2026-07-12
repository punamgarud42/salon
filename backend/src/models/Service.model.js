import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    photo: { type: String, default: '' },   // Cloudinary URL; falls back to the icon if empty
    price: { type: Number, required: true },
    duration: { type: String, required: true },        // display string, e.g. "45 min"
    durationMinutes: { type: Number, required: true },  // used by booking availability math
    category: { type: String, required: true },
    icon: { type: String, default: 'leaf' },            // key into frontend's SalonIcon set
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
