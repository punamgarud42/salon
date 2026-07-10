import { useLanguage } from '../../context/LanguageContext';
import './MobileMenu.css';

/**
 * MobileMenu — full-screen overlay panel, slides in from the right.
 *
 * Links are plain <a> tags rather than using the Button component so that
 * onClick fires reliably on every mobile browser before the hash changes.
 * The hashchange listener in Navbar.jsx also closes the menu as a
 * belt-and-suspenders backup.
 */
export default function MobileMenu({ open, onClose, navItems }) {
  const { t } = useLanguage();

  function handleLinkClick(e) {
    // Close immediately on tap, before the hash changes.
    // Calling onClose() first means the closing animation starts while
    // the new page is rendering, which feels snappy on mobile.
    onClose();
  }

  return (
    <div
      className={`mobile-menu ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <nav className="mobile-menu__panel" aria-label="Mobile navigation">
        <ul className="mobile-menu__list">
          {navItems.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: `${open ? i * 40 + 80 : 0}ms` }}>
              <a
                href={item.href}
                className="mobile-menu__link"
                onClick={handleLinkClick}
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
          onClick={handleLinkClick}
          tabIndex={open ? 0 : -1}
        >
          {t('nav.bookNow')}
        </a>
      </nav>

      <button
        className="mobile-menu__backdrop"
        aria-label="Close menu"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />
    </div>
  );
}
