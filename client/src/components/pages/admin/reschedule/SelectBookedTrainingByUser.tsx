import { useQuery } from '@apollo/client';
import React, { FC, Fragment, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { errorToString } from 'src/components/shared/api/errorToString';
import { myTrainingSchedule } from 'src/components/shared/api/timeslots';
import { Paragraph } from 'src/components/shared/Paragraph';
import { Stack } from 'src/components/shared/Stack';
import { TimeslotConnection, TimeslotModelWithEvent } from 'src/types';
import ParticipantDetailCardItem from '../../Player/ParticipantDetailCardItem';

export const SelectBookedTrainingByUser: FC<{
  userId: number;
  onSelect: (selected: TimeslotModelWithEvent, participantId: number) => void;
}> = ({ userId, onSelect }) => {
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
    refetch();
  }, [userId]);

  if (data && data.timeslot) console.log(data.timeslot.edges);

  return (
    <section className="event-details-section">
      <div className="container">
        {data?.timeslot.edges && data.timeslot.edges.length > 0 ? (
          <div className="event-details">
            <h1 className="title">
              Choose which booked training to reschedule (click select on the
              card)
            </h1>
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
                node.event
                  ? node.participants
                      ?.filter((p) => p.client?.id === userId) // Watch out! client id is userId not profileId
                      .map((participant) => (
                        <Fragment key={node.id}>
                          <div className="row">
                            <div className="col-md-9 gutter">
                              <ParticipantDetailCardItem
                                event={node.event}
                                timeslot={node}
                              />
                            </div>
                            <div className="col-md-3 gutter">
                              <Stack
                                style={{ height: '100%' }}
                                gap={0}
                                flow="row"
                                alignItems="center"
                              >
                                <Button
                                  type="button"
                                  className="btn-signup w-100"
                                  onClick={() => {
                                    onSelect(node, participant.id);
                                  }}
                                >
                                  Select (id: {participant.id})
                                </Button>
                              </Stack>
                            </div>
                          </div>
                        </Fragment>
                      ))
                  : null
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
                  User currently do not have any scheduled training sessions.
                  Reschedule is not available for this user, choose other user.
                </>
              )}
            </Paragraph>
          </div>
        )}
      </div>
    </section>
  );
};
