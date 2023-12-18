import React, { useState, useContext, useEffect, FC } from 'react';
import { gql, useQuery } from '@apollo/client';
import { MainContext } from '../../../contexts';
import CompletedEventsList from './dashboard/completed/CompletedEventsList';

const CompletedTrainings: FC = () => {
  const [paramsReady, setParamsReady] = useState(false);

  const participantQuery = gql`
    query Participant(
      $limit: Int
      $offset: Int
      $playerId: Int
      $completed: Boolean
    ) {
      participant(
        limit: $limit
        offset: $offset
        playerId: $playerId
        completed: $completed
      ) {
        ... on ParticipantConnection {
          total
          edges {
            node {
              id
              coach {
                id
                name
                rating
                profileImage {
                  id
                  publicId
                  url
                }
              }
              timeslot {
                startDate
                endDate
                duration
                cost
                maxParticipantsCount
                participantsCount
                isCancelled
                cancelDate
              }
              event {
                id
                date
                title
                cost
                max
                description
                duration
                location
                media {
                  id
                  url
                  publicId
                }
              }
              review {
                id
                comment
                rating
              }
            }
          }
        }
      }
    }
  `;

  const { userId, profileId, isSignedIn } = useContext(MainContext);

  const { loading, error, data, refetch, fetchMore } = useQuery(
    participantQuery,
    {
      variables: {
        playerId: Number(userId), // Warning! This is userId not profileId
        limit: 10,
        offset: 0,
        completed: true,
      },
    }
  );

  useEffect(() => {
    if (isSignedIn && userId && profileId) {
      setParamsReady(true);
    }
  }, [isSignedIn, userId, profileId]);

  useEffect(() => {
    refetch();
  }, [paramsReady]);

  return data?.participant?.edges?.length > 0 ? (
    <section className="event-details-section">
      <div className="container">
        <div className="event-details">
          <h1 className="title">Completed Trainings</h1>
          <CompletedEventsList
            canReview={true}
            participations={data?.participant}
            fetchMore={fetchMore}
          />
        </div>
      </div>
    </section>
  ) : (
    <section className="event-details-section">
      <div className="container">
        <div className="event-details">
          <h2 className="title">
            {!loading && !(data?.participant?.edges?.length > 0)
              ? 'You currently do not have any completed trainings'
              : 'Loading...'}
          </h2>
        </div>
      </div>
    </section>
  );
};

export default CompletedTrainings;
