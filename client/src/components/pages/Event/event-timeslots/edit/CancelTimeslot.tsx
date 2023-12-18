import moment from 'moment';
import React, { FC } from 'react';
import { DataItems, DataList } from 'src/components/data-list';
import { EventType, TimeslotModel } from 'src/types';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Stack } from 'src/components/shared/Stack';
import { errorToString } from 'src/components/shared/api/errorToString';
import { useMutation } from '@apollo/client';
import {
  cancelTimeslotMutation,
  deleteTimeslotMutation,
} from 'src/components/shared/api/event';
import { CheckboxField } from 'src/components/shared/form/CheckboxField';
import { hasTimeslotStarted, isTimeslotPast } from '../details/helpers';
import { FormatPrice } from 'src/components/shared/FormatPrice';

export const CancelTimeslot: FC<{
  eventId: number;
  eventType?: EventType;
  timeslot: TimeslotModel;
  onCancel: () => void;
  onSuccess: (isDeleted: boolean) => void;
}> = ({ eventId, eventType, timeslot, onCancel, onSuccess }) => {
  const [cancelTimeslot, { error: cancelError, loading: cancelLoading }] =
    useMutation(cancelTimeslotMutation, {
      refetchQueries: 'active',
    });

  const isBookedTimeslot =
    timeslot.participantsCount > 0 ||
    (Array.isArray(timeslot.participants) && timeslot.participants.length);

  const [deleteTimeslot, { error: deleteError, loading: deleteLoading }] =
    useMutation(deleteTimeslotMutation, {
      refetchQueries: 'active',
    });

  return (
    <div className="event-details">
      <h1 className="title">
        {isBookedTimeslot ||
        hasTimeslotStarted(timeslot.startDate, timeslot.endDate) ||
        isTimeslotPast(timeslot.endDate)
          ? 'Cancelling'
          : 'Deleting'}{' '}
        {moment(timeslot.startDate).local().format('ddd, MM/DD/YYYY, h:mm a')}
      </h1>
      <div className="details-card">
        <div className="row">
          <div className="col-md-6">
            <DataList>
              <DataItems>
                <span>Date and time</span>
                <span>
                  {moment(timeslot.startDate).format('MM/DD/YYYY hh:mm A')} -{' '}
                  {moment(timeslot.endDate).format('hh:mm A')}
                </span>
                <span>Cost</span>
                <span>
                  <FormatPrice price={timeslot.cost} />
                </span>
                <span>Duration</span>
                <span>{timeslot.duration} minutes</span>
                <span>Participants</span>
                <span>
                  {timeslot.maxParticipantsCount > 1
                    ? `Group of max. ${timeslot.maxParticipantsCount} people.`
                    : 'Private 1:1'}
                </span>
              </DataItems>
              {timeslot.participantsCount !== 0 && timeslot.participantsCount && (
                <p className="text text-primary text-small">
                  {timeslot.participantsCount}{' '}
                  {timeslot.participantsCount > 1
                    ? 'participants'
                    : 'participant'}{' '}
                  have joined this event.
                </p>
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
                  if (
                    isBookedTimeslot ||
                    hasTimeslotStarted(timeslot.startDate, timeslot.endDate) ||
                    isTimeslotPast(timeslot.endDate)
                  ) {
                    cancelTimeslot({
                      variables: {
                        timeslot: {
                          id: timeslot.id,
                        },
                      },
                    }).then(() => onSuccess(false));
                  } else {
                    deleteTimeslot({
                      variables: {
                        timeslot: {
                          id: timeslot.id,
                        },
                      },
                    }).then(() => onSuccess(true));
                  }
                }}
              >
                {({ handleSubmit, values, errors }) => (
                  <BootstrapForm onSubmit={handleSubmit}>
                    <p>
                      {isBookedTimeslot ? (
                        <>
                          You are about to cancel timeslot that has already been
                          booked. All participants will be refunded and this
                          session will be cancelled. This only affects this date
                          and time, other timeslots will not be affected. After
                          cancellation this timeslot will still show under the
                          event with information it has been cancelled. All
                          participants who booked this session will be notified
                          via email and sms, if they verified their phone.
                        </>
                      ) : hasTimeslotStarted(
                          timeslot.startDate,
                          timeslot.endDate
                        ) || isTimeslotPast(timeslot.endDate) ? (
                        <>
                          You are about to cancel timeslot that has already
                          started. This only affects this date and time, other
                          timeslots will not be affected. After cancellation
                          this timeslot will still show under the event with
                          information it has been cancelled. All participants
                          who booked this session will be notified via email and
                          sms, if they verified their phone.
                        </>
                      ) : (
                        <>
                          You are about to delete timeslot that has not yet been
                          booked. This only affects this date and time, other
                          timeslots will not be affected. After deletion the
                          timeslot will disappear from the event.
                        </>
                      )}
                    </p>
                    <div className="form-group">
                      <CheckboxField
                        name="accept"
                        label="I understand and want to perform the action that cannot be undone."
                        custom
                      />
                    </div>
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
                        disabled={deleteLoading || cancelLoading}
                        className="btn btn-danger submit-btn"
                      >
                        {isBookedTimeslot ||
                        hasTimeslotStarted(
                          timeslot.startDate,
                          timeslot.endDate
                        ) ||
                        isTimeslotPast(timeslot.endDate)
                          ? 'Cancel timeslot'
                          : 'Delete timeslot'}
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
  );
};
