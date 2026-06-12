import React from 'react';

/**
 * Button — a bracketed terminal command: [ ▸ LABEL ]. No box; the
 * brackets ARE the button. Hover fills with inverse video. Monochrome:
 * "primary" = peak phosphor, "secondary" = dim, "danger" = blinking.
 */
export function Button({
  variant = 'primary',
  block = false,
  icon,
  disabled = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const color = {
    primary: 'var(--p-bright)',
    secondary: 'var(--p-dim)',
    danger: 'var(--p-bright)',
  }[variant] || 'var(--p-bright)';

  const inverse = hover && !disabled;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={variant === 'danger' && !inverse ? 'term-blink' : undefined}
      style={{
        display: block ? 'flex' : 'inline-flex',
        width: block ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '.6ch',
        padding: '.28rem .8rem',
        border: 'none',
        background: inverse ? 'var(--inverse-bg)' : 'transparent',
        color: inverse ? 'var(--inverse-fg)' : color,
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-sm)',
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        textShadow: inverse ? 'none' : 'var(--text-glow)',
        whiteSpace: 'nowrap',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background var(--t-fast), color var(--t-fast)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ opacity: 0.6 }}>[</span>
      {icon ? <span>{icon}</span> : null}
      <span>{children}</span>
      <span style={{ opacity: 0.6 }}>]</span>
    </button>
  );
}
