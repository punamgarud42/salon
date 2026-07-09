/**
 * businessInfo.js — GET /api/business-info is the real source of truth.
 * DEFAULT_BUSINESS_INFO mirrors the backend model's own schema defaults
 * (backend/src/models/BusinessInfo.model.js) so the fallback and the
 * backend-seeded starting content match exactly.
 */
export const DEFAULT_BUSINESS_INFO = {
  brandName: 'Vermé',
  tagline: 'Salon & Beauty Academy',
  address: 'Shop 12, MG Road, Nagpur, Maharashtra',
  phone: '+911234567890',
  email: 'hello@verme.example',
  whatsappNumber: '911234567890',
  hours: 'Tue – Sun, 10:00 AM – 8:00 PM',
  socials: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
  },
};
