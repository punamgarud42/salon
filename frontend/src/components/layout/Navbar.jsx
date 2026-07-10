import { useEffect, useState } from 'react';
import Logo from '../../assets/logo.jsx';
import Button from '../ui/Button.jsx';
import LanguageSelector from '../widgets/LanguageSelector.jsx';
import MobileMenu from './MobileMenu.jsx';
import { useLanguage } from '../../context/LanguageContext';
import './Navbar.css';

export default function Navbar({ navItems }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll backdrop
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu whenever the hash/route changes — covers:
  // - tapping a nav link (hash changes → this fires)
  // - pressing the browser back button
  // - any programmatic navigation
  useEffect(() => {
    const onHashChange = () => setMobileOpen(false);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}
