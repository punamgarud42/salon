import SalonIcon from '../ui/SalonIcon.jsx';
import { getCategoryGradient } from '../../lib/categoryTheme.js';
import './ComparisonPanel.css';

/**
 * ComparisonPanel — fills one side of the before/after slider. `muted`
 * desaturates and dims the gradient + icon to read as "before"; the
 * vibrant version (muted=false) reads as "after". Same icon both times on
 * purpose — the treatment is the same category, just before vs after.
 */
export default function ComparisonPanel({ category, icon, muted = false }) {
  const [c1, c2] = getCategoryGradient(category);

  return (
    <div
      className={`comparison-panel ${muted ? 'is-muted' : ''}`}
      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
    >
      <SalonIcon name={icon} size={56} className="comparison-panel__icon" />
    </div>
  );
}
