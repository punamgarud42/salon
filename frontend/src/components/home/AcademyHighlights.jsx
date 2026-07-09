import Button from '../ui/Button.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import Reveal from './Reveal.jsx';
import { useBackedList } from '../../hooks/useBackedList.js';
import { DEFAULT_HIGHLIGHTS } from '../../data/academy.js';
import { useLanguage } from '../../context/LanguageContext';
import './AcademyHighlights.css';

export default function AcademyHighlights() {
  const { t } = useLanguage();
  const { items: highlights } = useBackedList('/academy-highlights', DEFAULT_HIGHLIGHTS);

  return (
    <section className="academy-highlights">
      <div className="container academy-highlights__grid">
        <Reveal direction="left" className="academy-highlights__visual" aria-hidden="true">
          <div className="academy-highlights__visual-inner">
            <span className="academy-highlights__visual-monogram">VA</span>
            <span className="academy-highlights__visual-caption">Vermé Academy</span>
          </div>
        </Reveal>

        <div>
          <Reveal direction="right">
            <p className="eyebrow">{t('academySection.eyebrow')}</p>
            <h2>{t('academySection.heading')}</h2>
            <KumkumDivider align="left" />
            <p className="academy-highlights__lede">
              {t('academySection.lede')}
            </p>
          </Reveal>

          <ul className="academy-highlights__list">
            {highlights.map((h, i) => (
              <Reveal as="li" direction="right" delay={100 + i * 90} key={h.id}>
                <span className="academy-highlights__bullet" aria-hidden="true" />
                <div>
                  <h4 className="academy-highlights__item-title">{h.title}</h4>
                  <p className="academy-highlights__item-detail">{h.detail}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal direction="right" delay={100 + highlights.length * 90}>
            <Button variant="primary" size="lg" href="#/academy">{t('academySection.cta')}</Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
