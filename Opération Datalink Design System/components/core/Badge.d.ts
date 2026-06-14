import * as React from 'react';

export interface BadgeProps {
  /** success = inverse block · info = bright · warn/danger = blink · pending = faint. */
  variant?: 'success' | 'info' | 'warn' | 'pending' | 'danger';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Terminal status tag — state via inverse video / blink / brightness, not color. */
export function Badge(props: BadgeProps): JSX.Element;
