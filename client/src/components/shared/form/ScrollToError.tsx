import React, { FC, useEffect } from 'react';
import { FormikErrors, useFormikContext } from 'formik';

const isObject = (variable: any) =>
  typeof variable === 'object' && !Array.isArray(variable) && variable !== null;
const isArray = (variable: any) =>
  typeof variable === 'object' && Array.isArray(variable) && variable !== null;

const scrollToFirstError = (
  errors: FormikErrors<unknown>,
  scrollBehavior?: ScrollIntoViewOptions
) => {
  if (!errors) {
    return;
  }
  const firstError = Object.keys(errors)[0];

  if (!firstError) {
    return;
  }

  const input = document.querySelector(`input[name='${firstError}']`);
  if (input && input.getAttribute('type') !== 'hidden') {
    // Scroll to first known error into view
    input.scrollIntoView(scrollBehavior);
    return;
  }
  const textarea = document.querySelector(`textarea[name='${firstError}']`);
  if (textarea && textarea.getAttribute('type') !== 'hidden') {
    // Scroll to first known error into view
    textarea.scrollIntoView(scrollBehavior);
    return;
  }
  const error = (errors as unknown as any)[firstError];
  if (!isObject(error) && !isArray(error)) {
    const errorTxt = error?.toString();
    // Sometimes input is hidden by the external library and a substitute is used (like in Select)
    // Then we just fallback to plain error string check (paragraph)
    const findFields = [...document.querySelectorAll('p')].filter((div) =>
      div.innerHTML.includes(errorTxt)
    );
    if (findFields.length === 0) {
      return;
    }
    // Scroll to first known error into view
    findFields[0].scrollIntoView(scrollBehavior);
    return;
  }
  // Sometimes however the error is nested, because f.in. input is an array.
  if (isArray(error)) {
    scrollToFirstError({ ...error }, scrollBehavior);
    return;
  }
  scrollToFirstError(error, scrollBehavior);
};

export const ScrollToError: FC<{
  scrollBehavior?: ScrollIntoViewOptions;
}> = ({ scrollBehavior = { behavior: 'smooth', block: 'center' } }) => {
  const { errors, submitCount } = useFormikContext();
  useEffect(() => {
    scrollToFirstError(errors, scrollBehavior);
  }, [submitCount, errors]);

  return null;
};
