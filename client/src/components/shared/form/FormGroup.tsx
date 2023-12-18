import { useField } from 'formik';
import React, { FC, createContext, ReactNode } from 'react';
import { Form, FormGroupProps } from 'react-bootstrap';
import { OnShowError, useErrorHandler } from '../hooks/use-error-handler';
import { Stack } from '../Stack';
import { ErrorMessageBox } from './FormError';
import { FormFieldProps, FormGroupCustomProps } from 'src/types';

type GroupContextType = {
  name?: string;
};

export type FormGroupFieldProps = FormGroupProps &
  FormFieldProps &
  FormGroupCustomProps & {
    error?: string;
    onShowError?: OnShowError;
    type?: JSX.IntrinsicElements['input']['type'];
  };

export const GroupContext = createContext<GroupContextType>({});

export const Group: FC<FormGroupFieldProps> = ({
  label,
  helpText,
  containerGridArea,
  invertedLabel,
  children,
  onShowError,
  errorOutsideGroup,
  noErrorText,
  groupChildren = null,
  type,
  ...props
}: FormGroupFieldProps) => {
  const [field, meta] = useField(props);
  const [showError, fieldError] = useErrorHandler(field, meta, onShowError);
  return (
    <GroupContext.Provider value={{ name: props.name }}>
      <Form.Group
        style={containerGridArea ? { gridArea: containerGridArea } : undefined}
        {...props}
      >
        {type === 'checkbox' ? (
          <Stack flow="column" gap={1}>
            {label && invertedLabel && <Form.Label>{label}</Form.Label>}
            {children}
            {label && !invertedLabel && <Form.Label>{label}</Form.Label>}
          </Stack>
        ) : (
          <>
            {label && !invertedLabel && <Form.Label>{label}</Form.Label>}
            {children}
            {label && invertedLabel && <Form.Label>{label}</Form.Label>}
          </>
        )}
        {!noErrorText && showError && !errorOutsideGroup && (
          <ErrorMessageBox>{fieldError}</ErrorMessageBox>
        )}
        {helpText && <Form.Text muted>{helpText}</Form.Text>}
        {groupChildren}
      </Form.Group>
      {!noErrorText && showError && errorOutsideGroup && (
        <ErrorMessageBox>{fieldError}</ErrorMessageBox>
      )}
    </GroupContext.Provider>
  );
};
