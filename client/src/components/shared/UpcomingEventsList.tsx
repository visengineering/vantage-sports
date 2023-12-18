import { gql, useQuery } from '@apollo/client';
import find from 'lodash.find';
import React, { useContext, useEffect, FC, useMemo, useState } from 'react';
import { useNotification } from './hooks/use-notifications';
import { Formik, FormikValues } from 'formik';
import { Form as BootstrapForm } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams, useHistory } from 'react-router-dom';
import { MainContext } from '../../contexts';
import EventCard from './EventCard';
import {
  DerivedFormikProps,
  EventModel,
  EventSessionType,
  Sport,
} from '../../types';
import { LocationTypeSearchField } from './form/LocationTypeField';
import { StateSearchField } from './form/StateSearchField';
import { SportSearchField } from './form/SportSearchField';
import { GroupWrap } from '../group-wrap';
import { axiosInstance } from './api/axios';
import { UniversitySearchField } from './form/UniversitySearchField';

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';
const googleMapsGeoCodeJson =
  'https://maps.googleapis.com/maps/api/geocode/json';

const eventQuery = gql`
  query UpcomingEvents(
    $upcoming: Boolean
    $limit: Int
    $coachProfileId: Int
    $playerProfileId: Int
    $sportId: Int
    $sessionType: String
    $offset: Int
    $selectedState: String
    $universityId: Int
    $includeDisabledBookings: Boolean
  ) {
    event(
      upcoming: $upcoming
      limit: $limit
      coachProfileId: $coachProfileId
      playerProfileId: $playerProfileId
      sportId: $sportId
      sessionType: $sessionType
      selectedState: $selectedState
      universityId: $universityId
      offset: $offset
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

export const UpcomingEventsList: FC<{
  coachId?: number;
  title?: string;
  enableSearch?: boolean;
  notFoundText?: string;
  includeEventsWhenDisabledBookings?: boolean;
}> = ({
  coachId,
  title,
  enableSearch,
  notFoundText,
  includeEventsWhenDisabledBookings = true,
}) => {
  const history = useHistory();
  const notify = useNotification();
  const [sportId, setSportId] = useState<number | undefined>(undefined);
  const [sessionType, setSessionType] = useState<string | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined
  );
  const [universityId, setUniversityId] = useState<number | undefined>(
    undefined
  );
  const params = useParams<{ sport: string; state: string }>();
  const { profileId } = useContext(MainContext);
  const queryParams = new URLSearchParams(history.location.search);
  const tab = queryParams.get('tab') ?? '';

  const argsObj = useMemo(() => {
    return {
      variables: {
        sessionType,
        upcoming: true,
        includeDisabledBookings: includeEventsWhenDisabledBookings,
        offset: 0,
        limit: 10,
        ...(sportId || sportId === 0 ? { sportId } : {}),
        ...(universityId || universityId === 0 ? { universityId } : {}),
        ...(coachId || coachId === 0 ? { coachProfileId: coachId } : {}),
        ...(selectedState ? { selectedState } : {}),
        ...((profileId || profileId === 0) &&
        history.location.pathname.includes('/player')
          ? { playerProfileId: profileId }
          : {}),
      },
    };
  }, [
    selectedState,
    sessionType,
    universityId,
    sportId,
    coachId,
    profileId,
    tab,
  ]);

  const { loading, error, data, refetch, fetchMore } = useQuery<{
    event: {
      edges: { node: EventModel }[];
      total: number;
    };
  }>(eventQuery, argsObj);

  const result = useMemo(() => {
    if (data && data.event.edges.length > 0) {
      return data.event.edges.map(
        ({ node }: { node: EventModel }, index: number) => {
          const event = {
            ...node,
            timeslots: node.timeslots.slice(0, 3),
          };
          return <EventCard key={event.id} event={event} />;
        }
      );
    }
    return [];
  }, [
    data,
    selectedState,
    sessionType,
    universityId,
    sportId,
    coachId,
    profileId,
    tab,
  ]);

  useEffect(() => {
    if (params.sport) {
      const url = `${process.env.REACT_APP_API || ''}/rest/lookups/sports`;
      axiosInstance.get(url).then((response) => {
        const found = find(response.data.sports, function (o: Sport) {
          return (
            o.name
              .toLowerCase()
              .replace(' ', '-')
              .replace("'", '')
              .search(params.sport.toLowerCase()) > -1
          );
        });
        if (found) {
          setSportId(found.id);
        }
      });
    }
    if (params.state) {
      const url = `${process.env.REACT_APP_API || ''}/rest/lookups/states`;
      axiosInstance.get(url).then((response) => {
        const found = find(
          response.data.states,
          function (response: { state: string }) {
            return (
              response.state.toLowerCase().search(params.state.toLowerCase()) >
              -1
            );
          }
        );
        if (found) {
          setSelectedState(found.state);
        }
      });
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [selectedState, sessionType, universityId, sportId, coachId, profileId]);

  useEffect(
    function refetchEventsAfterCreateEvent() {
      if ((history as any)?.location?.state?.comingFromCreateEvent) {
        history.location.state = {};
        let state = { ...(history as any).location.state };
        delete state.comingFromCreateEvent;
        history.replace({ ...history.location, state });
        refetch();
      }
    },
    [(history as any).location.state?.comingFromCreateEvent]
  );

  const getLocation = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      notify({
        type: 'error',
        children: 'Geolocation is not supported by your browser',
      });
    } else {
      try {
        const coordinates: { latitude: string; longitude: string } =
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: `${position.coords.latitude}`,
                  longitude: `${position.coords.longitude}`,
                });
              },
              (error) => {
                reject(error);
              }
            );
          });

        const { latitude, longitude } = coordinates;
        const url = `${googleMapsGeoCodeJson}?key=${googleMapsApiKey}&latlng=${latitude},${longitude}`;
        fetch(url)
          .then((response) => response.json())
          .then((latLngLocation) => {
            const place = latLngLocation.results[0];

            place.address_components.forEach((component: any) => {
              const types = component.types;
              const value = component.long_name;
              if (types.includes('administrative_area_level_1')) {
                setSelectedState(value);
                notify({
                  type: 'success',
                  children: 'We grabbed your location!',
                });
              }
            });
          });
      } catch (e) {
        console.log(`Error ${e}`);
        notify({
          type: 'error',
          children: 'Something went wrong!',
        });
      }
    }
  };

  return (
    <>
      {enableSearch == true ? (
        <section className="card-panel-section">
          <div className="container">
            <div className="block-header">
              {title && (
                <div>
                  <h3 style={{ margin: 0, padding: 0, marginBottom: '1rem' }}>
                    {title}
                  </h3>
                </div>
              )}
              <Formik<{
                sport: number | '';
                locationType: EventSessionType | '';
                selectedState: string | '';
              }>
                initialValues={{
                  sport: '',
                  locationType: '',
                  selectedState: '',
                }}
                onSubmit={() => {}}
              >
                {({ handleSubmit }: DerivedFormikProps<FormikValues>) => (
                  <BootstrapForm onSubmit={handleSubmit}>
                    <GroupWrap
                      gap={1}
                      style={{ minWidth: '200px', flex: 1 }}
                      justifyContent="normal"
                      alignItems="stretch"
                    >
                      <StateSearchField
                        name="state"
                        placeholder="By State"
                        withLabel={false}
                        onChange={(value) => setSelectedState(value)}
                        valueTracker={selectedState}
                      />
                      <SportSearchField
                        name="sport"
                        placeholder="By Sport"
                        withLabel={false}
                        onChange={(value) => setSportId(value)}
                        valueTracker={sportId}
                      />
                      <UniversitySearchField
                        name="university"
                        placeholder="By University"
                        withLabel={false}
                        onChange={(value) => setUniversityId(value)}
                        valueTracker={universityId}
                      />
                      <LocationTypeSearchField
                        name="locationType"
                        placeholder="By Type"
                        withLabel={false}
                        onChange={(value) => setSessionType(value)}
                        valueTracker={sessionType}
                      />

                      <div className="filter-events-buttons">
                        <button
                          type="button"
                          style={{
                            height: '50px',
                            width: '100%',
                            background: '#fff 0% 0% no-repeat padding-box',
                            boxShadow: '0px 0px 9px #0000001c',
                          }}
                          className="btn btn-default text-center"
                          onClick={() => {
                            setSportId(undefined);
                            setSessionType(undefined);
                            setSelectedState(undefined);
                            setUniversityId(undefined);
                          }}
                        >
                          <i className="fas fa-refresh fa-1x"></i>
                        </button>

                        <button
                          type="button"
                          style={{
                            height: '50px',
                            width: '100%',
                            background: '#fff 0% 0% no-repeat padding-box',
                            boxShadow: '0px 0px 9px #0000001c',
                          }}
                          className="btn btn-default text-center"
                        >
                          <i
                            className="fas fa-map-marker-alt fa-1x"
                            onClick={getLocation}
                          ></i>
                        </button>
                      </div>
                    </GroupWrap>
                  </BootstrapForm>
                )}
              </Formik>
            </div>
            <div className="card-container">
              {data?.event.edges && (
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
                  {result}
                  <div className="card">
                    <div className="text-block">
                      <div className="text">
                        <h4>Not finding the right training?</h4>
                        <br />
                        We are adding new athletes each week. Enter a custom
                        training request or book a free 15 min call with our
                        team to discuss your specific needs.
                      </div>
                    </div>

                    <div className="btn-container">
                      <a
                        href="https://timesync.novocall.co/patrickj/15min"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button type="button" className="btn btn-primary">
                          Book a 15 min call with our Team
                        </button>
                      </a>

                      <a
                        href="https://g6ey57cftos.typeform.com/to/Ncm0mRzv"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <button type="button" className="btn btn-primary">
                          Fill out the brief training request form
                        </button>
                      </a>
                    </div>
                  </div>
                </InfiniteScroll>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="card-panel-section">
          <h3 className="title">{title}</h3>
          <div className="block-header"></div>
          <div className="card-container">
            {data && data.event.edges.length > 0 ? (
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
                {result}
              </InfiniteScroll>
            ) : (
              <div className="card-not-found">{notFoundText || ''}</div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default UpcomingEventsList;
