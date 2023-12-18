import { useEffect, useState } from 'react';

export const defaultInitialSeconds = 5;
// speed up countdown within tests
const delay = process.env.NODE_ENV === 'test' ? 50 : 1000;

export function useCountdown(
  initialSeconds: number = defaultInitialSeconds
): [number | null, (time?: number) => void, () => void] {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (seconds === null) return;
    if (seconds === 0) return;

    const id = setTimeout(() => setSeconds(seconds - 1), delay);
    return () => clearTimeout(id);
  }, [seconds]);

  return [
    seconds,
    (time?: number) => {
      setSeconds(time ?? initialSeconds);
    },
    () => {
      setSeconds(null);
    },
  ];
}
