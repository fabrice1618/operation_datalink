import * as React from 'react';

export interface StatCardProps {
  /** The headline numeral (string or number). */
  value: React.ReactNode;
  /** Wide-tracked uppercase caption. */
  label: React.ReactNode;
  /** Accepted for API compatibility; monochrome renders peak phosphor. */
  color?: 'accent' | 'cyan' | 'green';
  style?: React.CSSProperties;
}

/**
 * Framed metric tile — big phosphor numeral over an uppercase label.
 * @startingPoint section="Data" subtitle="Terminal metric tile" viewport="320x140"
 */
export function StatCard(props: StatCardProps): JSX.Element;
