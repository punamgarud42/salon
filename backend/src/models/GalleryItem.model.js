import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    icon: { type: String, default: 'leaf' }, // key into frontend's SalonIcon set — used as fallback if photo fails to load
    photo: { type: String, default: '' },    // image URL; falls back to the icon tile if empty or fails to load
    video: { type: String, default: '' },    // video URL; if set, shown as a looping muted preview in the gallery
    mediaType: { type: String, enum: ['image', 'video', 'icon'], default: 'icon' }, // controls what the tile renders
    title: { type: String, required: true },
    size: { type: String, enum: ['tall', 'wide', null], default: null }, // masonry span hint
  },
  { timestamps: true }
);

export default mongoose.model('GalleryItem', galleryItemSchema);
