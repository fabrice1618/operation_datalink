import React from 'react';

/**
 * AsciiFrame — the signature terminal group-box: a square border with
 * the title cut into the top edge as ┤ TITLE ├, and an optional ┤ right ├
 * slot. This is the primary container of the system.
 */
export function AsciiFrame({ title, right, children, style, bodyStyle, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid var(--frame-line)',
        background: 'var(--bg-panel)',
        ...style,
      }}
      {...rest}
    >
      {title != null ? (
        <div style={{
          position: 'absolute', top: 0, left: '1.2ch', transform: 'translateY(-50%)',
          display: 'flex', alignItems: 'center', gap: '.6ch',
          background: 'var(--bg-screen)', padding: '0 .6ch',
          color: 'var(--p-bright)', fontFamily: 'var(--font-term)',
          fontSize: 'var(--fs-xs)', letterSpacing: '.16em', textTransform: 'uppercase',
          textShadow: 'var(--text-glow)', whiteSpace: 'nowrap',
        }}>
          <span style={{ opacity: 0.5 }}>┤</span>{title}<span style={{ opacity: 0.5 }}>├</span>
        </div>
      ) : null}

      {right != null ? (
        <div style={{
          position: 'absolute', top: 0, right: '1.2ch', transform: 'translateY(-50%)',
          background: 'var(--bg-screen)', padding: '0 .6ch',
          fontSize: 'var(--fs-xs)', color: 'var(--p-dim)', whiteSpace: 'nowrap',
        }}>
          {right}
        </div>
      ) : null}

      <div style={{ padding: 'var(--space-5)', ...bodyStyle }}>
        {children}
      </div>
    </div>
  );
}
