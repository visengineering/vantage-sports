import React, { FC, useContext } from 'react';
import { gql, useMutation } from '@apollo/client';
import { DataItems, DataList } from 'src/components/data-list';
import { EventModel } from 'src/types';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import { Stack } from 'src/components/shared/Stack';
import { errorToString } from 'src/components/shared/api/errorToString';
import { CheckboxField } from 'src/components/shared/form/CheckboxField';
import { MainContext } from 'src/contexts';
import { useNotification } from 'src/components/shared/hooks/use-notifications';

const deleteEventMutation = gql`
  mutation deleteEvent($id: Int!) {
    deleteEvent(id: $id) {
      id
    }
  }
`;

const cancelEventMutation = gql`
  mutation cancelEvent($id: Int!) {
    cancelEvent(id: $id) {
      id
    }
  }
`;

export const DeleteEventCard: FC<{
  training: EventModel;
  hasParticipants: boolean;
}> = ({ training, hasParticipants }) => {
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const { profileId, profile } = useContext(MainContext);
  const notify = useNotification();

  const [deleteEvent, { error: deleteError, loading: deleteLoading }] =
    useMutation(deleteEventMutation, {
      variables: { id: parseInt(params.id) },
      refetchQueries: 'active',
      onCompleted() {
        notify({
          type: 'success',
          children: 'Event deleted successfully',
        });
        history.push(`/${profile?.path || profileId}`, {
          comingFromCreateEvent: true,
          shouldShowMessage: true,
        });
      },
    });

  const [cancelEvent, { error: cancelError, loading: cancelLoading }] =
    useMutation(cancelEventMutation, {
      variables: { id: parseInt(params.id) },
      refetchQueries: 'active',
      onCompleted() {
        notify({
          type: 'success',
          children: 'Event cancelled successfully',
        });
        history.push(`/${profile?.path || profileId}`, {
          comingFromCreateEvent: true,
          shouldShowMessage: true,
        });
      },
    });

  return (
    <div className="event-details">
      <h1 className="title">
        {hasParticipants ? 'Cancelling' : 'Deleting'} {training.title}
      </h1>
      <div className="details-card">
        <div className="row">
          <div className="col-md-6">
            <DataList>
              <DataItems>
                <span>Sport</span>
                <span>{training.sport.name}</span>
                <span>Skill</span>
                <span>{training.skill?.name}</span>
                {training?.position?.name && (
                  <>
                    <span>Position</span>
                    <span>{training.position.name}</span>
                  </>
                )}
                <span>Description</span>
                <span>{training.description}</span>
                <span>Location</span>
                <span>{training.location}</span>
              </DataItems>
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
                  if (hasParticipants) {
                    cancelEvent();
                  } else {
                    deleteEvent();
                  }
                }}
              >
                {({ handleSubmit, values, errors }) => (
                  <BootstrapForm onSubmit={handleSubmit}>
                    <p>
                      {hasParticipants ? (
                        <>
                          You are about to cancel event that has active
                          participants.
                        </>
                      ) : (
                        <>
                          You are about to delete event that has not yet been
                          booked.
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
                        className="btn btn-secondary"
                        onClick={() => {
                          history.push(`/training/${training.id}`);
                        }}
                      >
                        Back
                      </button>
                      <Button
                        type="submit"
                        disabled={deleteLoading || cancelLoading}
                        className="btn btn-danger submit-btn"
                      >
                        {hasParticipants ? 'Cancel event' : 'Delete event'}
                      </Button>
                    </Stack>
                  </BootstrapForm>
                )}
              </Formik>
            </Stack>
          </div>
        </div>
        {(deleteError || cancelError) && (
          <div className="alert alert-danger" role="alert">
            {errorToString(deleteError || cancelError)}
          </div>
        )}
      </div>
    </div>
  );
};
