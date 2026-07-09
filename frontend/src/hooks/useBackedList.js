import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../lib/api.js';

/**
 * useBackedList — the one hook every content type (services, courses,
 * gallery, testimonials, offers, academy highlights) uses to read its
 * list: try the backend first (the real, shared source of truth so admin
 * edits are visible to every visitor, not just the admin's own browser),
 * and fall back to the given local defaults if the backend is unreachable
 * — same resilience pattern used everywhere else in this project
 * (newsletter, booking availability, batch seat counts).
 */
export function useBackedList(path, fallback = []) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);

    apiGet(path)
      .then((res) => {
        if (cancelled) return;
        setItems(res);
        setUsedFallback(false);
      })
      .catch((err) => {
        console.warn(`[useBackedList] ${path} unreachable, using local fallback:`, err.message);
        if (cancelled) return;
        setItems(fallback);
        setUsedFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => load(), [load]);

  return { items, loading, usedFallback, refetch: load };
}
