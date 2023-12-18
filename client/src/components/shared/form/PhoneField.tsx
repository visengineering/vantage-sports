import React, { FC, ReactNode } from 'react';
import PhoneInput from 'react-phone-input-2';
import startsWith from 'lodash.startswith';
import { useField } from 'formik';
import { Stack } from '../Stack';
import { Group } from './FormGroup';

export const PhoneField: FC<{
  name: string;
  placeholder?: string;
  label?: ReactNode;
  componentNext?: ReactNode;
  flow?: 'row' | 'column';
  justifyItems?: 'legacy' | 'center' | 'start' | 'end' | 'stretch';
  gap?: number;
}> = ({
  name,
  placeholder,
  label = 'Phone Number',
  componentNext,
  flow = 'column',
  justifyItems,
  gap = 1,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <Group name={name} controlId={name} label={label}>
      <Stack
        gap={gap}
        flow={flow}
        autoColumns="1fr auto"
        justifyItems={justifyItems}
      >
        <PhoneInput
          enableSearch
          country="us"
          placeholder={placeholder}
          inputClass="form-control w-100 phone-input"
          inputStyle={{ textIndent: '3em' }}
          buttonStyle={{ width: '3em', borderRadius: '5px' }}
          value={field.value}
          inputProps={{ required: false }}
          isValid={(number, country, countries) => {
            const cond1 =
              countries.some((country: any) => {
                return (
                  startsWith(number, country.dialCode) ||
                  startsWith(country.dialCode, number)
                );
              }) &&
              number.length > 9 &&
              number.length <= 13;
            if (!cond1 && !meta.error) {
              helpers.setError(
                'Please enter the phone number as per given format.'
              );
            }
            return cond1;
          }}
          onChange={(value, country, formattedvalue) => {
            helpers.setValue(value);
          }}
          specialLabel=""
          autocompleteSearch
        />
        {componentNext}
      </Stack>
    </Group>
  );
};
