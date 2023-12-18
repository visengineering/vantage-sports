import { gql, useQuery } from '@apollo/client';
import React, { useContext, FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MainContext } from '../../../contexts';
import { EventModel } from '../../../types';
import { Link } from '../Link';
import { CoachProfileTabEnum } from 'src/components/pages/CoachProfile/ProfileInfoSection';
import { errorToString } from '../api/errorToString';
import { BookedEventCard } from './BookedEventCard';

const bookedFutureEventsOfCoach = gql`
  query Event(
    $limit: Int
    $coachProfileId: Int!
    $playerProfileId: Int
    $sportId: Int
    $sessionType: String
    $offset: Int
    $withCancelled: Boolean
  ) {
    event(
      upcoming: true
      booked: true
      limit: $limit
      coachProfileId: $coachProfileId
      playerProfileId: $playerProfileId
      sportId: $sportId
      sessionType: $sessionType
      offset: $offset
      withCancelled: $withCancelled
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
              participants {
                id
                client {
                  id
                  email
                  profile {
                    name
                    cellphone
                  }
                }
              }
            }
            max
            coach {
              id
              name
              path
              state
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

export const BookedTrainings: FC = () => {
  const { profileId } = useContext(MainContext);

  const { loading, error, data, fetchMore } = useQuery<{
    event: {
      edges: { node: EventModel }[];
      total: number;
    };
  }>(bookedFutureEventsOfCoach, {
    variables: {
      offset: 0,
      limit: 10,
      coachProfileId: profileId,
      withCancelled: true,
    },
  });

  if (error) {
    <div className="alert alert-danger my-2" role="alert">
      Failed to load booked events:
      {errorToString(error)}
    </div>;
  }

  return (
    <section className="card-panel-section">
      <h3 className="title">Your Booked Trainings</h3>
      <div className="card-container">
        {!!data?.event.edges.length ? (
          <InfiniteScroll
            dataLength={data.event.edges.length}
            style={{ display: 'flex', flexWrap: 'wrap' }}
            next={() => {
              const currentLength = data.event.edges.length;
              fetchMore({
                variables: { offset: currentLength },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    ...prev,
                    ...fetchMoreResult,
                    event: {
                      ...fetchMoreResult.event,
                      edges: [
                        ...prev.event.edges,
                        ...fetchMoreResult.event.edges,
                      ],
                    },
                  };
                },
              });
            }}
            hasMore={!(data.event.total === data.event.edges.length)}
            loader={<h4>Loading...</h4>}
          >
            {data.event.edges.map(
              ({ node }: { node: EventModel }, index: number) => {
                return <BookedEventCard key={node.id} event={node} />;
              }
            )}
          </InfiniteScroll>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card-not-found">
            You have no booked trainings. See{' '}
            <Link
              variant="blue"
              to={`/coach/${profileId}?tab=${CoachProfileTabEnum.TRAININGS}`}
            >
              all of your trainings
            </Link>
            .
          </div>
        )}
      </div>
    </section>
  );
};

export default BookedTrainings;
