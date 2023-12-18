import React, { FC, useContext, useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  CreateEventFormValues,
  CreateTimeSlotInput,
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
import { TimeslotsCreator } from '../../../../shared/form/TimeslotsCreator';
import { createEventMutation } from '../../../../shared/api/event';
import { MainContext } from '../../../../../contexts/MainContext';
import UploadImageField from '../../../../shared/form/UploadImageField';
import { Stack } from '../../../../shared/Stack';
import {
  isKnownSport,
  timeslotsFormValidationSchema,
} from '../validation-schema';
import { Input } from 'src/components/shared/form/Input';
import { Textarea } from 'src/components/shared/form/TextArea';
import { errorToString } from 'src/components/shared/api/errorToString';
import { ScrollToError } from 'src/components/shared/form/ScrollToError';
import { useTimezone } from 'src/components/shared/hooks/use-timezone';
import { getEventTitleAndAbout } from '../../availability/create/helpers';
import moment from 'moment-timezone';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { LocationAutocompleteField } from 'src/components/shared/form/LocationAutocompleteField';

const emptyInitialValues: CreateEventFormValues = {
  title: '',
  picture: undefined,
  university: '',
  sport: '',
  position: '',
  skill: '',
  location: '',
  locationType: '',
  cost: '',
  maxParticipantsCount: '',
  timeslots: [
    {
      duration: '',
      startDate: '',
    },
  ],
  about: '',
};

export const CreateEventForm: FC<{
  initialValues: CreateEventFormValues;
  initialImage?: MediaType;
}> = ({ initialValues = emptyInitialValues, initialImage }) => {
  const { profile, profileId } = useContext(MainContext);
  const notify = useNotification();

  const history = useHistory();
  const timezone = useTimezone();
  const [createEvent, { error, loading, data }] = useMutation<
    EventCreateMutation,
    EventCreateReturnData
  >(createEventMutation, {
    refetchQueries: 'all',
    onCompleted(createEvent) {
      notify({
        type: 'success',
        children: 'You have created an Event Successfully',
      });
      history.push({
        pathname: `/${profile?.path || profileId}`,
        state: { comingFromCreateEvent: true, shouldShowMessage: true },
      });
    },
  });
  const [scrollToError, setScrollToError] = useState(false);

  const [geoAddressDB, setGeoAddressDB] = useState<GeoAddressDBType>();

  const initializeForm: CreateEventFormValues = {
    ...initialValues,
    university: profile?.university?.id || '',
    sport: profile?.sport?.id || '',
    position: profile?.primaryPosition?.id || '',
    timezone,
    locationType: 'In-Person',
  };

  const defineGeoAddress: defineGeoAddressType = (params) => {
    const { geoAddressDB: _geoAddressDB } = params ?? {};

    if (geoAddressDB !== _geoAddressDB) setGeoAddressDB(_geoAddressDB);
  };

  return (
    <section className="create-event-section">
      <Formik<CreateEventFormValues>
        validateOnChange={
          false // This is really important for Timeslots array performance
          // Note: Yup validation is still picking up on change.
        }
        initialValues={emptyInitialValues}
        validationSchema={timeslotsFormValidationSchema}
        enableReinitialize
        onSubmit={({
          skill,
          position,
          picture,
          maxParticipantsCount,
          cost,
          ...values
        }) => {
          createEvent({
            variables: {
              event: {
                ...values,
                geoAddressDB,
                image: !!picture ? picture : undefined,
                skill: skill || undefined,
                position: position || undefined,
                eventType: EventTypeEnum.MULTIPLE_TIMESLOTS,
                coachProfileId: Number(profileId),
                timeslots: values.timeslots.map((t: CreateTimeSlotInput) => ({
                  ...t,
                  startDate: moment
                    .tz(new Date(t.startDate), timezone)
                    .format('YYYY-MM-DDTHH:mm:ssZ'),
                  cost,
                  maxParticipantsCount,
                })),
              },
            },
          });
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          isSubmitting,
          setFieldValue,
          setValues,
        }: DerivedFormikProps<FormikValues>) => (
          <div className="container">
            <div className="row title">
              <h1 className="col-lg-7 title-text">Create a Training Session</h1>
              <div className="btn-container col-lg-5 d-flex align-items-center justify-content-end py-2">
                <Button
                  className="btn btn-primary mx-2"
                  onClick={() => setValues(initializeForm)}
                >
                  Fill Default Values
                </Button>
                <Button
                  className="btn btn-primary"
                  onClick={() => setValues(emptyInitialValues)}
                >
                  Clear Form
                </Button>
              </div>
            </div>
            <BootstrapForm onSubmit={handleSubmit}>
              {scrollToError && <ScrollToError />}
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
                <Input name="title" label="Training Sessions Title*" />
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
                        setFieldValue('position', '');
                        setFieldValue('skill', '');
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
              <div className="row">
                <div className="col-sm-6">
                  <Input type="number" name="cost" label="Cost*" />
                </div>
                <div className="col-sm-6">
                  <Input
                    type="number"
                    name="maxParticipantsCount"
                    label="Participants Limit (Max)*"
                  />
                </div>
              </div>
              <TimeslotsCreator name="timeslots" />
              <div className="form-group">
                <Textarea
                  name="about"
                  label={`About Training Session* ${
                    values.about ? `(${values.about.length}/450)` : ''
                  }`}
                  placeholder={'Type here...'}
                  rows={4}
                />
              </div>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {errorToString(error)}
                </div>
              )}
              <Button
                type="submit"
                className="btn btn-primary submit-btn"
                onClick={() => {
                  setScrollToError(true);
                }}
              >
                Publish Training
              </Button>
            </BootstrapForm>
          </div>
        )}
      </Formik>
    </section>
  );
};
