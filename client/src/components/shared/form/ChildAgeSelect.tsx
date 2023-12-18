import React, { FC } from 'react';
import { SelectField } from './SelectField';
import { FormFieldProps } from 'src/types';

const childAgeOptions = [...Array(17).keys()].map((v) => ({
  label: (v + 1).toString(),
  value: v + 1,
}));

export const ChildAgeSelect: FC<
  FormFieldProps & {
    containerGridArea?: string;
  }
> = ({ name, label = 'Child Age*', helpText, containerGridArea }) => (
  <SelectField
    containerGridArea={containerGridArea}
    name={name}
    label={label}
    helpText={helpText}
    options={childAgeOptions}
  />
);
