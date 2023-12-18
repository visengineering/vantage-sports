import Timeslot from '../models/Timeslot';
import moment from 'moment';

export const isTimeslotPast = (endDate: Timeslot['endDate']) =>
  moment(endDate).isBefore(new Date());

export const hasTimeslotStarted = (
  startDate: Timeslot['startDate'],
  endDate: Timeslot['endDate']
) =>
  moment(startDate).isBefore(new Date()) && moment(endDate).isAfter(new Date());
