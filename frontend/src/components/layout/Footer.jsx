import Logo from '../../assets/logo.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import SocialLinks from '../ui/SocialLinks.jsx';
import { useBackedObject } from '../../hooks/useBackedObject.js';
import { DEFAULT_BUSINESS_INFO } from '../../data/businessInfo.js';
import { useLanguage } from '../../context/LanguageContext';
import './Footer.css';

export default function Footer({ navItems }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const { data: business } = useBackedObject('/business-info', DEFAULT_BUSINESS_INFO);

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand-col">
          <div className="footer__brand">
            <Logo size={36} />
            <span className="footer__brand-name">{business.brandName || t('common.brand')}</span>
          </div>
          <p className="footer__about">{t('footer.about')}</p>
          <SocialLinks size={36} socials={business.socials} />
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.quickLinks')}</h4>
          <KumkumDivider width={70} />
          <ul className="footer__list">
            {navItems.map((item) => (
              <li key={item.href}><a href={item.href}>{item.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.contactUs')}</h4>
          <KumkumDivider width={70} />
          <ul className="footer__list footer__list--contact">
            <li>{business.address}</li>
            <li><a href={`tel:${business.phone}`}>{business.phone}</a></li>
            <li><a href={`mailto:${business.email}`}>{business.email}</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">{t('footer.hours')}</h4>
          <KumkumDivider width={70} />
          <p className="footer__hours">{business.hours}</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {year} {business.brandName || t('common.brand')}. {t('footer.rights')}</p>
        <a href="#/admin" className="footer__admin-link">Admin</a>
      </div>
    </footer>
  );
}
