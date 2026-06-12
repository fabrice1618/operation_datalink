import React from 'react';

/**
 * Badge — a terminal status tag. Monochrome: "validated" uses inverse
 * video, "danger/warn" blink, others vary by brightness. Pass short
 * text like OK / ·· / !! / 3.
 */
export function Badge({ variant = 'pending', children, style, ...rest }) {
  const map = {
    success: { fg: 'var(--inverse-fg)', bg: 'var(--inverse-bg)', blink: false },
    info:    { fg: 'var(--p-bright)',   bg: 'transparent',       blink: false },
    warn:    { fg: 'var(--p-bright)',   bg: 'transparent',       blink: true },
    pending: { fg: 'var(--p-faint)',    bg: 'transparent',       blink: false },
    danger:  { fg: 'var(--inverse-fg)', bg: 'var(--inverse-bg)', blink: true },
  };
  const s = map[variant] || map.pending;

  return (
    <span
      className={s.blink ? 'term-blink' : undefined}
      style={{
        display: 'inline-block',
        padding: s.bg === 'transparent' ? '0' : '0 .5ch',
        background: s.bg,
        color: s.fg,
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-xs)',
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        textShadow: s.bg === 'transparent' ? 'var(--text-glow)' : 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
