import { useEffect, useState } from 'react';
import './ScrollProgressBar.css';

/**
 * ScrollProgressBar — thin gold line at the very top of the viewport showing
 * how far down the current page the visitor has scrolled. Passive scroll
 * listener + rAF throttling so it doesn't jank on long pages (gallery, courses).
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const computeProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(computeProgress);
        ticking = true;
      }
    };

    computeProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" role="presentation">
      <div className="scroll-progress__fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
