import { useEffect, useRef } from 'react';

export function useMounted() {
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  return mounted;
}
