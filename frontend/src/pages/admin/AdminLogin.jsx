import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import '../../components/admin/AdminForm.css';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [wakingUp, setWakingUp] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setWakingUp(false);

    // After 4 seconds of waiting, show a "waking up" message so the user
    // doesn't think it's broken — Render free tier takes 30–60s to start.
    const wakeTimer = setTimeout(() => setWakingUp(true), 4000);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      clearTimeout(wakeTimer);
      setSubmitting(false);
      setWakingUp(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <h1 className="admin-login__title">Vermé Admin</h1>
        <p className="admin-login__subtitle">Sign in to manage your site.</p>

        <label className="admin-form__label" htmlFor="admin-email">Email</label>
        <input
          id="admin-email"
          type="email"
          className="admin-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="admin-form__label" htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          className="admin-form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="admin-form__error">{error}</p>}
        {wakingUp && !error && (
          <p className="admin-login__waking">
            ⏳ Server is waking up (this can take up to 60 seconds on the free tier)...
          </p>
        )}

        <button type="submit" className="admin-btn admin-btn--primary admin-login__submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="admin-login__hint">
          No account yet? Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD_HASH</code> in the
          backend's <code>.env</code> — see the README for the one-command hash generator.
        </p>
      </form>
    </div>
  );
}
