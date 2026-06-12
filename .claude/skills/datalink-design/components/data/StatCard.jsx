import React from 'react';

/**
 * StatCard — a framed metric: a big phosphor numeral over a dim
 * uppercase label. Monochrome; the `color` prop is accepted for API
 * compatibility but every numeral renders in peak phosphor.
 */
export function StatCard({ value, label, color, style, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid var(--frame-line)',
        background: 'var(--bg-panel)',
        textAlign: 'center',
        padding: 'var(--space-4)',
        ...style,
      }}
      {...rest}
    >
      <div style={{
        fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xl)', lineHeight: 1,
        color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xs)',
        color: 'var(--p-dim)', letterSpacing: '.16em', textTransform: 'uppercase',
        marginTop: '.35rem',
      }}>
        {label}
      </div>
    </div>
  );
}
