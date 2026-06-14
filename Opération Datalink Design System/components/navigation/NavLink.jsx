import React from 'react';

/**
 * NavLink — top-bar nav item rendered as bracketed text [ LABEL ].
 * Active/hover fills with inverse video.
 */
export function NavLink({ active = false, href = '#', children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;

  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '.5ch',
        padding: '.15rem .7ch',
        textDecoration: 'none',
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-sm)',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        background: on ? 'var(--inverse-bg)' : 'transparent',
        color: on ? 'var(--inverse-fg)' : 'var(--p-dim)',
        textShadow: on ? 'none' : 'var(--text-glow)',
        transition: 'background var(--t-fast), color var(--t-fast)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ opacity: 0.5 }}>[</span>{children}<span style={{ opacity: 0.5 }}>]</span>
    </a>
  );
}
