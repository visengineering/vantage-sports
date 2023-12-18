import { useQuery } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useContext, useEffect, FC, useState } from 'react';
import { Formik, FormikValues } from 'formik';
import { Form as BootstrapForm } from 'react-bootstrap';
import { MainContext } from '../../../contexts';
import {
  DerivedFormikProps,
  EventModel,
  EventSessionType,
} from '../../../types';
import { LocationTypeSearchField } from '../../shared/form/LocationTypeField';
import { SportSearchField } from '../../shared/form/SportSearchField';
import { GroupWrap } from '../../group-wrap';
import { favoriteCoachesEventsQuery } from 'src/components/shared/api/event';
import { EventCard } from 'src/components/shared';
import { Paragraph } from 'src/components/shared/Paragraph';
import { Link } from 'src/components/shared/Link';
import { Stack } from 'src/components/shared/Stack';

const FavoriteCoachesEvents: FC = () => {
  const { profileId } = useContext(MainContext);
  const [sportId, setSportId] = useState<number | undefined>(undefined);
  const [sessionType, setSessionType] = useState<number | undefined>(undefined);

  const { loading, error, data, refetch, fetchMore } = useQuery<{
    event: {
      edges: { node: EventModel }[];
      total: number;
    };
  }>(favoriteCoachesEventsQuery, {
    variables: {
      sessionType,
      upcoming: true,
      includeDisabledBookings: false,
      onlyFavorites: true,
      offset: 0,
      limit: 10,
      ...(sportId || sportId === 0 ? { sportId } : {}),
      ...(profileId || profileId === 0 ? { playerProfileId: profileId } : {}),
    },
  });

  useEffect(() => {
    refetch();
  }, [profileId]);

  useEffect(() => {
    if (sessionType || sportId) {
      refetch();
    }
  }, [sessionType, sportId]);

  return (
    <section className="card-panel-section" style={{ marginTop: '32px' }}>
      <Stack flow="row" gap={1}>
        <GroupWrap gap={1}>
          <div>
            <h3 style={{ margin: 0, padding: 0 }}>
              Availability of Favorite Coaches
            </h3>
            <Link variant="blue" to={`/player/${profileId}/favorite-coaches`}>
              Manage Your Favorite Coaches
            </Link>{' '}
            |{' '}
            <Link variant="blue" to={`/coaches`}>
              All Coaches
            </Link>
          </div>
          <Formik<{ sport: number | ''; locationType: EventSessionType | '' }>
            initialValues={{
              sport: '',
              locationType: '',
            }}
            onSubmit={() => {}}
          >
            {({ handleSubmit }: DerivedFormikProps<FormikValues>) => (
              <BootstrapForm onSubmit={handleSubmit}>
                <GroupWrap
                  gap={1}
                  style={{ minWidth: '250px', flex: 1 }}
                  justifyContent="normal"
                  alignItems="stretch"
                >
                  <LocationTypeSearchField
                    name="locationType"
                    placeholder="By Type"
                    withLabel={false}
                    onChange={(value) => setSessionType(value)}
                  />
                  <SportSearchField
                    name="sport"
                    placeholder="By Sport"
                    withLabel={false}
                    onChange={(value) => setSportId(value)}
                  />
                </GroupWrap>
              </BootstrapForm>
            )}
          </Formik>
        </GroupWrap>
        <div className="card-container">
          {loading && <p>Loading...</p>}
          {data?.event.edges?.length ? (
            <div
              style={{
                height: 'auto',
                overflow: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {data.event.edges.map(
                ({ node }: { node: EventModel }, index: number) => (
                  <EventCard
                    key={node.id}
                    event={{
                      ...node,
                      timeslots: node.timeslots.slice(0, 3),
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <Paragraph type="infobox">
              Your favorite coaches do not have any sessions scheduled. Consider{' '}
              <Link variant="blue" to={`/coaches`}>
                adding more coaches to favorites
              </Link>
              . You can also check availability of{' '}
              <Link variant="blue" to={`/sports-coaching`}>
                all Vantage Sports coaches
              </Link>
              .
            </Paragraph>
          )}
        </div>
      </Stack>
    </section>
  );
};

export default FavoriteCoachesEvents;
