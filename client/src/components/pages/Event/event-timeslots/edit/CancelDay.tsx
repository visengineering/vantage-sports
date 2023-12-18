import React, { FC, useMemo } from 'react';
import { TimeslotModel } from 'src/types';

import { useMutation } from '@apollo/client';
import {
  cancelTimeslotMutation,
  deleteTimeslotMutation,
} from 'src/components/shared/api/event';
import {
  BucketSortedTimeslots,
  bucketSortTimeslots,
  hasTimeslotStarted,
  isTimeslotPast,
} from '../details/helpers';
import moment from 'moment';
import { FormatPrice } from 'src/components/shared/FormatPrice';
import { errorToString } from 'src/components/shared/api/errorToString';
import { Stack } from 'src/components/shared/Stack';
import { Formik } from 'formik';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { CheckboxField } from 'src/components/shared/form/CheckboxField';
import * as yup from 'yup';
import { DataList } from 'src/components/data-list';

export const CancelDay: FC<{
  selectedDate: any;
  onCancel: () => void;
  timeslots: TimeslotModel[];
  onSuccess: (isDeleted: boolean) => void;
}> = ({ selectedDate, timeslots, onCancel, onSuccess }) => {
  const [cancelTimeslot, { error: cancelError, loading: cancelLoading }] =
    useMutation(cancelTimeslotMutation, {
      refetchQueries: 'active',
    });

  const [deleteTimeslot, { error: deleteError, loading: deleteLoading }] =
    useMutation(deleteTimeslotMutation, {
      refetchQueries: 'active',
    });

  const byDate = useMemo<BucketSortedTimeslots>(() => {
    return bucketSortTimeslots(timeslots);
  }, [timeslots]);

  const day = byDate[selectedDate];

  const isSamePrice = useMemo<boolean>(() => {
    const unique = [...new Set(day?.map(({ timeslot }) => timeslot.cost))];

    return unique.length === 1;
  }, [day]);

  const isSameDuration = useMemo<boolean>(() => {
    const unique = [...new Set(day?.map(({ timeslot }) => timeslot.duration))];

    return unique.length === 1;
  }, [day]);

  const isSameParticipantsLimit = useMemo<boolean>(() => {
    const unique = [
      ...new Set(day?.map(({ timeslot }) => timeslot.maxParticipantsCount)),
    ];

    return unique.length === 1;
  }, [day]);

  if (!day) {
    return null;
  }

  const isAnyTimeslotCancellable = day.some(
    ({ timeslot }) =>
      timeslot.participantsCount > 0 &&
      !timeslot.isCancelled &&
      !hasTimeslotStarted(timeslot.startDate, timeslot.endDate) &&
      !isTimeslotPast(timeslot.endDate)
  );

  const isAnyTimeslotRemovable = day.some(
    ({ timeslot }) =>
      timeslot.participantsCount === 0 &&
      !hasTimeslotStarted(timeslot.startDate, timeslot.endDate) &&
      !isTimeslotPast(timeslot.endDate)
  );

  const hasAnyTimeslotStarted = day.some(({ timeslot }) =>
    hasTimeslotStarted(timeslot.startDate, timeslot.endDate)
  );

  const isAnyTimeslotPast = day.some(({ timeslot }) =>
    isTimeslotPast(timeslot.endDate)
  );

  const isBookedTimeslot = (timeslot: TimeslotModel) =>
    timeslot.participantsCount > 0 ||
    (Array.isArray(timeslot.participants) && timeslot.participants.length);

  return (
    <>
      <div className="event-details">
        <h1 className="title">
          {(isAnyTimeslotCancellable ||
            hasAnyTimeslotStarted ||
            isAnyTimeslotPast) &&
          isAnyTimeslotRemovable
            ? 'Cancelling and Deleting'
            : isAnyTimeslotRemovable
            ? 'Deleting'
            : isAnyTimeslotCancellable
            ? 'Cancelling'
            : 'Nothing to remove'}{' '}
          {moment(day[0].timeslot.startDate).local().format('ddd, MM/DD/YYYY')}
        </h1>
        <div className="details-card">
          <div className="row">
            <div className="col-md-6">
              <DataList>
                <span className="dataitem">Date:</span>
                <span className="dataitem">
                  {moment(day[0].timeslot.startDate).format('MM/DD/YYYY')}
                </span>
                <span className="dataitem">Time:</span>
                <span></span>
                {day.map(({ timeslot }) => (
                  <>
                    <span className="dataitem" key={timeslot.id}>
                      {moment(timeslot.startDate).format('hh:mm')}-
                      {moment(timeslot.endDate).format('hh:mm')}
                    </span>
                    <span className="dataitem" key={`${timeslot.id}state`}>
                      {moment(timeslot.endDate).isBefore(moment()) ||
                      moment(timeslot.startDate).isBefore(moment())
                        ? 'not changed '
                        : timeslot.isCancelled
                        ? 'already cancelled '
                        : timeslot.participantsCount > 0
                        ? 'cancelling '
                        : 'deleting '}
                    </span>
                  </>
                ))}

                <span className="dataitem">Cost:</span>
                {isSamePrice ? (
                  <span className="dataitem">
                    <FormatPrice price={day[0].timeslot.cost} />
                  </span>
                ) : (
                  <>
                    <span></span>
                    {day.map(({ timeslot }) => (
                      <>
                        <span className="dataitem" key={timeslot.id}>
                          {moment(timeslot.startDate).format('hh:mm')}-
                          {moment(timeslot.endDate).format('hh:mm')}
                        </span>
                        <span className="dataitem" key={`${timeslot.id}cost`}>
                          <FormatPrice price={timeslot.cost} />
                        </span>
                      </>
                    ))}
                  </>
                )}
                <span className="dataitem">Duration:</span>
                {isSameDuration ? (
                  <span className="dataitem">
                    {day[0].timeslot.duration} minutes
                  </span>
                ) : (
                  <>
                    <span></span>
                    {day.map(({ timeslot }) => (
                      <>
                        <span className="dataitem" key={timeslot.id}>
                          {moment(timeslot.startDate).format('hh:mm')}-
                          {moment(timeslot.endDate).format('hh:mm')}
                        </span>
                        <span
                          className="dataitem"
                          key={`${timeslot.id}duration`}
                        >
                          {timeslot.duration} minutes
                        </span>
                      </>
                    ))}
                  </>
                )}

                <span className="dataitem">Participants:</span>
                {isSameParticipantsLimit ? (
                  <span className="dataitem">
                    {day[0].timeslot.maxParticipantsCount > 1
                      ? `Group of max. ${day[0].timeslot.maxParticipantsCount} people.`
                      : 'Private 1:1'}
                  </span>
                ) : (
                  <>
                    <span></span>
                    {day.map(({ timeslot }) => (
                      <>
                        <span className="dataitem" key={timeslot.id}>
                          {moment(timeslot.startDate).format('hh:mm')}-
                          {moment(timeslot.endDate).format('hh:mm')}
                        </span>
                        <span
                          className="dataitem"
                          key={`${timeslot.id}participants`}
                        >
                          {timeslot.maxParticipantsCount > 1
                            ? `Group of max. ${timeslot.maxParticipantsCount} people.`
                            : 'Private 1:1'}
                        </span>
                      </>
                    ))}
                  </>
                )}
              </DataList>
            </div>

            <div className="col-md-6">
              <Stack flow="row" gap={1}>
                <Formik<{ accept: boolean }>
                  initialValues={{
                    accept: false,
                  }}
                  validationSchema={yup
                    .object({
                      accept: yup
                        .bool()
                        .oneOf(
                          [true],
                          'Confirm you undestand this action cannot be undone.'
                        )
                        .label('Acceptance')
                        .required(),
                    })
                    .required()}
                  onSubmit={(values) => {
                    day.map(({ timeslot }) => {
                      if (
                        isTimeslotPast(timeslot.endDate) ||
                        hasTimeslotStarted(timeslot.startDate, timeslot.endDate)
                      ) {
                        onSuccess(true);
                      } else {
                        if (isBookedTimeslot(timeslot)) {
                          cancelTimeslot({
                            variables: {
                              timeslot: {
                                id: timeslot.id,
                              },
                            },
                          }).then(() => onSuccess(true));
                        } else {
                          deleteTimeslot({
                            variables: {
                              timeslot: {
                                id: timeslot.id,
                              },
                            },
                          }).then(() => onSuccess(true));
                        }
                      }
                    });
                  }}
                >
                  {({ handleSubmit }) => (
                    <BootstrapForm onSubmit={handleSubmit}>
                      {isAnyTimeslotCancellable && (
                        <p>
                          You are about to cancel timeslots that has already
                          been booked. All participants will be refunded and
                          this session will be cancelled. This only affects this
                          date and times, other timeslots will not be affected.
                          After cancellation this timeslot(s) will still show
                          under the event with information it has been
                          cancelled. All participants who booked this session
                          will be notified via email and sms, if they verified
                          their phone.
                        </p>
                      )}
                      {hasAnyTimeslotStarted && (
                        <p>
                          {`You have selected a day with some of the trainings
                        already started. You cannot delete nor cancel events that have already started. Trainings marked as <not changed> will not be changed.`}
                        </p>
                      )}
                      {isAnyTimeslotRemovable && (
                        <p>
                          You are about to delete timeslot(s) that has not yet
                          been booked. This only affects this date and time,
                          other timeslots will not be affected. After deletion
                          the timeslot(s) will disappear from the event.
                        </p>
                      )}
                      {isAnyTimeslotPast && (
                        <p>
                          {`You have selected a day with some of the trainings already in the past (finished). You cannot delete nor cancel events that have already finished. Trainings marked as <not changed> will not be changed.`}
                        </p>
                      )}
                      {(isAnyTimeslotCancellable || isAnyTimeslotRemovable) && (
                        <div className="form-group">
                          <CheckboxField
                            name="accept"
                            label="I understand and want to perform the action that cannot be undone."
                            custom
                          />
                        </div>
                      )}
                      <Stack flow="column" gap={1}>
                        <button
                          type="reset"
                          onClick={onCancel}
                          className="btn btn-secondary"
                        >
                          Back
                        </button>
                        <Button
                          type="submit"
                          disabled={
                            deleteLoading ||
                            cancelLoading ||
                            (!isAnyTimeslotCancellable &&
                              !isAnyTimeslotRemovable)
                          }
                          className="btn btn-danger submit-btn"
                        >
                          {isAnyTimeslotCancellable && isAnyTimeslotRemovable
                            ? 'Cancel and Delete timeslots'
                            : isAnyTimeslotRemovable
                            ? 'Delete timeslots'
                            : isAnyTimeslotCancellable
                            ? 'Cancel timeslots'
                            : 'Nothing to remove'}
                        </Button>
                      </Stack>
                    </BootstrapForm>
                  )}
                </Formik>

                {deleteError && (
                  <div className="alert alert-danger" role="alert">
                    {errorToString(deleteError)}
                  </div>
                )}
                {cancelError && (
                  <div className="alert alert-danger" role="alert">
                    {errorToString(cancelError)}
                  </div>
                )}
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
