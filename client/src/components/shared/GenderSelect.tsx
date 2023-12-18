import React, { FC } from 'react';
import { FormFieldProps } from 'src/types';
import { SelectField } from './form/SelectField';

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-Binary', value: 'Non-Binary' },
];

export const GenderSelect: FC<
  FormFieldProps & {
    containerGridArea?: string;
  }
> = ({ name, label = 'Gender', containerGridArea, helpText }) => (
  <SelectField
    containerGridArea={containerGridArea}
    name={name}
    label={label}
    helpText={helpText}
    options={genders}
  />
);
