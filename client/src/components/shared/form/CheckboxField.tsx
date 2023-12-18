import { useField, useFormikContext, FormikProps } from 'formik';
import React, { FC, useContext, useCallback, useMemo, ReactNode } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { FormError } from './FormError';

import { GroupContext } from './Group';

export type FormCheckboxFieldProps = Omit<FormControlProps, 'type'> &
  JSX.IntrinsicElements['input'] & {
    name: string;
    label: string | ReactNode;
  };

const CheckboxFieldGroup: FC<FormCheckboxFieldProps> = ({
  custom,
  ...props
}: FormCheckboxFieldProps) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<FormikProps<FormCheckboxFieldProps>>();
  const { name: groupName = '' } = useContext(GroupContext);
  const [{ name, onBlur }] = useField(props);

  const isChecked = useMemo(
    () =>
      (values as any)[groupName]?.includes(name) ??
      (values as any)[name] ??
      false,
    [groupName, name, values]
  );
  const isInvalid =
    Boolean((errors as any)[groupName]) && (touched as any)[groupName];
  const handleChange = useCallback(
    (e) => {
      if (props.onChange) {
        props.onChange(e);
      }
      setFieldTouched(groupName, true);
      setFieldValue(
        groupName,
        isChecked
          ? (values as any)[groupName].filter((value: string) => value !== name)
          : [...(values as any)[groupName], name]
      );
    },
    [groupName, isChecked, name, props, setFieldTouched, setFieldValue, values]
  );
  return (
    <Form.Check
      {...props}
      id={name}
      type="checkbox"
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

const CheckboxFieldSolo: FC<FormCheckboxFieldProps> = ({
  custom,
  ...props
}: FormCheckboxFieldProps) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<FormikProps<FormCheckboxFieldProps>>();
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
      type="checkbox"
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

export const CheckboxField: FC<FormCheckboxFieldProps> = ({
  custom,
  ...props
}: FormCheckboxFieldProps) => {
  const { values } = useFormikContext<FormikProps<FormCheckboxFieldProps>>();
  const { name: groupName = '' } = useContext(GroupContext);
  const [{ name }] = useField(props);
  if ((values as any)[groupName]?.includes(name)) {
    return <CheckboxFieldGroup {...props} custom={custom} />;
  }
  return <CheckboxFieldSolo {...props} custom={custom} />;
};
