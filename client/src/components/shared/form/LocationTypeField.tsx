import React, { FC, useEffect } from 'react';
import { Options } from 'react-select';
import { SelectField } from './SelectField';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { FormFieldProps, EventSessionType } from 'src/types';

const locationTypeOptions: Options<{
  value: EventSessionType;
  label: EventSessionType;
}> = [
  {
    label: 'In-Person',
    value: 'In-Person',
  },
  {
    label: 'Virtual',
    value: 'Virtual',
  },
];
export const LocationTypeSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    valueTracker?: string;
  }
> = ({
  name,
  label = 'Location Type*',
  placeholder,
  containerGridArea,
  helpText,
  withLabel = true,
  onChange,
  valueTracker,
}) => {
  const [field, value, { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  useEffect(() => {
    if (!valueTracker) {
      setValue(initialValue);
    }
  }, [valueTracker]);

  return (
    <SelectField
      containerGridArea={containerGridArea}
      name={name}
      placeholder={placeholder}
      label={withLabel ? label : undefined}
      helpText={helpText}
      options={locationTypeOptions}
      onChangeCb={onChange}
    />
  );
};
