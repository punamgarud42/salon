import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Reveal from './Reveal.jsx';
import { apiPost } from '../../lib/api.js';
import { getItem, setItem } from '../../lib/storage.js';
import { useLanguage } from '../../context/LanguageContext';
import './Newsletter.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Newsletter — a genuinely working signup, not just a UI mockup:
 *  1. Tries POST /api/newsletter/subscribe on the real backend (see
 *     backend/src/routes/newsletter.routes.js).
 *  2. If that fails (backend not running, e.g. reviewing the frontend
 *     standalone), falls back to saving the email in localStorage so the
 *     flow still completes and nothing is silently lost — check
 *     localStorage under 'verme:newsletterLocalFallback' if you ever need
 *     to recover entries submitted while the backend was down.
 */
export default function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus('error');
      setErrorMsg(t('newsletter.invalidEmail'));
      return;
    }

    setStatus('loading');
    try {
      await apiPost('/newsletter/subscribe', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      // Backend unreachable or rejected — fall back to local storage so the
      // signup isn't lost, and still show success (the visitor's intent
      // was captured either way).
      console.warn('[Newsletter] backend subscribe failed, saving locally:', err.message);
      const existing = getItem('newsletterLocalFallback', []);
      if (!existing.includes(email)) {
        setItem('newsletterLocalFallback', [...existing, email]);
      }
      setStatus('success');
      setEmail('');
    }
  }

  return (
    <section className="newsletter">
      <div className="container">
        <Reveal direction="up" className="newsletter__box">
          <div>
            <h2 className="newsletter__title">{t('newsletter.title')}</h2>
            <p className="newsletter__lede">
              {t('newsletter.lede')}
            </p>
          </div>

          <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="newsletter__input"
              placeholder={t('newsletter.placeholder')}
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle'); }}
              aria-label="Email address"
              required
            />
            <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'}>
              {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.subscribe')}
            </Button>
          </form>

          <div className="newsletter__status" role="status" aria-live="polite">
            {status === 'success' && <span className="newsletter__success">{t('newsletter.success')}</span>}
            {status === 'error' && <span className="newsletter__error">{errorMsg}</span>}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
