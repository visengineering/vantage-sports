import { shield, allow } from 'graphql-shield';
import { isAuthenticated } from './rules';
const environment = process.env.NODE_ENV;

const rulesMap = {
  rootQuery: {
    '*': allow,
    participant: isAuthenticated,
    review: isAuthenticated, //Currently not in use
  },
  rootMutation: {
    '*': allow,
    updateCoach: isAuthenticated,
    createMedia: isAuthenticated,
    deleteMedia: isAuthenticated,
    createEventWithTimeslots: isAuthenticated,
    deleteEvent: isAuthenticated,
    updateEvent: isAuthenticated,
    cancelEvent: isAuthenticated,
    createReview: isAuthenticated,
    updateReview: isAuthenticated,
  },
};

const options = {
  fallbackRule: allow,
  debug: environment !== 'production', // If environment is not equal to production then, debug and allowExternalErrors is true
  allowExternalErrors: environment !== 'production',
  fallbackError: Error('Something went wrong.'),
};

export const permissions = shield(rulesMap, options);

export default permissions;
