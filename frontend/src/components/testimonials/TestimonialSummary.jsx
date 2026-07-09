import { useCountUp } from '../../hooks/useCountUp.js';
import StarRating from '../ui/StarRating.jsx';
import { useLanguage } from '../../context/LanguageContext';
import './TestimonialSummary.css';

export default function TestimonialSummary({ testimonials }) {
  const { t } = useLanguage();
  const total = testimonials.length;
  const average = total
    ? Math.round((testimonials.reduce((sum, item) => sum + item.rating, 0) / total) * 10) / 10
    : 0;
  const [ref, count] = useCountUp(total);

  return (
    <div className="testimonial-summary">
      <div className="testimonial-summary__score">{average.toFixed(1)}</div>
      <div className="testimonial-summary__details">
        <StarRating rating={Math.round(average)} />
        <p ref={ref} className="testimonial-summary__count">
          {t('testimonialsPage.reviewsPrefix')} {count.toLocaleString('en-IN')}{t('testimonialsPage.reviewsSuffix')}
        </p>
      </div>
    </div>
  );
}
