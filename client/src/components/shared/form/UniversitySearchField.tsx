import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { SelectField } from './SelectField';
import { useAxios } from '../api/use-axios';
import { FormFieldProps, University } from 'src/types';

export const UniversitySearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    valueTracker?: number;
  }
> = ({
  name,
  label = 'University*',
  containerGridArea,
  helpText,
  placeholder,
  withLabel = true,
  valueTracker,
  onChange,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  useEffect(() => {
    if (!valueTracker) {
      setValue(initialValue);
    }
  }, [valueTracker]);

  const { response, error, loading } = useAxios<{
    universities?: University[];
  }>({
    url: `${process.env.REACT_APP_API || ''}/rest/lookups/universities`,
  });
  const options = useMemo(() => {
    if (error || !response || !response.universities) return [];
    return response.universities.map((item: { name: string; id: number }) => ({
      label: item.name,
      value: item.id,
    }));
  }, [response]);

  useEffect(() => {
    if (error || !response || !response.universities) return;
    setValue(initialValue);
  }, [response, loading]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
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
          Error: Unable to retrieve {name}.
        </p>
      )}
    </>
  );
};
