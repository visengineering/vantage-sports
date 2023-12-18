import { ReviewType } from '../types';
import { Event, Review, Participant, Profile } from '../../models';
import { ReviewInputType } from '../inputTypes';
import { Op } from 'sequelize';

const createReview = {
  type: ReviewType,
  description: 'The mutation that allows you to create a new review',
  args: {
    review: {
      name: 'review',
      type: ReviewInputType('create'),
    },
  },
  resolve: async (review: any, { review: reviewArgument }: any) => {
    const {
      coachProfileId = null,
      playerProfileId = null,
      eventId = null,
      participantId = null,
      comment = null,
      rating = null,
    } = reviewArgument;

    if (!coachProfileId) {
      return new Error('Coach Profile Id is missing.');
    }

    if (!participantId) {
      return new Error('Player participant Id is missing.');
    }

    if (!playerProfileId) {
      return new Error('Player Profile Id is missing.');
    }

    if (!eventId) {
      return new Error('Event Id is missing.');
    }

    if (!comment && !rating) {
      return new Error('Both review comment and rating are required.');
    }

    //ratings count must be 1 and 5
    if ((rating && rating > 5) || rating < 1) {
      return new Error('Ratings can only be between 1 to 5.');
    }

    //Checking is event exists and is completed.
    const event = await Event.findOne({
      where: {
        id: parseInt(eventId),
        profileId: parseInt(coachProfileId),
      },
      attributes: ['date', 'duration'],
    });

    if (!event) {
      return new Error('Event does not exist.');
    }

    const currentTime = new Date().toJSON();
    const eventStartHours = new Date(event.date).getHours();
    const eventCompleteTime = new Date(
      new Date(event.date).setHours(eventStartHours + Number(event.duration))
    ).toJSON();

    if (eventCompleteTime > currentTime) {
      return new Error(
        'Event is not completed yet. Please try again after some time.'
      );
    }

    const playerProfile = await Profile.findByPk(playerProfileId, {
      attributes: ['userId'],
    });

    if (!playerProfile) {
      return new Error(
        'It seems like you have not participated in given event.You can only review the coach for the events in which you have participated.'
      );
    }

    // Checking is the user is a participant in the given event.
    const isParticipantExists = await Participant.findOne({
      where: {
        id: participantId,
        paid: true,
        paymentReference: { [Op.ne]: null },
        clientId: playerProfile.userId, // Watch out this is user ID not profile ID.
        eventId: parseInt(eventId),
      },
    });

    if (!isParticipantExists) {
      return new Error(
        'It seems like you have not participated in given event.You can only review the coach for the events in which you have participated.'
      );
    }

    // Checking is the user has already reviewed the given event for particular participation
    const isReviewExists = await Participant.findOne({
      where: {
        id: participantId,
        reviewId: { [Op.ne]: null },
      },
    });

    if (isReviewExists) {
      return new Error(
        'You have already created a review for this participation. You can not create a duplicate or second review unless you buy more trainings.'
      );
    }

    const createdReview = await Review.create({
      coachProfileId,
      playerProfileId,
      comment,
      rating,
      eventId,
    });

    // Now updating the profiles table to include review id.
    await Participant.update(
      { reviewId: createdReview.id },
      {
        where: {
          id: participantId,
        },
      }
    );

    return createdReview;
  },
};

const updateReview = {
  type: ReviewType,
  description:
    'The mutation that allows you to update an existing review by Id',
  args: {
    review: {
      name: 'review',
      type: ReviewInputType('update'),
    },
  },
  resolve: async (review: any, args: any) => {
    const { id: reviewId, comment, rating } = args.review;

    if ((rating && rating > 5) || rating < 1) {
      return new Error('Ratings can only be between 0 to 5.');
    }

    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      return new Error(
        'Please create a review first, before trying to udpate it.'
      );
    }

    existingReview.comment = comment;
    existingReview.rating = rating;
    const updatedReview = await existingReview.save();

    return updatedReview;
  },
};

export { createReview, updateReview };
export default { createReview, updateReview };
