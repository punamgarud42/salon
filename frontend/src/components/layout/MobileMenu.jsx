import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../../context/LanguageContext';
import './MobileMenu.css';

/**
 * MobileMenu — rendered via React Portal directly on document.body so it
 * is never clipped by the sticky Navbar header. Some mobile browsers
 * (Chrome Android, Safari iOS) do not honour position:fixed on children
 * of position:sticky elements — portaling out avoids this entirely.
 */
export default function MobileMenu({ open, onClose, navItems }) {
  const { t } = useLanguage();

  // Prevent background scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const menu = (
    <div
      className={`mobile-menu ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop — tap to close */}
      <button
        className="mobile-menu__backdrop"
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      {/* Slide-in panel */}
      <nav className="mobile-menu__panel" aria-label="Mobile navigation">
        <ul className="mobile-menu__list">
          {navItems.map((item, i) => (
            <li
              key={item.href}
              style={{ transitionDelay: `${open ? i * 40 + 80 : 0}ms` }}
            >
              <a
                href={item.href}
                className="mobile-menu__link"
                onClick={onClose}
                tabIndex={open ? 0 : -1}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#/book"
          className="mobile-menu__cta-link"
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        >
          {t('nav.bookNow')}
        </a>
      </nav>
    </div>
  );

  // Portal renders outside the sticky header — fixes mobile fixed-in-sticky bug
  return createPortal(menu, document.body);
}
