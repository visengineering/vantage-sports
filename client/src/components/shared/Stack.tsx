import React, { CSSProperties, FC } from 'react';

export const Stack: FC<{
  gap?: number | [number, number];
  flow?: 'row' | 'column';
  inline?: boolean;
  style?: CSSProperties;
  alignItems?:
    | 'center'
    | 'baseline'
    | 'start'
    | 'end'
    | 'stretch'
    | 'flex-start'
    | 'flex-end';
  justifyContent?:
    | 'normal'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'end'
    | 'start';
  justifyItems?: 'legacy' | 'center' | 'start' | 'end' | 'stretch';
  textAlign?: 'center' | 'start' | 'end' | 'left' | 'right' | 'justify';
  autoColumns?: string;
  templateColumns?: string;
  autoRows?: string;
  templateRows?: string;
  minHeight?: number;
}> = ({
  gap,
  flow,
  inline,
  alignItems,
  justifyContent,
  justifyItems,
  textAlign,
  autoColumns,
  templateColumns,
  autoRows,
  templateRows,
  children,
  minHeight,
  style,
}) => (
  <div
    style={{
      minHeight: minHeight || undefined,
      display: inline ? 'inline-grid' : 'grid',
      gridAutoFlow: flow,
      gridGap: Array.isArray(gap) ? `${gap[0]}rem ${gap[1]}rem` : `${gap}rem`,
      alignItems,
      justifyContent,
      gridAutoColumns: autoColumns,
      gridTemplateColumns: templateColumns,
      gridAutoRows: autoRows,
      gridTemplateRows: templateRows,
      justifyItems,
      textAlign,
      ...style,
    }}
  >
    {children}
  </div>
);
