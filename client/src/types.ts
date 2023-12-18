import { FormikProps } from 'formik';
import { FormEvent, ReactNode } from 'react';
import { GeoAddressDBType } from './components/shared/hooks/googleapis/use-gmaps-place-result';

export type FormFieldProps = {
  name: string;
  label?: ReactNode;
  helpText?: string;
};

export type FormGroupCustomProps = {
  containerGridArea?: string;
  invertedLabel?: boolean;
  /**
   * Dirty hack for absolute positioning of label. Used in sign-in modal.
   * I don't like this hack but it makes the input work as desired.
   */
  errorOutsideGroup?: boolean;
  noErrorText?: boolean;
  groupChildren?: ReactNode;
};

export type SocialNetworkSignupDataType = {
  email: string;
  name?: string;
  socialType: string;
  socialToken: string;
};

export enum EventTypeEnum {
  // 1 - legacy one time event
  LEGACY_ONE_TIME = 'LEGACY_ONE_TIME',
  // 2 - event on multiple dates and timeslots
  MULTIPLE_TIMESLOTS = 'MULTIPLE_TIMESLOTS',
  // 3 - event meant to be an availability range with multiple dates and timeslots
  AVAILABILITY = 'AVAILABILITY',
}

export enum MediaTypeEnum {
  PROFILE_PICTURE = 'profile',
  EVENT_PICTURE = 'event',
  BANNER_PICTURE = 'banner',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'Non-Binary',
}

export type MediaType = {
  id: number;
  publicId: string;
  url: string;
};

export type EventSessionType = 'Virtual' | 'In-Person';

export enum EventSessionTypeEnum {
  Virtual = 'Virtual',
  In_Person = 'In-Person',
}

export type EventType = EventTypeEnum | null;

export type TimeslotModel = {
  id: number;
  startDate: string;
  endDate: string;
  duration: number;
  cost: number;
  event?: EventModel;
  maxParticipantsCount: number;
  participantsCount: number;
  isNotificationProcessed: boolean;
  isCancelled: boolean;
  notificationDate: string;
  cancelDate: string;
  participants?: Participant[];
};

export type Participant = {
  id: number;
  client?: GraphQLUserType;
};

export type University = {
  id: number;
  name: string;
  state: string;
  updatedAt: string;
  createdAt: string;
  conferenceId?: number;
  divisionId?: number;
  city?: string;
};

export type Sport = {
  id: number;
  name: string;
  // Add more types here if you need them
};

export type Referrer = {
  id: number;
  name: string;
};

export type Position = {
  id: number;
  name: string;
  sportId: number;
  // Add more types here if you need them
};

export type Skill = {
  id: number;
  name: string;
  sportId: number;
  // Add more types here if you need them
};

export type TimeSlotModel = {
  startDate: string;
  endDate?: string;
  duration: number | '';
  cost: number | '';
  maxParticipantsCount: number | '';
};

// Forms
export type DerivedFormikProps<Values> = FormikProps<Values> & {
  handleSubmit: (event: FormEvent<HTMLElement>) => void;
};

export type CreateTimeSlotInput = {
  startDate: string;
  duration: number | '';
};

export type CreateEventFormValues = {
  title: string;
  picture?: number;
  university: number | '';
  sport: number | '';
  position: number | '';
  skill: number | '';
  locationType: EventSessionType | '';
  location: string;
  cost: number | '';
  maxParticipantsCount: number | '';
  timeslots: CreateTimeSlotInput[] | [];
  about: string;
  timezone?: string;
};
export type EditCoachProfileFormValues = {
  name: string;
  university?: University['id'] | '';
  sport: Sport['id'] | '';
  primaryPosition: Position['id'] | '';
  secondaryPosition?: Position['id'] | '';
  bio?: string;
  email: string;
  cellphone: string;
  gender: GenderEnum | '';
  class?: string;
  height?: string;
  weight?: string;
  hometown?: string;
  profileImage?: number;
  bannerImage?: number;
  disabledBooking: boolean;
};

export type CreateEventPayloadValues = {
  picture?: number;
  title: string;
  university: number | '';
  sport: number | '';
  position?: number | '';
  skill?: number | '';
  locationType: EventSessionType | '';
  location: string;
  geoAddressDB?: GeoAddressDBType;
  timeslots: TimeSlotModel[] | [];
  about: string;
};

export type AvailabilityField = {
  from?: string | null;
  to?: string | null;
};

export enum AvailabilityLengthEnum {
  ONE_WEEK = 'one-week',
  TWO_WEEKS = 'two-weeks',
  THREE_WEEKS = 'three-weeks',
  FOUR_WEEKS = 'four-weeks',
  FIVE_WEEKS = 'five-weeks',
  SIX_WEEKS = 'six-weeks',
}

export type CreateAvailabilityEventFormValues = {
  title: string;
  picture: string;
  university: number | '';
  sport: number | '';
  position: number | '';
  skill: number | '';
  locationType: EventSessionType | '';
  location: string;
  availabilityLength: AvailabilityLengthEnum | '';
  cost: number | '';
  duration: number | '';
  maxParticipantsCount: number | '';
  timezone: string;
  availability: AvailabilityField[] | [];
  about: string;
};

export type ChildCreateForm = {
  name: string;
  age: number;
  remarks?: string;
  favoriteSportId?: number;
  favoriteSport?: Sport;
  favoritePositionId?: number;
  favoritePosition?: Position;
};

export type ChildUpdateForm = {
  id: number;
  name: string;
  age: number;
  remarks?: string;
  favoriteSportId?: number;
  favoriteSport?: Sport;
  favoritePositionId?: number;
  favoritePosition?: Position;
};

export type Child = {
  id: number;
  name: string;
  age: number;
  remarks?: string;
  parentProfileId: string;
  favoriteSportId?: number;
  favoriteSport?: Sport;
  favoritePositionId?: number;
  favoritePosition?: Position;
};

export type CreateChildPayloadValues = Child;

// API
export type EventCreateMutation = {
  createEvent: CreateEventPayloadValues & {
    coachProfileId: number;
    eventType: EventTypeEnum;
    timezone: string;
  };
};
export type EventCreateReturnData = {
  event: any; // TODO improve types
};
export type TimeslotEditMutation = {
  updateTimeslot: {
    cost: TimeslotModel['cost'];
    maxParticipantsCount: TimeslotModel['maxParticipantsCount'];
  };
};
export type TimeslotEditReturnData = {};

export type EventModel = {
  id: number;
  coach: GraphQLUserProfile;
  media?: MediaType;
  sport: Sport;
  timeslots: TimeslotModel[];
  university: University;
  position?: Position;
  skill?: Skill;
  profileId: number;
  universityId: number; // is not provided? at least on event details?
  sportId: number; // is not provided? at least on event details?
  skillId: number; // is not provided? at least on event details?
  mediaId: number; // is not provided? at least on event details?
  max: number;
  participantsCount: number;
  duration: number;
  sessionType: EventSessionType;
  cost: number;
  date: Date;
  timezone: string;
  location: string;
  title: string;
  description: string;
  isNotificationProcessed: boolean;
  isEventCancelled: boolean;
  eventCancelDate?: Date;
  notificationDate?: Date;
  dailyReminderAt?: Date;
  eventType?: EventType;
  createdAt: string;
  updatedAt: string;
};

export enum UserTypeEnum {
  // 1 - coach / trainer
  COACH = '1',
  // 2 - attendee / trainee
  TRAINEE = '2',
}

export type GraphQLUserType = {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile?: GraphQLUserProfile;
};

export type GraphQLMediaType = {
  id: number;
  name: string;
  publicId: string;
  url: string;
  type: string;
  externalId: number;
  eventId: number;
  profileId: number;
  contentId: number;
  createdAt: string;
  updatedAt: string;
};

export type GraphQLUserProfile = {
  id: number;
  user?: GraphQLUserType;
  userType: UserTypeEnum;
  name: string;
  userId: number;
  cellphone?: string;
  isPhoneVerified: boolean;
  profileImage?: GraphQLMediaType;
  bannerImage?: GraphQLMediaType;
  rating?: number;
  class?: string;
  sport?: Sport;
  state?: string;
  university?: University;
  primaryPosition?: Position;
  path?: string;
  gender?: GenderEnum;
  secondaryPosition?: Position;
  height?: string;
  weight?: string;
  hometown?: string;
  bio?: string;
  disabledBooking: boolean;
};

export interface CookieSetOptions {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | 'none' | 'lax' | 'strict';
  encode?: (value: string) => string;
}

export type MainContextType = {
  // Needs a lot of type updates - fill them as whenever needed.
  loading: boolean;
  invite: any;
  live: boolean;
  setLive: (a: boolean) => void;
  setInvite: any;
  jwt: string;
  profileId?: number;
  profile?: GraphQLUserProfile;
  setProfile: any;
  userId?: number;
  setUserId: (val: number | undefined) => void;
  admin: boolean;
  userType?: string;
  setUserType: (val: UserTypeEnum | undefined) => void;
  isSignedIn: boolean;
  coachId: any;
  setCoachId: any;
  player: any;
  isCoach: boolean;
  signedIn: any;
  userName: any;
  setUserName: (val: string) => void;
  isSocialSignup: any;
  setIsSocialSignup: any;
  socialToken: any;
  setSocialToken: any;
  socialType: any;
  isPhoneVerified: any;
  setIsPhoneVerified: any;
  showEventCancel: any;
  setShowEventCancel: any;
  detectBrowser: any;
  login: ({ jwt }: { jwt: string }) => void;
  logout: (args?: { isExpiredJwt?: boolean }) => void;
};

export type ReviewModel = {
  id: number;
  comment: string;
  rating: number;
};

export type EventModelWithCoach = EventModel & {
  coach: GraphQLUserProfile;
};

export type TimeslotModelWithEvent = TimeslotModel &
  EventModelWithCoach & {
    event: EventModel;
  };

export type TimeslotConnection = {
  timeslot: {
    total: number;
    edges: { node: TimeslotModelWithEvent }[];
  };
};

export type EditProfileMutation = {
  coach: {
    id: number;
    email: string;
    cellphone: string;
    name: string;
    sportId: number;
    universityId?: number;
    primaryPositionId?: number;
    secondaryPositionId?: number;
    skill?: string;
    bio?: string;
    gender?: string;
    class?: string;
    height?: string;
    weight?: string;
    profileImage: number | null;
    bannerImage: number | null;
    disabledBooking: boolean;
  };
};

export type UpdateProfileMutation = {
  updateCoach: {
    id: number;
    path: string;
    name: string;
  };
};

export type CoachQueryType = {
  id: number;
  user: GraphQLUserType;
  userId: number;
  name: string;
  userType: UserTypeEnum;
  sport: Sport;
  university?: University;
  city: string;
  state: string;
  zip: string;
  primaryPosition: Position;
  secondaryPosition: Position;
  skill: string;
  skill1: Skill;
  skill2: Skill;
  skill3: Skill;
  skill4: Skill;
  class: string;
  path?: string;
  gender?: GenderEnum;
  rating: number;
  height: string;
  weight: string;
  hometown: string;
  profileImage: GraphQLMediaType;
  bannerImage: GraphQLMediaType;
  bio: string;
  eventCount: number;
  cellphone: string;
  isPhoneVerified: boolean;
  updatedAt: string;
  disabledBooking: boolean;
};
