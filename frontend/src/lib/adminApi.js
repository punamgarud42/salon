import { API_BASE_URL } from './api.js';
import { getItem, removeItem } from './storage.js';

/**
 * adminFetch — like apiGet/apiPost in api.js, but attaches the admin JWT
 * (see context/AdminAuthContext.jsx) and is used only by admin dashboard
 * pages. Public-facing pages never import this file — they use the
 * unauthenticated helpers in api.js, since all public GET endpoints (and
 * booking/enrollment/contact/newsletter creation) don't need a token.
 *
 * On a 401 (expired/invalid token), clears the stored session so the next
 * admin page render redirects to the login screen rather than looping on
 * failed requests.
 */
async function adminFetch(method, path, body) {
  const token = getItem('adminToken', null);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    removeItem('adminToken');
  }

  if (!res.ok) {
    throw new Error(data.error || `Request to ${path} failed (${res.status})`);
  }

  return data;
}

export const adminGet = (path) => adminFetch('GET', path);
export const adminPost = (path, body) => adminFetch('POST', path, body);
export const adminPut = (path, body) => adminFetch('PUT', path, body);
export const adminDelete = (path) => adminFetch('DELETE', path);
