import React, { FC, ReactNode, useEffect } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { FormFieldProps } from 'src/types';
import { Input } from './Input';

export const USPhoneNumberField: FC<
  JSX.IntrinsicElements['input'] &
    FormFieldProps & {
      containerGridArea?: string;
      groupClassName?: string;
      invertedLabel?: boolean;
      errorOutsideGroup?: boolean;
      noErrorText?: boolean;
      groupChildren?: ReactNode;
      placeholder?: string;
      withLabel?: boolean;
      valueTracker?: string;
    }
> = ({
  name,
  label = 'User Type*',
  placeholder,
  containerGridArea,
  helpText,
  withLabel = true,
  valueTracker,
  groupChildren,
  groupClassName,
  noErrorText,
  errorOutsideGroup,
  invertedLabel,
  type,
  autoComplete,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  useEffect(() => {
    if (!valueTracker) {
      setValue(initialValue);
    }
  }, [valueTracker]);

  return (
    <Input
      type={type ?? 'tel'}
      containerGridArea={containerGridArea}
      groupChildren={groupChildren}
      errorOutsideGroup={errorOutsideGroup}
      invertedLabel={invertedLabel}
      noErrorText={noErrorText}
      name={name}
      groupClassName={groupClassName}
      placeholder={placeholder}
      label={withLabel ? label : undefined}
      helpText={helpText}
      modifyBeforeSave={(
        value: any,
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const onlyNumbers = value.toString().replace(/\D/g, '');
        const numbers =
          onlyNumbers.length > 10 ? onlyNumbers.substring(0, 10) : onlyNumbers;

        if (numbers.length === 1) {
          return numbers;
        } else if (numbers.length > 1 && numbers.length < 4) {
          event.target.value = '(' + numbers + ')';
          if (numbers.length === 2) {
            event.target.setSelectionRange(3, 3);
          }
          if (numbers.length === 3) {
            event.target.setSelectionRange(4, 4);
          }
          return '(' + numbers + ')';
        } else if (numbers.length > 3 && numbers.length < 7) {
          return '(' + numbers.substring(0, 3) + ') ' + numbers.substring(3, 6);
        } else if (numbers.length > 6 && numbers.length < 11) {
          return (
            '(' +
            numbers.substring(0, 3) +
            ') ' +
            numbers.substring(3, 6) +
            '-' +
            numbers.substring(6, 10)
          );
        }
      }}
      autoComplete={autoComplete}
    />
  );
};
