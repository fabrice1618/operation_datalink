import * as React from 'react';

export interface AsciiFrameProps {
  /** Title cut into the top border as ┤ TITLE ├. */
  title?: React.ReactNode;
  /** Right-side slot cut into the top border (status, count). */
  right?: React.ReactNode;
  children?: React.ReactNode;
  /** Style for the outer frame. */
  style?: React.CSSProperties;
  /** Style for the inner padded body. */
  bodyStyle?: React.CSSProperties;
}

/**
 * The signature terminal group-box — title cut into the top border.
 * @startingPoint section="Core" subtitle="Titled ASCII group-box" viewport="700x180"
 */
export function AsciiFrame(props: AsciiFrameProps): JSX.Element;
