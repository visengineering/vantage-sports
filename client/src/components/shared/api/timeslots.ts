import { gql } from '@apollo/client';

export const myTrainingSchedule = gql`
  query Timeslot(
    $upcoming: Boolean
    $playerUserId: Int
    $offset: Int
    $limit: Int
    $isCancelled: Boolean
  ) {
    timeslot(
      upcoming: $upcoming
      playerUserId: $playerUserId
      offset: $offset
      limit: $limit
      isCancelled: $isCancelled
    ) {
      ... on TimeslotConnection {
        total
        edges {
          node {
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
            participants {
              id
              client {
                id
              }
            }
            event {
              id
              title
              location
              coach {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const coachUpcomingTrainings = gql`
  query Timeslot(
    $upcoming: Boolean
    $coachProfileId: Int
    $offset: Int
    $limit: Int
    $isCancelled: Boolean
  ) {
    timeslot(
      upcoming: $upcoming
      coachProfileId: $coachProfileId
      offset: $offset
      limit: $limit
      isCancelled: $isCancelled
    ) {
      ... on TimeslotConnection {
        total
        edges {
          node {
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
            participants {
              id
              client {
                id
              }
            }
            event {
              id
              title
              location
              coach {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;
