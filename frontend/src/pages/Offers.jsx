import { useState } from 'react';
import PromoBanner from '../components/offers/PromoBanner.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_OFFERS, getActiveOffers, extractOfferCategories } from '../data/offers.js';
import { useLanguage } from '../context/LanguageContext';
import './Offers.css';

export default function Offers() {
  const { t } = useLanguage();
  const { items, loading } = useBackedList('/offers', DEFAULT_OFFERS);
  const allOffers = getActiveOffers(items);
  const categories = extractOfferCategories(allOffers);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? allOffers
    : allOffers.filter((o) => o.category === activeCategory);

  return (
    <section className="offers-page container">
      <Reveal direction="up">
        <p className="eyebrow">{t('offersPage.eyebrow')}</p>
        <h1>{t('offersPage.heading')}</h1>
        <KumkumDivider align="left" />
        <p className="offers-page__lede">
          {t('offersPage.lede')}
        </p>
      </Reveal>

      {!loading && (
        <Reveal direction="up" delay={60}>
          <FilterTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        </Reveal>
      )}

      {loading ? (
        <p className="offers-page__empty">Loading offers…</p>
      ) : (
        <div className="offers-page__list">
          {filtered.map((offer, i) => (
            <Reveal direction="up" delay={i * 80} key={offer.id}>
              <PromoBanner offer={offer} />
            </Reveal>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="offers-page__empty">{t('offersPage.empty')}</p>
      )}
    </section>
  );
}
