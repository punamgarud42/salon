import { useEffect, useState } from 'react';

function diffToParts(target) {
  const total = Math.max(0, target - Date.now());
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: total <= 0 };
}

/**
 * useCountdown — ticks every second toward an ISO date string.
 * Used by OffersPreview now; Phase 6's full offers page reuses this as-is.
 */
export function useCountdown(isoDate) {
  const target = new Date(isoDate).getTime();
  const [parts, setParts] = useState(() => diffToParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(diffToParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return parts;
}
