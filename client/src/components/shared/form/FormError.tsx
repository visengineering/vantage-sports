import React from 'react';
import { ErrorMessage } from 'formik';
import { FC } from 'react';

export const ErrorMessageBox: FC<{ extraClasses?: string }> = ({
  extraClasses,
  children,
}) => (
  <p className={`text text-danger text-small m-2 ${extraClasses}`}>
    {children}
  </p>
);

export const FormError: FC<{ name: string }> = ({ name }) => (
  <ErrorMessage
    name={name}
    component={({ children }) => <ErrorMessageBox>{children}</ErrorMessageBox>}
  />
);
