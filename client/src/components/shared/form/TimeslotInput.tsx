import React, { FC } from 'react';
import { useMemoOne } from 'use-memo-one';
import { DatePickerField } from './DateField';
import { Input } from './Input';
import '../../../styles/timeslotInput.scss';

export const TimeslotInput: FC<{ name: string }> = ({ name }) => {
  const startDateName = useMemoOne(() => `${name}.startDate`, [name]);
  const durationName = useMemoOne(() => `${name}.duration`, [name]);

  return (
    <>
      <label
        className="timeslot-label"
        style={{ gridArea: 'start-label' }}
        htmlFor={startDateName}
      >
        Start Date*
      </label>
      <DatePickerField containerGridArea="start-input" name={startDateName} />

      <label
        className="timeslot-label"
        style={{ gridArea: 'duration-label' }}
        htmlFor={durationName}
      >
        Duration (minutes)*
      </label>
      <Input
        containerGridArea="duration-input"
        type="number"
        name={durationName}
      />
    </>
  );
};
