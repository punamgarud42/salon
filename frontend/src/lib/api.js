/**
 * api.js — single place that knows how to reach the backend.
 *
 * VITE_API_URL lets you point the built frontend at a deployed backend
 * (e.g. https://your-api.onrender.com/api) without touching code — set it
 * in a .env file in frontend/ (see .env.example) or in your hosting
 * provider's environment variables. Falls back to localhost for local dev.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * apiPost — POSTs JSON, returns parsed JSON, throws on non-2xx.
 * Callers should catch and decide their own fallback (see Newsletter.jsx
 * for the pattern used when the backend isn't running yet).
 */
export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
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
  const res = await fetch(`${API_BASE_URL}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed (${res.status})`);
  }
  return data;
}

export { API_BASE_URL };
