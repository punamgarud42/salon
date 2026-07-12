import { useState } from 'react';
import GalleryGrid from '../components/gallery/GalleryGrid.jsx';
import BeforeAfterSlider from '../components/gallery/BeforeAfterSlider.jsx';
import ComparisonPanel from '../components/gallery/ComparisonPanel.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_GALLERY_ITEMS, extractGalleryCategories } from '../data/galleryFull.js';
import { DEFAULT_BEFORE_AFTER } from '../data/beforeAfter.js';
import { useLanguage } from '../context/LanguageContext';
import './Gallery.css';

export default function Gallery() {
  const { t } = useLanguage();
  const { items: allItems, loading } = useBackedList('/gallery', DEFAULT_GALLERY_ITEMS);
  const { items: beforeAfterPairs } = useBackedList('/before-after', DEFAULT_BEFORE_AFTER);
  const categories = extractGalleryCategories(allItems);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePairId, setActivePairId] = useState(null);

  const activePair = beforeAfterPairs.find((p) => p.id === activePairId) ?? beforeAfterPairs[0];

  const filteredItems = activeCategory === 'All'
    ? allItems
    : allItems.filter((item) => item.category === activeCategory);

  return (
    <>
      <section className="gallery-page container">
        <Reveal direction="up">
          <p className="eyebrow">{t('galleryPage.eyebrow')}</p>
          <h1>{t('galleryPage.heading')}</h1>
          <KumkumDivider align="left" />
          <p className="gallery-page__lede">
            {t('galleryPage.lede')}
          </p>
        </Reveal>

        <Reveal direction="up" delay={80}>
          <FilterTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        </Reveal>

        {loading ? (
          <p className="gallery-page__lede">Loading gallery…</p>
        ) : (
          <GalleryGrid items={filteredItems} />
        )}
      </section>

      <section className="before-after-section">
        <div className="container">
          <Reveal direction="up">
            <p className="eyebrow">{t('galleryPage.baEyebrow')}</p>
            <h2>{t('galleryPage.baHeading')}</h2>
            <KumkumDivider align="left" />
            <p className="gallery-page__lede">
              {t('galleryPage.baLede')}
            </p>
          </Reveal>

          <Reveal direction="up" delay={80} className="before-after-section__tabs">
            {beforeAfterPairs.map((pair) => (
              <button
                key={pair.id}
                className={`before-after-section__tab ${activePairId === pair.id ? 'is-active' : ''}`}
                onClick={() => setActivePairId(pair.id)}
              >
                {pair.category}
              </button>
            ))}
          </Reveal>

          {activePair && (
            <Reveal direction="up" delay={120} className="before-after-section__slider">
              <BeforeAfterSlider
                before={
                  activePair.beforePhoto
                    ? <img src={activePair.beforePhoto} alt={`Before — ${activePair.label}`} className="before-after-section__photo" />
                    : <ComparisonPanel category={activePair.category} icon={activePair.icon} muted />
                }
                after={
                  activePair.afterPhoto
                    ? <img src={activePair.afterPhoto} alt={`After — ${activePair.label}`} className="before-after-section__photo" />
                    : <ComparisonPanel category={activePair.category} icon={activePair.icon} />
                }
              />
              <p className="before-after-section__caption">{activePair.label}</p>
            </Reveal>
          )}

          <p className="before-after-section__note">
            {t('galleryPage.baNote')}
          </p>
        </div>
      </section>
    </>
  );
}
