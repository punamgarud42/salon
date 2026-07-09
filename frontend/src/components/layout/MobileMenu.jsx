import Button from '../ui/Button.jsx';
import { useLanguage } from '../../context/LanguageContext';
import './MobileMenu.css';

/**
 * MobileMenu — full-screen overlay panel, slides in from the right.
 * Rendered inside Navbar; visibility purely controlled by the `open` prop
 * so it can be unit-tested / reused without depending on Navbar's own state.
 */
export default function MobileMenu({ open, onClose, navItems }) {
  const { t } = useLanguage();

  return (
    <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <nav className="mobile-menu__panel" aria-label="Mobile">
        <ul className="mobile-menu__list">
          {navItems.map((item, i) => (
            <li key={item.href} style={{ transitionDelay: `${open ? i * 40 + 80 : 0}ms` }}>
              <a href={item.href} className="mobile-menu__link" onClick={onClose}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <Button variant="primary" size="lg" href="#/book" onClick={onClose} className="mobile-menu__cta">
          {t('nav.bookNow')}
        </Button>
      </nav>

      <button className="mobile-menu__backdrop" aria-label="Close menu" onClick={onClose} tabIndex={open ? 0 : -1} />
    </div>
  );
}
