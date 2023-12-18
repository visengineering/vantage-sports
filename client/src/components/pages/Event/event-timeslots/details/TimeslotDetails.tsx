import moment from 'moment';
import React, { FC, useMemo } from 'react';
import { EventType, TimeslotModel } from '../../../../../types';
import { DataItems, DataList } from 'src/components/data-list';
import { Stack } from 'src/components/shared/Stack';
import { BookTimeslot } from '../../checkout/BookTimeslot';
import { Button } from 'react-bootstrap';
import {
  isTimeslotFullyBooked,
  hasTimeslotStarted,
  isTimeslotPast,
  isTimeslotNotAvailable,
  convertMsToHours,
} from './helpers';
import { FormatPrice } from 'src/components/shared/FormatPrice';

// 43200000 = 12 Hours
const DEFAULT_AVAILABLE_TIME_IN_MS = '43200000';

export const TimeslotDetails: FC<{
  timeslot: TimeslotModel;
  eventId: number;
  isMyEvent: boolean;
  isCoach: boolean;
  eventType?: EventType;
  coachName?: string;
  disabledBooking?: boolean;
  onCancel: () => void;
}> = ({
  isMyEvent,
  timeslot,
  eventId,
  coachName,
  eventType,
  onCancel,
  isCoach,
  disabledBooking,
}) => {
  const isCancelled = useMemo(() => timeslot.isCancelled, [timeslot]);
  const isPast = useMemo(() => isTimeslotPast(timeslot.endDate), [timeslot]);
  const isFullyBooked = useMemo(
    () =>
      isTimeslotFullyBooked(
        timeslot.participantsCount,
        timeslot.maxParticipantsCount
      ),
    [timeslot]
  );
  const hasStarted = useMemo(
    () => hasTimeslotStarted(timeslot.startDate, timeslot.endDate),
    [timeslot]
  );

  const isNotAvailable = useMemo(
    () => isTimeslotNotAvailable(timeslot.startDate),
    [timeslot]
  );

  const hoursBeforeAvailable = convertMsToHours(
    process.env.REACT_APP_TIMESLOT_AVAILABLE_IN_MILLISECOND ||
      DEFAULT_AVAILABLE_TIME_IN_MS
  );

  const showBookingForm =
    !isCancelled &&
    !isPast &&
    !isFullyBooked &&
    !hasStarted &&
    !isNotAvailable &&
    !disabledBooking;
  return (
    <div className="event-details">
      <h1 className="title">
        {isMyEvent ? 'Your Training on ' : 'Booking '}
        {moment(timeslot.startDate).local().format('ddd, MM/DD/YYYY, h:mm a')}
      </h1>
      <div className="details-card">
        <div className="row">
          <div className="col-md-6">
            <DataList>
              <DataItems>
                <span>Date and time</span>
                <span>
                  {moment(timeslot.startDate).format('MM/DD/YYYY hh:mm A')} -{' '}
                  {moment(timeslot.endDate).format('hh:mm A')}
                </span>
                <span>Cost</span>
                <span>
                  <FormatPrice price={timeslot.cost} />
                </span>
                <span>Duration</span>
                <span>{timeslot.duration} minutes</span>
                <span>Participants</span>
                <span>
                  {timeslot.maxParticipantsCount > 1
                    ? `Group of max. ${timeslot.maxParticipantsCount} people.`
                    : 'Private 1:1'}
                </span>
              </DataItems>
              {timeslot.participantsCount !== 0 && timeslot.participantsCount && (
                <p className="text text-primary text-small">
                  {timeslot.participantsCount}{' '}
                  {timeslot.participantsCount > 1
                    ? 'participants'
                    : 'participant'}{' '}
                  have joined this event.
                </p>
              )}
            </DataList>
          </div>
          <div className="col-md-6">
            <Stack flow="row" gap={1}>
              {isCoach ? (
                <Stack flow="row" gap={1}>
                  <div>
                    You are logged in as a coach. To book a training please
                    create a player account.
                  </div>
                  <Button onClick={onCancel} className="btn btn-primary">
                    Go Back
                  </Button>
                </Stack>
              ) : showBookingForm ? (
                <BookTimeslot
                  eventId={eventId}
                  eventType={eventType}
                  timeslot={timeslot}
                  onCancel={onCancel}
                />
              ) : (
                <Stack flow="row" gap={1}>
                  {isCancelled ? (
                    <div>
                      This timeslot has been cancelled{' '}
                      {coachName ? ` by ${coachName}` : ''}. All participants
                      who successfully booked will be refunded.
                    </div>
                  ) : hasStarted ? (
                    <div>This timeslot has already started.</div>
                  ) : isPast ? (
                    <div>This event has already finished.</div>
                  ) : isFullyBooked ? (
                    <div>We are sorry, this timeslot is fully booked.</div>
                  ) : isNotAvailable ? (
                    <div>
                      You cannot select training that is starting in{' '}
                      {hoursBeforeAvailable} hours.
                    </div>
                  ) : disabledBooking ? (
                    <div className="alert alert-danger">
                      This coach is taking a break. You cannot book events until
                      coach switches bookings on again.
                    </div>
                  ) : null}
                  {!disabledBooking && (
                    <div>
                      <Button onClick={onCancel} className="btn btn-primary">
                        Choose Other Date
                      </Button>
                    </div>
                  )}
                </Stack>
              )}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};
