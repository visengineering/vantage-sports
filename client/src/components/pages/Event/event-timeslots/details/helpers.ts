import cloneDeep from 'lodash.clonedeep';
import moment from 'moment';

import { TimeSlotModel, TimeslotModel } from '../../../../../types';
import { dayNrToWeekText } from '../../availability/create/helpers';

const timeslotToTime = (slot: TimeSlotModel): string =>
  `${moment(slot.startDate).format('hh:mm A')} - ${moment(slot.endDate).format(
    'hh:mm A'
  )}`;

const TIMESLOT_AVAILABLE_IN_MS =
  process.env.REACT_APP_TIMESLOT_AVAILABLE_IN_MILLISECOND;

export const bucketSortTimeslotsWithIndex = (
  timeslots: TimeSlotModel[]
): {
  [key: string]: { value: string; index: number }[] | null;
} => {
  return timeslots.reduce(
    (acc, timeslot, iterIndex) => {
      const dateM = moment(timeslot.startDate);
      const date = dateM.format('MM-DD-YYYY');
      const dayNr = dateM.isoWeekday();
      const index = `${date} (${dayNrToWeekText(dayNr)})`;
      if (acc[index]) {
        acc[index]?.push({ value: timeslotToTime(timeslot), index: iterIndex });
        return acc;
      }

      return {
        ...acc,
        [index]: [{ value: timeslotToTime(timeslot), index: iterIndex }],
      };
    },
    {} as {
      [key: string]: { value: string; index: number }[] | null;
    }
  );
};

export type BucketSortedTimeslots = {
  [key: string]:
    | { value: string; index: number; timeslot: TimeslotModel }[]
    | null;
};

export const bucketSortTimeslots = (
  timeslots: TimeslotModel[]
): BucketSortedTimeslots => {
  return timeslots.reduce(
    (acc, timeslot, iterIndex) => {
      const dateM = moment(timeslot.startDate);
      const date = dateM.format('MM-DD-YYYY');
      const dayNr = dateM.isoWeekday();
      const index = `${date} (${dayNrToWeekText(dayNr)})`;
      if (acc[index]) {
        acc[index]?.push({
          value: timeslotToTime(timeslot),
          index: iterIndex,
          timeslot,
        });
        return acc;
      }

      return {
        ...acc,
        [index]: [
          { value: timeslotToTime(timeslot), index: iterIndex, timeslot },
        ],
      };
    },
    {} as {
      [key: string]:
        | {
            value: string;
            index: number;
            timeslot: TimeslotModel;
          }[]
        | null;
    }
  );
};
export const isTimeslotPast = (endDate: TimeslotModel['endDate']) =>
  moment(endDate).isBefore(new Date());

export const isTimeslotNotAvailable = (
  startDate: TimeslotModel['startDate']
) => {
  return moment(startDate).isBefore(
    moment().add(TIMESLOT_AVAILABLE_IN_MS, 'milliseconds')
  );
};

export const convertMsToHours = (timeInMilliseconds: string) => {
  if (!timeInMilliseconds) {
    return 0;
  }

  const timeInNumber = parseInt(timeInMilliseconds);

  return timeInNumber / (3600 * 1000);
};

export const hasTimeslotStarted = (
  startDate: TimeslotModel['startDate'],
  endDate: TimeslotModel['endDate']
) =>
  moment(startDate).isBefore(new Date()) && moment(endDate).isAfter(new Date());

export const isTimeslotFullyBooked = (
  participantsCount: TimeslotModel['participantsCount'],
  maxParticipantsCount: TimeslotModel['maxParticipantsCount']
) => participantsCount >= maxParticipantsCount;

export const getDateClosestToToday = (timeslots: TimeslotModel[]) => {
  if (!timeslots.length) {
    return '';
  }

  const today = moment();

  let filteredTimeslots = cloneDeep(timeslots);

  filteredTimeslots.sort(
    (a: TimeslotModel, b: TimeslotModel) =>
      +new Date(a.startDate) - +new Date(b.startDate)
  );

  let timeslot = filteredTimeslots.find((t) =>
    moment(t.startDate).isSame(today, 'minutes')
  );

  if (!timeslot) {
    timeslot = filteredTimeslots.find((t) =>
      moment(t.startDate).isAfter(today)
    );
  }

  if (!timeslot) {
    // sort array in reverse to fetch before today's closest date
    filteredTimeslots.sort(
      (a: TimeslotModel, b: TimeslotModel) =>
        +new Date(b.startDate) - +new Date(a.startDate)
    );

    timeslot = filteredTimeslots.find((t) =>
      moment(t.startDate).isBefore(today)
    );
  }

  if (!timeslot) {
    return '';
  }

  const date = moment(timeslot.startDate);

  return `${date.format('MM-DD-YYYY')} (${dayNrToWeekText(date.isoWeekday())})`;
};
