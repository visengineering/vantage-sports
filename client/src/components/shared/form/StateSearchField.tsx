import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { SelectField } from './SelectField';
import { useAxios } from '../api/use-axios';
import { FormFieldProps } from '../../../types';

export const StateSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    valueTracker?: string;
  }
> = ({
  name,
  label = 'State*',
  placeholder,
  withLabel = true,
  onChange,
  valueTracker,
}) => {
  const [field, value, { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);
  const { response, error, loading } = useAxios<{
    states?: { state: string }[];
  }>({
    url: `${process.env.REACT_APP_API || ''}/rest/lookups/states`,
  });
  const options = useMemo(() => {
    if (error || !response || !response.states) return [];
    return response.states.map((item: { state: string }) => ({
      label: item.state,
      value: item.state,
    }));
  }, [response]);

  useEffect(() => {
    if (error || !response || !response.states) return;
    setValue(initialValue);

    if (!loading && valueTracker) setValue(valueTracker);
  }, [response, loading, valueTracker]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <SelectField
          name={name}
          label={withLabel ? label : undefined}
          placeholder={placeholder}
          options={options}
          onChangeCb={onChange}
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
