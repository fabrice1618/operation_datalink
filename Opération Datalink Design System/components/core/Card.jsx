import React from 'react';

/**
 * Card — a plain terminal panel: square frame-line border over the
 * faint phosphor panel tint. Compose with CardHeader / CardBody.
 * For a titled group-box with the title cut into the border, use
 * AsciiFrame instead.
 */
export function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-panel)',
        border: '1px solid var(--frame-line)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Card header — bottom-ruled bar with a bright uppercase label + right slot. */
export function CardHeader({ label, right, children, style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        padding: '.4rem .9rem',
        borderBottom: '1px solid var(--frame-line)',
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-xs)',
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'var(--p-dim)',
        ...style,
      }}
      {...rest}
    >
      {children ?? <span style={{ color: 'var(--p-bright)' }}>{label}</span>}
      {right ? <span>{right}</span> : null}
    </div>
  );
}

/** Card body — default padded well. */
export function CardBody({ children, style, ...rest }) {
  return (
    <div style={{ padding: 'var(--space-5)', ...style }} {...rest}>
      {children}
    </div>
  );
}
