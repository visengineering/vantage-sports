import moment from 'moment';
import { AvailabilityField, TimeSlotModel } from 'src/types';

function checkOverlapTimeSlots(
  firstTimeSlot: TimeSlotModel,
  secondTimeSlot: TimeSlotModel
) {
  if (!(firstTimeSlot && secondTimeSlot)) {
    return false;
  }

  if (!(firstTimeSlot.startDate && secondTimeSlot.startDate)) {
    return false;
  }

  const firstStartDate = moment(firstTimeSlot.startDate);
  const secondStartDate = moment(secondTimeSlot.startDate);
  const firstEndDate = moment(firstTimeSlot.startDate).add(
    firstTimeSlot.duration || 0,
    'minutes'
  );
  const secondEndDate = moment(secondTimeSlot.startDate).add(
    secondTimeSlot.duration || 0,
    'minutes'
  );

  if (firstStartDate < secondEndDate && secondStartDate < firstEndDate) {
    return true;
  }

  return false;
}

function convertStringToNumber(string: string) {
  const numsStr = string.replace(/[^0-9]/g, '');
  return parseInt(numsStr);
}

function validateDurationAvailability(
  duration: number,
  availabilityFields: AvailabilityField[] | []
) {
  if (!duration) {
    return true;
  }

  if (!availabilityFields.length) {
    return true;
  }

  return !availabilityFields.some((field) => {
    if (!field) {
      return false;
    }

    if (!field.from || !field.to) {
      return false;
    }

    const fromDate = moment(field.from, 'hhmm');
    const toDate = moment(field.to, 'hhmm');
    const fieldDuraton = toDate.diff(fromDate, 'minutes');

    if (fieldDuraton < duration) {
      return true;
    }

    return false;
  });
}

export {
  checkOverlapTimeSlots,
  convertStringToNumber,
  validateDurationAvailability,
};
