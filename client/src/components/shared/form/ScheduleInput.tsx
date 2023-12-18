import { useField } from 'formik';
import React, { FC, useMemo } from 'react';
import { AvailabilityField } from 'src/types';
import { DayAvailabilityTimeRangeField } from './DayAvailabilityTimeRangeField';
import { dayNrToWeekText } from '../../pages/Event/availability/create/helpers';
import { ErrorMessageBox } from './FormError';
import { Stack } from '../Stack';

const getDayInputName = (arrayName: string, dayNr: number) =>
  `${arrayName}.${dayNr}`;
const weekdaysArray = [1, 2, 3, 4, 5, 6, 7];

export const ScheduleInput: FC<{ name: string }> = ({ name }) => {
  const [{ value }, { error: fieldError, touched }, { setValue }] =
    useField<AvailabilityField[]>(name);

  const weekdaysSelected = useMemo(
    () => weekdaysArray.filter((nr) => !!value[nr]),
    [value]
  );
  return (
    <Stack flow="row" gap={1}>
      <div className="row">
        {weekdaysSelected.map((dayNr: number) => (
          <div className="col-md-6 mb-4" key={dayNr}>
            <DayAvailabilityTimeRangeField
              name={getDayInputName(name, dayNr)}
              day={dayNrToWeekText(dayNr)}
              onClose={() => {
                const newAvailabilityArray = value.map(
                  (d: AvailabilityField, index: number) =>
                    index === dayNr ? null : d
                );
                setValue(
                  newAvailabilityArray.filter(Boolean).length
                    ? (newAvailabilityArray as AvailabilityField[])
                    : []
                );
              }}
            />
          </div>
        ))}
        {fieldError && touched && typeof fieldError === 'string' && (
          <ErrorMessageBox extraClasses="w-100">{fieldError}</ErrorMessageBox>
        )}
      </div>
    </Stack>
  );
};
