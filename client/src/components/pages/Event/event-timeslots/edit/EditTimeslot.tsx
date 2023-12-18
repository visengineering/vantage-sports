import moment from 'moment';
import React, { FC } from 'react';
import { DataItems, DataList } from 'src/components/data-list';
import {
  EventType,
  TimeslotEditMutation,
  TimeslotEditReturnData,
  TimeslotModel,
} from 'src/types';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Stack } from 'src/components/shared/Stack';
import { errorToString } from 'src/components/shared/api/errorToString';
import {
  costSchema,
  durationSchema,
  maxParticipantsCountSchema,
  startDateSchema,
} from '../validation-schema';
import { useMutation } from '@apollo/client';
import { updateTimeslotMutation } from 'src/components/shared/api/event';
import { Input } from 'src/components/shared/form/Input';
import { DatePickerField } from 'src/components/shared/form/DateField';
import { FormatPrice } from 'src/components/shared/FormatPrice';

export const EditTimeslot: FC<{
  eventId: number;
  eventType?: EventType;
  timeslot: TimeslotModel;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ eventId, eventType, timeslot, onCancel, onSuccess }) => {
  const history = useHistory();
  const [updateTimeslot, { error, loading }] = useMutation<
    TimeslotEditMutation,
    TimeslotEditReturnData
  >(updateTimeslotMutation, {
    refetchQueries: 'active',
    onCompleted() {
      history.push({ pathname: `/training/${eventId}` });
    },
  });

  return (
    <div className="event-details">
      <h1 className="title">
        Editing{' '}
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
              <Formik<{
                startDate: TimeslotModel['startDate'];
                duration: TimeslotModel['duration'];
                cost: TimeslotModel['cost'];
                maxParticipantsCount: TimeslotModel['maxParticipantsCount'];
              }>
                initialValues={{
                  startDate: timeslot.startDate,
                  duration: timeslot.duration,
                  cost: timeslot.cost,
                  maxParticipantsCount: timeslot.maxParticipantsCount,
                }}
                validationSchema={yup
                  .object({
                    startDate: startDateSchema,
                    duration: durationSchema,
                    cost: costSchema,
                    maxParticipantsCount: maxParticipantsCountSchema,
                  })
                  .required()}
                onSubmit={(values) => {
                  updateTimeslot({
                    variables: {
                      timeslot: {
                        id: timeslot.id,
                        startDate: values.startDate,
                        duration: values.duration,
                        cost: values.cost,
                        maxParticipantsCount: values.maxParticipantsCount,
                      },
                    },
                  }).then(() => onSuccess());
                }}
              >
                {({ handleSubmit, values, errors }) => (
                  <BootstrapForm onSubmit={handleSubmit}>
                    <div className="form-group">
                      <DatePickerField label="Start Date*" name="startDate" />
                      <Input
                        label="Duration (minutes)"
                        type="number"
                        name="duration"
                      />
                      <Input label="Cost" type="number" name="cost" />
                      <Input
                        label="Participants Limit (Max)"
                        type="number"
                        name="maxParticipantsCount"
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
                        disabled={loading}
                        className="btn btn-primary submit-btn"
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </BootstrapForm>
                )}
              </Formik>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {errorToString(error)}
                </div>
              )}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};
