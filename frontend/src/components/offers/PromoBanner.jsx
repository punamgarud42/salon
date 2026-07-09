import Button from '../ui/Button.jsx';
import { useCountdown } from '../../hooks/useCountdown.js';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.js';
import { useLanguage } from '../../context/LanguageContext';
import './PromoBanner.css';

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown-unit">
      <span className="countdown-unit__value">{String(value).padStart(2, '0')}</span>
      <span className="countdown-unit__label">{label}</span>
    </div>
  );
}

/**
 * PromoBanner — the one offer-banner layout used by the homepage preview
 * (OffersPreview.jsx) and the full Offers page (Phase 6). Includes a real,
 * working "copy code" button (see hooks/useCopyToClipboard.js) — not just
 * a static code shown as text.
 */
export default function PromoBanner({ offer }) {
  const { t } = useLanguage();
  const countdown = useCountdown(offer.endsAt);
  const [copied, copy] = useCopyToClipboard();

  return (
    <div className="offer-banner">
      <div className="offer-banner__badge">{offer.discountLabel}</div>

      <div className="offer-banner__body">
        <h3 className="offer-banner__title">{offer.title}</h3>
        <p className="offer-banner__desc">{offer.description}</p>
        <button className="offer-banner__code" onClick={() => copy(offer.code)}>
          <span>{copied ? t('offersPage.copied') : offer.code}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        </button>
      </div>

      <div className="offer-banner__countdown" aria-label="Offer ends in">
        {countdown.expired ? (
          <span className="offer-banner__expired">{t('offersPage.expired')}</span>
        ) : (
          <>
            <CountdownUnit value={countdown.days} label={t('common.countdown.days')} />
            <CountdownUnit value={countdown.hours} label={t('common.countdown.hrs')} />
            <CountdownUnit value={countdown.minutes} label={t('common.countdown.min')} />
            <CountdownUnit value={countdown.seconds} label={t('common.countdown.sec')} />
          </>
        )}
      </div>

      <Button variant="primary" size="lg" href="#/book" className="offer-banner__cta">
        {t('offersPage.claim')}
      </Button>
    </div>
  );
}
