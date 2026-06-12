import React from 'react';

/**
 * ProgressBar — an ASCII meter: [████████░░░░░░░░] with an optional
 * trailing percentage. Pure text, monospaced, phosphor glow.
 */
export function ProgressBar({ value = 0, max = 100, cells = 24, showPercent = true, style, ...rest }) {
  const ratio = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const filled = Math.round(ratio * cells);
  const pct = Math.round(ratio * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      style={{
        display: 'flex', alignItems: 'center', gap: '1ch',
        fontFamily: 'var(--font-term)', fontSize: 'var(--fs-base)',
        color: 'var(--p-dim)', letterSpacing: '-.02em', whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span>
        <span style={{ color: 'var(--p-dim)' }}>[</span>
        <span style={{ color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)' }}>{'\u2588'.repeat(filled)}</span>
        <span style={{ color: 'var(--p-ghost)' }}>{'\u2591'.repeat(cells - filled)}</span>
        <span style={{ color: 'var(--p-dim)' }}>]</span>
      </span>
      {showPercent ? <span style={{ color: 'var(--p-bright)' }}>{String(pct).padStart(3, ' ')}%</span> : null}
    </div>
  );
}
