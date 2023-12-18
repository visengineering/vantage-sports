import React, { FC, Children, ReactNode, CSSProperties } from 'react';
import { isFragment } from 'react-is';

type Props = {
  gap: number;
  alignItems?: 'center' | 'baseline' | 'stretch';
  justifyContent?: 'normal' | 'space-between' | 'end';
  flexDirection?: 'column' | 'row';
  templateColumns?: string;
  style?: CSSProperties;
  styleC?: CSSProperties;
};

// sadly the gap rule is currently not really supported for flex
// that's why we need this workaround
export const GroupWrap: FC<Props> = ({
  children,
  styleC = {},
  style = {},
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: props.flexDirection ?? 'row',
        flexWrap: 'wrap',
        ...(Children.map(children, (c) => null)?.length
          ? { margin: `-${props.gap / 2}rem` }
          : {}),
        alignItems: props.alignItems ?? 'center',
        justifyContent: props.justifyContent ?? 'normal',
        ...styleC,
      }}
    >
      {Children.map(children, function recursive(child): ReactNode {
        if (isFragment(child)) {
          return Children.map(child.props.children, recursive);
        } else if (child) {
          return (
            <div style={{ margin: `${props.gap / 2}rem`, ...style }}>
              {child}
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};
