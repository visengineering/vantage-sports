const { GraphQLInt, GraphQLList } = require('graphql');

import { ReviewType } from '../types';
import { Review } from '../../models';

const reviewQuery = {
  type: new GraphQLList(ReviewType),
  args: {
    id: { name: 'id', type: GraphQLInt },
    coachProfileId: { name: 'coachProfileId', type: GraphQLInt },
    playerProfileId: { name: 'playerProfileId', type: GraphQLInt },
    eventId: { name: 'eventId', type: GraphQLInt },
  },

  resolve: async (review: any, reviewQueryArgs: any) => {
    const {
      playerProfileId = null,
      coachProfileId = null,
      eventId = null,
      id: reviewId,
    } = reviewQueryArgs;
    let reviewData = null;

    if (reviewId) {
      reviewData = await Review.findByPk(reviewId);
      return reviewData ? [reviewData] : [];
    }

    if (playerProfileId && coachProfileId && eventId) {
      reviewData = await Review.findOne({
        where: {
          playerProfileId: parseInt(playerProfileId),
          coachProfileId: parseInt(coachProfileId),
          eventId: parseInt(eventId),
        },
      });
      return reviewData ? [reviewData] : [];
    }

    if (coachProfileId) {
      const reviewsList = await Review.findAll({
        where: {
          coachProfileId: parseInt(coachProfileId),
        },
      });
      return reviewsList;
    }

    const reviewsList = await Review.findAll();
    return reviewsList;
  },
};

export { reviewQuery };
export default { reviewQuery };
