import { useCallback, useEffect, useState } from 'react';
import { apiGet } from '../lib/api.js';

/**
 * useBackedObject — like useBackedList, but for single-document content
 * (currently just BusinessInfo). Same backend-first-with-local-fallback
 * pattern as everything else in this project.
 */
export function useBackedObject(path, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);

    apiGet(path)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => {
        console.warn(`[useBackedObject] ${path} unreachable, using local fallback:`, err.message);
        if (!cancelled) setData(fallback);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => load(), [load]);

  return { data, loading, refetch: load };
}
