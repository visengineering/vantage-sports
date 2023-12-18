import { useFormikContext } from 'formik';
import moment from 'moment';
import React, { Fragment, useMemo } from 'react';
import { DataItems, DataList } from 'src/components/data-list';
import { availabilityLengthOptions } from 'src/components/shared/form/AvailabilityLengthField';
import {
  AvailabilityField,
  CreateAvailabilityEventFormValues,
} from 'src/types';
import {
  bucketSortTimeslots,
  computeTimeslots,
  dayNrToWeekText,
} from './helpers';

export const AvailabilitySummary = () => {
  const { values } = useFormikContext<CreateAvailabilityEventFormValues>();
  const timeslots = useMemo<
    | {
        [key: string]: string[];
      }
    | string
  >(() => {
    if (
      !values.availability ||
      !values.availability.length ||
      !values.availabilityLength ||
      !values.duration
    ) {
      return 'To see concrete date and times please select Availability Length, Duration and set at least one weekday of Availability.';
    }
    if (
      !values.availability
        .filter(Boolean /* under index 0 there is a null */)
        .every((a) => (a as AvailabilityField | null) && a.to && a.from)
    ) {
      return "To see concrete date and times please select both 'From' and 'To' times for all weekdays of your availability.";
    }
    if (values.duration < 1) {
      return 'To see concrete date and times please select Duration as a positive value.';
    }
    return bucketSortTimeslots(
      computeTimeslots(
        values.availability,
        values.availabilityLength,
        values.cost === '' ? 0 : values.cost,
        values.duration,
        values.maxParticipantsCount === '' ? 0 : values.maxParticipantsCount
      )
    );
  }, [values]);
  return (
    <div className="card">
      <div className="card-body">
        <h3>Summary of Your Availability</h3>

        {values.title && <>&quot;{values.title}&quot;</>}
        <div className="row">
          <div className="col-md-6">
            <div>
              <b>
                Weekly Schedule{' '}
                {values.availabilityLength
                  ? availabilityLengthOptions
                      .find((o) => o.value === values.availabilityLength)
                      ?.label.toLocaleLowerCase()
                  : ''}
              </b>
            </div>
            {values.availability &&
            values.availability.filter((wd) => wd && wd.from && wd.to)
              .length ? (
              <DataList>
                <DataItems>
                  {values.availability.map(
                    (day: AvailabilityField, index: number) =>
                      day && day.from && day.to && index ? (
                        <Fragment key={`${index}-${day.from}${day.to}`}>
                          <span>{dayNrToWeekText(index)}s</span>
                          <span>
                            {moment(day.from, 'HHmm').format('hh:mm A')} -{' '}
                            {moment(day.to, 'HHmm').format('hh:mm A')}
                          </span>
                        </Fragment>
                      ) : (
                        ''
                      )
                  )}
                </DataItems>
              </DataList>
            ) : (
              'No weekly schedule added. Scroll up.'
            )}
          </div>
          <div className="col-md-6">
            <div>
              <b>Concrete Dates and Times</b>
            </div>
            {timeslots && typeof timeslots === 'string' ? (
              timeslots
            ) : (
              <DataList>
                <DataItems>
                  {Object.keys(timeslots).map((key: string) => (
                    <Fragment key={key}>
                      <span>{key}</span>
                      <span>{(timeslots as any)[key].join(', ')}</span>
                    </Fragment>
                  ))}
                </DataItems>
              </DataList>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
