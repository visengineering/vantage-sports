import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { SelectField } from './SelectField';
import { useMemoOne } from 'use-memo-one';
import { useAxios } from '../api/use-axios';
import { FormFieldProps, Position } from '../../../types';

export const PositionSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    sportId?: number;
  }
> = ({ name, sportId, label = 'Position*', containerGridArea, helpText }) => {
  const { response, error, loading, refetch } = useAxios<{
    positions?: Position[];
  }>({
    url: `${process.env.REACT_APP_API || ''}/rest/lookups/positions`,
  });
  const [field, _, { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);
  const options = useMemo(() => {
    if (error || !response || !response.positions) return [];
    return response.positions
      .filter((s) => (sportId ? s.sportId == sportId : true))
      .map((item: { name: string; id: number }) => ({
        label: item.name,
        value: item.id,
      }));
  }, [response]);

  useEffect(() => {
    if (error || !response || !response.positions) return;

    const value =
      options.find(
        (option) => option.value?.toString() === initialValue?.toString()
      )?.value ?? '';
    setValue(value);
  }, [response, loading]);

  useEffect(() => {
    setValue('');
    refetch();
  }, [sportId]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <SelectField
          containerGridArea={containerGridArea}
          label={label}
          helpText={helpText}
          {...field}
          options={options}
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
