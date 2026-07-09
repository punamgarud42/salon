import { useEffect, useState } from 'react';

/**
 * parseHash — turns "#/book?service=svc-hair-styling" into
 * { path: '/book', params: { service: 'svc-hair-styling' } }.
 */
export function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, queryString] = raw.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));
  return { path: path || '/', params };
}

/**
 * useHashRoute — the whole router. No external library: this is a
 * single-owner marketing + booking site, not an app that needs nested
 * routes, route guards, or code-splitting yet. If that changes later,
 * swap this hook out for react-router without touching page components —
 * they only ever read `path` and `params`.
 */
export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash());

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}

export function navigate(path) {
  window.location.hash = path;
}
