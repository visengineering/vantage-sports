import React, { FC } from 'react';
import { SelectField } from './SelectField';
import { FormFieldProps } from 'src/types';

const schoolClass = [
  { label: 'Freshman', value: 'freshman' },
  { label: 'Sophmore', value: 'sophmore' },
  { label: 'Junior', value: 'junior' },
  { label: 'Senior', value: 'senior' },
  { label: 'Post Collegiate', value: 'post' },
  { label: 'Other', value: 'other' },
];

export const ClassSelect: FC<
  FormFieldProps & {
    containerGridArea?: string;
  }
> = ({ name, label = 'Class', helpText, containerGridArea }) => (
  <SelectField
    containerGridArea={containerGridArea}
    name={name}
    label={label}
    helpText={helpText}
    options={schoolClass}
  />
);
