import * as React from 'react';

export interface ButtonProps {
  /** primary = peak phosphor · secondary = dim · danger = blinking. */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Stretch full width and center contents. */
  block?: boolean;
  /** Leading glyph (e.g. "▸", "▲"). */
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Bracketed terminal command button — [ LABEL ], inverse-video on hover.
 * @startingPoint section="Core" subtitle="Bracketed terminal button" viewport="700x120"
 */
export function Button(props: ButtonProps): JSX.Element;
