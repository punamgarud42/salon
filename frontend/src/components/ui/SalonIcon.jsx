/**
 * SalonIcons — original line-art illustrations for each service/gallery
 * category. Built specifically for this project instead of using stock
 * photography, so there's no licensing question at all, and the linework
 * matches the site's gold-on-dark palette rather than looking like a
 * generic photo library.
 *
 * Used by: ServiceCard (service category), GalleryPreview (category tiles).
 * Add a new category by adding both an entry here and a matching accent
 * pair in data/gallery.js / data/services.js.
 */
const ICONS = {
  scissors: (
    <>
      <circle cx="7" cy="7" r="2.4" />
      <circle cx="7" cy="17" r="2.4" />
      <path d="M8.7 8.4L19 19M8.7 15.6L19 5" strokeLinecap="round" />
    </>
  ),
  lipstick: (
    <>
      <path d="M9 3h6l1 4-4 3-4-3 1-4Z" />
      <path d="M9.5 10h5l0.8 9.2a1 1 0 0 1-1 1.1h-4.6a1 1 0 0 1-1-1.1L9.5 10Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c8-1 13-6 15-15-9 1-14 6-15 15Z" />
      <path d="M6 18c3-4 6-7 11-11" strokeLinecap="round" />
    </>
  ),
  henna: (
    <>
      <path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9Z" />
      <circle cx="12" cy="14" r="1.4" />
      <path d="M8 21c1.5-1 2.7-1 4 0 1.3-1 2.5-1 4 0" strokeLinecap="round" />
    </>
  ),
  graduationCap: (
    <>
      <path d="M2 9l10-4 10 4-10 4-10-4Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      <path d="M22 9v6" strokeLinecap="round" />
    </>
  ),
  veil: (
    <>
      <path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V7a4 4 0 0 1 4-4Z" />
      <path d="M5 21c1-6 4-9 7-9s6 3 7 9" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" />
    </>
  ),
};

export default function SalonIcon({ name, size = 40, className = '' }) {
  const paths = ICONS[name] ?? ICONS.leaf;
  return (
    <svg
      className={`salon-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
