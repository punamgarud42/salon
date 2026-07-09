import { useParallax } from '../../hooks/useParallax';
import Button from '../ui/Button.jsx';
import KumkumDivider from '../ui/KumkumDivider.jsx';
import Reveal from './Reveal.jsx';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

/**
 * Hero — the page's thesis statement. Instead of a stock photo of a model
 * (which would need real licensed photography this project doesn't have),
 * the "characteristic thing in this subject's world" chosen here is the
 * vanity mirror itself: a soft radial gold glow behind a dark vignette,
 * like standing in front of a lit mirror in a dim room. That's the parallax
 * layer — it drifts slower than the page as you scroll, giving the mirror
 * a sense of depth behind the content.
 */
export default function Hero() {
  const { t } = useLanguage();
  const parallaxRef = useParallax(0.25);

  return (
    <section className="hero">
      <div className="hero__parallax-layer" ref={parallaxRef} aria-hidden="true">
        <div className="hero__glow" />
        <div className="hero__vignette" />
      </div>

      <div className="container hero__content">
        <Reveal direction="up">
          <p className="eyebrow">{t('common.brandTagline')}, {t('hero.locationSuffix')}</p>
        </Reveal>

        <Reveal direction="up" delay={80}>
          <h1 className="hero__headline">
            {t('hero.headline1')}<br />{t('hero.headline2')}
          </h1>
        </Reveal>

        <Reveal direction="up" delay={160}>
          <KumkumDivider align="left" width={200} />
        </Reveal>

        <Reveal direction="up" delay={200}>
          <p className="hero__lede">
            {t('hero.lede')}
          </p>
        </Reveal>

        <Reveal direction="up" delay={280}>
          <div className="hero__cta-row">
            <Button variant="primary" size="lg" href="#/book">{t('hero.ctaBook')}</Button>
            <Button variant="secondary" size="lg" href="#/academy">{t('hero.ctaAcademy')}</Button>
          </div>
        </Reveal>
      </div>

      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
