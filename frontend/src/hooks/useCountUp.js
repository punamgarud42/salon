import { useEffect, useState } from 'react';
import { useScrollReveal } from './useScrollReveal';

/**
 * useCountUp — animates a number from 0 to `end` once the returned ref
 * scrolls into view. Used by the homepage StatsBar section.
 *
 * Returns [ref, displayValue] — displayValue is already rounded, so it can
 * be rendered directly.
 */
export function useCountUp(end, { duration = 1400 } = {}) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.5 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    let raf;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // ease-out cubic — starts fast, settles gently, matches the site's signature easing feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, end, duration]);

  return [ref, value];
}
