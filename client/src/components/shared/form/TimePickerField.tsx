import React, { FC } from 'react';
import { Options } from 'react-select';
import { SelectField } from './SelectField';
import moment from 'moment';
import { FormFieldProps } from 'src/types';

const timeOptionsWholeDay: Options<{
  value: string;
  label: string;
}> = [
  {
    label: 'Not Available',
    value: '',
  },
  ...Array.from(Array(24).keys())
    .map((nr) => (nr.toString().length === 1 ? `0${nr}` : nr))
    .flatMap((nr) => [
      {
        label: `${moment(`${nr}:00`, 'HHmm').format('hh:mm A')}`,
        value: `${nr}00`,
      },
      {
        label: moment(`${nr}:30`, 'HHmm').format('hh:mm A'),
        value: `${nr}30`,
      },
    ]),
];
export const TimePickerField: FC<
  FormFieldProps & {
    containerGridArea?: string;
  }
> = ({ name, label = 'Time', helpText, containerGridArea }) => {
  return (
    <SelectField
      containerGridArea={containerGridArea}
      name={name}
      label={label}
      helpText={helpText}
      options={timeOptionsWholeDay}
      emptyLabel="Not Available"
    />
  );
};
