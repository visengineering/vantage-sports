import { Field, FieldProps } from 'formik';
import React, { ReactNode } from 'react';
import StateManagedSelect, { Options } from 'react-select';
import Select from 'react-select';
import { FormFieldProps } from 'src/types';
import { useMemoOne } from 'use-memo-one';
import { Group } from './FormGroup';

const wideStyles = {
  minWidth: '100%',
  width: '100%',
};
const clearSpacing = {
  padding: '0',
  margin: '0',
};
const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    borderBottom: '1px dotted #1836DD',
    paddingBottom: '5px',
    color: state.isSelected ? 'white' : '#000080',
    background: state.isSelected && '#000080',
    overflowX: 'hidden',
  }),
  input: (provided: any, state: any) => ({
    ...provided,
    ...wideStyles,
    ...clearSpacing,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    ...clearSpacing,
    paddingRight: '12px',
  }),
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    return { ...provided, opacity, transition, ...clearSpacing };
  },
  control: (styles: any) => ({
    ...styles,
    ...wideStyles,
    border: 0,
    height: 'auto',
    background: '#fff 0% 0% no-repeat padding-box',
    boxShadow: '0px 0px 9px #0000001c',
    borderRadius: '5px',
    fontWeight: '300',
    padding: '7px 1.45rem',
  }),
};

const SelectFieldInner: React.FC<
  StateManagedSelect &
    FieldProps & {
      emptyLabel: string;
      options: Options<{ value: string; label: string }>;
      placeholder: string;
      onChangeCb?: (v: any) => void;
      changeTextBoolean: boolean;
      locationAPIValue?: string;
    }
> = ({
  options,
  field,
  form,
  placeholder = 'Select...',
  onChangeCb,
  emptyLabel = 'Search...',
  changeTextBoolean = false,
  locationAPIValue = null,
}) => {
  const value = useMemoOne(() => {
    // ONLY VALID FOR STATE SELECT FIELD FOR NOW
    if (locationAPIValue != null)
      return { label: locationAPIValue, value: locationAPIValue };

    return changeTextBoolean
      ? { label: placeholder, value: '' }
      : field.value
      ? options.find((option) => option.value === field.value)
      : { label: placeholder || emptyLabel, value: '' };
  }, [field, options, emptyLabel]);

  return (
    <Select
      {...field}
      options={options}
      name={field.name}
      value={value}
      onChange={(option) => {
        form.setFieldValue(field.name, option?.value);
        if (onChangeCb) {
          onChangeCb(option?.value);
        }
      }}
      onBlur={field.onBlur}
      styles={customStyles}
    />
  );
};

export const SelectField: React.FC<
  FormFieldProps & {
    emptyLabel?: string;
    containerGridArea?: string;
    groupClassName?: string;
    invertedLabel?: boolean;
    errorOutsideGroup?: boolean;
    noErrorText?: boolean;
    groupChildren?: ReactNode;
    options: Options<{ value: string | number; label: string }>;
    placeholder?: string;
    onChangeCb?: (v: any) => void;
  }
> = ({
  name,
  label,
  containerGridArea,
  helpText,
  options,
  placeholder,
  onChangeCb,
  emptyLabel = 'Search...',
  groupChildren,
  noErrorText,
  errorOutsideGroup,
  invertedLabel,
}) => (
  <Group
    containerGridArea={containerGridArea}
    groupChildren={groupChildren}
    noErrorText={noErrorText}
    errorOutsideGroup={errorOutsideGroup}
    invertedLabel={invertedLabel}
    name={name}
    controlId={name}
    label={label}
    helpText={helpText}
  >
    <Field
      name={name}
      emptyLabel={emptyLabel}
      placeholder={placeholder}
      onChangeCb={onChangeCb}
      component={SelectFieldInner}
      options={options}
    />
  </Group>
);
