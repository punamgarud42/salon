import { useEffect, useState } from 'react';
import Button from '../components/ui/Button.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedList } from '../hooks/useBackedList.js';
import { DEFAULT_COURSES, findCourseById } from '../data/courses.js';
import { useBatchAvailability } from '../hooks/useBatchAvailability.js';
import { SEAT_STATUS_LABEL } from '../lib/enrollment.js';
import { apiPost } from '../lib/api.js';
import { getItem, setItem, genRefNumber } from '../lib/storage.js';
import { parseHash } from '../router/useHashRoute.js';
import { useLanguage } from '../context/LanguageContext';
import './Enrollment.css';

const PHONE_RE = /^[6-9]\d{9}$/;

export default function Enrollment() {
  const { t } = useLanguage();
  const { items: allCourses, loading: coursesLoading } = useBackedList('/courses', DEFAULT_COURSES);
  const initialParams = parseHash().params;

  const [courseId, setCourseId] = useState(initialParams.course ?? '');
  const [batchId, setBatchId] = useState(initialParams.batch ?? '');
  const { batches, loading: batchesLoading } = useBatchAvailability();

  const [form, setForm] = useState({ name: '', phone: '', email: '', age: '', qualification: '', address: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  // Once courses load, default to the first one if the URL didn't specify one.
  useEffect(() => {
    if (!coursesLoading && !courseId && allCourses.length > 0) {
      setCourseId(allCourses[0].id);
    }
  }, [coursesLoading, courseId, allCourses]);

  const course = findCourseById(allCourses, courseId);
  const courseBatches = batches.filter((b) => b.courseId === courseId);
  const selectedBatch = courseBatches.find((b) => b.id === batchId) ?? null;

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter the applicant\'s name.';
    if (!PHONE_RE.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit mobile number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email or leave it blank.';
    if (!form.age || Number(form.age) < 14 || Number(form.age) > 70) next.age = 'Enter a valid age (14–70).';
    if (!batchId) next.batch = 'Please choose a batch.';
    if (selectedBatch && selectedBatch.status === 'full') next.batch = 'That batch is full — please choose another.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    const payload = {
      courseId: course.id,
      courseName: course.name,
      amount: course.fee,
      batchId: selectedBatch.id,
      batchLabel: `${selectedBatch.startDate} to ${selectedBatch.endDate}`,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      age: Number(form.age),
      qualification: form.qualification.trim(),
      address: form.address.trim(),
    };

    try {
      const saved = await apiPost('/enrollments', payload);
      setConfirmation({ ...payload, referenceNumber: saved.referenceNumber });
    } catch (err) {
      console.warn('[Enrollment] backend enrollment failed, saving locally:', err.message);
      const referenceNumber = genRefNumber('EN');
      const existing = getItem('enrollments', []);
      setItem('enrollments', [...existing, { ...payload, referenceNumber, status: 'confirmed', createdAt: new Date().toISOString() }]);
      setConfirmation({ ...payload, referenceNumber });
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return <EnrollmentConfirmation confirmation={confirmation} />;
  }

  if (coursesLoading) {
    return (
      <section className="enrollment-page container">
        <p className="enrollment-form__hint">Loading courses…</p>
      </section>
    );
  }

  return (
    <section className="enrollment-page container">
      <Reveal direction="up">
        <p className="eyebrow">{t('enrollmentPage.eyebrow')}</p>
        <h1>{t('enrollmentPage.heading')}</h1>
        <KumkumDivider align="left" />
      </Reveal>

      <form className="enrollment-form" onSubmit={handleSubmit} noValidate>
        <Reveal direction="up" delay={60} className="enrollment-form__section">
          <label className="enrollment-form__label" htmlFor="course">{t('enrollmentPage.step1')}</label>
          <select
            id="course"
            className="enrollment-form__select"
            value={courseId}
            onChange={(e) => { setCourseId(e.target.value); setBatchId(''); }}
          >
            {allCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — ₹{c.fee.toLocaleString('en-IN')}</option>
            ))}
          </select>
        </Reveal>

        <Reveal direction="up" delay={100} className="enrollment-form__section">
          <label className="enrollment-form__label">{t('enrollmentPage.step2')}</label>
          {batchesLoading ? (
            <p className="enrollment-form__hint">{t('enrollmentPage.checking')}</p>
          ) : courseBatches.length === 0 ? (
            <p className="enrollment-form__hint">{t('enrollmentPage.noBatches')}</p>
          ) : (
            <div className="enrollment-form__batches">
              {courseBatches.map((b) => {
                const full = b.status === 'full';
                const active = batchId === b.id;
                return (
                  <button
                    type="button"
                    key={b.id}
                    disabled={full}
                    className={`batch-option ${active ? 'is-active' : ''} ${full ? 'is-disabled' : ''}`}
                    onClick={() => setBatchId(b.id)}
                  >
                    <span className="batch-option__dates">{b.startDate} → {b.endDate}</span>
                    <span className={`batch-option__status batch-option__status--${b.status}`}>
                      {SEAT_STATUS_LABEL[b.status]}{!full && ` · ${b.seatsLeft} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
          {errors.batch && <p className="enrollment-form__error">{errors.batch}</p>}
        </Reveal>

        <Reveal direction="up" delay={140} className="enrollment-form__section">
          <label className="enrollment-form__label">{t('enrollmentPage.step3')}</label>
          <div className="enrollment-form__grid">
            <div>
              <input type="text" placeholder={t('enrollmentPage.namePlaceholder')} aria-label={t('enrollmentPage.namePlaceholder')} className="enrollment-form__input"
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              {errors.name && <p className="enrollment-form__error">{errors.name}</p>}
            </div>
            <div>
              <input type="tel" placeholder={t('enrollmentPage.phonePlaceholder')} aria-label={t('enrollmentPage.phonePlaceholder')} className="enrollment-form__input"
                value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              {errors.phone && <p className="enrollment-form__error">{errors.phone}</p>}
            </div>
            <div>
              <input type="email" placeholder={t('enrollmentPage.emailPlaceholder')} aria-label={t('enrollmentPage.emailPlaceholder')} className="enrollment-form__input"
                value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              {errors.email && <p className="enrollment-form__error">{errors.email}</p>}
            </div>
            <div>
              <input type="number" placeholder={t('enrollmentPage.agePlaceholder')} aria-label={t('enrollmentPage.agePlaceholder')} className="enrollment-form__input"
                value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} />
              {errors.age && <p className="enrollment-form__error">{errors.age}</p>}
            </div>
            <input type="text" placeholder={t('enrollmentPage.qualificationPlaceholder')} aria-label={t('enrollmentPage.qualificationPlaceholder')} className="enrollment-form__input"
              value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} />
          </div>
          <textarea placeholder={t('enrollmentPage.addressPlaceholder')} aria-label={t('enrollmentPage.addressPlaceholder')} className="enrollment-form__textarea" rows={2}
            value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        </Reveal>

        <Reveal direction="up" delay={180}>
          <Button type="submit" variant="primary" size="lg" disabled={submitting} className="enrollment-form__submit">
            {submitting ? t('enrollmentPage.submitting') : t('enrollmentPage.submit')}
          </Button>
        </Reveal>
      </form>
    </section>
  );
}

function EnrollmentConfirmation({ confirmation }) {
  const { t } = useLanguage();
  const waMessage = `Hi! I've applied for ${confirmation.courseName} (batch: ${confirmation.batchLabel}). My reference number is ${confirmation.referenceNumber}. — ${confirmation.name}`;
  const waHref = `https://wa.me/911234567890?text=${encodeURIComponent(waMessage)}`; // TODO: same number as WhatsAppButton

  return (
    <section className="enrollment-confirmation container">
      <Reveal direction="up">
        <div className="enrollment-confirmation__badge">✓</div>
        <h1>{t('enrollmentPage.confirmedTitle')}</h1>
        <p className="enrollment-confirmation__ref">{t('enrollmentPage.refLabel')} <strong>{confirmation.referenceNumber}</strong></p>
        <KumkumDivider align="center" />

        <dl className="enrollment-confirmation__details">
          <div><dt>Course</dt><dd>{confirmation.courseName}</dd></div>
          <div><dt>Batch</dt><dd>{confirmation.batchLabel}</dd></div>
          <div><dt>Applicant</dt><dd>{confirmation.name}</dd></div>
          <div><dt>Phone</dt><dd>{confirmation.phone}</dd></div>
        </dl>

        <p className="enrollment-confirmation__note">
          {t('enrollmentPage.note')}
        </p>

        <div className="enrollment-confirmation__actions">
          {confirmation.amount > 0 && (
            <Button variant="primary" size="lg" href={`#/pay?type=enrollment&ref=${confirmation.referenceNumber}`}>
              Pay ₹{confirmation.amount.toLocaleString('en-IN')} Now
            </Button>
          )}
          <Button variant="whatsapp" size="lg" href={waHref}>{t('enrollmentPage.whatsappConfirm')}</Button>
          <Button variant="ghost" size="lg" href="#/academy">{t('enrollmentPage.backAcademy')}</Button>
        </div>
      </Reveal>
    </section>
  );
}
