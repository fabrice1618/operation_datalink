import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  /** Uppercase wide-tracked label above the field. */
  label?: React.ReactNode;
  /** Helper text below the field (blinks when error). */
  hint?: React.ReactNode;
  /** Brighten border + blink the hint to signal rejection. */
  error?: boolean;
  /** Prompt glyph before the field. Default "›". */
  prompt?: React.ReactNode;
  style?: React.CSSProperties;
  /** Style for the wrapping <div>. */
  wrapStyle?: React.CSSProperties;
}

/**
 * Terminal prompt field — "›" prefix, recessed well, glow on focus.
 * @startingPoint section="Forms" subtitle="Terminal prompt field" viewport="700x130"
 */
export function Input(props: InputProps): JSX.Element;
