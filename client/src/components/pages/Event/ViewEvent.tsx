import { gql, useQuery } from '@apollo/client';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { EventModel } from '../../../types';
import ViewEventTimeslot from './event-timeslots/details/ViewEventTimeslot';

export const eventQuery = gql`
  query Event($id: Int) {
    event(id: $id) {
      ... on Event {
        id
        geoAddressId
        eventType
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
          participants {
            id
          }
        }
        isEventCancelled
        eventCancelDate
        max
        coach {
          id
          name
          rating
          university {
            id
            name
          }
          primaryPosition {
            id
            name
          }
          profileImage {
            id
            url
            publicId
          }
          path
          disabledBooking
        }
        cost
        duration
        sessionType
        date
        location
        title
        description
        participantsCount
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
`;

const ViewEvent: FC = () => {
  const params = useParams<{ id: string }>();

  const { loading, error, data } = useQuery<{ event: EventModel }>(eventQuery, {
    variables: {
      id: parseInt(params.id),
    },
    fetchPolicy: 'no-cache',
    skip: !params.id,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>Error loading event data. Please refresh the page to try again.</div>
    );
  }
  const event = data?.event;

  if (!event) {
    return (
      <section className="event-details-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-10">
              Unfortunately we couldn&apos;t find event with id = {params.id}.
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <ViewEventTimeslot event={event} />;
};

export default ViewEvent;
