import { useState } from 'react';
import SalonIcon from '../ui/SalonIcon.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';
import Reveal from '../home/Reveal.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import './GalleryGrid.css';

function GalleryTile({ item, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [c1, c2] = getCategoryGradient(item.category);
  const showPhoto = item.photo && !imgFailed;

  return (
    <button
      className="gallery-grid__tile"
      style={!showPhoto ? { background: `linear-gradient(135deg, ${c1}, ${c2})` } : undefined}
      onClick={onClick}
      aria-label={`View ${item.title}`}
    >
      {showPhoto ? (
        <img
          src={item.photo}
          alt={`${item.category} — ${item.title}`}
          className="gallery-grid__photo"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <SalonIcon name={item.icon} size={40} className="gallery-grid__icon" />
      )}
      <span className="gallery-grid__label">{item.title}</span>
    </button>
  );
}

export default function GalleryGrid({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <>
      <div className="gallery-grid">
        {items.map((item, i) => (
          <Reveal
            direction="up"
            delay={(i % 6) * 60}
            key={item.id}
            className={`gallery-grid__tile-wrap ${item.size ? `gallery-grid__tile-wrap--${item.size}` : ''}`}
          >
            <GalleryTile item={item} onClick={() => setActiveIndex(i)} />
          </Reveal>
        ))}
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
