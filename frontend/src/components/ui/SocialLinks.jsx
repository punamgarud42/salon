import { SOCIALS } from '../../data/socials.js';
import './SocialLinks.css';

/**
 * SocialLinks — the icon set (name + SVG path) stays static here since
 * icons are a design asset, not editable content. `socials` (optional) is
 * a live { instagram, facebook, youtube } URL map — pass BusinessInfo's
 * `socials` field to use real, admin-edited URLs; omit it to fall back to
 * the placeholder hrefs in data/socials.js.
 */
export default function SocialLinks({ size = 36, socials }) {
  return (
    <div className="social-links">
      {SOCIALS.map((s) => {
        const key = s.name.toLowerCase();
        const href = socials?.[key] || s.href;
        return (
          <a
            key={s.name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className="social-links__link"
            style={{ width: size, height: size }}
          >
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={s.icon} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
