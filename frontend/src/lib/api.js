/**
 * api.js — single place that knows how to reach the backend.
 *
 * VITE_API_URL lets you point the built frontend at a deployed backend
 * (e.g. https://your-api.onrender.com/api) without touching code — set it
 * in a .env file in frontend/ (see .env.example) or in your hosting
 * provider's environment variables. Falls back to localhost for local dev.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * TIMEOUT_MS — how long to wait before giving up on a request.
 *
 * Set to 70 seconds specifically for Render's free tier, which "spins down"
 * after 15 minutes of inactivity. The first request after sleep can take
 * 30–60 seconds to wake the server up. A short timeout (the browser default
 * is ~30s) causes "Failed to fetch" during that wake-up window, which looks
 * like the backend is broken when it's actually just waking up.
 */
const TIMEOUT_MS = 70_000;

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .then((res) => { clearTimeout(timer); return res; })
    .catch((err) => {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(
          'The server took too long to respond. If this is a fresh start, ' +
          'it may still be waking up — please try again in 30 seconds.'
        );
      }
      throw err;
    });
}

/**
 * apiPost — POSTs JSON, returns parsed JSON, throws on non-2xx.
 */
export async function apiPost(path, body) {
  const res = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed (${res.status})`);
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetchWithTimeout(`${API_BASE_URL}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed (${res.status})`);
  }
  return data;
}
