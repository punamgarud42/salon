/**
 * galleryFull.js — GET /api/gallery is the real source of truth as of
 * Phase 8. DEFAULT_GALLERY_ITEMS is the offline fallback.
 *
 * Previously the homepage preview (gallery.js) and the full Gallery page
 * (galleryFull.js) were separate datasets with duplicate content. Now
 * there's one list; the homepage preview just takes the first few items
 * (see pickPreview) — consistent with how services/courses already work
 * (one list, `.slice()` for the homepage teaser).
 *
 * `photo` (added later) is real stock photography from Pexels — free for
 * commercial use, no attribution required (https://www.pexels.com/license/).
 * These are representative style photos, NOT this specific salon's own
 * portfolio — swap them for real client/work photos (with consent) as
 * soon as you have them; `icon` stays as the fallback if a photo URL ever
 * fails to load (see GalleryGrid.jsx).
 */
export const DEFAULT_GALLERY_ITEMS = [
  { id: 'gal-1', category: 'Bridal', icon: 'veil', title: 'Bridal Look, Reception Day', size: 'tall', mediaType: 'image', photo: 'https://images.pexels.com/photos/34955448/pexels-photo-34955448.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-2', category: 'Hair', icon: 'scissors', title: 'Balayage Finish', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/3993320/pexels-photo-3993320.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-3', category: 'Makeup', icon: 'lipstick', title: 'Editorial Glam', size: 'wide', mediaType: 'image', photo: 'https://images.pexels.com/photos/6161/makeup-make-up-artist-make-up.jpg?auto=compress&cs=tinysrgb&w=1200', video: '' },
  { id: 'gal-4', category: 'Skin', icon: 'leaf', title: 'Post-Facial Glow', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-5', category: 'Mehendi', icon: 'henna', title: 'Bridal Mehendi Detail', size: 'tall', mediaType: 'image', photo: 'https://images.pexels.com/photos/5602783/pexels-photo-5602783.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-6', category: 'Academy', icon: 'graduationCap', title: 'Student Practicum Day', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/13068359/pexels-photo-13068359.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-7', category: 'Hair', icon: 'scissors', title: 'Layered Cut', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/19664876/pexels-photo-19664876.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-8', category: 'Makeup', icon: 'lipstick', title: 'Party-Ready Makeup', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/37710473/pexels-photo-37710473.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-9', category: 'Bridal', icon: 'veil', title: 'Reception Saree Draping', size: 'wide', mediaType: 'image', photo: 'https://images.pexels.com/photos/24549077/pexels-photo-24549077.jpeg?auto=compress&cs=tinysrgb&w=1200', video: '' },
  { id: 'gal-10', category: 'Skin', icon: 'leaf', title: 'Express Clean-Up Result', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/5240815/pexels-photo-5240815.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-11', category: 'Mehendi', icon: 'henna', title: 'Festive Occasion Mehendi', size: null, mediaType: 'image', photo: 'https://images.pexels.com/photos/4987379/pexels-photo-4987379.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
  { id: 'gal-12', category: 'Academy', icon: 'graduationCap', title: 'Graduation Day', size: 'tall', mediaType: 'image', photo: 'https://images.pexels.com/photos/3993467/pexels-photo-3993467.jpeg?auto=compress&cs=tinysrgb&w=800', video: '' },
];

export function extractGalleryCategories(items) {
  return Array.from(new Set(items.map((g) => g.category)));
}

export function pickPreview(items, count = 6) {
  return items.slice(0, count);
}
