import { useField } from 'formik';
import React, { FC } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { FormFieldProps } from '../../../types';

import { Group } from './Group';

export type FormTextareaFieldProps = Omit<FormControlProps, 'type'> &
  Omit<JSX.IntrinsicElements['textarea'], 'ref'> &
  FormFieldProps;

export const Textarea: FC<FormTextareaFieldProps> = ({
  label,
  helpText,
  ...props
}: FormTextareaFieldProps) => {
  const [{ name, value, onBlur }, { error, touched }, { setValue }] =
    useField(props);
  return (
    <Group
      name={name}
      controlId={name}
      label={label}
      helpText={helpText}
      error={error}
    >
      <Form.Control
        {...props}
        as="textarea"
        name={name}
        value={value?.toString()}
        isInvalid={Boolean(error) && touched}
        onChange={(event) => {
          setValue((event as any)?.target?.value);
        }}
        onBlur={onBlur}
      />
    </Group>
  );
};
