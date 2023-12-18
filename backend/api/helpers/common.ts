import moment from 'moment-timezone';
import { Op } from 'sequelize';
import { Profile } from '../models';
import { DEFAULT_TIMEZONE } from './timezone';

const getProfilePathUsingName = async (name: String = '', id: number = 0) => {
  // remove special characters so 'repo test's 123' to 'repo tests 123'
  let path = name.replace(/[^a-zA-Z0-9 ]/g, '');

  // remove spaces and trim the path
  // NOTE: we have to remove special characters separately so 'repo test's 123' don't become 'repo-test-s-123'
  path = path.trim().replace(/\s+/g, '-').toLowerCase();

  const foundProfile = await Profile.findOne({
    where: {
      path,
      id: {
        [Op.ne]: id,
      },
    },
  });

  if (foundProfile) {
    path = `${path}-${id}`;
  }

  return path;
};

const addHoursToDate = (date: Date, hours: number) => {
  return new Date(new Date(date).setHours(date.getHours() + hours));
};

const convertMsToHours = (timeInMilliseconds: string) => {
  if (!timeInMilliseconds) {
    return 0;
  }

  const timeInNumber = parseInt(timeInMilliseconds);

  return timeInNumber / (3600 * 1000);
};

const getRemaingTimeslots = (date: Date, timezone: string) => {
  if (!date) {
    return '';
  }

  if (!timezone) {
    timezone = DEFAULT_TIMEZONE;
  }

  const remainingMinutes = moment
    .tz(date, timezone)
    .diff(moment.tz(new Date(), timezone), 'minutes');

  let remainingMinutesToString = `${remainingMinutes} minutes`;

  if (remainingMinutes > 60) {
    remainingMinutesToString = `One hour and ${remainingMinutes - 60} minutes`;
  }

  return remainingMinutesToString;
};

const flatMapAnArray = (objName: string, objArray: Array<any>) => {
  const map = new Map();

  objArray.forEach((obj: any) => {
    const storeValue = map.get(obj.id);
    const data = Array.isArray(obj[objName]) ? obj[objName][0] : obj[objName];

    if (Array.isArray(storeValue) && storeValue.length > 0) {
      storeValue.push(data);
      map.set(obj.id, storeValue);
    } else {
      map.set(obj.id, [data]);
    }
  });

  let uniqueArray = [...new Map(objArray.map((v: any) => [v.id, v])).values()];

  uniqueArray = uniqueArray.map((event: any) => ({
    ...event,
    [objName]: map.get(event.id),
  }));

  return uniqueArray;
};

export {
  getProfilePathUsingName,
  getRemaingTimeslots,
  flatMapAnArray,
  addHoursToDate,
  convertMsToHours,
};
