import moment from 'moment';
import React, { useState, useEffect, FC } from 'react';
import { Button } from 'react-bootstrap';
const { useHistory } = require('react-router-dom');
const { Link } = require('react-router-dom');
import {
  EventModel,
  GraphQLUserProfile,
  ReviewModel,
  TimeslotModel,
} from 'src/types';
import * as assets from '../../../../../assets';
import Rating from '../../../../shared/Rating';
import ReviewModal from '../../../../shared/ReviewModal';
const { Image } = require('cloudinary-react');

export type ReviewModalContents = {
  starRatingValue: number;
  reviewId: number | null;
  reviewText: string;
};

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
const CompletedEvent: FC<{
  canReview: boolean;
  participant: {
    id: number;
    coach: GraphQLUserProfile;
    event: EventModel;
    review?: ReviewModel;
    timeslot: TimeslotModel;
  };
}> = ({ participant, canReview }) => {
  const history = useHistory();
  let [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  let [reviewId, setReviewId] = useState<number | null>(
    participant?.review?.id ?? null
  );
  let [reviewModalContents, setReviewModalContents] =
    useState<ReviewModalContents>({
      starRatingValue: 0,
      reviewText: '',
      reviewId: null,
    });
  const isEventOngoing = moment(participant?.timeslot?.endDate).isAfter(
    moment(new Date().toJSON())
  );

  useEffect(
    function showReviewModal() {
      if (history.location.state?.eventId) {
        if (participant.event.id == history.location.state?.eventId) {
          setIsReviewModalOpen(true);
        }

        setTimeout(function clearStateFromHistory() {
          history.location.state = {};
          let state = { ...history.location.state };
          delete state.eventId;
          history.replace({ ...history.location, state });
        }, 0);
      }
    },
    [history.location.state?.eventId]
  );

  return (
    <div className={'card'}>
      <Link to={'/training/' + participant?.event?.id}>
        <div className="card-img">
          {participant?.event.media?.publicId && (
            <Image
              publicId={participant?.event?.media?.publicId}
              alt="cover image"
            />
          )}

          {!participant?.event?.media?.publicId &&
            participant?.coach?.profileImage?.publicId && (
              <Image
                publicId={participant?.coach?.profileImage?.publicId}
                alt="cover image"
              />
            )}
          {!participant?.event?.media?.publicId &&
            !participant?.coach?.profileImage?.publicId && (
              <img src={assets.defaultPic} alt="cover image" />
            )}
        </div>
        <span className="card-title" title={participant?.event?.title}>
          {participant?.event?.title}
        </span>
      </Link>
      <div className="info-block">
        <Link to={`/${participant?.coach?.path || participant?.coach?.id}`}>
          <div className="author">
            <div className="profile">
              {participant?.coach?.profileImage?.publicId && (
                <Image
                  publicId={participant?.coach?.profileImage?.publicId}
                  alt="coach image"
                />
              )}
              {!participant?.coach?.profileImage?.publicId && (
                <img src={assets.defaultPic} className="coach-img" />
              )}
            </div>

            <div className="name">{participant?.coach?.name}</div>
          </div>
        </Link>

        <div className="date-price-block">
          <div className="date">
            <span className="icon">
              <img src={assets.calendarBlue} alt="icon" />
            </span>

            <span className="lbl">
              {participant?.timeslot?.startDate &&
                moment(participant?.timeslot?.startDate)
                  .utc()
                  .local()
                  .format('ddd, MM/DD/YYYY, h:mm a')}
            </span>
          </div>

          <div className="price">${participant?.timeslot?.cost}</div>
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={function openReviewModalOnStarClick() {
            setIsReviewModalOpen(true);
          }}
        >
          <Rating
            value={participant?.coach?.rating || 0}
            maxValue={5}
            ratingsStyles={{
              fontSize: '1.3rem',
              marginTop: '1rem',
              marginBottom: 0,
            }}
          />
        </div>
      </div>

      {canReview && (
        <Button
          className="review"
          onClick={() => {
            setIsReviewModalOpen(true);
          }}
          style={{ alignSelf: 'flex-center' }}
          disabled={isEventOngoing}
        >
          {reviewId || participant?.review?.id
            ? `Edit review`
            : isEventOngoing
            ? 'Ongoing Event'
            : 'Write a review'}
        </Button>
      )}
      {isReviewModalOpen && (
        <ReviewModal
          participantId={participant?.id}
          coachProfileId={participant?.coach?.id}
          setIsReviewModalOpen={setIsReviewModalOpen}
          eventId={participant?.event?.id}
          reviewData={participant?.review}
          reviewTitle={participant?.event?.title}
          setReviewedEventId={setReviewId}
          setReviewModalContents={setReviewModalContents}
          reviewModalContents={reviewModalContents}
        />
      )}
    </div>
  );
};

export default CompletedEvent;

/* eslint-enable @typescript-eslint/no-unnecessary-condition */
