import {
  participantQuery,
  reviewQuery,
  userQuery,
  sportQuery,
  profileQuery,
  noteQuery,
  coachQuery,
  childQuery,
  mediaQuery,
  eventQuery,
  timeslotQuery,
  favoriteCoachQuery,
  geoAddressQuery,
} from './queries';
import {
  updateUser,
  deleteUser,
  createNote,
  updateNote,
  deleteNote,
  createMedia,
  deleteMedia,
  updateCoach,
  createEventWithTimeslots,
  deleteEvent,
  updateEvent,
  cancelEvent,
  createReview,
  updateReview,
  cancelTimeslot,
  deleteTimeslot,
  updateTimeslot,
  addFavoriteCoach,
  removeFavoriteCoach,
  createChild,
  deleteChild,
  updateChild,
} from './mutations';

const { GraphQLSchema, GraphQLObjectType } = require('graphql');

const RootQuery = new GraphQLObjectType({
  name: 'rootQuery',
  description:
    'This is the root query which holds all possible READ entrypoints for the GraphQL API',
  fields: () => ({
    user: userQuery,
    note: noteQuery,
    sport: sportQuery,
    profile: profileQuery,
    coach: coachQuery,
    child: childQuery,
    media: mediaQuery,
    event: eventQuery,
    timeslot: timeslotQuery,
    participant: participantQuery,
    review: reviewQuery,
    favoriteCoach: favoriteCoachQuery,
    geoAddress: geoAddressQuery,
  }),
});

const RootMutation = new GraphQLObjectType({
  name: 'rootMutation',
  description:
    'This is the root mutation which holds all possible WRITE entrypoints for the GraphQL API',
  fields: () => ({
    updateUser,
    deleteUser,
    createNote,
    updateNote,
    createReview,
    updateReview,
    deleteNote,
    updateCoach,
    createMedia,
    deleteMedia,
    createEventWithTimeslots,
    deleteEvent,
    updateEvent,
    cancelEvent,
    deleteTimeslot,
    updateTimeslot,
    cancelTimeslot,
    createChild,
    deleteChild,
    updateChild,
    removeFavoriteCoach,
    addFavoriteCoach,
  }),
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export { schema };
export default schema;
