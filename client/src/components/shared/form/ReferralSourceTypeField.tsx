import React, { FC, ReactNode, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { useAxios } from '../api/use-axios';
import { FormFieldProps, Referrer } from '../../../types';
import { ClassicSelectField } from './ClassicSelectField';

export const ReferralSourceTypeField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    valueTracker?: number;
    groupClassName?: string;
    invertedLabel?: boolean;
    errorOutsideGroup?: boolean;
    noErrorText?: boolean;
    groupChildren?: ReactNode;
  }
> = ({
  name,
  label = 'Where did you find us*',
  placeholder,
  withLabel = true,
  onChange,
  valueTracker,
  groupChildren,
  groupClassName,
  noErrorText,
  errorOutsideGroup,
  invertedLabel,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);
  const { response, error, loading } = useAxios<{
    referrers?: Referrer[];
  }>({
    url: `${process.env.REACT_APP_API || ''}/rest/lookups/referrers`,
  });
  const options = useMemo(() => {
    if (error || !response || !response.referrers) return [];
    return response.referrers.map((item: { name: string; id: number }) => ({
      label: item.name,
      value: item.id,
    }));
  }, [response]);

  useEffect(() => {
    if (error || !response || !response.referrers) return;
    setValue(initialValue);
    if (!loading && valueTracker) setValue(valueTracker);
  }, [response, loading, valueTracker]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <ClassicSelectField
          groupChildren={groupChildren}
          errorOutsideGroup={errorOutsideGroup}
          invertedLabel={invertedLabel}
          noErrorText={noErrorText}
          name={name}
          groupClassName={groupClassName}
          label={withLabel ? label : undefined}
          placeholder={placeholder}
          options={options}
          onChange={onChange}
        />
      )}
      {error && (
        <p className="text text-danger text-small m-2">
          Unable to retrieve {name} list.
        </p>
      )}
    </>
  );
};
