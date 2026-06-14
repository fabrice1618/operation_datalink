import * as React from 'react';

export interface AlertProps {
  /** success/warning/info = brightness · danger = blink. */
  variant?: 'success' | 'danger' | 'warning' | 'info';
  onDismiss?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Terminal status line prefixed ">>", with an [X] dismiss. */
export function Alert(props: AlertProps): JSX.Element;
