import moment, { duration, Moment } from 'moment';
import v from 'voca';

import {
  AvailabilityField,
  AvailabilityLengthEnum,
  GraphQLUserProfile,
  TimeSlotModel,
} from '../../../../../types';

const determineEndDate = (
  availabilityLength: AvailabilityLengthEnum
): Moment => {
  const today = moment(Date.now());
  const endOfWeek = today.clone().endOf('isoWeek');

  switch (availabilityLength) {
    case AvailabilityLengthEnum.ONE_WEEK:
      return endOfWeek.add(1, 'week').endOf('isoWeek').clone();
    case AvailabilityLengthEnum.TWO_WEEKS:
      return endOfWeek.add(2, 'weeks').endOf('isoWeek').clone();
    case AvailabilityLengthEnum.THREE_WEEKS:
      return endOfWeek.add(3, 'weeks').endOf('isoWeek').clone();
    case AvailabilityLengthEnum.FOUR_WEEKS:
      return endOfWeek.add(4, 'weeks').endOf('isoWeek').clone();
    case AvailabilityLengthEnum.FIVE_WEEKS:
      return endOfWeek.add(5, 'weeks').endOf('isoWeek').clone();
    case AvailabilityLengthEnum.SIX_WEEKS:
      return endOfWeek.add(6, 'weeks').endOf('isoWeek').clone();
  }
};

const daysBetweenDates = (startDate: Moment, endDate: Moment): Moment[] => {
  let dates = [];

  let currDate = startDate.clone().startOf('day');
  const lastDate = endDate.clone().startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    dates.push(currDate.clone());
  }

  return [startDate.startOf('day'), ...dates, lastDate];
};

const timeslotsBetweenTimes = (
  startTime: Moment,
  endTime: Moment,
  duration: number // minutes
): { startTime: Moment; endTime: Moment }[] => {
  let timeslots = [];

  let start = startTime.clone();
  let end = startTime.clone().add(duration, 'minutes');

  while (end.diff(endTime) <= 0) {
    timeslots.push({
      startTime: start.clone(),
      endTime: end.clone(),
    });
    start = end.clone();
    end = start.clone().add(duration, 'minutes');
  }

  return timeslots;
};

const setTimeOfDay = (day: Moment, time: Moment): Moment =>
  day.set({
    hour: time.get('hour'),
    minute: time.get('minute'),
    second: time.get('second'),
  });

export const computeTimeslots = (
  availability: AvailabilityField[] | [] | undefined,
  availabilityLength: AvailabilityLengthEnum | '',
  cost: number | '',
  duration: number | '',
  maxParticipantsCount: number | ''
): TimeSlotModel[] => {
  if (
    !availability ||
    availability.length === 0 ||
    availabilityLength === '' ||
    cost === '' ||
    duration === '' ||
    maxParticipantsCount === ''
  ) {
    return [];
  }

  const tomorrow = moment(Date.now()).add(1, 'day');
  const endDate = determineEndDate(availabilityLength);
  const daysArray = daysBetweenDates(tomorrow, endDate);

  const timeslots: TimeSlotModel[] = daysArray
    .flatMap((day): TimeSlotModel[] | [] => {
      const weekDayNr = day.isoWeekday(); // 1,2,3,4,5,6,7
      if (
        availability[weekDayNr] &&
        availability[weekDayNr].from &&
        availability[weekDayNr].to
      ) {
        const fromTime = moment(availability[weekDayNr].from, 'HHmm');
        const toTime = moment(availability[weekDayNr].to, 'HHmm');
        const timesArray: { startTime: Moment; endTime: Moment }[] =
          timeslotsBetweenTimes(fromTime, toTime, duration);

        return timesArray.map((timerange) => {
          return {
            startDate: setTimeOfDay(day.clone(), timerange.startTime)
              .toDate()
              .toISOString(),
            endDate: setTimeOfDay(day.clone(), timerange.endTime)
              .toDate()
              .toISOString(),
            duration,
            cost,
            maxParticipantsCount,
          };
        });
      }
      return [];
    })
    .filter(Boolean);

  return timeslots;
};

export const dayNrToWeekText = (index: number) =>
  index === 1
    ? 'Monday'
    : index === 2
    ? 'Tuesday'
    : index === 3
    ? 'Wednesday'
    : index === 4
    ? 'Thursday'
    : index === 5
    ? 'Friday'
    : index === 6
    ? 'Saturday'
    : index === 7
    ? 'Sunday'
    : '';

const timeslotToTime = (slot: TimeSlotModel): string =>
  `${moment(slot.startDate).format('hh:mm A')} - ${moment(slot.endDate).format(
    'hh:mm A'
  )}`;

export const bucketSortTimeslots = (
  timeslots: TimeSlotModel[]
): {
  [key: string]: string[];
} => {
  return timeslots.reduce(
    (acc, timeslot) => {
      const dateM = moment(timeslot.startDate);
      const date = dateM.format('MM-DD-YYYY');
      const dayNr = dateM.isoWeekday();
      const index = `${date} (${dayNrToWeekText(dayNr)})`;
      if (acc[index]) {
        acc[index].push(timeslotToTime(timeslot));
        return acc;
      }

      return { ...acc, [index]: [timeslotToTime(timeslot)] };
    },
    {} as {
      [key: string]: string[];
    }
  );
};

export const getTitleCase = (title: string | undefined) => {
  if (!title || title === '0') {
    return '';
  }

  if (title.indexOf("'") != -1) return title + ' ';

  return v.titleCase(title) + ' ';
};
const sportsLession = ['Baseball', `Women's Softball`];

export const getEventTitleAndAbout = (
  profile: GraphQLUserProfile | undefined
) => {
  const eventTitle = `${getTitleCase(profile?.sport?.name)}${
    sportsLession.includes(profile?.sport?.name || '')
      ? 'Lessons'
      : 'Instruction'
  } with ${getTitleCase(profile?.university?.name)}${getTitleCase(
    profile?.class
  )}${getTitleCase(profile?.name)}`;

  const eventAbout = `Take your game to the next level with personalized instruction with ${getTitleCase(
    profile?.university?.name
  )}${getTitleCase(profile?.class)}${getTitleCase(
    profile?.name
  )}. This session will be personalized to focus on [PLEASE FILL IN DETAILS HERE].`;

  return { eventTitle, eventAbout };
};
