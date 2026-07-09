import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiPost } from '../lib/api.js';
import { adminGet } from '../lib/adminApi.js';
import { getItem, setItem, removeItem } from '../lib/storage.js';

const AdminAuthContext = createContext(null);

/**
 * AdminAuthProvider — wraps the whole app (see App.jsx) so any admin page
 * can check auth state. The actual security boundary is the backend's
 * requireAdmin middleware (see backend/src/middleware/requireAdmin.js) —
 * this context only controls what the admin UI *shows*; a determined
 * visitor bypassing the UI would still hit real 401s from the API.
 */
export function AdminAuthProvider({ children }) {
  const [email, setEmail] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getItem('adminToken', null);
    if (!token) {
      setChecking(false);
      return;
    }
    adminGet('/auth/me')
      .then((res) => setEmail(res.email))
      .catch((err) => {
        // adminGet already clears the stored token itself if the server
        // responded with a genuine 401. If this was just a network error
        // (backend temporarily unreachable), leave the token in place so
        // the next successful check can still pick up the session.
        console.warn('[AdminAuth] session check failed:', err.message);
      })
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (loginEmail, password) => {
    const res = await apiPost('/auth/login', { email: loginEmail, password });
    setItem('adminToken', res.token);
    setEmail(res.email);
    return res;
  }, []);

  const logout = useCallback(() => {
    removeItem('adminToken');
    setEmail(null);
  }, []);

  const value = { email, isAuthenticated: !!email, checking, login, logout };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
}
