import { useField } from 'formik';
import React, { FC, createContext } from 'react';
import { Form, FormGroupProps } from 'react-bootstrap';
import { FormFieldProps } from 'src/types';

type GroupContextType = {
  name?: string;
};

export type FormGroupFieldProps = FormGroupProps &
  FormFieldProps & {
    error?: string;
  };

export const GroupContext = createContext<GroupContextType>({});

export const Group: FC<FormGroupFieldProps> = ({
  label,
  helpText,
  error,
  children,
  ...props
}: FormGroupFieldProps) => {
  const [, { error: fieldError }] = useField(props);
  return (
    <GroupContext.Provider value={{ name: props.name }}>
      <Form.Group {...props}>
        {label && <Form.Label>{label}</Form.Label>}
        {children}
        <Form.Control.Feedback type="invalid">
          {error ?? fieldError}
        </Form.Control.Feedback>
        {helpText && <Form.Text muted>{helpText}</Form.Text>}
      </Form.Group>
    </GroupContext.Provider>
  );
};
