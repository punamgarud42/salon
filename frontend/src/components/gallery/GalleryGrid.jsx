import { useState } from 'react';
import SalonIcon from '../ui/SalonIcon.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';
import Reveal from '../home/Reveal.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import './GalleryGrid.css';

function GalleryTile({ item, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [c1, c2] = getCategoryGradient(item.category);

  const mediaType = item.mediaType || (item.video ? 'video' : item.photo ? 'image' : 'icon');
  const showVideo = mediaType === 'video' && item.video;
  const showPhoto = mediaType === 'image' && item.photo && !imgFailed;
  const showIcon = !showVideo && !showPhoto;

  return (
    <button
      className="gallery-grid__tile"
      style={showIcon ? { background: `linear-gradient(135deg, ${c1}, ${c2})` } : undefined}
      onClick={onClick}
      aria-label={`View ${item.title}`}
    >
      {showVideo && (
        <>
          <video
            src={item.video}
            className="gallery-grid__photo"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          {/* Video badge so visitors know they can click to see it full size */}
          <span className="gallery-grid__video-badge" aria-hidden="true">▶</span>
        </>
      )}

      {showPhoto && (
        <img
          src={item.photo}
          alt={`${item.category} — ${item.title}`}
          className="gallery-grid__photo"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      )}

      {showIcon && (
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
