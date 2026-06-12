import * as React from 'react';

export interface NavLinkProps {
  /** Current page — persistent inverse video. */
  active?: boolean;
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Top-bar nav item [ LABEL ] — inverse video on hover/active. */
export function NavLink(props: NavLinkProps): JSX.Element;
