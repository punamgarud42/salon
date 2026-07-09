import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Reveal.css';

/**
 * Reveal — wrap any block to fade/slide it in once when scrolled into view.
 *
 * direction: 'up' | 'left' | 'right' | 'none'
 * delay: ms, use to stagger siblings (e.g. cards in a grid) — pass index*80
 */
export default function Reveal({ children, direction = 'up', delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${direction} ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
