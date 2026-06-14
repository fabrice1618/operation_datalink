import React from 'react';

/**
 * MenuItem — a numbered row for the main-menu hub:
 *   [1] ▸ LABEL ......................... STATUS
 * The whole row inverts on hover/active (keyboard or mouse selection).
 * Dotted leader fills the gap to the right-hand status.
 */
export function MenuItem({ number, label, right, active = false, href = '#', onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const on = active || hover;

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1ch',
        padding: '.35rem 1ch',
        textDecoration: 'none',
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-md)',
        background: on ? 'var(--inverse-bg)' : 'transparent',
        color: on ? 'var(--inverse-fg)' : 'var(--p-text)',
        textShadow: on ? 'none' : 'var(--text-glow)',
        transition: 'background var(--t-fast), color var(--t-fast)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ color: on ? 'var(--inverse-fg)' : 'var(--p-bright)' }}>[{number}]</span>
      <span style={{ flexShrink: 0 }}>{on ? '▸' : ' '}</span>
      <span style={{ flexShrink: 0, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
      <span aria-hidden="true" style={{
        flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap',
        color: on ? 'var(--inverse-fg)' : 'var(--p-ghost)', opacity: 0.7,
      }}>
        {' ' + '.'.repeat(200)}
      </span>
      {right != null ? <span style={{ flexShrink: 0, color: on ? 'var(--inverse-fg)' : 'var(--p-dim)' }}>{right}</span> : null}
    </a>
  );
}
