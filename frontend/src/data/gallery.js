import { getItem } from '../lib/storage';

/**
 * Homepage gallery preview.
 *
 * `icon` keys into the original SalonIcon set (components/ui/SalonIcon.jsx)
 * — these are hand-built line-art illustrations, not stock photography, so
 * there's no licensing question about using them on a commercial site.
 * `accent` is the gradient each icon sits on, matched to its category.
 *
 * These are placeholders for the layout, not real photos of this business.
 * Replace with your own studio photography whenever you have it — Phase 5's
 * full gallery is built to accept real photo uploads directly.
 */
const DEFAULT_GALLERY_PREVIEW = [
  { id: 'g-1', category: 'Bridal', accent: ['#C98A93', '#C9A15A'], icon: 'veil' },
  { id: 'g-2', category: 'Hair Color', accent: ['#7C8B6F', '#C9A15A'], icon: 'scissors' },
  { id: 'g-3', category: 'Skin', accent: ['#C9A15A', '#E4C583'], icon: 'leaf' },
  { id: 'g-4', category: 'Mehendi', accent: ['#C98A93', '#E4C583'], icon: 'henna' },
  { id: 'g-5', category: 'Academy', accent: ['#46523F', '#C9A15A'], icon: 'graduationCap' },
  { id: 'g-6', category: 'Makeup', accent: ['#C98A93', '#46523F'], icon: 'lipstick' },
];

export function getGalleryPreview() {
  return getItem('galleryPreview', DEFAULT_GALLERY_PREVIEW);
}
