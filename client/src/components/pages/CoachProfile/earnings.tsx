import { gql, useQuery } from '@apollo/client';
const { Image } = require('cloudinary-react');
import moment from 'moment';
import React, { useContext, FC, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import { errorToString } from 'src/components/shared/api/errorToString';
import { Stack } from 'src/components/shared/Stack';
import {
  EventModel,
  TimeslotConnection,
  TimeslotModel,
  TimeslotModelWithEvent,
} from 'src/types';
import { wallet, tax, sports, defaultPic } from '../../../assets';
import { MainContext } from '../../../contexts';

const completedEvent = gql`
  query Timeslot(
    $completed: Boolean
    $coachProfileId: Int
    $limit: Int
    $offset: Int
  ) {
    timeslot(
      completed: $completed
      coachProfileId: $coachProfileId
      limit: $limit
      offset: $offset
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
            event {
              id
              title
              description
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

const DashboardCardBlock: FC<{ data: TimeslotConnection }> = ({ data }) => {
  const totalEarnings = useMemo(() => {
    if (data) {
      return data.timeslot.edges.reduce(
        (total, { node: timeslot }) =>
          total + timeslot.participantsCount * timeslot.cost,
        0
      );
    }
    return 0;
  }, [data, data.timeslot.total]);
  const trainingsComplete = data.timeslot.edges.length;

  return (
    <div className="card-block">
      <div className="dashboard-card">
        <div className="card-icon">
          <img src={wallet} alt="wallet" />
        </div>

        <div className="card-content">
          <div className="nm-lbl">${totalEarnings.toFixed(2)}</div>
          <div className="text">Total Earning</div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="card-icon">
          <img src={tax} alt="tax" />
        </div>

        <div className="card-content">
          <div className="nm-lbl">${(totalEarnings * 0.15).toFixed(2)}</div>
          <div className="text">Tax Liability*</div>
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card-icon">
          <img src={sports} alt="sports" />
        </div>

        <div className="card-content">
          <div className="nm-lbl">{trainingsComplete}</div>
          <div className="text">Trainings Complete</div>
        </div>
      </div>
    </div>
  );
};

const TimeslotRow: FC<{
  timeslot: TimeslotModelWithEvent;
}> = ({ timeslot }) => (
  <div className="event">
    <div className="event-img">
      {timeslot.event.media?.publicId && (
        <Image publicId={timeslot.event.media.publicId} alt="cover image" />
      )}
      {!timeslot.event.media?.publicId &&
        timeslot.event.coach?.profileImage?.publicId && (
          <Image
            publicId={timeslot.event.coach?.profileImage.publicId}
            alt="cover image"
          />
        )}
      {!timeslot.event.media?.publicId &&
        !timeslot.event.coach?.profileImage?.publicId && (
          <img src={defaultPic} alt="cover image" />
        )}
    </div>

    <div className="event-text">{timeslot.event.title}</div>

    <div className="mbl-row">
      <div className="event-text text-center">
        {' '}
        {moment
          .utc(timeslot.startDate)
          .local()
          .format('MM-DD-YYYY  h:mm a')}{' '}
      </div>
      <div className="event-text text-center">
        ${(timeslot.cost * timeslot.participantsCount).toFixed(2)}
      </div>
    </div>
  </div>
);

const Earnings: FC = (props) => {
  const history = useHistory();
  const { profileId, isCoach, signedIn } = useContext(MainContext);

  const { loading, error, data, fetchMore } = useQuery<TimeslotConnection>(
    completedEvent,
    {
      variables: {
        coachProfileId: profileId,
        completed: true,
        limit: 1000, // We need all timeslots for calculations
        offset: 0,
      },
    }
  );

  if (!isCoach) {
    history.push('/sports-coaching');
  }

  if (loading) {
    return (
      <div className="event-details">
        <h2 className="title">
          {error ? (
            <div className="alert alert-danger" role="alert">
              {errorToString(error)}
            </div>
          ) : (
            'Loading...'
          )}
        </h2>
      </div>
    );
  }

  return (
    <section className="dashboard-info-section">
      <div className="container">
        <div className="dashboard-block">
          {!!data?.timeslot.edges.length && <DashboardCardBlock data={data} />}
          <div className="dashboard-head-block">
            <h3 className="title mb-0">Completed Trainings</h3>
            <Stack flow="column" gap={1}>
              <Button
                className="btn btn-primary"
                onClick={() => history.push('/create-event')}
              >
                Create Event
              </Button>
              <Button
                className="btn btn-primary"
                onClick={() => history.push('/set-availability')}
              >
                Set Availability
              </Button>
            </Stack>
          </div>
          <div className="event-list">
            {!!data?.timeslot.edges.length && (
              <InfiniteScroll
                dataLength={data.timeslot.edges.length}
                next={() => {
                  const currentLength = data.timeslot.edges.length ?? 0;
                  fetchMore({
                    variables: { offset: currentLength },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...prev,
                        ...fetchMoreResult,
                        timeslot: {
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
                {data.timeslot.edges.map(({ node }, index) => (
                  <TimeslotRow key={node.id} timeslot={node} />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
      * Tax liability only applies if you exceed $600 in earnings in a calendar
    </section>
  );
};
export default Earnings;
