import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { SelectField } from '../../../shared/form/SelectField';
import {
  FormFieldProps,
  TimeslotConnection,
  TimeslotModelWithEvent,
} from 'src/types';
import { Loading } from '../../../shared/Loading';
import { useQuery } from '@apollo/client';
import { coachUpcomingTrainings } from 'src/components/shared/api/timeslots';
import moment from 'moment';

export const DesiredTrainingSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    coachProfileId: number;
  }
> = ({
  name,
  label = 'New training timeslot to reschedule to*',
  containerGridArea,
  helpText,
  placeholder,
  withLabel = true,
  onChange,
  coachProfileId,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  const {
    loading: loadingProfiles,
    error,
    data,
    refetch,
  } = useQuery<TimeslotConnection>(coachUpcomingTrainings, {
    variables: {
      upcoming: true,
      limit: 10,
      offset: 0,
      coachProfileId,
      isCancelled: false,
    },
  });

  const options = useMemo(() => {
    if (error || !data) return [];
    return data.timeslot.edges.map(
      ({ node: timeslot }: { node: TimeslotModelWithEvent }, id: number) => ({
        label: `${
          timeslot.participantsCount === timeslot.maxParticipantsCount
            ? '(Caution: full!!!) '
            : ''
        }Training ${moment(timeslot.startDate)
          .utc()
          .local()
          .format('ddd, MM/DD/YYYY, h:mm a')} · ${timeslot.duration} mins · $${
          timeslot.cost
        } · Participants ${timeslot.participantsCount}/${
          timeslot.maxParticipantsCount
        }  - ${timeslot.event.title}`,
        value: timeslot,
      })
    );
  }, [data]);

  useEffect(() => {
    if (error || !data) return;
    setValue(initialValue);
  }, [data, loadingProfiles]);

  return (
    <>
      {loadingProfiles && <Loading />}
      {!loadingProfiles && (
        <SelectField
          containerGridArea={containerGridArea}
          name={name}
          helpText={helpText}
          options={options as any}
          label={withLabel ? label : undefined}
          placeholder={placeholder}
          onChangeCb={onChange}
        />
      )}
      {error && (
        <p className="text text-danger text-small m-2">
          Error: Unable to fetch coach training timeslots.
        </p>
      )}
    </>
  );
};
