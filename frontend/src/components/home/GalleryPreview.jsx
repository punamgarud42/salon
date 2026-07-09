import { useState } from 'react';
import Button from '../ui/Button.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import SalonIcon from '../ui/SalonIcon.jsx';
import Reveal from './Reveal.jsx';
import { useBackedList } from '../../hooks/useBackedList.js';
import { DEFAULT_GALLERY_ITEMS, pickPreview } from '../../data/galleryFull.js';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import { useLanguage } from '../../context/LanguageContext';
import './GalleryPreview.css';

function PreviewTile({ tile }) {
  const [imgFailed, setImgFailed] = useState(false);
  const [c1, c2] = getCategoryGradient(tile.category);
  const showPhoto = tile.photo && !imgFailed;

  return (
    <div className="gallery-preview__tile" style={!showPhoto ? { background: `linear-gradient(150deg, ${c1}, ${c2})` } : undefined}>
      {showPhoto ? (
        <img
          src={tile.photo}
          alt={`${tile.category} — sample work`}
          className="gallery-preview__tile-photo"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <SalonIcon name={tile.icon} size={44} className="gallery-preview__tile-icon" />
      )}
      <span className="gallery-preview__tile-label">{tile.category}</span>
    </div>
  );
}

/**
 * GalleryPreview — real photos (see data/galleryFull.js for licensing —
 * free-for-commercial-use stock, representative style photos, not this
 * salon's own portfolio yet) on gradient tiles, falling back to the
 * original icon illustrations if a photo URL ever fails to load. Fetches
 * the same gallery list the full Gallery page uses and just takes the
 * first few.
 */
export default function GalleryPreview() {
  const { t } = useLanguage();
  const { items } = useBackedList('/gallery', DEFAULT_GALLERY_ITEMS);
  const tiles = pickPreview(items, 6);

  return (
    <section className="gallery-preview">
      <div className="container">
        <Reveal direction="up">
          <p className="eyebrow">{t('gallerySection.eyebrow')}</p>
          <h2>{t('gallerySection.heading')}</h2>
          <KumkumDivider align="left" />
        </Reveal>

        <div className="gallery-preview__grid">
          {tiles.map((tile, i) => (
            <Reveal direction="up" delay={i * 60} key={tile.id} className="gallery-preview__tile-wrap">
              <PreviewTile tile={tile} />
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" className="gallery-preview__footer">
          <Button variant="ghost" size="lg" href="#/gallery">{t('gallerySection.viewAll')}</Button>
        </Reveal>
      </div>
    </section>
  );
}
