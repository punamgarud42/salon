import TestimonialCard from '../components/testimonials/TestimonialCard.jsx';
import TestimonialSummary from '../components/testimonials/TestimonialSummary.jsx';
import VideoTestimonialPlaceholder from '../components/testimonials/VideoTestimonialPlaceholder.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_TESTIMONIALS } from '../data/testimonials.js';
import { useLanguage } from '../context/LanguageContext';
import './Testimonials.css';

const VIDEO_PLACEHOLDERS = [
  { name: 'Ananya R.', role: 'Bridal client' },
  { name: 'Sneha K.', role: 'Academy graduate' },
  { name: 'Kavya S.', role: 'Mehendi client' },
];

export default function Testimonials() {
  const { t } = useLanguage();
  const { items: testimonials, loading } = useBackedList('/testimonials', DEFAULT_TESTIMONIALS);

  return (
    <>
      <section className="testimonials-page container">
        <Reveal direction="up">
          <p className="eyebrow">{t('testimonialsPage.eyebrow')}</p>
          <h1>{t('testimonialsPage.heading')}</h1>
          <KumkumDivider align="left" />
        </Reveal>

        {loading ? (
          <p className="testimonials-page__empty">Loading testimonials…</p>
        ) : (
          <>
            <Reveal direction="up" delay={60}>
              <TestimonialSummary testimonials={testimonials} />
            </Reveal>

            <div className="testimonials-page__grid">
              {testimonials.map((tm, i) => (
                <Reveal direction="up" delay={i * 60} key={tm.id}>
                  <TestimonialCard testimonial={tm} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="video-testimonials-section">
        <div className="container">
          <Reveal direction="up">
            <p className="eyebrow">{t('testimonialsPage.videoEyebrow')}</p>
            <h2>{t('testimonialsPage.videoHeading')}</h2>
            <KumkumDivider align="left" />
          </Reveal>

          <div className="video-testimonials-section__grid">
            {VIDEO_PLACEHOLDERS.map((v, i) => (
              <Reveal direction="up" delay={i * 80} key={v.name}>
                <VideoTestimonialPlaceholder name={v.name} role={v.role} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
