import * as React from 'react';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  /** Number of block cells in the meter. Default 24. */
  cells?: number;
  /** Show the trailing "  NN%". Default true. */
  showPercent?: boolean;
  style?: React.CSSProperties;
}

/** ASCII meter — [████░░░░] NN%, pure monospaced text. */
export function ProgressBar(props: ProgressBarProps): JSX.Element;
