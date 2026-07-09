import { useLanguage } from '../../context/LanguageContext';
import './WhatsAppButton.css';

/**
 * WhatsAppButton — floating action button, bottom-right on every page.
 *
 * This works with zero backend and zero API keys: wa.me links just open
 * WhatsApp (app or web) with a pre-filled message. Update WHATSAPP_NUMBER
 * below to your business number in international format, no "+" or spaces.
 *
 * businessNumber and defaultMessage are read from props with sane fallbacks
 * so that Phase 8 (admin dashboard) can later let the owner edit these and
 * pass them down as props without touching this component.
 */
const WHATSAPP_NUMBER = '911234567890'; // TODO: replace with real business WhatsApp number

export default function WhatsAppButton({
  businessNumber = WHATSAPP_NUMBER,
  defaultMessage = "Hi! I'd like to know more about your services.",
}) {
  const { t } = useLanguage();

  const href = `https://wa.me/${businessNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label={t('whatsapp.cta')}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.16 8.16 0 0 1-1.26-4.37c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.86 5.8 2.4a8.15 8.15 0 0 1 2.4 5.81c0 4.52-3.68 8.24-8.15 8.24Zm4.51-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.77 2.71 4.29 3.79.6.26 1.07.42 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    </a>
  );
}
