import './StarRating.css';

/**
 * StarRating — read-only star display (0-5, whole numbers). Reused as-is by
 * Phase 6's full testimonials page, so keep this generic rather than
 * hard-coding anything homepage-specific here.
 */
export default function StarRating({ rating = 5, max = 5 }) {
  return (
    <div className="star-rating" role="img" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          className={i < rating ? 'star-rating__star is-filled' : 'star-rating__star'}
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7-5.4-4.7 7.1-.6z"
          />
        </svg>
      ))}
    </div>
  );
}
