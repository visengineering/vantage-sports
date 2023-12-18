import { CoachType } from './CoachType';

import { EventType } from './EventType';
import { ProfileType } from './ProfileType';
const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  description: 'This represents a Review',
  fields: () => ({
    id: { type: GraphQLInt, resolve: (review: any) => review.id },
    coach: { type: CoachType, resolve: (review: any) => review.getCoach() },
    player: { type: ProfileType, resolve: (review: any) => review.getPlayer() },
    event: { type: EventType, resolve: (review: any) => review.getEvent() },
    comment: {
      type: GraphQLString,
      resolve: (review: any) => review.comment,
    },
    rating: {
      type: GraphQLInt,
      resolve: (review: any) => Math.round(review.rating),
    },
    createdAt: {
      type: GraphQLString,
      resolve: (review: any) => review.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (review: any) => review.updatedAt,
    },
  }),
});

export { ReviewType };
export default { ReviewType };
