import * as React from 'react';

export interface MenuItemProps {
  /** The selection digit shown as [N]. */
  number: React.ReactNode;
  /** Menu entry label. */
  label: React.ReactNode;
  /** Right-hand status after the dotted leader. */
  right?: React.ReactNode;
  /** Selected — persistent inverse video. */
  active?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Numbered main-menu row with dotted leader; inverts on hover/select.
 * @startingPoint section="Navigation" subtitle="Numbered terminal menu row" viewport="700x120"
 */
export function MenuItem(props: MenuItemProps): JSX.Element;
