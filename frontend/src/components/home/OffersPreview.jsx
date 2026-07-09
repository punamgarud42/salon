import Reveal from './Reveal.jsx';
import PromoBanner from '../offers/PromoBanner.jsx';
import { useBackedList } from '../../hooks/useBackedList.js';
import { DEFAULT_OFFERS, pickFeaturedOffer } from '../../data/offers.js';
import './OffersPreview.css';

export default function OffersPreview() {
  const { items } = useBackedList('/offers', DEFAULT_OFFERS);
  const offer = pickFeaturedOffer(items);
  if (!offer) return null;

  return (
    <section className="offers-preview">
      <div className="container">
        <Reveal direction="up">
          <PromoBanner offer={offer} />
        </Reveal>
      </div>
    </section>
  );
}
