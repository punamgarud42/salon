/**
 * storage.js — single, consistent wrapper around localStorage.
 *
 * Every "in-browser persistent storage" feature in this build (language
 * preference now; bookings, admin-edited services, gallery, testimonials,
 * offers etc. in later phases) should go through this module rather than
 * calling localStorage directly. That keeps key naming consistent and makes
 * it a one-file job to later swap this for real API calls against the
 * Phase 8+ backend, without touching every component.
 */

const NAMESPACE = 'verme'; // change to your business's short name if you like

function nsKey(key) {
  return `${NAMESPACE}:${key}`;
}

export function getItem(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(nsKey(key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`storage.getItem failed for "${key}"`, err);
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    window.localStorage.setItem(nsKey(key), JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`storage.setItem failed for "${key}"`, err);
    return false;
  }
}

export function removeItem(key) {
  try {
    window.localStorage.removeItem(nsKey(key));
    return true;
  } catch (err) {
    console.warn(`storage.removeItem failed for "${key}"`, err);
    return false;
  }
}

/**
 * Generate a short, human-readable reference number.
 * Used later for booking confirmations (Phase 3) and enrollment IDs (Phase 4).
 * e.g. genRefNumber('BK') -> "BK-7F2K9C"
 */
export function genRefNumber(prefix = 'REF') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I ambiguity
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
}
