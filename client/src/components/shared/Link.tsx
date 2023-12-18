import { Link as RouterLink, LinkProps } from 'react-router-dom';
import React, { FC } from 'react';

export const Link: FC<LinkProps & { variant?: 'blue' }> = ({
  children,
  variant,
  ...params
}) => {
  return (
    <RouterLink
      {...params}
      style={variant === 'blue' ? { color: '#0000EE' } : params.style}
    >
      {children}
    </RouterLink>
  );
};
