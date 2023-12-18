import React, { createContext, FC, useContext } from 'react';

type ParentZIndexContextValue = number;

const ParentZIndexContext = createContext<ParentZIndexContextValue>(0);

export function useParentZIndex() {
  return useContext(ParentZIndexContext);
}

export const ParentZIndexProvider: FC<{ value: number }> = ({
  children,
  value,
}) => {
  return (
    <ParentZIndexContext.Provider value={value}>
      {children}
    </ParentZIndexContext.Provider>
  );
};
