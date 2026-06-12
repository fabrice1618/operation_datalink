import * as React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export interface CardHeaderProps {
  label?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export interface CardBodyProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Plain terminal panel (frame-line border); compose CardHeader/CardBody.
 * @startingPoint section="Core" subtitle="Terminal panel with header + body" viewport="700x200"
 */
export function Card(props: CardProps): JSX.Element;
export function CardHeader(props: CardHeaderProps): JSX.Element;
export function CardBody(props: CardBodyProps): JSX.Element;
