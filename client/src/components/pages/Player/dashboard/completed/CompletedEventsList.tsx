import {
  ApolloQueryResult,
  FetchMoreOptions,
  FetchMoreQueryOptions,
  OperationVariables,
} from '@apollo/client';
import React, { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  EventModel,
  GraphQLUserProfile,
  ReviewModel,
  TimeslotModel,
} from 'src/types';
import CompletedEvent from './CompletedEvent';

type TData = {
  event: {
    edges: { node: EventModel }[];
    total: number;
  };
};

type CompletedEventsListProps = {
  canReview: boolean;
  fetchMore: (
    fetchMoreOptions: FetchMoreQueryOptions<OperationVariables, TData> &
      FetchMoreOptions<TData, OperationVariables>
  ) => Promise<ApolloQueryResult<any>>;
  participations: {
    total: number;
    edges: {
      node: {
        id: number;
        coach: GraphQLUserProfile;
        event: EventModel;
        review: ReviewModel;
        timeslot: TimeslotModel;
      };
    }[];
  };
};

export const CompletedEventsList: FC<CompletedEventsListProps> = ({
  participations,
  canReview,
  fetchMore,
}) => (
  <section className="card-panel-section">
    <div className="block-header"></div>
    <div className="card-container">
      {participations.total && (
        <InfiniteScroll
          dataLength={participations.edges.length}
          className="row"
          style={{ display: 'flex', flexWrap: 'wrap' }}
          next={() => {
            const currentLength = participations.edges.length;
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
          hasMore={!(participations.total === participations.edges.length)}
          loader={<h4>Loading...</h4>}
        >
          {participations.total > 0 && (
            <>
              {participations.edges.map(({ node }) => (
                <CompletedEvent
                  key={node.event.id}
                  participant={node}
                  canReview={canReview}
                />
              ))}
            </>
          )}
        </InfiniteScroll>
      )}
    </div>
  </section>
);

export default CompletedEventsList;
