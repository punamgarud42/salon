import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — returns [ref, isVisible]. Attach ref to any element;
 * isVisible flips to true the first time it crosses the given threshold and
 * stays true (reveals don't reverse on scroll-up, which reads as calmer on
 * a long page like this homepage).
 *
 * Every scroll-reveal animation on the site should go through this one hook
 * so the trigger behavior (threshold, one-shot, reduced-motion handling)
 * stays consistent instead of each section rolling its own observer.
 */
export function useScrollReveal({ threshold = 0.2, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isVisible];
}
