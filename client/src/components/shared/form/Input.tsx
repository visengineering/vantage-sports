import { Field, useField } from 'formik';
import React, { FC } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { Group } from './FormGroup';
import { FormFieldProps, FormGroupCustomProps } from '../../../types';
import { isNumeric } from '../utils/is-numeric';

export type FormInputFieldProps = FormControlProps &
  JSX.IntrinsicElements['input'] &
  FormFieldProps &
  FormGroupCustomProps & {
    groupClassName?: string;
    modifyBeforeSave?: (
      value: any,
      event: React.ChangeEvent<HTMLInputElement>
    ) => any;
  };

export const Input: FC<FormInputFieldProps> = ({
  label,
  helpText,
  containerGridArea,
  groupClassName,
  invertedLabel,
  errorOutsideGroup,
  noErrorText,
  groupChildren,
  modifyBeforeSave,
  ...props
}: FormInputFieldProps) => {
  const [{ name, value, onBlur }, { error, touched }, { setValue }] = useField(
    props.name
  );
  return (
    <Group
      containerGridArea={containerGridArea}
      name={name}
      type={props.type}
      controlId={name}
      label={label}
      invertedLabel={invertedLabel}
      errorOutsideGroup={errorOutsideGroup}
      noErrorText={noErrorText}
      helpText={helpText}
      className={groupClassName}
      groupChildren={groupChildren}
    >
      <Field
        component={Form.Control}
        {...props}
        form={undefined}
        field={undefined}
        name={name}
        value={value}
        isInvalid={Boolean(error) && touched}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (props.type === 'checkbox') {
            setValue(!value);
            return;
          }
          const parseRawValue =
            props.type === 'number' && isNumeric(event.target.value)
              ? parseInt(event.target.value)
              : event.target.value;
          const newValue = modifyBeforeSave
            ? modifyBeforeSave(parseRawValue, event)
            : parseRawValue;
          setValue(newValue);
        }}
        onBlur={onBlur}
      />
    </Group>
  );
};
