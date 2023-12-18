import { gql, useMutation } from '@apollo/client';
import Rate from 'rc-rate';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { MainContext } from '../../contexts';

import 'rc-rate/assets/index.css';
import { ReviewModalContents } from '../pages/Player/dashboard/completed/CompletedEvent';
import { ReviewModel } from 'src/types';

type EditReviewProps = {
  setIsReviewModalOpen: (o: boolean) => void;
  eventId: number;
  participantId: number;
  coachProfileId: number;
  reviewData?: ReviewModel;
  reviewTitle: string;
  setReviewedEventId: (a: number) => void;
  reviewModalContents: ReviewModalContents;
  setReviewModalContents: (rmc: ReviewModalContents) => void;
};

const EditReviewModal: FC<EditReviewProps> = ({
  setIsReviewModalOpen,
  eventId,
  participantId,
  coachProfileId,
  reviewData,
  reviewTitle,
  setReviewedEventId,
  reviewModalContents,
  setReviewModalContents,
}) => {
  const { profileId: playerProfileId } = useContext(MainContext);
  const [reviewText, setReviewText] = useState<string>('');
  const [showDanger, setShowDanger] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [starRatingValue, setStarRatingValue] = useState<number>(0);
  const [reviewId, setReviewId] = useState<number | null>(null);

  useEffect(() => {
    if (
      reviewModalContents.starRatingValue > 0 &&
      reviewModalContents.reviewText != ''
    ) {
      setStarRatingValue(reviewModalContents.starRatingValue);
      setReviewText(reviewModalContents.reviewText);
      setReviewId(reviewModalContents.reviewId);
      setShowDanger(false);
      setEditMode(true);
      return;
    }
    if (!!reviewData) {
      setReviewText(reviewData?.comment);
      setStarRatingValue(reviewData?.rating);
      setShowDanger(false);
      setEditMode(true);
    }
  }, [reviewData, reviewModalContents]);

  const CREATE_REVIEW_MUTATION = gql`
    mutation CreateReview($review: ReviewInputTypeCreate) {
      createReview(review: $review) {
        id
        comment
        rating
        coach {
          id
          rating
        }
      }
    }
  `;

  const UPDATE_REVIEW_MUTATION = gql`
    mutation UpdateReview($review: ReviewInputTypeUpdate!) {
      updateReview(review: $review) {
        id
        rating
        comment
        coach {
          id
          rating
        }
      }
    }
  `;

  const [createReview, { data, loading, error }] = useMutation(
    CREATE_REVIEW_MUTATION,
    {
      onError: (err) => {
        const errorMessage = err.message;
      },
      refetchQueries: 'active',
      onCompleted: function onCreateReviewComplete({ createReview }) {
        // setCoachRating(data.createReview.coach.rating);
        setReviewModalContents({
          starRatingValue: createReview?.rating,
          reviewId: createReview?.id,
          reviewText: createReview?.comment,
        });
        setReviewedEventId(createReview.id);
        setReviewId(createReview.id);
      },
    }
  );

  const [updateReview, updatedReviewObj] = useMutation(UPDATE_REVIEW_MUTATION, {
    onError: (err) => {
      const errorMessage = err.message;
    },
    onCompleted: function onUpdateReviewComplete({ updateReview }) {
      // setCoachRating(data.updateReview.coach.rating);
      setReviewId(updateReview.id);
    },
  });

  if (loading || updatedReviewObj.loading) return <h1>Loading...</h1>;

  const handleSave = (event: React.MouseEvent<HTMLElement>) => {
    if (starRatingValue === 0 || reviewText === '') {
      setShowDanger(true);
    } else {
      setShowDanger(false);
      setIsReviewModalOpen(false);

      if (editMode) {
        let variables = {
          variables: {
            review: {
              id: reviewData?.id || reviewModalContents.reviewId,
              comment: reviewText,
              rating: Number(starRatingValue),
            },
          },
        };
        updateReview(variables);
      } else {
        let variables = {
          variables: {
            review: {
              coachProfileId: Number(coachProfileId),
              playerProfileId: Number(playerProfileId),
              participantId,
              eventId: Number(eventId),
              comment: reviewText,
              rating: Number(starRatingValue),
            },
          },
        };
        createReview(variables);
      }
      if (!reviewData?.id || !reviewId) {
        return;
      }
      setReviewModalContents({
        starRatingValue,
        reviewText,
        reviewId: reviewData?.id || reviewId,
      });
      setEditMode(false);
    }
  };

  return (
    <>
      <div
        id="profileEditModal"
        tabIndex={-1}
        aria-labelledby="profileEditModalLabel"
        aria-hidden="true"
      >
        <Modal
          show={true}
          className="edit-review-modal modal"
          onHide={function hideReviewModal() {
            setIsReviewModalOpen(false);
          }}
          style={{
            borderRadius: '10px',
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{reviewTitle || 'Review'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form style={{ textAlign: 'center' }}>
              <div className="ratings">
                <Rate
                  value={starRatingValue}
                  count={5}
                  onChange={function onStarRatingChange(val) {
                    setStarRatingValue(val);
                  }}
                  style={{ fontSize: 40, marginBottom: '2rem' }}
                />
              </div>

              <div className="row">
                <textarea
                  className="review"
                  id="txtid"
                  name="txtname"
                  rows={4}
                  cols={50}
                  placeholder="Write a review..."
                  value={reviewText}
                  style={{
                    borderRadius: '5px',
                    margin: 'auto',
                    resize: 'none',
                    padding: '10px',
                  }}
                  onChange={(e) => {
                    setReviewText(e.target.value);
                  }}
                />
              </div>

              {showDanger && (
                <p style={{ marginTop: '10px' }} className="text-danger">
                  Both Fields Are Mandatory
                </p>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsReviewModalOpen(false);
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {editMode ? `Edit` : `Post`}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default EditReviewModal;
