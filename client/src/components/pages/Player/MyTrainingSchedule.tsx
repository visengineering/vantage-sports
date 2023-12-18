import React, { useState, useContext, useEffect, FC, Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MainContext } from '../../../contexts';
import ParticipantDetailCardItem from './ParticipantDetailCardItem';
import { TimeslotConnection } from 'src/types';
import { errorToString } from 'src/components/shared/api/errorToString';
import { Paragraph } from 'src/components/shared/Paragraph';
import { myTrainingSchedule } from 'src/components/shared/api/timeslots';

const MyTrainingSchedule: FC = () => {
  const [paramsReady, setParamsReady] = useState(false);
  const { userId, isSignedIn, jwt } = useContext(MainContext);

  const { loading, error, data, refetch, fetchMore } =
    useQuery<TimeslotConnection>(myTrainingSchedule, {
      variables: {
        upcoming: true,
        limit: 10,
        offset: 0,
        playerUserId: userId,
        isCancelled: false,
      },
    });

  useEffect(() => {
    if (isSignedIn && userId && jwt) {
      setParamsReady(true);
    } else {
      console.log('cant query for events');
    }
  }, [isSignedIn, userId, jwt]);

  useEffect(() => {
    refetch();
  }, [paramsReady]);

  return (
    <section className="event-details-section">
      <div className="container">
        {data?.timeslot.edges && data.timeslot.edges.length > 0 ? (
          <div className="event-details">
            <h1 className="title">My Training Schedule</h1>
            <InfiniteScroll
              dataLength={data.timeslot.edges.length}
              next={() => {
                const currentLength = data.timeslot.edges.length;
                fetchMore({
                  variables: { offset: currentLength },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                      ...prev,
                      ...fetchMoreResult,
                      event: {
                        ...fetchMoreResult.timeslot,
                        edges: [
                          ...prev.timeslot.edges,
                          ...fetchMoreResult.timeslot.edges,
                        ],
                      },
                    };
                  },
                });
              }}
              hasMore={!(data.timeslot.total === data.timeslot.edges.length)}
              loader={<h4>Loading...</h4>}
            >
              {data.timeslot.edges.map(({ node }) =>
                node.event ? (
                  <Fragment key={node.id}>
                    <ParticipantDetailCardItem
                      event={node.event}
                      timeslot={node}
                    />
                  </Fragment>
                ) : null
              )}
            </InfiniteScroll>
          </div>
        ) : (
          <div className="event-details">
            <Paragraph type="infobox">
              {loading ? (
                'Loading'
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {errorToString(error)}
                </div>
              ) : (
                <>
                  You currently do not have any scheduled training sessions.
                  <br />
                  Use the Available Training link to select a session
                </>
              )}
            </Paragraph>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyTrainingSchedule;
