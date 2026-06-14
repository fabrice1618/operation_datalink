import * as React from 'react';

export interface ClassificationChipProps {
  /** Chip label. Defaults to "ACCÈS CLASSIFIÉ". */
  children?: React.ReactNode;
  /** Blink for maximum attention. */
  blink?: boolean;
  style?: React.CSSProperties;
}

/** Inverse-video classification marker for framing restricted context. */
export function ClassificationChip(props: ClassificationChipProps): JSX.Element;
