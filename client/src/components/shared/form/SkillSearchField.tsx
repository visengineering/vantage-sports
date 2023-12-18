import React, { FC, useEffect, useMemo } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { SelectField } from './SelectField';
import { useAxios } from '../api/use-axios';
import { FormFieldProps, Skill } from '../../../types';

export const SkillSearchField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    sportId?: number;
  }
> = ({ name, label = 'Skill', sportId }) => {
  const { response, error, loading, refetch } = useAxios<{
    skills?: Skill[];
  }>({
    url: `${process.env.REACT_APP_API || ''}/rest/lookups/skills`,
  });
  const [field, _, { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);
  const options = useMemo(() => {
    if (error || !response || !response.skills) return [];
    return response.skills
      .filter((s) => (sportId ? s.sportId == sportId : true))
      .map((item: { name: string; id: number }) => ({
        label: item.name,
        value: item.id,
      }));
  }, [response]);
  useEffect(() => {
    setValue('');
    refetch();
  }, [sportId]);

  useEffect(() => {
    if (error || !response || !response.skills) return;
    setValue(initialValue);
  }, [response, loading]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && <SelectField {...field} label={label} options={options} />}
      {error && (
        <p className="text text-danger text-small m-2">
          Unable to retrieve {name} list.
        </p>
      )}
    </>
  );
};
