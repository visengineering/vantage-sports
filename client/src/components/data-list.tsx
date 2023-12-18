import React, { Children, FC, ReactNode } from 'react';
import { isFragment } from 'react-is';
const DataItem: FC = ({ children }) => (
  <div style={{ lineHeight: '1.6' }} className="dataitem">
    {children}
  </div>
);

export const DataItems: FC = ({ children }) => {
  let index = 0;
  return (
    <>
      {Children.map(children, function recursive(child): ReactNode {
        if (isFragment(child)) {
          return Children.map(child.props.children, recursive);
        } else if (child) {
          const isOdd = index % 2 === 0;
          index += 1;
          return (
            <DataItem>
              {child}
              {isOdd && ':'}
            </DataItem>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export const DataList: FC = ({ children }) => (
  <div className="datalist">{children}</div>
);
