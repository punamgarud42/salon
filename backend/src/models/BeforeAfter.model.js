import mongoose from 'mongoose';

/**
 * BeforeAfter — stores a real before/after photo pair for the Gallery
 * page's comparison slider. Both `beforePhoto` and `afterPhoto` are
 * Cloudinary URLs uploaded via the admin dashboard.
 *
 * The slider component (BeforeAfterSlider.jsx) already handles <img>
 * content — this model just gives the admin a way to provide those images
 * rather than hardcoding them in the frontend's data file.
 *
 * IMPORTANT: only use photos you have explicit written consent from the
 * client to publish as a before/after comparison — this is a legal and
 * ethical requirement, not just a recommendation.
 */
const beforeAfterSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    label: { type: String, required: true },
    beforePhoto: { type: String, default: '' }, // Cloudinary URL
    afterPhoto: { type: String, default: '' },  // Cloudinary URL
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('BeforeAfter', beforeAfterSchema);
