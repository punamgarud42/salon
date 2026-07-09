import { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_SERVICES, findServiceById } from '../data/services.js';
import { generateDaySlots, filterAvailableSlots, todayInputValue, maxBookableInputValue } from '../lib/booking.js';
import { apiGet, apiPost } from '../lib/api.js';
import { getItem, setItem, genRefNumber } from '../lib/storage.js';
import { parseHash } from '../router/useHashRoute.js';
import { useLanguage } from '../context/LanguageContext';
import './Booking.css';

const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile numbers

/**
 * getLocalBookedStartMinutes — fallback availability check used when the
 * backend isn't reachable: scans localStorage bookings for the same
 * service+date and returns their start times, so double-booking is still
 * prevented even in a frontend-only demo.
 */
function getLocalBookedStartMinutes(serviceId, dateStr) {
  const bookings = getItem('bookings', []);
  return bookings
    .filter((b) => b.serviceId === serviceId && b.date === dateStr)
    .map((b) => b.startMinutes);
}

export default function Booking() {
  const { t } = useLanguage();
  const { items: allServices, loading: servicesLoading } = useBackedList('/services', DEFAULT_SERVICES);
  const initialServiceId = parseHash().params.service ?? '';

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [date, setDate] = useState(todayInputValue());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Once services load, default to the first one if the URL didn't specify one.
  useEffect(() => {
    if (!servicesLoading && !serviceId && allServices.length > 0) {
      setServiceId(allServices[0].id);
    }
  }, [servicesLoading, serviceId, allServices]);

  const service = findServiceById(allServices, serviceId);

  // Recompute available slots whenever service or date changes.
  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    setSelectedSlot(null);
    setLoadingSlots(true);

    async function loadAvailability() {
      const baseSlots = generateDaySlots(service.durationMinutes);
      let bookedStartMinutes = [];

      try {
        const res = await apiGet(`/bookings/availability?serviceId=${service.id}&date=${date}`);
        bookedStartMinutes = res.bookedStartMinutes ?? [];
      } catch (err) {
        console.warn('[Booking] availability check failed, using local data:', err.message);
        bookedStartMinutes = getLocalBookedStartMinutes(service.id, date);
      }

      if (!cancelled) {
        setSlots(filterAvailableSlots(baseSlots, { dateStr: date, bookedStartMinutes }));
        setLoadingSlots(false);
      }
    }

    loadAvailability();
    return () => { cancelled = true; };
  }, [service?.id, date]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit mobile number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email or leave it blank.';
    if (!selectedSlot) next.slot = 'Please choose an available time slot.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    const payload = {
      serviceId: service.id,
      serviceName: service.name,
      amount: service.price,
      date,
      startMinutes: selectedSlot.startMinutes,
      timeLabel: selectedSlot.label,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
    };

    try {
      const saved = await apiPost('/bookings', payload);
      setConfirmation({ ...payload, referenceNumber: saved.referenceNumber });
    } catch (err) {
      console.warn('[Booking] backend booking failed, saving locally:', err.message);
      const referenceNumber = genRefNumber('BK');
      const existing = getItem('bookings', []);
      setItem('bookings', [...existing, { ...payload, referenceNumber, createdAt: new Date().toISOString() }]);
      setConfirmation({ ...payload, referenceNumber });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setConfirmation(null);
    setForm({ name: '', phone: '', email: '', notes: '' });
    setSelectedSlot(null);
    setErrors({});
  }

  if (confirmation) {
    return <BookingConfirmation confirmation={confirmation} onBookAnother={resetForm} />;
  }

  if (servicesLoading) {
    return (
      <section className="booking-page container">
        <p className="booking-form__hint">Loading services…</p>
      </section>
    );
  }

  return (
    <section className="booking-page container">
      <Reveal direction="up">
        <p className="eyebrow">{t('bookingPage.eyebrow')}</p>
        <h1>{t('bookingPage.heading')}</h1>
        <KumkumDivider align="left" />
      </Reveal>

      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <Reveal direction="up" delay={60} className="booking-form__section">
          <label className="booking-form__label" htmlFor="service">{t('bookingPage.step1')}</label>
          <select
            id="service"
            className="booking-form__select"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {allServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ₹{s.price.toLocaleString('en-IN')} ({s.duration})
              </option>
            ))}
          </select>
        </Reveal>

        <Reveal direction="up" delay={100} className="booking-form__section">
          <label className="booking-form__label" htmlFor="date">{t('bookingPage.step2')}</label>
          <input
            id="date"
            type="date"
            className="booking-form__input"
            value={date}
            min={todayInputValue()}
            max={maxBookableInputValue()}
            onChange={(e) => setDate(e.target.value)}
          />
        </Reveal>

        <Reveal direction="up" delay={140} className="booking-form__section">
          <label className="booking-form__label">{t('bookingPage.step3')}</label>
          {loadingSlots ? (
            <p className="booking-form__hint">{t('bookingPage.checking')}</p>
          ) : (
            <div className="booking-form__slots">
              {slots.map((slot) => {
                const disabled = slot.isBooked || slot.isPast;
                const active = selectedSlot?.startMinutes === slot.startMinutes;
                return (
                  <button
                    type="button"
                    key={slot.startMinutes}
                    disabled={disabled}
                    className={`booking-slot ${active ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                    title={slot.isBooked ? 'Already booked' : slot.isPast ? 'This time has passed' : ''}
                  >
                    {slot.label}
                  </button>
                );
              })}
              {slots.length === 0 && <p className="booking-form__hint">{t('bookingPage.noSlots')}</p>}
            </div>
          )}
          {errors.slot && <p className="booking-form__error">{errors.slot}</p>}
        </Reveal>

        <Reveal direction="up" delay={180} className="booking-form__section">
          <label className="booking-form__label">{t('bookingPage.step4')}</label>
          <div className="booking-form__grid">
            <div>
              <input
                type="text"
                placeholder={t('bookingPage.namePlaceholder')}
                aria-label={t('bookingPage.namePlaceholder')}
                className="booking-form__input"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <p className="booking-form__error">{errors.name}</p>}
            </div>
            <div>
              <input
                type="tel"
                placeholder={t('bookingPage.phonePlaceholder')}
                aria-label={t('bookingPage.phonePlaceholder')}
                className="booking-form__input"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              {errors.phone && <p className="booking-form__error">{errors.phone}</p>}
            </div>
            <div>
              <input
                type="email"
                placeholder={t('bookingPage.emailPlaceholder')}
                aria-label={t('bookingPage.emailPlaceholder')}
                className="booking-form__input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <p className="booking-form__error">{errors.email}</p>}
            </div>
          </div>
          <textarea
            placeholder={t('bookingPage.notesPlaceholder')}
            aria-label={t('bookingPage.notesPlaceholder')}
            className="booking-form__textarea"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          />
        </Reveal>

        <Reveal direction="up" delay={220}>
          <Button type="submit" variant="primary" size="lg" disabled={submitting} className="booking-form__submit">
            {submitting ? t('bookingPage.confirming') : t('bookingPage.confirm')}
          </Button>
        </Reveal>
      </form>
    </section>
  );
}

function BookingConfirmation({ confirmation, onBookAnother }) {
  const { t } = useLanguage();
  const dateLabel = new Date(confirmation.date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const waMessage = `Hi! I've booked ${confirmation.serviceName} on ${dateLabel} at ${confirmation.timeLabel}. My reference number is ${confirmation.referenceNumber}. — ${confirmation.name}`;
  const waHref = `https://wa.me/911234567890?text=${encodeURIComponent(waMessage)}`; // TODO: same number as WhatsAppButton

  return (
    <section className="booking-confirmation container">
      <Reveal direction="up">
        <div className="booking-confirmation__badge">✓</div>
        <h1>{t('bookingPage.confirmedTitle')}</h1>
        <p className="booking-confirmation__ref">{t('bookingPage.refLabel')} <strong>{confirmation.referenceNumber}</strong></p>
        <KumkumDivider align="center" />

        <dl className="booking-confirmation__details">
          <div><dt>Service</dt><dd>{confirmation.serviceName}</dd></div>
          <div><dt>Date</dt><dd>{dateLabel}</dd></div>
          <div><dt>Time</dt><dd>{confirmation.timeLabel}</dd></div>
          <div><dt>Name</dt><dd>{confirmation.name}</dd></div>
          <div><dt>Phone</dt><dd>{confirmation.phone}</dd></div>
        </dl>

        <p className="booking-confirmation__note">
          {t('bookingPage.note')}
        </p>

        <div className="booking-confirmation__actions">
          {confirmation.amount > 0 && (
            <Button variant="primary" size="lg" href={`#/pay?type=booking&ref=${confirmation.referenceNumber}`}>
              Pay ₹{confirmation.amount.toLocaleString('en-IN')} Now
            </Button>
          )}
          <Button variant="whatsapp" size="lg" href={waHref}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Z" />
            </svg>
            {t('bookingPage.whatsappConfirm')}
          </Button>
          <Button variant="secondary" size="lg" onClick={onBookAnother}>{t('bookingPage.bookAnother')}</Button>
          <Button variant="ghost" size="lg" href="#/">{t('bookingPage.backHome')}</Button>
        </div>
      </Reveal>
    </section>
  );
}
