import { Formik, FormikValues } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { UserSearchField } from 'src/components/pages/admin/reschedule/UserSearchField';
import { useAxios } from 'src/components/shared/api/use-axios';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { DerivedFormikProps, TimeslotModelWithEvent } from 'src/types';
import { rescheduleTrainingAdminForm } from '../Event/event-timeslots/validation-schema';
import ParticipantDetailCardItem from '../Player/ParticipantDetailCardItem';
import { DesiredTrainingSearchField } from './reschedule/DesiredTrainingSearchField';
import { SelectBookedTrainingByUser } from './reschedule/SelectBookedTrainingByUser';

export const AdminTrainingReschedule: FC = () => {
  const notify = useNotification();
  const [currentTraining, setCurrentTraining] =
    useState<TimeslotModelWithEvent | null>(null);
  const [rescheduleToTraining, setRescheduleToTraining] =
    useState<TimeslotModelWithEvent | null>(null);
  const {
    response,
    error,
    loading: reschedulingInProgress,
    refetch: executeRescheduleTraining,
  } = useAxios<{
    participantId: number;
    currentTimeslotId: number;
    coachProfileId: number;
    desiredTimeslotId: number;
  }>({
    fetchOnLoad: false,
  });
  useEffect(() => {
    if (!rescheduleToTraining) return;
    setCurrentTraining(null);
    setRescheduleToTraining(null);
    notify({
      type: 'success',
      children: 'Training successfully rescheduled.',
    });
  }, [response]);
  return (
    <section id="reschedule-training">
      <div className="container" style={{ marginTop: '32px' }}>
        <h3>Reschedule Training</h3>
        <p>
          You can reschedule any training purchased by user to another timebox
          of the same coach.
        </p>
        <p>
          First select user, then select already booked timeslot, you will be
          presented with all available timeslots you can reschedule to.
        </p>
      </div>
      <Formik<{
        userId: number | null;
        participantId: number | null;
        currentTimeslotId: number | null;
        coachProfileId: number | null;
        desiredTimeslotId: number | null;
      }>
        initialValues={{
          userId: null,
          participantId: null,
          currentTimeslotId: null,
          coachProfileId: null,
          desiredTimeslotId: null,
        }}
        validationSchema={rescheduleTrainingAdminForm}
        onSubmit={(values, { resetForm }) => {
          executeRescheduleTraining({
            method: 'POST',
            url: `${
              process.env.REACT_APP_API || ''
            }/rest/admin/reschedule-training`,
            data: {
              participantId: values.participantId,
              currentTimeslotId: values.currentTimeslotId,
              coachProfileId: values.coachProfileId,
              desiredTimeslotId: values.desiredTimeslotId,
            },
          });
          resetForm();
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          handleSubmit,
        }: DerivedFormikProps<FormikValues>) => (
          <BootstrapForm onSubmit={handleSubmit}>
            <UserSearchField
              name="userId"
              onChange={() => {
                setFieldValue('participantId', null);
                setFieldValue('currentTimeslotId', null);
                setFieldValue('coachProfileId', null);
                setFieldValue('desiredTimeslotId', null);
              }}
            />
            {values.userId &&
              (!values.participantId ||
                !values.currentTimeslotId ||
                !values.coachProfileId) && (
                <SelectBookedTrainingByUser
                  onSelect={(selected, participantId) => {
                    setFieldValue('participantId', participantId);
                    setFieldValue('currentTimeslotId', selected.id);
                    setFieldValue('coachProfileId', selected.event.coach.id);
                    setCurrentTraining(selected);
                  }}
                  userId={values.userId}
                />
              )}
            {values.userId &&
              values.participantId &&
              values.currentTimeslotId &&
              values.coachProfileId &&
              currentTraining && (
                <>
                  <section className="event-details-section">
                    <p>
                      You are about to reschedule the timeslot below:
                      [Participant ID: {values.participantId} ·{' '}
                      <span style={{ color: 'red' }}>
                        Current training cost: ${currentTraining.cost}
                      </span>
                      ]
                    </p>
                    <ParticipantDetailCardItem
                      event={currentTraining.event}
                      timeslot={currentTraining}
                    />
                  </section>
                  <p>
                    Pick training timeslot to reschedule to (from coach{' '}
                    {currentTraining.event.coach.name}):
                  </p>
                  <DesiredTrainingSearchField
                    coachProfileId={currentTraining.event.coach.id}
                    name="trainingSelect"
                    onChange={(trainingSelected: TimeslotModelWithEvent) => {
                      setFieldValue('desiredTimeslotId', trainingSelected.id);
                      setRescheduleToTraining(trainingSelected);
                    }}
                  />
                  {Object.keys(errors).length > 0 &&
                    values.desiredTimeslotId && (
                      <p className="text text-danger text-small m-2">
                        {JSON.stringify(errors)}
                      </p>
                    )}
                  <h2 style={{ marginTop: '32px' }}>Reschedule summary</h2>
                  {rescheduleToTraining && (
                    <section className="event-details-section">
                      <div className="row">
                        <div className="col-md-6">
                          <h3>From (${currentTraining.cost})</h3>
                        </div>
                        <div className="col-md-6">
                          <h3>To (${rescheduleToTraining.cost})</h3>
                        </div>
                        <div className="col-md-6">
                          <ParticipantDetailCardItem
                            event={currentTraining.event}
                            timeslot={currentTraining}
                          />
                        </div>
                        <div className="col-md-6">
                          <ParticipantDetailCardItem
                            event={rescheduleToTraining.event}
                            timeslot={rescheduleToTraining}
                          />
                        </div>
                      </div>
                    </section>
                  )}
                  <p>
                    Confirm selected details and when you are sure press
                    Reschedule Training. You can reschedule to a full training
                    if you need to. You can also reschedule to more expensive
                    slot if you need to.
                  </p>
                  {error && (
                    <p className="text text-danger text-small m-2">
                      {JSON.stringify(error)}
                    </p>
                  )}
                  <Button
                    disabled={reschedulingInProgress}
                    type="submit"
                    className="btn btn-primary submit-btn"
                  >
                    Reschedule Training
                  </Button>
                </>
              )}
          </BootstrapForm>
        )}
      </Formik>
    </section>
  );
};
