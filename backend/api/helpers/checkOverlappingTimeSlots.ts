import { FormInputTimeSlotModified } from 'api/types';
import moment from 'moment-timezone';

function checkOverlapTimeSlots(
  firstTimeSlot: FormInputTimeSlotModified,
  secondTimeSlot: FormInputTimeSlotModified
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

export function checkOverlappingTimeSlots(
  timeslots: FormInputTimeSlotModified[]
) {
  return timeslots?.some(
    (timeSlot: FormInputTimeSlotModified, firstIndex: number) => {
      if (
        timeslots.some(
          (timeSlotSec: FormInputTimeSlotModified, secondIndex: number) => {
            if (firstIndex !== secondIndex) {
              return checkOverlapTimeSlots(timeSlot, timeSlotSec);
            } else {
              return false;
            }
          }
        )
      ) {
        return true;
      }
      return false;
    }
  );
}

export default {
  checkOverlappingTimeSlots,
};
