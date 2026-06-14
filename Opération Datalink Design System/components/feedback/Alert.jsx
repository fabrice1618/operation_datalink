import React from 'react';

/**
 * Alert — a terminal status line prefixed ">>". Monochrome: "danger"
 * blinks, others vary by brightness. Optional [X] dismiss.
 */
export function Alert({ variant = 'info', onDismiss, children, style, ...rest }) {
  const [open, setOpen] = React.useState(true);
  const map = {
    success: { color: 'var(--p-bright)', blink: false },
    danger:  { color: 'var(--p-bright)', blink: true },
    warning: { color: 'var(--p-bright)', blink: false },
    info:    { color: 'var(--p-text)',   blink: false },
  };
  const s = map[variant] || map.info;
  if (!open) return null;

  return (
    <div
      role="status"
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '.8ch',
        padding: '.5rem .8rem',
        marginBottom: 'var(--space-5)',
        border: '1px solid var(--frame-line)',
        background: 'var(--bg-panel)',
        color: s.color,
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-sm)',
        ...style,
      }}
      {...rest}
    >
      <span className={s.blink ? 'term-blink' : undefined} style={{ color: 'var(--p-dim)', flexShrink: 0 }}>&gt;&gt;</span>
      <span className={s.blink ? 'term-blink' : undefined} style={{ flex: 1 }}>{children}</span>
      <button
        onClick={() => { setOpen(false); onDismiss?.(); }}
        aria-label="Fermer"
        style={{
          background: 'none', border: 'none', color: 'var(--p-dim)', cursor: 'pointer',
          fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)', flexShrink: 0,
          textShadow: 'var(--text-glow)',
        }}
      >
        [X]
      </button>
    </div>
  );
}
