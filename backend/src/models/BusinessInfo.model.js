import mongoose from 'mongoose';

/**
 * BusinessInfo — a single-document collection holding the salon's editable
 * business details: contact info, hours, socials, WhatsApp number.
 *
 * This exists in Phase 1 (rather than being added later) because the
 * frontend's Footer and WhatsAppButton already display/use this exact data
 * — right now from hard-coded fallbacks, later (Phase 8) fetched from
 * GET /api/business-info and editable by the owner. Modeling it now means
 * Phase 8 is a routes+UI job, not a schema-design job.
 */
const businessInfoSchema = new mongoose.Schema(
  {
    brandName: { type: String, default: 'Vermé' },
    tagline: { type: String, default: 'Salon & Beauty Academy' },
    address: { type: String, default: 'Shop 12, MG Road, Nagpur, Maharashtra' },
    phone: { type: String, default: '+911234567890' },
    email: { type: String, default: 'hello@verme.example' },
    whatsappNumber: { type: String, default: '911234567890' },
    hours: { type: String, default: 'Tue – Sun, 10:00 AM – 8:00 PM' },
    socials: {
      instagram: { type: String, default: 'https://instagram.com/' },
      facebook: { type: String, default: 'https://facebook.com/' },
      youtube: { type: String, default: 'https://youtube.com/' },
    },
  },
  { timestamps: true }
);

export default mongoose.model('BusinessInfo', businessInfoSchema);
