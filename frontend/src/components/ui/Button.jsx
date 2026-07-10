import './Button.css';

/**
 * Button — shared across booking, enrollment, admin, everywhere.
 *
 * variant: 'primary' | 'secondary' | 'ghost' | 'whatsapp'
 * size: 'md' | 'lg'
 * as: render as <button> (default) or <a> when `href` is passed
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
