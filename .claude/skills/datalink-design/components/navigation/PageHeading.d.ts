import * as React from 'react';

export interface PageHeadingProps {
  children?: React.ReactNode;
  /** Optional "// subhead" comment line beneath the title. */
  subhead?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Terminal screen title — bright block ▌ + title + "// subhead". */
export function PageHeading(props: PageHeadingProps): JSX.Element;
