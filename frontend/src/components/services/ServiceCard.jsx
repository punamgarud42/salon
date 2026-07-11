import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import SalonIcon from '../ui/SalonIcon.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import { useLanguage } from '../../context/LanguageContext';
import { getServiceImage } from './serviceImages.js';
import './ServiceCard.css';

/**
 * ServiceCard — the one card layout used everywhere a service is shown.
 * "Book This" links to #/book?service=<id>, which Booking.jsx reads to
 * preselect that service in the form.
 */
export default function ServiceCard({ service }) {
  const { t } = useLanguage();
  const [c1, c2] = getCategoryGradient(service.category);

  const imageSrc = getServiceImage(service);
  const hasImage = Boolean(imageSrc);

  return (
    <Card className="service-card">
      <div className="service-card__media">
        {hasImage ? (
          <>
            <img
              src={imageSrc}
              alt={service.name}
              className="service-card__image"
              loading="lazy"
            />
            <div className="service-card__overlay">
              <span className="service-card__category">{service.category}</span>
            </div>
          </>
        ) : (
          <div
            className="service-card__swatch"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            <SalonIcon name={service.icon} size={36} className="service-card__icon" />
            <span className="service-card__category">{service.category}</span>
          </div>
        )}
      </div>
      <h3 className="service-card__name">{service.name}</h3>
      <p className="service-card__desc">{service.description}</p>
      <div className="service-card__meta">
        <span className="service-card__price">₹{service.price.toLocaleString('en-IN')}</span>
        <span className="service-card__duration">{service.duration}</span>
      </div>
      <Button variant="secondary" size="md" href={`#/book?service=${service.id}`} className="service-card__cta">
        {t('servicesSection.bookThis')}
      </Button>
    </Card>
  );
}
