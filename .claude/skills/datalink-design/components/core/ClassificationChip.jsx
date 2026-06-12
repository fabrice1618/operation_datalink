import React from 'react';

/**
 * ClassificationChip — the "ACCÈS CLASSIFIÉ" marker, rendered as a
 * bracketed inverse-video bar (the loudest thing a monochrome terminal
 * can say). Optionally blinks.
 */
export function ClassificationChip({ children = 'ACCÈS CLASSIFIÉ', blink = false, style, ...rest }) {
  return (
    <span
      className={blink ? 'term-blink' : undefined}
      style={{
        display: 'inline-block',
        background: 'var(--inverse-bg)',
        color: 'var(--inverse-fg)',
        padding: '.1rem 1.2ch',
        fontFamily: 'var(--font-term)',
        fontSize: 'var(--fs-xs)',
        letterSpacing: '.26em',
        textTransform: 'uppercase',
        textShadow: 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
