import React, { FC } from 'react';
import { Options } from 'react-select';
import { SelectField } from './SelectField';
import { AvailabilityLengthEnum, FormFieldProps } from '../../../types';

export const availabilityLengthOptions: Options<{
  value: string;
  label: string;
}> = [
  {
    label: 'Until end of next week',
    value: AvailabilityLengthEnum.ONE_WEEK,
  },
  {
    label: 'For next 2 weeks',
    value: AvailabilityLengthEnum.TWO_WEEKS,
  },
  {
    label: 'For next 3 weeks',
    value: AvailabilityLengthEnum.THREE_WEEKS,
  },
  {
    label: 'For next 4 weeks',
    value: AvailabilityLengthEnum.FOUR_WEEKS,
  },
  {
    label: 'For next 5 weeks',
    value: AvailabilityLengthEnum.FIVE_WEEKS,
  },
  {
    label: 'For next 6 weeks',
    value: AvailabilityLengthEnum.SIX_WEEKS,
  },
];
export const AvailabilityLengthField: FC<
  FormFieldProps & {
    containerGridArea?: string;
  }
> = ({ name, label = 'Availability Length*', containerGridArea, helpText }) => (
  <SelectField
    containerGridArea={containerGridArea}
    name={name}
    label={label}
    helpText={helpText}
    options={availabilityLengthOptions}
  />
);
