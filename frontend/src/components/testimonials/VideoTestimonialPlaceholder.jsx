import { useState } from 'react';
import './VideoTestimonialPlaceholder.css';

/**
 * VideoTestimonialPlaceholder — a styled stand-in for a real video
 * testimonial. The phase plan calls for a "video placeholder" explicitly,
 * so this is intentional rather than a corner cut: real video testimonials
 * need actual client recordings, which don't exist for this project. Once
 * you have real videos, swap the contents of `.video-placeholder__frame`
 * for a real <video> element or an embedded player — nothing else in this
 * component needs to change.
 */
export default function VideoTestimonialPlaceholder({ name, role }) {
  const [showNote, setShowNote] = useState(false);

  return (
    <div className="video-placeholder">
      <button
        className="video-placeholder__frame"
        onClick={() => setShowNote(true)}
        aria-label="Play video testimonial (placeholder)"
      >
        <span className="video-placeholder__play">▶</span>
      </button>
      <div className="video-placeholder__caption">
        <span className="video-placeholder__name">{name}</span>
        <span className="video-placeholder__role">{role}</span>
      </div>
      {showNote && (
        <p className="video-placeholder__note" role="status">
          Video testimonials will appear here once recorded — this is a placeholder.
        </p>
      )}
    </div>
  );
}
