import React, { FC, ReactNode } from 'react';
import { useField } from 'formik';
import { useMemoOne } from 'use-memo-one';
import { FormFieldProps, UserTypeEnum } from 'src/types';
import { ClassicSelectField } from './ClassicSelectField';

const userTypeOptions: {
  value: UserTypeEnum | '3';
  label: string;
}[] = [
  {
    label: 'Parent',
    value: '3',
  },
  {
    label: 'High School/Youth Athlete',
    value: UserTypeEnum.TRAINEE,
  },
  {
    label: 'College Athlete',
    value: UserTypeEnum.COACH,
  },
];
export const UserTypeField: FC<
  FormFieldProps & {
    containerGridArea?: string;
    groupClassName?: string;
    invertedLabel?: boolean;
    errorOutsideGroup?: boolean;
    noErrorText?: boolean;
    groupChildren?: ReactNode;
    placeholder?: string;
    withLabel?: boolean;
    onChange?: (value: any) => void;
    valueTracker?: string;
  }
> = ({
  name,
  label = 'User Type*',
  placeholder,
  containerGridArea,
  helpText,
  withLabel = true,
  onChange,
  groupChildren,
  groupClassName,
  noErrorText,
  errorOutsideGroup,
  invertedLabel,
}) => {
  const [field, , { setValue }] = useField(name);
  const initialValue = useMemoOne(() => field.value, []);

  return (
    <ClassicSelectField
      containerGridArea={containerGridArea}
      groupChildren={groupChildren}
      errorOutsideGroup={errorOutsideGroup}
      invertedLabel={invertedLabel}
      noErrorText={noErrorText}
      name={name}
      groupClassName={groupClassName}
      placeholder={placeholder}
      label={withLabel ? label : undefined}
      helpText={helpText}
      options={userTypeOptions}
      defaultValue={initialValue}
      onChange={onChange}
    />
  );
};
