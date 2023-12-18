import { useFormikContext, FieldInputProps, FieldMetaProps } from 'formik';
import { useEffect } from 'react';
import { usePrevious } from './use-previous';

type GlobalError = true;

export type OnShowError = (error: string | GlobalError) => boolean;

// global form errors should be set via `setStatus(true)`
// server side validation errors should be set via `setStatus({ [field.name]: 'message' })`
export function useErrorHandler(
  field: FieldInputProps<unknown>,
  meta: FieldMetaProps<unknown>,
  onShowError?: OnShowError
) {
  const { submitCount, status, setStatus } = useFormikContext();
  const prevValue = usePrevious(field.value);

  const globalError = status === true;
  const serverError: string | undefined =
    typeof status === 'object' ? status[field.name] : undefined;

  let showError = Boolean(
    globalError || serverError || (meta.error && (meta.touched || submitCount))
  );

  if (showError && onShowError) {
    const error = globalError! || serverError! || meta.error!;
    showError = onShowError(error);
  }

  // reset server side validation error on change
  useEffect(() => {
    if (serverError && field.value !== prevValue) {
      const newStatus = { ...status };
      delete newStatus[field.name];
      setStatus(newStatus);
    }
  }, [serverError, field.value, prevValue, setStatus, status, field.name]);

  // in case of a global error, the error message can actually be undefined
  const error = serverError || meta.error;

  return [showError, error] as const;
}
