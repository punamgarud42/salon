import { useEffect, useState } from 'react';
import Logo from '../../assets/logo.jsx';
import Button from '../ui/Button.jsx';
import LanguageSelector from '../widgets/LanguageSelector.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

/**
 * Navbar — sticky top navigation.
 *
 * navItems is passed in (rather than hard-coded) so Phase 8's admin dashboard
 * can eventually reorder/rename nav entries without touching this component;
 * for now App.jsx supplies the default set built from the i18n dictionary.
 */
export default function Navbar({ navItems }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#/" className="navbar__brand" aria-label={t('common.brand')}>
          <Logo size={38} />
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">{t('common.brand')}</span>
            <span className="navbar__brand-tagline">{t('common.brandTagline')}</span>
          </span>
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="navbar__link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <LanguageSelector />
          <Button variant="primary" size="md" href="#/book" className="navbar__cta">
            {t('nav.bookNow')}
          </Button>

          <button
            className={`navbar__burger ${mobileOpen ? 'is-open' : ''}`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navItems={navItems} />
    </header>
  );
}
