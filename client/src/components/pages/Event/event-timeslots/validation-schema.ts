import {
  checkOverlapTimeSlots,
  convertStringToNumber,
  validateDurationAvailability,
} from 'src/utils';
import * as yup from 'yup';
import {
  AvailabilityField,
  TimeSlotModel,
  EventSessionType,
  EventSessionTypeEnum,
} from '../../../../types';

const titleSchema = yup.string().label('Title').required();
const optionalPictureSchema = yup.string().optional();
const universitySchema = yup.number().label('University').required();
const universityOptionalSchema = yup.number().label('University').optional();

const sportSchema = (label = 'Sport') => yup.number().label('Sport').required();
const referralSchema = yup.number().label('Referral').required();
export const confirmationSchema = yup
  .boolean()
  .defined()
  .oneOf<boolean>([true], 'Required');

export const isKnownSport = (sportId: number) => {
  const OTHER_SPORT_ID = 9;
  return OTHER_SPORT_ID !== sportId;
};
const positionSchema = (label: string = 'Position') =>
  yup
    .mixed<number | null>()
    .label(label)
    .test(
      'Primary position and secondary position must be different.',
      'Primary position and secondary position must be different.',
      function () {
        if (!(this as any) || !(this as any).parent) return true;
        const { primaryPosition, secondaryPosition } = (this as any).parent;
        return !(
          primaryPosition &&
          secondaryPosition &&
          primaryPosition === secondaryPosition
        );
      }
    )
    .when('sport', {
      is: isKnownSport,
      then: yup.number().required(),
      otherwise: yup.number().optional().nullable(),
    });

const nameSchema = yup.string().label('Name').required();
const userTypeSchema = yup.string().label('User Type').required();

export const emailSchema = yup.string().email().label('Email').required();
export const passwordSchema = yup.string().label('Password').required();
export const password2Schema = yup
  .string()
  .label('Password')
  .oneOf([yup.ref('password1'), null], 'Passwords must match')
  .required();
const cellphoneSchema = yup.string().label('Cell Phone').required();
export const mobileSchema = yup
  .string()
  .label('Mobile Phone')
  .required()
  .test(
    'The mobile number must be 10 digits long.',
    'The mobile number must be 10 digits long.',
    function (nr: any) {
      const onlyNumbers = (nr ?? '').toString().replace(/\D/g, '');
      if (onlyNumbers.length === 10) {
        return true;
      }
      return false;
    }
  );
const bioSchema = yup
  .string()
  .label('About')
  .max(250, 'Text is too long. Limit: 250 characters.')
  .optional();

const genderSchema = yup.string().label('Gender').optional();
const classSchema = yup.string().label('Class').optional();
const heightSchema = yup.string().label('Height').optional();
const weightSchema = yup.string().label('Weight').optional();
const hometownSchema = yup.string().label('Hometown').optional().nullable();
const secondaryPositionSchema = yup
  .number()
  .label('Secondary Position')
  .optional()
  .nullable()
  .test(
    'Primary position and secondary position must be different.',
    'Primary position and secondary position must be different.',
    function () {
      if (!(this as any) || !(this as any).parent) return true;
      const { primaryPosition, secondaryPosition } = (this as any).parent;
      return !(
        primaryPosition &&
        secondaryPosition &&
        primaryPosition === secondaryPosition
      );
    }
  );

const isVirtualLocationType = (locationType: EventSessionType) => {
  return locationType === EventSessionTypeEnum.Virtual;
};

const locationSchema = yup
  .string()
  .required()
  .when('locationType', {
    is: isVirtualLocationType,
    then: yup.string().label('Video Chat Link'),
    otherwise: yup.string().label('Location'),
  });

const locationTypeSchema = yup.string().label('Location Type').required();
export const maxParticipantsCountSchema = yup
  .number()
  .label('Participants Limit (Max)')
  .required('Participants Limit is required')
  .integer('Value cannot have decimals.')
  .min(1, 'Must be greater or equal to 1.');

export const durationSchema = yup
  .number()
  .label('Duration')
  .required('Duration is required')
  .integer('Value cannot have decimals.')
  .min(1, 'Must be greater or equal to 1.');
export const costSchema = yup
  .number()
  .label('Cost')
  .integer('Value cannot have decimals.')
  .min(1, 'Must be greater or equal to 1.')
  .required('Cost is required');
const availabilityLengthSchema = yup
  .string()
  .label('Availability Length')
  .required('Availability Length is required');
const aboutSchema = yup
  .string()
  .label('About')
  .max(450, 'Text is too long. Limit: 450 characters.')
  .required()
  .matches(
    /^((?!PLEASE FILL IN DETAILS HERE).)*$/,
    'You must add in a few details.'
  );
export const startDateSchema = yup
  .date()
  .label('Start Date')
  .required()
  .test(
    'Timeslots cannot overlap',
    'Timeslots cannot overlap',
    function (item: any) {
      if (!(this as any) || !(this as any).parent) return true;

      const { from, parent } = this as any;
      const index = convertStringToNumber(this.path);

      const timeslots = from[1]?.value?.timeslots || [];

      if (!(Array.isArray(from) && from.length > 1)) {
        return true;
      }

      return !timeslots.some((timeSlot: TimeSlotModel, secondIndex: number) => {
        if (index !== secondIndex) {
          return checkOverlapTimeSlots(parent, timeSlot);
        } else {
          return false;
        }
      });
    }
  )
  .test(
    'Selected Time cannot be less than current Time',
    'Selected Time cannot be less than current Time',
    function (item: any) {
      if (!(this as any) || !(this as any).parent) return true;

      const currentDate = new Date();
      const selectedDate = new Date(item);

      if (selectedDate < currentDate) {
        return false;
      }

      return true;
    }
  );
const createTimeslotSchema = yup.object().shape({
  startDate: startDateSchema,
  duration: durationSchema,
});
const createTimeslotsArraySchema = yup
  .array()
  .of(createTimeslotSchema)
  .min(1, 'You need to schedule at least one session for your event.')
  .required();

export const editEventFormValidationSchema = yup
  .object({
    title: titleSchema,
    picture: optionalPictureSchema,
    university: universitySchema,
    sport: sportSchema(),
    position: positionSchema(),
    location: locationSchema,
    locationType: locationTypeSchema,
    about: aboutSchema,
  })
  .required();

export const timeslotsFormValidationSchema = yup
  .object({
    title: titleSchema,
    picture: optionalPictureSchema,
    university: universitySchema,
    sport: sportSchema(),
    position: positionSchema(),
    location: locationSchema,
    locationType: locationTypeSchema,
    maxParticipantsCount: maxParticipantsCountSchema,
    cost: costSchema,
    about: aboutSchema,
    timeslots: createTimeslotsArraySchema,
  })
  .required();
export const editCoachProfileFormValidationSchema = yup
  .object({
    name: nameSchema,
    email: emailSchema,
    cellphone: cellphoneSchema,
    sport: sportSchema(),
    primaryPosition: positionSchema('Primary Position'),
    gender: genderSchema,
    university: universityOptionalSchema,
    class: classSchema,
    secondaryPosition: secondaryPositionSchema,
    height: heightSchema,
    weight: weightSchema,
    hometown: hometownSchema,
    about: bioSchema,
  })
  .required();

const validateAvailability = (from?: string, to?: string) => {
  if (!from || !to) {
    if (from && !to) {
      return false; // '"To" time must be defined if "From" time is set.';
    }
    if (!from && to) {
      return false; // '"From" time must be defined if "To" time is set.';
    }
    return true;
  } else {
    if (!(from < to)) {
      return false; // '"To" time should be after "From" time';
    }
    return true;
  }
};

const availabilityTimeFromSchema = yup
  .mixed<string | null>()
  .label('From')
  .required()
  .test(
    'from is before to',
    '"To" time should be after "From" time.',
    function (item: AvailabilityField['from']) {
      if (!(this as any) || !(this as any).parent) return true;
      const { from: fromRaw, to: toRaw } = (this as any).parent;
      const from = fromRaw ? JSON.stringify(fromRaw) : '';
      const to = toRaw ? JSON.stringify(toRaw) : '';
      return validateAvailability(from, to);
    }
  );
const availabilityTimeToSchema = yup
  .mixed<string | null>()
  .label('To')
  .required()
  .test(
    'from is before to',
    '"To" time should be after "From" time.',
    function (item: AvailabilityField['to']) {
      if (!(this as any) || !(this as any).parent) return true;
      const { from: fromRaw, to: toRaw } = (this as any).parent;
      const from: string = fromRaw ? JSON.stringify(fromRaw) : '';
      const to: string = toRaw ? JSON.stringify(toRaw) : '';
      return validateAvailability(from, to);
    }
  );
const availabilitySchema = yup
  .array()
  .of(
    yup
      .object()
      .shape({
        from: availabilityTimeFromSchema,
        to: availabilityTimeToSchema,
      })
      .nullable()
  )
  .min(1, 'You need to schedule at least one session for your availability.')
  .required()
  .test(
    'Choose correct time slot or Enter correct time duration',
    'Choose correct time slot or Enter correct time duration',
    function (item: any) {
      if (!(this as any) || !(this as any).parent) return true;

      return validateDurationAvailability(this.parent.duration, item);
    }
  );

export const availabilityFormValidationSchema = yup
  .object({
    title: titleSchema,
    picture: optionalPictureSchema,
    university: universitySchema,
    sport: sportSchema(),
    position: positionSchema(),
    location: locationSchema,
    locationType: locationTypeSchema,
    maxParticipantsCount: maxParticipantsCountSchema,
    duration: durationSchema,
    cost: costSchema,
    availabilityLength: availabilityLengthSchema,
    about: aboutSchema,
    availability: availabilitySchema,
  })
  .required();

export const childNameSchema = yup.string().label('Child Name').required();
export const childRemarksSchema = yup
  .string()
  .label('Remarks')
  .max(250, 'Text is too long. Limit: 250 characters.')
  .optional();
export const childAgeSchema = yup
  .number()
  .label('Child Age')
  .required('Age is required')
  .integer('Age cannot have decimals.')
  .min(1, 'Must be greater or equal to 1.')
  .max(17, 'Must be lower or equal to 17.');
const childFavoriteSport = (label = 'Favorite Sport') =>
  yup.number().label(label).optional();
const childFavoritePosition = (label = 'Favorite Position') =>
  yup.mixed<number | null>().label(label).optional();

export const addChildFormSchema = yup
  .object({
    name: childNameSchema,
    age: childAgeSchema,
    remarks: childRemarksSchema,
    favoriteSportId: childFavoriteSport(),
    favoritePositionId: childFavoritePosition(),
  })
  .required();

export const registrationStep2Schema = (isSocialSignup: boolean) =>
  yup
    .object({
      name: nameSchema,
      ...(!isSocialSignup
        ? {
            password1: passwordSchema,
            password2: password2Schema,
          }
        : {}),
      userType: userTypeSchema,
      sport: sportSchema(),
      address: locationSchema,
      mobile: mobileSchema,
      referral: referralSchema,
      agreement: confirmationSchema,
    })
    .required();

export const rescheduleTrainingAdminForm = yup
  .object({
    userId: yup.number().label('User (ID)').required(),
    participantId: yup.number().label('Training (Participant)').required(),
    currentTimeslotId: yup
      .number()
      .label('Current Training Timeslot')
      .required(),
    desiredTimeslotId: yup.number().label('New Training Timeslot').required(),
  })
  .required();
