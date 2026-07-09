import Button from '../ui/Button.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import Reveal from './Reveal.jsx';
import ServiceCard from '../services/ServiceCard.jsx';
import { useBackedList } from '../../hooks/useBackedList.js';
import { DEFAULT_SERVICES, pickFeatured } from '../../data/services.js';
import { useLanguage } from '../../context/LanguageContext';
import './FeaturedServices.css';

/**
 * FeaturedServices — homepage preview of the salon menu, using the same
 * ServiceCard the full Services page renders. As of Phase 8, service data
 * is fetched from the backend (the admin dashboard's real source of
 * truth) via useBackedList, falling back to local defaults if the
 * backend is unreachable.
 */
export default function FeaturedServices() {
  const { t } = useLanguage();
  const { items, loading } = useBackedList('/services', DEFAULT_SERVICES);
  const services = pickFeatured(items);

  return (
    <section className="featured-services">
      <div className="container">
        <Reveal direction="up">
          <p className="eyebrow">{t('servicesSection.eyebrow')}</p>
          <h2>{t('servicesSection.heading')}</h2>
          <KumkumDivider align="left" />
        </Reveal>

        {loading ? (
          <p className="featured-services__hint">Loading services…</p>
        ) : (
          <div className="featured-services__grid">
            {services.map((svc, i) => (
              <Reveal direction="up" delay={i * 90} key={svc.id}>
                <ServiceCard service={svc} />
              </Reveal>
            ))}
          </div>
        )}

        <Reveal direction="up" className="featured-services__footer">
          <Button variant="ghost" size="lg" href="#/services">{t('servicesSection.viewAll')}</Button>
        </Reveal>
      </div>
    </section>
  );
}
