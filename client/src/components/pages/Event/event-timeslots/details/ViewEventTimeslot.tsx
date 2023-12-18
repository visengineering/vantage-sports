import { useQuery } from '@apollo/client';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  EventModel,
  GraphQLUserProfile,
  UserTypeEnum,
  EventSessionTypeEnum,
} from '../../../../../types';
import * as assets from '../../../../../assets';
import { MainContext } from '../../../../../contexts';
import { Rating } from '../../../../shared';
import { TimeslotsCard } from '../details/TimeslotsCard';
import moment from 'moment';
import { Tooltip } from 'src/components/shared/tooltip';
import { Stack } from 'src/components/shared/Stack';
import { EditTimeslot } from '../edit/EditTimeslot';
import { CancelTimeslot } from '../edit/CancelTimeslot';
import { TimeslotDetails } from './TimeslotDetails';
import {
  getDateClosestToToday,
  hasTimeslotStarted,
  isTimeslotPast,
} from './helpers';
import { GroupWrap } from 'src/components/group-wrap';
import { CoachReviews } from 'src/components/pages/CoachProfile/CoachReviews';
import { CoachProfileTabEnum } from 'src/components/pages/CoachProfile/ProfileInfoSection';
import { reviewQuery } from 'src/components/queries/review';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { CancelDay } from '../edit/CancelDay';
import { ShareOnSocial } from 'src/components/layout/ShareOnSocial';
import { useShareLink } from 'src/components/shared/hooks/use-share-link';
const { Image } = require('cloudinary-react');
const v = require('voca');

export type DetailsPageActionType =
  | 'DELETE_CANCEL'
  | 'PURCHASE'
  | 'EDIT'
  | 'EDIT_SUCCESS'
  | 'DELETE_CANCEL_SUCCESS';

export const ViewEventTimeslot: FC<{
  event: EventModel;
}> = ({ event }) => {
  const history = useHistory();
  const { profileId, isSignedIn, userType, profile } = useContext(MainContext);
  const notify = useNotification();

  const shareLink = useShareLink();

  let [alertMessage, setAlertMessage] = useState('');
  let [coachRating] = useState(0);
  const [selectedTimeslot, setSelectedTimeslot] = useState<null | {
    timeslotId: number;
    actionType: DetailsPageActionType;
  }>(null);
  const [selectedDay, setSelectedDay] = useState<null | {
    actionType: DetailsPageActionType;
  }>(null);

  const deleteEvent = () => {
    history.push(`/training/${training.id}/delete`);
  };

  const [selectedDate, setSelectedDate] = useState('');

  const training = event;

  const isEventCancelled =
    training.timeslots.every((t) => t.isCancelled) || training.isEventCancelled;
  const isEventSoldOut = training.timeslots.every(
    (t) => t.participantsCount >= t.maxParticipantsCount
  );
  const isEventComplete = training.timeslots.every((t) =>
    moment(t.startDate).isBefore(moment(new Date().toJSON()))
  );
  const isEventInactive = isEventCancelled || isEventComplete || isEventSoldOut;
  const isCoach = userType === UserTypeEnum.COACH;
  const isMyEvent = !!(
    profileId &&
    training.coach.id == profileId &&
    isSignedIn
  );

  const navigateToTimeslots = () => {
    document.getElementById('join-now')?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkTimeslotsLength = (isDeleted: boolean) => {
    if (training.timeslots.length < 2 && isDeleted) {
      notify({
        type: 'success',
        children: 'Event deleted successfully',
      });
      history.push(`/${profile?.path || profileId}`, {
        shouldShowMessage: true,
      });
    }

    if (selectedTimeslot) {
      setSelectedTimeslot({
        ...selectedTimeslot,
        actionType: 'DELETE_CANCEL_SUCCESS',
      });
    }
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const deletedDay = (isDeleted: boolean) => {
    if (isDeleted) {
      setSelectedDay(null);
      setSelectedDate('');
      setShowSuccess(true);
    }
  };

  const isSamePrice = useMemo<boolean>(() => {
    const unique = [
      ...new Set(training.timeslots.map((timeslot) => timeslot.cost)),
    ];

    return unique.length === 1;
  }, [training.timeslots]);

  useEffect(() => {
    if (!selectedDate) {
      const closestToToday = getDateClosestToToday(training.timeslots);

      setSelectedDate(closestToToday);
    }
  }, [training.timeslots]);
  const { loading, error, data } = useQuery<{
    review: {
      comment: string;
      rating: number;
      player: GraphQLUserProfile;
    }[];
  }>(reviewQuery, {
    variables: { coachId: training.coach.id },
  });

  return (
    <section className="view-event-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <Link
              to="#"
              className="btn btn-back"
              onClick={function onEventBackArrowClick(event) {
                event.preventDefault();
                if (!window.document.referrer) {
                  history.push('/sports-coaching');
                } else {
                  if (history.length > 1) {
                    history.goBack();
                  } else {
                    history.push('/sports-coaching');
                  }
                }
              }}
            >
              <div className="go-back">
                <img
                  src={
                    window.document.referrer ? assets.backArrow : assets.home
                  }
                  alt={window.document.referrer ? 'Back Arrow' : 'Home Icon'}
                />
              </div>
            </Link>
          </div>

          {isMyEvent && (
            <div className="btn-container col-lg-4 heading-btn">
              <GroupWrap
                gap={0}
                style={{ marginLeft: '0.5rem' }}
                justifyContent="end"
              >
                {isEventCancelled ? (
                  <Tooltip
                    content={<small>You cannot edit cancelled event</small>}
                  >
                    {() => (
                      <Button disabled className="btn btn-primary">
                        Edit Details
                      </Button>
                    )}
                  </Tooltip>
                ) : (
                  <Link
                    className="btn btn-primary"
                    to={`/edit-training/${training.id}`}
                  >
                    Edit details
                  </Link>
                )}

                <Tooltip
                  content={
                    <small>
                      You can delete event if it has no participants registered.
                      Once somebody pays for participation you can only cancel
                      event.
                    </small>
                  }
                >
                  {() => (
                    <Button
                      disabled={isEventInactive}
                      className="btn btn-danger last-button"
                      onClick={deleteEvent as any /* TODO: improve types */}
                    >
                      Delete
                    </Button>
                  )}
                </Tooltip>
              </GroupWrap>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-lg-8" style={{ width: '69%' }}>
            <div className="event-head-block">
              {isEventCancelled && (
                <h4 className=" text text-danger font-weight-bold">
                  This event is cancelled
                </h4>
              )}
              <div className="event-post-info">
                <div className="author">
                  <span className="profile">
                    {training.coach.profileImage?.publicId && (
                      <Image
                        publicId={training.coach.profileImage.publicId}
                        alt="coach image"
                      />
                    )}
                    {!training.coach.profileImage?.publicId && (
                      <img src={assets.defaultPic} alt="coach image" />
                    )}
                  </span>
                  <div className="heading-block">
                    <span className="heading">{training.title}</span>
                    <span>
                      by &nbsp;
                      <Link to={`/${training.coach.path || training.coach.id}`}>
                        <span className="name">{training.coach.name}</span>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="btn-container col-lg-4 join-now">
            <Button
              className="btn btn-primary"
              onClick={navigateToTimeslots}
              disabled={training.coach.disabledBooking && !isMyEvent}
            >
              {isMyEvent ? 'See My Availability' : 'Join Now'}
            </Button>
            <ShareOnSocial className="event-share" shareLink={shareLink} />
          </div>
          {training.coach.disabledBooking && !isMyEvent && (
            <p className="alert alert-danger w-100">
              This coach is taking a break. You cannot book events from{' '}
              {training.coach.name} until coach switches bookings on again.
            </p>
          )}
        </div>
        <div className="row">
          <div className="col-md-12 gutter">
            <div className="row">
              <div className="col-md-12">
                <div className="post-cover">
                  <div className="img-container">
                    {training.media?.publicId && (
                      <Image
                        publicId={training.media.publicId}
                        alt="event cover image"
                      />
                    )}
                    {!training.media?.publicId &&
                      training.coach.profileImage?.publicId && (
                        <Image
                          publicId={training.coach.profileImage.publicId}
                          alt="profile cover image"
                        />
                      )}
                    {!training.media?.publicId &&
                      !training.coach.profileImage?.publicId && (
                        <img src={assets.defaultPic} alt="default image" />
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 event-details info-section">
                <div className="info">
                  <span className="icon">
                    <img src={assets.location} alt="icon" />
                  </span>

                  <span className="text">
                    {`${v.titleCase(training.sessionType)}${
                      training.sessionType === EventSessionTypeEnum.In_Person
                        ? ` - ${training.location}`
                        : ''
                    }`}
                  </span>
                </div>
                {(training.id === 1270 || training.id === 1269) && (
                  <Stack flow="row" alignItems="center" justifyContent="center">
                    <Button
                      onClick={() => {
                        window.location =
                          'https://g6ey57cftos.typeform.com/to/Samzjh2C' as any;
                      }}
                    >
                      Sponsor Inquiry
                    </Button>
                  </Stack>
                )}

                {isSamePrice && (
                  <div className="fee-info">
                    Price:{' '}
                    <span className="fee">${training.timeslots[0].cost}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 event-details info-section">
                <div className="info">
                  <a
                    href="/blog/posts/location-of-session"
                    className="list-link"
                    style={{ color: '#0f47e6' }}
                  >
                    Where exactly do we meet the coach?
                  </a>
                </div>
              </div>
            </div>
            <div className="event-details">
              <h1 className="title">About</h1>
              <div className="row">
                <div id="join-now" className="col-md-12">
                  <div className="about-content">{training.description}</div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 event-details info-section">
                <div className="info">
                  <a
                    href="/blog/posts/what-can-i-expect-in-my-session"
                    className="list-link"
                    style={{ color: '#0f47e6' }}
                  >
                    What to expect from the session?
                  </a>
                </div>
              </div>
            </div>

            {selectedTimeslot &&
              selectedTimeslot.actionType === 'EDIT_SUCCESS' && (
                <div className="alert alert-success" role="alert">
                  Changes successfully saved.
                </div>
              )}
            {selectedTimeslot &&
              selectedTimeslot.actionType === 'DELETE_CANCEL_SUCCESS' && (
                <div className="alert alert-success" role="alert">
                  Successfully{' '}
                  {(event.timeslots[selectedTimeslot.timeslotId] &&
                    event.timeslots[selectedTimeslot.timeslotId]
                      .participantsCount > 0) ||
                  hasTimeslotStarted(
                    event.timeslots[selectedTimeslot.timeslotId].startDate,
                    event.timeslots[selectedTimeslot.timeslotId].endDate
                  ) ||
                  isTimeslotPast(
                    event.timeslots[selectedTimeslot.timeslotId].endDate
                  )
                    ? 'cancelled'
                    : 'deleted'}
                  .
                </div>
              )}

            {showSuccess && (
              <div className="alert alert-success" role="alert">
                Successfully deleted and/or cancelled timeslot(s).
              </div>
            )}

            {selectedTimeslot && selectedTimeslot.actionType === 'PURCHASE' ? (
              <TimeslotDetails
                coachName={training.coach.name}
                eventId={event.id}
                isCoach={isCoach}
                eventType={event.eventType}
                timeslot={event.timeslots[selectedTimeslot.timeslotId]}
                isMyEvent={isMyEvent}
                onCancel={() => {
                  setSelectedTimeslot(null);
                }}
                disabledBooking={training.coach.disabledBooking}
              />
            ) : selectedTimeslot && selectedTimeslot.actionType === 'EDIT' ? (
              <EditTimeslot
                eventId={event.id}
                eventType={event.eventType}
                timeslot={event.timeslots[selectedTimeslot.timeslotId]}
                onCancel={() => {
                  setSelectedTimeslot(null);
                }}
                onSuccess={() => {
                  setSelectedTimeslot({
                    ...selectedTimeslot,
                    actionType: 'EDIT_SUCCESS',
                  });
                }}
              />
            ) : selectedTimeslot &&
              selectedTimeslot.actionType === 'DELETE_CANCEL' ? (
              <CancelTimeslot
                eventId={event.id}
                eventType={event.eventType}
                timeslot={event.timeslots[selectedTimeslot.timeslotId]}
                onCancel={() => {
                  setSelectedTimeslot(null);
                }}
                onSuccess={(isDeleted: boolean) => {
                  checkTimeslotsLength(isDeleted);
                }}
              />
            ) : selectedDay && selectedDay.actionType === 'DELETE_CANCEL' ? (
              <CancelDay
                selectedDate={selectedDate}
                timeslots={event.timeslots}
                onCancel={() => {
                  setSelectedDay(null);
                }}
                onSuccess={(isDeleted: boolean) => {
                  deletedDay(isDeleted);
                }}
              />
            ) : (
              <TimeslotsCard
                coachName={training.coach.name}
                isMyEvent={isMyEvent}
                selectedDate={selectedDate}
                isSamePrice={isSamePrice}
                setSelectedDate={setSelectedDate}
                onSelect={(
                  timeslotId: number,
                  actionType: DetailsPageActionType
                ) => {
                  setSelectedTimeslot({
                    timeslotId,
                    actionType,
                  });
                }}
                onSelectDay={(actionType: DetailsPageActionType) => {
                  setSelectedDay({
                    actionType,
                  });
                }}
                timeslots={event.timeslots}
                disabledBooking={training.coach.disabledBooking}
              />
            )}

            <div className="event-details">
              <h1 className="title">Coach</h1>
              <div
                className="title-review-container"
                style={{ display: 'flex', justifyContent: 'space-between' }}
              ></div>
              <div className="details-card grid-block">
                <div className="img-container">
                  {training.coach.profileImage?.publicId && (
                    <Image
                      publicId={training.coach.profileImage.publicId}
                      alt="coach image"
                    />
                  )}
                  {!training.coach.profileImage?.publicId && (
                    <img src={assets.defaultPic} alt="coach image" />
                  )}
                </div>

                <div className="info-block">
                  <Link to={`/${training.coach.path || training.coach.id}`}>
                    <h2 className="name">{training.coach.name}</h2>
                  </Link>

                  <Rating
                    value={coachRating || Number(training.coach.rating) || 0}
                    maxValue={5}
                    ratingsStyles={{ justifyContent: 'flex-start' }}
                  />

                  <ul className="info-list">
                    <li>{training.coach.sport?.name || training.sport.name}</li>
                    <li>
                      {training.coach.university?.name ||
                        training.university.name}
                    </li>
                    {training.position?.name && (
                      <li>
                        {training.coach.primaryPosition?.name ||
                          training.position.name}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="count-down-block d-none">
              <div className="panel">
                <div className="row">
                  <div className="col-md-6">
                    <div className="content">
                      <p className="link-text mb-0">Countdown</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="timer-block"
                      id="trainingCountDay"
                      data-event-date="Dec 5, 2021 16:30:00"
                    >
                      <div className="timer-col">
                        <span id="days">19</span>
                        <span>Days</span>
                      </div>
                      <div className="timer-col">
                        <span id="hours">23</span>
                        <span>Hours</span>
                      </div>
                      <div className="timer-col">
                        <span id="minutes">55</span>
                        <span>Minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && <div>Loading...</div>}
        {!loading && data && data.review.length > 0 && (
          <div className="event-details">
            <div className="row align-items-center">
              <div className="col-sm-2">
                <h1 className="title m-0">Review</h1>
              </div>
              <div className="col-sm-2 review-link">
                <Link
                  to={`/${training.coach.path || training.coach.id}/?tab=${
                    CoachProfileTabEnum.REVIEWS
                  }`}
                >
                  See All Reviews
                </Link>
              </div>
            </div>
            <CoachReviews reviewsArray={data.review.slice(0, 3)} />
          </div>
        )}
        {error && (
          <p className="text text-danger text-small m-2">
            Failed to load reviews.
          </p>
        )}
      </div>
    </section>
  );
};

export default ViewEventTimeslot;
