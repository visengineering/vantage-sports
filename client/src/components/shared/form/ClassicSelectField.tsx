import { Field, useField } from 'formik';
import React, { FC, ReactNode } from 'react';
import { FormControlProps } from 'react-bootstrap';
import { Group } from './FormGroup';
import { FormFieldProps } from '../../../types';
import { useErrorHandler } from '../hooks/use-error-handler';

export type FormClassicSelectFieldProps = FormControlProps &
  JSX.IntrinsicElements['select'] &
  FormFieldProps & {
    options: { value: number | string; label: string }[];
    containerGridArea?: string;
    groupClassName?: string;
    invertedLabel?: boolean;
    errorOutsideGroup?: boolean;
    noErrorText?: boolean;
    groupChildren?: ReactNode;
  };

export const ClassicSelectField: FC<FormClassicSelectFieldProps> = ({
  label,
  helpText,
  containerGridArea,
  groupClassName,
  invertedLabel,
  errorOutsideGroup,
  noErrorText,
  groupChildren,
  options,
  ...props
}: FormClassicSelectFieldProps) => {
  const [{ name, value, onBlur }, { error, touched }, { setValue }] = useField(
    props.name
  );
  const [field, meta] = useField(props);
  const [showError] = useErrorHandler(field, meta);
  return (
    <Group
      containerGridArea={containerGridArea}
      name={name}
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
        component={(props: FormClassicSelectFieldProps) => (
          <select
            as="select"
            defaultValue={props.defaultValue}
            {...props}
            className={`form-control form-select${
              showError ? ' border-warning-custom' : ''
            }`}
          >
            <option
              key={'referral-source-select-0'}
              value={-1}
              disabled
              selected={
                !options.some(({ value: optionValue }) => optionValue === value)
              }
            >
              {label}
            </option>
            {options.map(({ label, value: optionValue }) => (
              <option
                key={
                  'referral-source-select-' +
                  label.toString().replace(/[^a-z0-9]/gi, '')
                }
                value={optionValue}
              >
                {label}
              </option>
            ))}
          </select>
        )}
        {...props}
        form={undefined}
        field={undefined}
        name={name}
        value={value}
        isInvalid={Boolean(error) && touched}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setValue(event.target.value);
        }}
        onBlur={onBlur}
      />
    </Group>
  );
};
