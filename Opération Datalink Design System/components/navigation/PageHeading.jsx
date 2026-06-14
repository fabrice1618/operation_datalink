import React from 'react';

/**
 * PageHeading — a terminal screen title: a bright solid block ▌ then the
 * title, with an optional "// subhead" comment line beneath.
 */
export function PageHeading({ children, subhead, style, ...rest }) {
  return (
    <div style={{ ...style }} {...rest}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1ch',
        fontFamily: 'var(--font-term)', fontSize: 'var(--fs-lg)',
        letterSpacing: '.08em', textTransform: 'uppercase',
        color: 'var(--p-bright)', textShadow: 'var(--text-glow-strong)', lineHeight: 1.1,
      }}>
        <span style={{ color: 'var(--p-max)' }}>&#9612;</span>
        {children}
      </div>
      {subhead ? (
        <div style={{
          fontFamily: 'var(--font-term)', fontSize: 'var(--fs-sm)',
          color: 'var(--p-dim)', marginTop: '.25rem', paddingLeft: '2ch',
        }}>
          <span style={{ color: 'var(--p-faint)' }}>// </span>{subhead}
        </div>
      ) : null}
    </div>
  );
}
