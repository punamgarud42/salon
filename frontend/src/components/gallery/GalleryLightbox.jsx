import { useEffect, useState } from 'react';
import SalonIcon from '../ui/SalonIcon.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import './GalleryLightbox.css';

/**
 * GalleryLightbox — enlarged view of one gallery item with prev/next.
 * Closes on Escape or backdrop click; arrow keys navigate.
 */
export default function GalleryLightbox({ items, activeIndex, onClose, onNavigate }) {
  const item = items[activeIndex];
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false); // reset when navigating to a new item
  }, [activeIndex]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((activeIndex - 1 + items.length) % items.length);
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  if (!item) return null;
  const [c1, c2] = getCategoryGradient(item.category);
  const showPhoto = item.photo && !imgFailed;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title}>
      <button className="lightbox__backdrop" aria-label="Close" onClick={onClose} />

      <div className="lightbox__content">
        <button className="lightbox__close" onClick={onClose} aria-label="Close">✕</button>

        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
          aria-label="Previous image"
        >
          ‹
        </button>

        <div className="lightbox__frame" style={!showPhoto ? { background: `linear-gradient(135deg, ${c1}, ${c2})` } : undefined}>
          {showPhoto ? (
            <img
              src={item.photo}
              alt={`${item.category} — ${item.title}`}
              className="lightbox__photo"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <SalonIcon name={item.icon} size={80} className="lightbox__icon" />
          )}
        </div>

        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={() => onNavigate((activeIndex + 1) % items.length)}
          aria-label="Next image"
        >
          ›
        </button>

        <div className="lightbox__caption">
          <span className="lightbox__category">{item.category}</span>
          <h3 className="lightbox__title">{item.title}</h3>
        </div>
      </div>
    </div>
  );
}
