import React, { FC, useContext, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { eventQuery } from '../../ViewEvent';
import { Formik, FormikValues } from 'formik';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  EventModel,
  CreateEventPayloadValues,
  DerivedFormikProps,
  EventCreateMutation,
  EventCreateReturnData,
  EventTypeEnum,
  EventSessionTypeEnum,
  MediaType,
  MediaTypeEnum,
} from '../../../../../types';
import {
  GeoAddressDBType,
  defineGeoAddressType,
} from 'src/components/shared/hooks/googleapis/use-gmaps-place-result';
import { UniversitySearchField } from '../../../../shared/form/UniversitySearchField';
import { SportSearchField } from '../../../../shared/form/SportSearchField';
import { PositionSearchField } from '../../../../shared/form/PositionSearchField';
import { SkillSearchField } from '../../../../shared/form/SkillSearchField';
import { LocationTypeSearchField } from '../../../../shared/form/LocationTypeField';
import { LocationAutocompleteField } from 'src/components/shared/form/LocationAutocompleteField';
import { updateEventMutation } from '../../../../shared/api/event';
import { MainContext } from '../../../../../contexts/MainContext';
import UploadImageField from '../../../../shared/form/UploadImageField';
import { Stack } from '../../../../shared/Stack';
import {
  editEventFormValidationSchema,
  isKnownSport,
} from '../validation-schema';
import { errorToString } from 'src/components/shared/api/errorToString';
import { Input } from 'src/components/shared/form/Input';
import { Textarea } from 'src/components/shared/form/TextArea';
import { useNotification } from 'src/components/shared/hooks/use-notifications';

type EditFormValues = Omit<
  CreateEventPayloadValues,
  'timeslots' | 'geoAddressDB'
>;

const emptyInitialValues: EditFormValues = {
  title: '',
  picture: undefined,
  university: '',
  sport: '',
  position: '',
  skill: '',
  location: '',
  locationType: '',
  about: '',
};

export const EditEventForm: FC<{
  eventId: number;
  eventType: EventTypeEnum;
  initialValues: EditFormValues;
  initialImage?: MediaType;
}> = ({
  eventId,
  eventType,
  initialValues = emptyInitialValues,
  initialImage,
}) => {
  const { profileId } = useContext(MainContext);
  const notify = useNotification();

  const history = useHistory();
  const [geoAddressDB, setGeoAddressDB] = useState<GeoAddressDBType>();

  const [updateEvent, { error, loading, data }] = useMutation<
    EventCreateMutation,
    EventCreateReturnData
  >(updateEventMutation, {
    refetchQueries: 'active',
    onCompleted(updatedEvent) {
      notify({
        type: 'success',
        children: 'You have edited the event successfully',
      });
      history.push(
        { pathname: `/training/${eventId}` },
        { shouldShowMessage: true }
      );
    },
  });

  const defineGeoAddress: defineGeoAddressType = (params) => {
    const { geoAddressDB: _geoAddressDB } = params ?? {};

    if (geoAddressDB !== _geoAddressDB) setGeoAddressDB(_geoAddressDB);
  };

  return (
    <section className="create-event-section">
      <div className="container">
        <h1 className="title">Edit your Training Session</h1>
        <Formik<EditFormValues>
          initialValues={initialValues}
          validationSchema={editEventFormValidationSchema}
          onSubmit={({ picture, ...values }) => {
            updateEvent({
              variables: {
                event: {
                  id: eventId,
                  eventType,
                  coachProfileId: Number(profileId),
                  universityId: values.university,
                  sportId: values.sport,
                  skillId: values.skill,
                  mediaId: !!picture ? picture : undefined,
                  positionId: values.position,
                  sessionType: values.locationType,
                  location: values.location,
                  geoAddressDB,
                  title: values.title,
                  description: values.about,
                },
              },
            });
          }}
        >
          {({
            handleSubmit,
            values,
            setFieldValue,
          }: DerivedFormikProps<FormikValues>) => (
            <BootstrapForm onSubmit={handleSubmit}>
              <div className="form-group">
                <Stack flow="row" justifyContent="center" alignItems="center">
                  <div className="img-upload-block">
                    <div className="img-container" style={{ width: '400px' }}>
                      <UploadImageField
                        name="picture"
                        type={MediaTypeEnum.EVENT_PICTURE}
                        initialImage={initialImage}
                      />
                    </div>
                  </div>
                </Stack>
              </div>
              <div className="form-group">
                <Input name="title" label="Training Sessions Title" />
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <UniversitySearchField name="university" />
                </div>
                <div className="col-sm-6">
                  <SportSearchField
                    name="sport"
                    onChange={(value) => {
                      if (!isKnownSport(value)) {
                        setFieldValue('position', null);
                        setFieldValue('skill', null);
                      }
                    }}
                  />
                </div>
              </div>
              {values.sport && isKnownSport(values.sport) && (
                <div className="row">
                  <div className="col-sm-6">
                    <PositionSearchField
                      name="position"
                      sportId={values.sport}
                    />
                  </div>
                  <div className="col-sm-6">
                    <SkillSearchField name="skill" sportId={values.sport} />
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-sm-6">
                  <LocationTypeSearchField
                    name="locationType"
                    onChange={(value: any) => {
                      setFieldValue('location', '');

                      if (geoAddressDB) setGeoAddressDB(undefined);
                    }}
                  />
                </div>
                <div className="col-sm-6">
                  {values.locationType === EventSessionTypeEnum.In_Person ? (
                    <LocationAutocompleteField
                      name="location"
                      label="Location*"
                      defineGeoAddress={defineGeoAddress}
                    />
                  ) : (
                    values.locationType === EventSessionTypeEnum.Virtual && (
                      <Input name="location" label="Video Chat Link*" />
                    )
                  )}
                </div>
              </div>
              <div className="form-group">
                <Textarea
                  name="about"
                  label={`About Training Session ${
                    values.about ? `(${values.about.length}/450)` : ''
                  }`}
                  placeholder={'Type here...'}
                  rows={4}
                />
              </div>
              {error && (
                <div className="alert alert-danger my-2" role="alert">
                  {errorToString(error)}
                </div>
              )}
              <Button type="submit" className="btn btn-primary submit-btn">
                Save changes
              </Button>
            </BootstrapForm>
          )}
        </Formik>
      </div>
    </section>
  );
};

export const EditEventFormPage = () => {
  const params = useParams<{ id: string }>();

  const { loading, error, data } = useQuery<{ event: EventModel }>(eventQuery, {
    variables: {
      id: parseInt(params.id),
    },
    skip: !params.id,
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return (
      <section className="event-details-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              Unfortunately we couldn&apos;t find event with id = {params.id}.
            </div>
          </div>
        </div>
      </section>
    );
  }

  const eventValues: EditFormValues = {
    title: data.event.title,
    picture: data.event.media?.id,
    university: data.event.university.id,
    sport: data.event.sport.id,
    position: data.event.position?.id,
    skill: data.event.skill?.id,
    location: data.event.location,
    locationType: data.event.sessionType,
    about: data.event.description,
  };

  return (
    <EditEventForm
      eventId={parseInt(params.id)}
      eventType={data.event.eventType ?? EventTypeEnum.MULTIPLE_TIMESLOTS}
      initialValues={eventValues}
      initialImage={data.event.media}
    />
  );
};
