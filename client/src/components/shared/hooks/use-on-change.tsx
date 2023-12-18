import { useEffect } from 'react';
import { usePrevious } from './use-previous';

export function useOnChange<T>(callback: (value: T) => void, value: T) {
  const prevValue = usePrevious(value);

  useEffect(() => {
    if (prevValue !== value) {
      callback(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValue, value]);
}
