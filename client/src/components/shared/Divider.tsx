import React from 'react';
const dividerStyles = {
  width: 'calc(100% + 3rem)',
  margin: '0 -1.5rem',
  border: 'none',
  borderTop: '0.1rem solid grey',
};
export const Divider = () => <hr style={dividerStyles} />;

const tooltipDividerStyles = {
  ...dividerStyles,
  margin: '0.8rem -1.5rem',
};
export const TooltipDivider = () => <hr style={tooltipDividerStyles} />;
