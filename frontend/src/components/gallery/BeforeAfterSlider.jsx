import { useRef, useState } from 'react';
import './BeforeAfterSlider.css';

/**
 * BeforeAfterSlider — a real, working comparison slider. Pass any React
 * node as `before`/`after` (currently gradient+icon panels — see
 * data/beforeAfter.js for why; swap for <img> tags once real photos exist
 * and this component doesn't need to change at all).
 *
 * Interaction: drag anywhere in the frame (mouse or touch, via the Pointer
 * Events API so both are handled by the same code), or focus the handle
 * and use the left/right arrow keys.
 */
export default function BeforeAfterSlider({ before, after, beforeLabel = 'Before', afterLabel = 'After' }) {
  const containerRef = useRef(null);
  const draggingRef = useRef(false);
  const [percent, setPercent] = useState(50);

  function updateFromClientX(clientX) {
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }

  function onPointerDown(e) {
    draggingRef.current = true;
    updateFromClientX(e.clientX);
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  }

  function stopDragging() {
    draggingRef.current = false;
  }

  function onHandleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      setPercent((p) => Math.max(0, p - 4));
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      setPercent((p) => Math.min(100, p + 4));
      e.preventDefault();
    }
  }

  return (
    <div
      className="ba-slider"
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
    >
      <div className="ba-slider__layer">
        {after}
        <span className="ba-slider__tag ba-slider__tag--after">{afterLabel}</span>
      </div>

      <div className="ba-slider__layer ba-slider__layer--clipped" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
        {before}
        <span className="ba-slider__tag ba-slider__tag--before">{beforeLabel}</span>
      </div>

      <div
        className="ba-slider__handle"
        style={{ left: `${percent}%` }}
        role="slider"
        aria-label="Before/after comparison position"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={onHandleKeyDown}
      >
        <span className="ba-slider__handle-grip">↔</span>
      </div>
    </div>
  );
}
