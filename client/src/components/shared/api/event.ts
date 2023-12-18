import { gql } from '@apollo/client';

export const createEventMutation = gql`
  mutation createEventWithTimeslots($event: EventInputTypeCreateTimeslots!) {
    createEventWithTimeslots(event: $event) {
      id
    }
  }
`;

export const updateEventMutation = gql`
  mutation updateEvent($event: EventInputTypeUpdate!) {
    updateEvent(event: $event) {
      id
    }
  }
`;

export const updateTimeslotMutation = gql`
  mutation updateTimeslot($timeslot: TimeslotInputTypeUpdate!) {
    updateTimeslot(timeslot: $timeslot) {
      id
    }
  }
`;

export const cancelTimeslotMutation = gql`
  mutation cancelTimeslot($timeslot: TimeslotInputTypeCancel!) {
    cancelTimeslot(timeslot: $timeslot) {
      id
    }
  }
`;

export const deleteTimeslotMutation = gql`
  mutation deleteTimeslot($timeslot: TimeslotInputTypeDelete!) {
    deleteTimeslot(timeslot: $timeslot) {
      id
    }
  }
`;

export const favoriteCoachesEventsQuery = gql`
  query Event(
    $upcoming: Boolean
    $limit: Int
    $coachProfileId: Int
    $playerProfileId: Int
    $sportId: Int
    $onlyFavorites: Boolean
    $sessionType: String
    $offset: Int
    $includeDisabledBookings: Boolean
  ) {
    event(
      upcoming: $upcoming
      limit: $limit
      coachProfileId: $coachProfileId
      playerProfileId: $playerProfileId
      sportId: $sportId
      sessionType: $sessionType
      offset: $offset
      onlyFavorites: $onlyFavorites
      includeDisabledBookings: $includeDisabledBookings
    ) {
      ... on EventConnection {
        total
        edges {
          node {
            id
            title
            timeslots {
              id
              startDate
              endDate
              duration
              cost
              maxParticipantsCount
              participantsCount
              isNotificationProcessed
              notificationDate
              isCancelled
              cancelDate
            }
            max
            coach {
              id
              name
              university {
                id
                name
              }
              profileImage {
                id
                url
                publicId
              }
            }
            cost
            duration
            isEventCancelled
            participantsCount
            sessionType
            date
            location
            description
            media {
              id
              url
              publicId
            }
            sport {
              id
              name
            }
            position {
              id
              name
            }
            skill {
              id
              name
            }
            university {
              id
              name
            }
          }
        }
      }
    }
  }
`;
