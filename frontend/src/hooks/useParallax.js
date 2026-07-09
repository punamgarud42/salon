import { useEffect, useRef } from 'react';

/**
 * useParallax — returns a ref to attach to the element that should drift as
 * the page scrolls. `speed` is a fraction: 0.3 means the layer moves at 30%
 * of the scroll distance (slower than the page = feels "behind" it).
 *
 * Kept to a single rAF-throttled listener and disabled entirely under
 * prefers-reduced-motion, per the site's motion guidelines.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;

    function update() {
      const rect = node.parentElement.getBoundingClientRect();
      // Only bother computing while the hero is anywhere near the viewport.
      if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
        const offset = rect.top * speed;
        node.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [speed]);

  return ref;
}
