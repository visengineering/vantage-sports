import React, {
  FC,
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  useMemo,
} from 'react';
import { Formik, useFormikContext } from 'formik';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  CreateAvailabilityEventFormValues,
  CreateEventPayloadValues,
  EventCreateMutation,
  EventCreateReturnData,
  EventSessionTypeEnum,
  EventTypeEnum,
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
import { createEventMutation } from '../../../../shared/api/event';
import { MainContext } from '../../../../../contexts/MainContext';
import { AvailabilityLengthField } from '../../../../shared/form/AvailabilityLengthField';
import { Stack } from 'src/components/shared/Stack';
import {
  computeTimeslots,
  dayNrToWeekText,
  getEventTitleAndAbout,
} from './helpers';
import UploadImageField from 'src/components/shared/form/UploadImageField';
import {
  availabilityFormValidationSchema,
  isKnownSport,
} from '../../event-timeslots/validation-schema';
import { AvailabilitySummary } from './AvailabilitySummary';
import { Input } from 'src/components/shared/form/Input';
import { Textarea } from 'src/components/shared/form/TextArea';
import { useMediaQuery } from 'react-responsive';
import {
  isLargeMobileMediaQuery,
  isTabletMediaQuery,
  isDesktopMediaQuery,
} from 'src/components/shared/utils/responsiveness';
import { useTimezone } from 'src/components/shared/hooks/use-timezone';
import { errorToString } from 'src/components/shared/api/errorToString';
import { ScheduleInput } from 'src/components/shared/form/ScheduleInput';
import { ScrollToError } from 'src/components/shared/form/ScrollToError';
import { useNotification } from 'src/components/shared/hooks/use-notifications';

const mapFormIntoPayload = (
  {
    availability,
    availabilityLength,
    cost,
    duration,
    maxParticipantsCount,
    picture,
    skill,
    position,
    ...otherProps
  }: CreateAvailabilityEventFormValues,
  profileId: number,
  geoAddressDB: GeoAddressDBType
): {
  variables: {
    event: Omit<CreateEventPayloadValues, 'position' | 'picture'> & {
      image?: string;
      coachProfileId: number;
      eventType: EventTypeEnum;
      position: number | undefined;
    };
  };
} => {
  return {
    variables: {
      event: {
        ...otherProps,
        geoAddressDB,
        position: position || undefined,
        image: !!picture ? picture : undefined,
        skill: skill || undefined,
        timeslots: computeTimeslots(
          availability,
          availabilityLength,
          cost,
          duration,
          maxParticipantsCount
        ),
        eventType: EventTypeEnum.AVAILABILITY,
        coachProfileId: Number(profileId),
      },
    },
  };
};

export const SetAvailabilityForm: FC = () => {
  const { profile, profileId } = useContext(MainContext);
  const notify = useNotification();

  const history = useHistory();
  const timezone = useTimezone();

  const [geoAddressDB, setGeoAddressDB] = useState<GeoAddressDBType>();

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
        state: { shouldShowMessage: true, comingFromCreateEvent: true },
      });
    },
  });

  const { eventAbout, eventTitle } = getEventTitleAndAbout(profile);

  return (
    <section className="create-event-section">
      <div className="container">
        <h1 className="title">Set your Availability</h1>
        <Formik<CreateAvailabilityEventFormValues>
          initialValues={{
            title: eventTitle,
            picture: '',
            university: profile?.university?.id || '',
            sport: profile?.sport?.id || '',
            position: profile?.primaryPosition?.id || '',
            skill: '',
            location: '',
            locationType: 'In-Person',
            availabilityLength: '',
            cost: '',
            duration: '',
            timezone,
            maxParticipantsCount: 1,
            availability: [],
            about: eventAbout,
          }}
          validationSchema={availabilityFormValidationSchema}
          onSubmit={(values) => {
            createEvent(mapFormIntoPayload(values, profileId!, geoAddressDB!));
          }}
        >
          <SetAvailabilityFormInner
            error={error}
            loading={loading}
            geoAddressDB={geoAddressDB}
            setGeoAddressDB={setGeoAddressDB}
          />
        </Formik>
      </div>
    </section>
  );
};

const weekdaysArray = [1, 2, 3, 4, 5, 6, 7];

export const SetAvailabilityFormInner: FC<{
  error?: Error;
  loading: boolean;
  geoAddressDB: GeoAddressDBType | undefined;
  setGeoAddressDB: Dispatch<SetStateAction<GeoAddressDBType | undefined>>;
}> = ({ error, loading, geoAddressDB, setGeoAddressDB }) => {
  const { values, handleSubmit, setFieldValue } =
    useFormikContext<CreateAvailabilityEventFormValues>();
  const isLargeMobile = useMediaQuery(isLargeMobileMediaQuery);
  const isTablet = useMediaQuery(isTabletMediaQuery);
  const isDesktop = useMediaQuery(isDesktopMediaQuery);
  const weekdaysNotSelected = useMemo(
    () => weekdaysArray.filter((nr) => !!!values.availability[nr]),
    [values.availability]
  );

  const defineGeoAddress: defineGeoAddressType = (params) => {
    const { geoAddressDB: _geoAddressDB } = params ?? {};

    if (geoAddressDB !== _geoAddressDB) setGeoAddressDB(_geoAddressDB);
  };

  return (
    <BootstrapForm onSubmit={handleSubmit}>
      <ScrollToError />
      <div className="form-group">
        <Stack flow="row" justifyContent="center" alignItems="center">
          <div className="img-upload-block">
            <div className="img-container" style={{ width: '400px' }}>
              <UploadImageField
                name="picture"
                type={MediaTypeEnum.EVENT_PICTURE}
              />
            </div>
          </div>
        </Stack>
      </div>
      <div className="form-group">
        <Input name="title" label="Training Sessions Title*" />
      </div>
      <div className="row">
        <div className="col-md-6">
          <UniversitySearchField name="university" />
        </div>
        <div className="col-md-6">
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
          <div className="col-md-6">
            <PositionSearchField name="position" sportId={values.sport} />
          </div>
          <div className="col-md-6">
            <SkillSearchField name="skill" sportId={values.sport} />
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-6">
          <LocationTypeSearchField
            name="locationType"
            onChange={(value: any) => {
              setFieldValue('location', '');
              setGeoAddressDB(undefined);
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
        <div className="col-md-6">
          <Input type="number" name="cost" label="Cost*" />
        </div>
        <div className="col-md-6">
          <Input
            type="number"
            name="maxParticipantsCount"
            label="Participants Limit (Max)*"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <AvailabilityLengthField name="availabilityLength" />
        </div>
        <div className="col-md-6">
          <Input type="number" name="duration" label="Duration (minutes)*" />
        </div>
      </div>
      <div className="form-group">
        <h3>Your Weekly Availability</h3>
        <Stack flow="row" gap={1}>
          {weekdaysNotSelected.length > 0 && (
            <Stack
              flow="row"
              templateColumns={
                isDesktop
                  ? '1fr 1fr 1fr 1fr'
                  : isTablet
                  ? '1fr 1fr 1fr'
                  : isLargeMobile
                  ? '1fr 1fr'
                  : '1fr'
              }
              gap={1}
            >
              {weekdaysNotSelected.map((dayNr) => (
                <Button
                  key={dayNr}
                  type="submit"
                  onClick={() => {
                    const newAvailabilityArray = Array.from(
                      Array(8).keys() /* Includes leading 0 for Formik */
                    ).map((_, index: number) =>
                      index === dayNr
                        ? {
                            from: '',
                            to: '',
                          }
                        : values.availability[index] || null
                    );
                    setFieldValue('availability', newAvailabilityArray);
                  }}
                  className="btn border border-primary bg-light text-primary font-weight-medium"
                >
                  Add {dayNrToWeekText(dayNr)}
                </Button>
              ))}
            </Stack>
          )}
          <ScheduleInput name="availability" />
        </Stack>
      </div>
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
      <div className="form-group">
        <AvailabilitySummary />
      </div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {errorToString(error)}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="btn btn-primary submit-btn"
      >
        Publish Training
      </Button>
    </BootstrapForm>
  );
};
