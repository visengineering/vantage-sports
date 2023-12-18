import React, { FC, useContext, useCallback, useMemo, ReactNode } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { useField, useFormikContext, FormikProps } from 'formik';
import { FormError } from './FormError';

type FormCheckboxSwitchFieldProps = Omit<FormControlProps, 'type'> &
  JSX.IntrinsicElements['input'] & {
    name: string;
    label: string | ReactNode;
  };
export const SwitchCheckButton: FC<FormCheckboxSwitchFieldProps> = ({
  custom,
  ...props
}: FormCheckboxSwitchFieldProps) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<FormikProps<FormCheckboxSwitchFieldProps>>();
  const [{ name, onBlur }] = useField(props);

  const isChecked = useMemo(
    () => (values as any)[name] ?? false,
    [name, values]
  );
  const isInvalid = Boolean((errors as any)[name]) && (touched as any)[name];
  const handleChange = useCallback(
    (e) => {
      if (props.onChange) {
        props.onChange(e);
      }
      setFieldTouched(name, true);
      setFieldValue(name, !(values as any)[name]);
    },

    [isChecked, name, props, setFieldTouched, setFieldValue, values]
  );
  return (
    <Form.Check
      {...props}
      id={name}
      type="switch"
      className={`${isInvalid ? 'is-invalid' : ''}`}
      custom={custom}
    >
      <Form.Check.Input
        {...props}
        type="checkbox"
        checked={isChecked}
        isInvalid={isInvalid}
        onChange={handleChange}
        onBlur={onBlur}
      />
      <Form.Check.Label title={props.title}>{props.label}</Form.Check.Label>
      <FormError name={name} />
    </Form.Check>
  );
};
