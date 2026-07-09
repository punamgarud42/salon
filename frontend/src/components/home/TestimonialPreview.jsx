import Button from '../ui/Button.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import Reveal from './Reveal.jsx';
import TestimonialCard from '../testimonials/TestimonialCard.jsx';
import { useBackedList } from '../../hooks/useBackedList.js';
import { DEFAULT_TESTIMONIALS, pickTestimonialPreview } from '../../data/testimonials.js';
import { useLanguage } from '../../context/LanguageContext';
import './TestimonialPreview.css';

export default function TestimonialPreview() {
  const { t } = useLanguage();
  const { items } = useBackedList('/testimonials', DEFAULT_TESTIMONIALS);
  const testimonials = pickTestimonialPreview(items);

  return (
    <section className="testimonial-preview">
      <div className="container">
        <Reveal direction="up">
          <p className="eyebrow">{t('testimonialsSection.eyebrow')}</p>
          <h2>{t('testimonialsSection.heading')}</h2>
          <KumkumDivider align="left" />
        </Reveal>

        <div className="testimonial-preview__grid">
          {testimonials.map((tm, i) => (
            <Reveal direction="up" delay={i * 100} key={tm.id}>
              <TestimonialCard testimonial={tm} />
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" className="testimonial-preview__footer">
          <Button variant="ghost" size="lg" href="#/testimonials">{t('testimonialsSection.viewAll')}</Button>
        </Reveal>
      </div>
    </section>
  );
}
