import { useState } from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import SalonIcon from '../ui/SalonIcon.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import { useLanguage } from '../../context/LanguageContext';
import './ServiceCard.css';

/**
 * ServiceCard — the one card layout used everywhere a service is shown.
 * Shows a real photo if one has been uploaded via the admin dashboard;
 * falls back to the gradient + icon tile if not.
 */
export default function ServiceCard({ service }) {
  const { t } = useLanguage();
  const [c1, c2] = getCategoryGradient(service.category);
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = service.photo && !imgFailed;

  return (
    <Card className="service-card">
      <div
        className="service-card__swatch"
        style={!showPhoto ? { background: `linear-gradient(135deg, ${c1}, ${c2})` } : undefined}
      >
        {showPhoto ? (
          <img
            src={service.photo}
            alt={service.name}
            className="service-card__photo"
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <SalonIcon name={service.icon} size={36} className="service-card__icon" />
        )}
        <span className="service-card__category">{service.category}</span>
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
