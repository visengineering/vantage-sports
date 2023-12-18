import React, { ReactNode, useState } from 'react';
import { EventSessionType } from 'src/types';

type CriteriaContextType = {
  universityId: number | undefined;
  setUniversityId: (nr: number) => void;
  sportId: number | undefined;
  setSportId: (nr: number) => void;
  skillId: number | undefined;
  setSkillId: (nr: number) => void;
  sessionType: EventSessionType | undefined;
  setSessionType: (session: EventSessionType) => void;
  positionId: number | undefined;
  setPositionId: (nr: number) => void;
};
const CriteriaContext = React.createContext<CriteriaContextType>({
  universityId: undefined,
  setUniversityId: (nr: number) => {},
  sportId: undefined,
  setSportId: (nr: number) => {},
  skillId: undefined,
  setSkillId: (nr: number) => {},
  sessionType: undefined,
  setSessionType: (session: EventSessionType) => {},
  positionId: undefined,
  setPositionId: (nr: number) => {},
});

function CriteriaContextProvider({ children }: { children: ReactNode }) {
  const [universityId, setUniversityId] = useState<number | undefined>();
  const [sportId, setSportId] = useState<number | undefined>();
  const [skillId, setSkillId] = useState<number | undefined>();
  const [sessionType, setSessionType] = useState<
    EventSessionType | undefined
  >();
  const [positionId, setPositionId] = useState<number | undefined>();

  return (
    <CriteriaContext.Provider
      value={{
        universityId,
        setUniversityId,
        sportId,
        setSportId,
        skillId,
        setSkillId,
        sessionType,
        setSessionType,
        positionId,
        setPositionId,
      }}
    >
      {children}
    </CriteriaContext.Provider>
  );
}

export { CriteriaContextProvider, CriteriaContext };
