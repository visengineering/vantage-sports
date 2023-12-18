import { createContext, useContext, useMemo } from 'react';

const TimezoneContext = createContext<string | null>(null);
export const TimezoneProvider = TimezoneContext.Provider;

// use this hook, if you need Timezone and you want to easily mock it's value (e.g. in storybook/tests)
export function useTimezone() {
  const value = useContext(TimezoneContext);
  const timezone = useMemo(
    () => value ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    [value]
  );
  return timezone;
}
