import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5, required: true },
    quote: { type: String, required: true },
    featured: { type: Boolean, default: false }, // shown in the homepage preview
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
