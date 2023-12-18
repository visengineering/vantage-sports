import { EventSessionType } from './models/Event';
import { GeoAddressDBType } from './models/GeoAddress';

export type FormInputTimeSlot = {
  startDate: Date;
  endDate?: string;
  duration: number;
  cost: number;
  maxParticipantsCount: number;
};

export type FormInputTimeSlotModified = {
  startDate: Date;
  endDate: Date;
  duration: number;
  cost: number;
  maxParticipantsCount: number;
  timeslot?: Date[];
};

// FE: CreateEventFormValues
export type GQLEventCreateTimeslots = {
  coachProfileId: number;
  image: number;
  title: string;
  university: number;
  sport: number;
  position: number;
  skill?: number;
  locationType: EventSessionType;
  location: string;
  geoAddressDB?: GeoAddressDBType;
  eventType: string;
  timezone: string;
  timeslots:
    | (Omit<FormInputTimeSlot, 'startDate'> & { startDate: string })[]
    | [];
  about: string;
};

// FE: EditEventFormValues
export type GQLEventEditTimeslots = {
  id: number;
  coachProfileId: number;
  mediaId?: number;
  title: string;
  universityId: number;
  sportId: number;
  positionId?: number; // note: position is optional, when: sport = other
  skillId?: number; // note: skill is optional, when: sport = other
  sessionType: EventSessionType;
  location: string;
  geoAddressDB?: GeoAddressDBType;
  eventType: string;
  description: string;
};
