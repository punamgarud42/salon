import ContactForm from '../components/contact/ContactForm.jsx';
import MapPlaceholder from '../components/contact/MapPlaceholder.jsx';
import SocialLinks from '../components/ui/SocialLinks.jsx';
import KumkumDivider from '../components/ui/KumkumDivider.jsx';
import Reveal from '../components/home/Reveal.jsx';
import { useBackedObject } from '../hooks/useBackedObject.js';
import { DEFAULT_BUSINESS_INFO } from '../data/businessInfo.js';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();
  const { data: business } = useBackedObject('/business-info', DEFAULT_BUSINESS_INFO);

  return (
    <section className="contact-page container">
      <Reveal direction="up">
        <p className="eyebrow">{t('contactPage.eyebrow')}</p>
        <h1>{t('contactPage.heading')}</h1>
        <KumkumDivider align="left" />
        <p className="contact-page__lede">{t('contactPage.lede')}</p>
      </Reveal>

      <div className="contact-page__grid">
        <Reveal direction="left" className="contact-page__form-col">
          <ContactForm />
        </Reveal>

        <Reveal direction="right" className="contact-page__info-col">
          <MapPlaceholder address={business.address} />

          <div className="contact-page__details">
            <div>
              <span className="contact-page__details-label">{t('contactPage.phoneLabel')}</span>
              <a href={`tel:${business.phone}`}>{business.phone}</a>
            </div>
            <div>
              <span className="contact-page__details-label">{t('contactPage.emailLabel')}</span>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </div>
            <div>
              <span className="contact-page__details-label">{t('footer.hours')}</span>
              <span>{business.hours}</span>
            </div>
          </div>

          <div>
            <span className="contact-page__details-label">{t('contactPage.followLabel')}</span>
            <SocialLinks size={40} socials={business.socials} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
