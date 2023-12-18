import React, { FC, useEffect, useMemo } from 'react';
import { GroupWrap } from 'src/components/group-wrap';
import { TimeslotModel } from '../../../../../types';
import {
  bucketSortTimeslots,
  isTimeslotFullyBooked,
  hasTimeslotStarted,
  isTimeslotPast,
  BucketSortedTimeslots,
  isTimeslotNotAvailable,
} from './helpers';
import { edit, deleteCalendar } from 'src/assets';
import { Button } from 'react-bootstrap';
import { Stack } from 'src/components/shared/Stack';
import { DetailsPageActionType } from './ViewEventTimeslot';
import DateSelect from 'src/components/shared/DateSelect';
import { FormatPrice } from 'src/components/shared/FormatPrice';
import moment from 'moment';

export const TimeslotsCard: FC<{
  coachName?: string;
  isMyEvent: boolean;
  timeslots: TimeslotModel[];
  selectedDate: string;
  setSelectedDate: Function;
  isSamePrice: boolean;
  disabledBooking?: boolean;
  onSelect?: (timeslotId: number, actionType: DetailsPageActionType) => void;
  onSelectDay?: (actionType: DetailsPageActionType) => void;
}> = ({
  isMyEvent,
  timeslots,
  selectedDate,
  setSelectedDate,
  onSelect,
  onSelectDay,
  isSamePrice,
  disabledBooking,
}) => {
  const byDate = useMemo<BucketSortedTimeslots>(() => {
    return bucketSortTimeslots(timeslots);
  }, [timeslots]);

  useEffect(() => {
    if (!(byDate as any)[selectedDate]) {
      setSelectedDate(Object.keys(byDate)[0]);
    }
  }, [timeslots]);

  return (
    <div className="event-details">
      <h1 className="title">Available dates</h1>

      <div className="row">
        <div className="col-lg-4 col-md-6">
          <DateSelect
            dates={byDate}
            selected={selectedDate}
            setTimeslot={(event) => setSelectedDate(event)}
          />
        </div>
        {isMyEvent &&
          (moment(selectedDate).isAfter(new Date()) ||
            moment(selectedDate).isSame(new Date(), 'day')) && (
            <Button
              onClick={() => (onSelectDay ? onSelectDay('DELETE_CANCEL') : {})}
              variant="secondary"
              className="btn border border-primary bg-white text-primary font-weight-medium form-group"
            >
              <img src={deleteCalendar} alt="Delete or cancel day" />
            </Button>
          )}
      </div>

      {selectedDate && (byDate as any)[selectedDate] && (
        <div className="row">
          <div className="col-md-12 gutter">
            <GroupWrap gap={1} style={{ marginLeft: `${1 / 2}rem` }}>
              {(byDate as any)[selectedDate].map(
                (a: {
                  value: string;
                  index: number;
                  timeslot: TimeslotModel;
                }) => (
                  <Stack gap={0.2} flow="column" key={a.index}>
                    {a.timeslot.isCancelled ||
                    isTimeslotFullyBooked(
                      a.timeslot.participantsCount,
                      a.timeslot.maxParticipantsCount
                    ) ||
                    isTimeslotPast(a.timeslot.endDate) ||
                    hasTimeslotStarted(
                      a.timeslot.startDate,
                      a.timeslot.endDate
                    ) ||
                    isTimeslotNotAvailable(a.timeslot.startDate) ||
                    disabledBooking ? (
                      <Button
                        onClick={() =>
                          onSelect ? onSelect(a.index, 'PURCHASE') : {}
                        }
                        variant="secondary"
                        className="btn border border-secondary bg-white text-secondary font-weight-medium"
                      >
                        {a.value}
                        {a.timeslot.isCancelled
                          ? ' (cancelled)'
                          : isTimeslotFullyBooked(
                              a.timeslot.participantsCount,
                              a.timeslot.maxParticipantsCount
                            ) &&
                            !isTimeslotPast(a.timeslot.endDate) &&
                            !hasTimeslotStarted(
                              a.timeslot.startDate,
                              a.timeslot.endDate
                            )
                          ? ' (fully booked)'
                          : !isSamePrice && (
                              <>
                                {` · `}
                                <FormatPrice price={a.timeslot.cost} />
                              </>
                            )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          onSelect ? onSelect(a.index, 'PURCHASE') : {}
                        }
                        variant="secondary"
                        className="btn border border-primary bg-white text-primary font-weight-medium"
                      >
                        {a.value}{' '}
                        {!isSamePrice && (
                          <>
                            {` · `}
                            <FormatPrice price={a.timeslot.cost} />
                          </>
                        )}
                      </Button>
                    )}
                    {isMyEvent &&
                      !a.timeslot.isCancelled &&
                      !isTimeslotPast(a.timeslot.endDate) &&
                      !hasTimeslotStarted(
                        a.timeslot.startDate,
                        a.timeslot.endDate
                      ) && (
                        <Button
                          onClick={() =>
                            onSelect ? onSelect(a.index, 'EDIT') : {}
                          }
                          variant="secondary"
                          className="btn border border-primary bg-white text-primary font-weight-medium"
                        >
                          <img src={edit} alt="Edit date and time" />
                        </Button>
                      )}
                    {!isTimeslotPast(a.timeslot.endDate) &&
                      !hasTimeslotStarted(
                        a.timeslot.startDate,
                        a.timeslot.endDate
                      ) &&
                      isMyEvent &&
                      !a.timeslot.isCancelled && (
                        <Button
                          onClick={() =>
                            onSelect ? onSelect(a.index, 'DELETE_CANCEL') : {}
                          }
                          variant="secondary"
                          className="btn border border-primary bg-white text-primary font-weight-medium"
                        >
                          <img
                            src={deleteCalendar}
                            alt="Delete or cancel this timeslot"
                          />
                        </Button>
                      )}
                  </Stack>
                )
              )}
            </GroupWrap>
          </div>
        </div>
      )}
    </div>
  );
};
