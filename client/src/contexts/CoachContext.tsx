import React, { ReactNode, useState } from 'react';
import { CoachQueryType } from 'src/types';

type CoachContextType = {
  coach: CoachQueryType | undefined;
  setCoach: (coach: CoachQueryType) => void;
  coachBusy: boolean;
  setCoachBusy: (isBusy: boolean) => void;
};

const CoachContext = React.createContext<CoachContextType>({
  coach: undefined,
  setCoach: () => {},
  coachBusy: true,
  setCoachBusy: () => {},
});

function CoachContextProvider({ children }: { children: ReactNode }) {
  const [coach, setCoach] = useState<CoachQueryType | undefined>(undefined);
  const [coachBusy, setCoachBusy] = useState<boolean>(true);

  return (
    <CoachContext.Provider
      value={{
        coach,
        setCoach,
        coachBusy,
        setCoachBusy,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
}

export { CoachContextProvider, CoachContext };
