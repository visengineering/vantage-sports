import React, { FC, useCallback, useMemo } from 'react';
import { getIn, useField, useFormikContext } from 'formik';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import { useNow } from '../hooks/use-now';
import { Group } from './FormGroup';
import { FormFieldProps } from 'src/types';

import 'flatpickr/dist/themes/airbnb.css';

type DatePickerFieldProps = FormFieldProps & {
  options?: any;
  containerGridArea?: string;
};

const DAY_IN_MS = 86400000;

export const DatePickerField: FC<DatePickerFieldProps> = ({
  name,
  helpText,
  containerGridArea,
  label,
  options = {},
}: DatePickerFieldProps) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const now = new Date(useNow() - DAY_IN_MS);
  const nowPlus2Years = useMemo(
    () => moment(now).add(2, 'years').toDate(),
    [now]
  );
  const onChange = useCallback(
    (val: Date[]) => {
      if (!val.length) {
        setFieldValue(name, '');
      } else if (val[0].toUTCString() !== new Date(field.value).toUTCString()) {
        setFieldValue(name, val[0]);
      }
    },
    [field]
  );
  return (
    <Group
      containerGridArea={containerGridArea}
      name={name}
      controlId={name}
      label={label}
      helpText={helpText}
    >
      <Flatpickr
        options={{
          enableTime: true,
          minuteIncrement: 15,
          monthSelectorType: 'dropdown',
          formatDate: (date) => {
            return moment(date, 'HHmm').format('MM/DD/YYYY hh:mm A');
          },
          enable: [
            {
              from: now,
              to: nowPlus2Years,
            },
          ],
          ...options,
        }}
        className="form-control date-input"
        value={field.value}
        onChange={onChange}
        disabled={false}
      />
    </Group>
  );
};
