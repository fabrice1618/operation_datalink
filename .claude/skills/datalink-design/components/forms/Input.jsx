import React from 'react';

/**
 * Input — a terminal prompt field: a "›" prompt prefix, recessed well,
 * block caret. Focus brightens the border + glow. Error shakes + blinks
 * the hint. Optional label + hint render a complete labelled control.
 */
export function Input({ label, hint, error = false, prompt = '›', id, style, wrapStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;

  return (
    <div style={{ ...wrapStyle }}>
      {label ? (
        <label htmlFor={fieldId} style={{
          display: 'block', fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xs)',
          letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--p-dim)',
          marginBottom: '.3rem',
        }}>
          {label}
        </label>
      ) : null}

      <div style={{
        display: 'flex', alignItems: 'center', gap: '.6ch',
        padding: '.4rem .7rem',
        background: 'var(--bg-inset)',
        border: '1px solid',
        borderColor: error ? 'var(--p-bright)' : focus ? 'var(--p-bright)' : 'var(--frame-line)',
        boxShadow: focus && !error ? 'var(--box-glow)' : 'none',
        transition: 'border-color var(--t-base)',
        animation: error ? 'term-shake .3s' : 'none',
      }}>
        <span style={{ color: 'var(--p-dim)', flexShrink: 0 }}>{prompt}</span>
        <input
          id={fieldId}
          onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          style={{
            flex: 1, minWidth: 0,
            background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--p-bright)', fontFamily: 'var(--font-term)',
            fontSize: 'var(--fs-base)', textShadow: 'var(--text-glow)',
            ...style,
          }}
          {...rest}
        />
      </div>

      {hint ? (
        <div className={error ? 'term-blink' : undefined} style={{
          fontFamily: 'var(--font-term)', fontSize: 'var(--fs-xs)',
          color: error ? 'var(--p-bright)' : 'var(--p-faint)', marginTop: '.3rem',
        }}>
          {hint}
        </div>
      ) : null}
    </div>
  );
}
