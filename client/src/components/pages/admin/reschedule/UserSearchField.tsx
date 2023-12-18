import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { SelectField } from '../../../shared/form/SelectField';
import { FormFieldProps, GraphQLUserProfile } from 'src/types';
import { Loading } from '../../../shared/Loading';
import { useQuery } from '@apollo/client';
import { allProfiles } from '../../../shared/api/profile';

export const UserSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
  }
> = ({
  name,
  label = 'User*',
  containerGridArea,
  helpText,
  placeholder,
  withLabel = true,
  onChange,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  const {
    loading: loadingProfiles,
    error,
    data,
    refetch,
  } = useQuery<{ profile: GraphQLUserProfile[] }>(allProfiles, {});

  const options = useMemo(() => {
    if (error || !data) return [];
    return data.profile.map((item: GraphQLUserProfile) => ({
      label: `${item.name} (${item.user?.email}) - user id: ${item.user?.id} - profile id: ${item.id}`,
      value: item.userId,
    }));
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
          options={options}
          label={withLabel ? label : undefined}
          placeholder={placeholder}
          onChangeCb={onChange}
        />
      )}
      {error && (
        <p className="text text-danger text-small m-2">
          Error: Unable to fetch user profiles.
        </p>
      )}
    </>
  );
};
