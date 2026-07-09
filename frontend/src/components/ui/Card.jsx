import './Card.css';

/**
 * Card — the base surface reused for service cards, course cards, gallery tiles,
 * testimonial cards etc. in later phases. Keep this generic; specialised cards
 * should compose this rather than reinvent the surface/shadow/hover treatment.
 */
export default function Card({ children, className = '', hoverable = true, as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`card ${hoverable ? 'card--hoverable' : ''} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
