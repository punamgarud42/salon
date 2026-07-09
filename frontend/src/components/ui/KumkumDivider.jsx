import { useEffect, useRef, useState } from 'react';
import './KumkumDivider.css';

/**
 * KumkumDivider — the site's signature element.
 *
 * A single hand-swept brush stroke rendered in SVG, inspired by a kumkum/sindoor
 * swipe and the gilt flourish on a vanity mirror. It draws itself in on scroll
 * (stroke-dasharray animation) the first time it enters the viewport, then stays
 * put. Used as section dividers everywhere a generic <hr> or numbered marker
 * would otherwise go.
 *
 * Props:
 *  - align: 'left' | 'center' | 'right' — where the stroke sits under its section
 *  - width: px width of the stroke (default 160)
 */
export default function KumkumDivider({ align = 'left', width = 160 }) {
  const ref = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced motion: just show it fully drawn immediately.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`kumkum-divider kumkum-divider--${align}`}
      style={{ width }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          className={`kumkum-divider__stroke ${drawn ? 'is-drawn' : ''}`}
          d="M2 14.5C22 6 44 3 66 9.5C88 16 108 15.5 128 8C140 3.6 150 4 158 8"
          stroke="url(#kumkum-gold)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="kumkum-gold" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C98A93" />
            <stop offset="45%" stopColor="#E4C583" />
            <stop offset="100%" stopColor="#C9A15A" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
