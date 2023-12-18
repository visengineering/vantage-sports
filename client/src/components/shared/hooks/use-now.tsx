import { createContext, useContext, useMemo } from 'react';

const NowContext = createContext<number | null>(null);
export const NowProvider = NowContext.Provider;

// use this hook, if you need Date.now() and you want to easily mock it's value (e.g. in storybook)
export function useNow() {
  const value = useContext(NowContext);
  const now = useMemo(() => value ?? Date.now(), [value]);
  return now;
}
