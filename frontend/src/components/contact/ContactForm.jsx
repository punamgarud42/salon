import { useState } from 'react';
import Button from '../ui/Button.jsx';
import { apiPost } from '../../lib/api.js';
import { getItem, setItem } from '../../lib/storage.js';
import { useLanguage } from '../../context/LanguageContext';
import './ContactForm.css';

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    const hasPhone = PHONE_RE.test(form.phone.trim());
    const hasEmail = EMAIL_RE.test(form.email.trim());
    if (!hasPhone && !hasEmail) next.contact = 'Enter a valid phone number or email so we can reach you.';
    if (!form.message.trim()) next.message = 'Please enter a message.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');
    const payload = { ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), subject: form.subject.trim(), message: form.message.trim() };

    try {
      await apiPost('/contact', payload);
    } catch (err) {
      console.warn('[ContactForm] backend submit failed, saving locally:', err.message);
      const existing = getItem('contactMessages', []);
      setItem('contactMessages', [...existing, { ...payload, createdAt: new Date().toISOString() }]);
    }

    setStatus('success');
    setForm({ name: '', phone: '', email: '', subject: '', message: '' });
  }

  if (status === 'success') {
    return (
      <div className="contact-form__success">
        <div className="contact-form__success-badge">✓</div>
        <h3>{t('contactPage.successTitle')}</h3>
        <p>{t('contactPage.successNote')}</p>
        <Button variant="secondary" size="md" onClick={() => setStatus('idle')}>{t('contactPage.sendAnother')}</Button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__grid">
        <div>
          <input type="text" placeholder={t('contactPage.namePlaceholder')} aria-label={t('contactPage.namePlaceholder')} className="contact-form__input"
            value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          {errors.name && <p className="contact-form__error">{errors.name}</p>}
        </div>
        <input type="tel" placeholder={t('contactPage.phonePlaceholder')} aria-label={t('contactPage.phonePlaceholder')} className="contact-form__input"
          value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <input type="email" placeholder={t('contactPage.emailPlaceholder')} aria-label={t('contactPage.emailPlaceholder')} className="contact-form__input"
          value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
      </div>
      {errors.contact && <p className="contact-form__error">{errors.contact}</p>}

      <input type="text" placeholder={t('contactPage.subjectPlaceholder')} aria-label={t('contactPage.subjectPlaceholder')} className="contact-form__input"
        value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />

      <textarea placeholder={t('contactPage.messagePlaceholder')} aria-label={t('contactPage.messagePlaceholder')} className="contact-form__textarea" rows={5}
        value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
      {errors.message && <p className="contact-form__error">{errors.message}</p>}

      <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="contact-form__submit">
        {status === 'loading' ? t('contactPage.sending') : t('contactPage.send')}
      </Button>
    </form>
  );
}
