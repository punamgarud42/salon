/**
 * Logo — a simple gold monogram ring around "V" with a small kumkum dot,
 * echoing a bindi placement. Kept as a component (not a static file) so its
 * currentColor pieces can be recolored per-context (nav vs footer) via CSS.
 */
export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vermé logo">
      <circle cx="20" cy="20" r="18.5" stroke="url(#logo-gold)" strokeWidth="1.4" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="'Fraunces', serif"
        fontSize="20"
        fontStyle="italic"
        fontWeight="600"
        fill="url(#logo-gold)"
      >
        V
      </text>
      <circle cx="30.5" cy="10.5" r="2.1" fill="#C98A93" />
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E4C583" />
          <stop offset="100%" stopColor="#C9A15A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
