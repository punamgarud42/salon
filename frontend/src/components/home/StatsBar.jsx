import { useCountUp } from '../../hooks/useCountUp';
import { useLanguage } from '../../context/LanguageContext';
import Reveal from './Reveal.jsx';
import './StatsBar.css';

function Stat({ end, suffix, label, delay }) {
  const [ref, value] = useCountUp(end);
  return (
    <Reveal direction="up" delay={delay} className="stat">
      <div ref={ref} className="stat__number">
        {value.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="stat__label">{label}</div>
    </Reveal>
  );
}

export default function StatsBar() {
  const { t } = useLanguage();

  const STATS = [
    { id: 'years', end: 12, suffix: '+', label: t('stats.years') },
    { id: 'clients', end: 8500, suffix: '+', label: t('stats.clients') },
    { id: 'experts', end: 18, suffix: '', label: t('stats.experts') },
    { id: 'grads', end: 640, suffix: '+', label: t('stats.grads') },
  ];

  return (
    <section className="stats-bar">
      <div className="container stats-bar__grid">
        {STATS.map((s, i) => (
          <Stat key={s.id} end={s.end} suffix={s.suffix} label={s.label} delay={i * 90} />
        ))}
      </div>
    </section>
  );
}
