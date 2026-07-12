/**
 * beforeAfter.js — offline fallback for the before/after slider pairs.
 * As of the image-upload update, GET /api/before-after is the real source
 * of truth (see backend/src/models/BeforeAfter.model.js). The admin can
 * upload real before/after photos via the admin dashboard → Before & After.
 *
 * `beforePhoto`/`afterPhoto` are empty by default — when empty, the
 * Gallery page falls back to the illustrated ComparisonPanel (the muted
 * vs vivid icon panels). Once the admin uploads real client photos, those
 * show instead.
 *
 * CLIENT CONSENT: only publish photos you have explicit written permission
 * to use as a before/after comparison result.
 */
export const DEFAULT_BEFORE_AFTER = [
  { id: 'ba-hair', category: 'Hair', label: 'Hair Color & Style Transformation', beforePhoto: '', afterPhoto: '', active: true },
  { id: 'ba-skin', category: 'Skin', label: 'Facial Treatment Glow-Up', beforePhoto: '', afterPhoto: '', active: true },
  { id: 'ba-makeup', category: 'Makeup', label: 'Bridal Makeup Transformation', beforePhoto: '', afterPhoto: '', active: true },
  { id: 'ba-mehendi', category: 'Mehendi', label: 'Mehendi Depth & Stain Development', beforePhoto: '', afterPhoto: '', active: true },
];
