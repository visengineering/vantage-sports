import React, { FC } from 'react';
import { Form } from 'react-bootstrap';
import { BucketSortedTimeslots } from '../pages/Event/event-timeslots/details/helpers';

/**
 * WARNING!!!!
 * DEPRECATED. DO NOT USE THIS COMPONENT.
 * USE: DateField
 */
const DateSelect: FC<{
  disabled?: boolean;
  placeholder?: string;
  selected: string;
  dates: BucketSortedTimeslots;
  setTimeslot: (date: string) => void;
}> = ({ disabled, placeholder, selected, dates, setTimeslot }) => {
  let placeholderText = 'Select ..';
  if (placeholder) {
    placeholderText = placeholder;
  }

  return (
    <div className="form-group">
      <Form.Control
        name="sport"
        id="sport"
        as="select"
        disabled={disabled}
        value={selected}
        defaultValue={selected}
        onChange={(e) => {
          setTimeslot(e.target.value);
        }}
      >
        {Object.keys(dates).map((date, index) => (
          <option key={index} value={date}>
            {date}
          </option>
        ))}
      </Form.Control>
    </div>
  );
};

export default DateSelect;
