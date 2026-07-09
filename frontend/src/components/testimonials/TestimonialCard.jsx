import Card from '../ui/Card.jsx';
import StarRating from '../ui/StarRating.jsx';
import './TestimonialCard.css';

/**
 * TestimonialCard — the one card layout used by both the homepage preview
 * (TestimonialPreview.jsx) and the full Testimonials page.
 */
export default function TestimonialCard({ testimonial }) {
  return (
    <Card className="testimonial-card">
      <StarRating rating={testimonial.rating} />
      <p className="testimonial-card__quote">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar" aria-hidden="true">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <div className="testimonial-card__name">{testimonial.name}</div>
          <div className="testimonial-card__role">{testimonial.role}</div>
        </div>
      </div>
    </Card>
  );
}
