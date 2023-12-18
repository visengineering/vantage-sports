import React, { FC } from 'react';
import { FieldArray, useField, useFormikContext } from 'formik';
import { CreateTimeSlotInput } from '../../../types';
import { Button } from 'react-bootstrap';
import { TimeslotInput } from './TimeslotInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Stack } from '../Stack';
import { ErrorMessageBox } from './FormError';
import '../../../styles/timeslotInput.scss';

export const emptyTimeslot: CreateTimeSlotInput = {
  duration: '',
  startDate: '',
};

const isTrashBinDisabled = (values: { timeslots?: CreateTimeSlotInput[] }) =>
  values.timeslots && values.timeslots.length < 2;

export const TimeslotsCreator: FC<{ name: string }> = ({ name }) => {
  const { values } = useFormikContext<{ timeslots?: CreateTimeSlotInput[] }>();
  const [, { error: fieldError, touched }] = useField(name);

  return (
    <div className="form-group">
      <label htmlFor={name}>Training calendar*</label>
      <FieldArray
        name={name}
        render={(arrayHelpers) => (
          <Stack flow="row" gap={1}>
            {values.timeslots &&
              values.timeslots.length > 0 &&
              values.timeslots.map((timeslot, index) => (
                <div key={index}>
                  <div className="timeslot-grid">
                    <TimeslotInput name={`timeslots.${index}`} />
                    <div className="timeslot-button">
                      <Button
                        type="button"
                        disabled={isTrashBinDisabled(values)}
                        onClick={() => arrayHelpers.remove(index)} // remove a timeslot from the list
                      >
                        <FontAwesomeIcon
                          size="lg"
                          style={{ height: '34px' }}
                          className="icon-trash"
                          icon={faTrash as any}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            <Button
              type="button"
              size={
                values.timeslots && values.timeslots.length > 0 ? 'sm' : 'lg'
              }
              onClick={() => arrayHelpers.push(emptyTimeslot)}
              className={`btn btn-primary`}
            >
              {values.timeslots && values.timeslots.length > 0
                ? 'Add another date'
                : 'Add date'}
            </Button>
          </Stack>
        )}
      />
      {fieldError && touched && typeof fieldError === 'string' && (
        <ErrorMessageBox>{fieldError}</ErrorMessageBox>
      )}
    </div>
  );
};
