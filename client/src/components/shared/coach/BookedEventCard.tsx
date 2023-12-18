import React, { FC, useContext } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import * as assets from '../../../assets';
const { Image } = require('cloudinary-react');
import { Link } from '../Link';
import { EventModel } from 'src/types';
import { Stack } from '../Stack';
import { useMediaQuery } from 'react-responsive';
import { DataItems, DataList } from 'src/components/data-list';
import { MainContext } from 'src/contexts';

export const BookedEventCard: FC<{ event: EventModel }> = ({ event }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });
  const { profileId } = useContext(MainContext);
  return (
    <div className="card" style={{ maxWidth: 'unset', width: '100%' }}>
      <Link to={'/training/' + event.id}>
        <div className="card-img">
          {event.media?.publicId && (
            <Image publicId={event.media.publicId} alt="cover image" />
          )}
          {event.timeslots.every(
            (t) => t.participantsCount === t.maxParticipantsCount
          ) && <div className="centered h3">Fully Booked </div>}

          {!event.media?.publicId && event.coach.profileImage?.publicId && (
            <Image
              publicId={event.coach.profileImage.publicId}
              alt="cover image"
            />
          )}
          {!event.media?.publicId && !event.coach.profileImage?.publicId && (
            <img src={assets.defaultPic} alt="cover image" />
          )}
        </div>
        <span className="card-title" title={event.title}>
          {event.title}
        </span>
      </Link>
      <div className="info-block">
        <Link to={`/${event.coach.path || event.coach.id}`}>
          <div className="author">
            <div className="profile">
              {event.coach.profileImage?.publicId && (
                <Image
                  publicId={event.coach.profileImage.publicId}
                  alt="coach image"
                />
              )}
              {!event.coach.profileImage?.publicId && (
                <img src={assets.defaultPic} className="coach-img" />
              )}
            </div>

            <div className="name">{event.coach.name}</div>
          </div>
        </Link>

        <Stack flow="row" gap={2}>
          {event.timeslots.map((timeslot, index) => (
            <div
              key={timeslot.id}
              className={`date-price-block${index !== 0 ? ' card-hr-top' : ''}`}
            >
              {timeslot.startDate && (
                <div>
                  <div className="date">
                    <span className="icon">
                      <img src={assets.calendarBlue} alt="icon" />
                    </span>

                    <h5 className="lbl">
                      {moment(timeslot.startDate)
                        .utc()
                        .local()
                        .format('ddd, MM/DD/YYYY, h:mm a')}
                    </h5>
                  </div>
                  <div>
                    {isTabletOrMobile ? (
                      <Stack flow="row" gap={1}>
                        {timeslot.participants?.map((p) => (
                          <Stack flow="row" gap={1} key={p.id}>
                            <DataList>
                              <DataItems>
                                <span>Participant Name</span>
                                <span>{p.client?.profile?.name}</span>
                                <span>Email</span>
                                <span>{p.client?.email}</span>
                                <span>Phone</span>
                                <span>{p.client?.profile?.cellphone}</span>
                              </DataItems>
                            </DataList>
                          </Stack>
                        ))}
                      </Stack>
                    ) : (
                      <Stack flow="row" gap={1}>
                        <Stack flow="column" templateColumns="40px 1fr 1fr 1fr">
                          <div className="font-weight-bold">Nr</div>
                          <div className="font-weight-bold">
                            Participant Name
                          </div>
                          <div className="font-weight-bold">Email</div>
                          <div className="font-weight-bold">Phone</div>
                        </Stack>

                        {timeslot.participants?.map((p, index) => (
                          <Stack
                            flow="column"
                            templateColumns="40px 1fr 1fr 1fr"
                            key={p.id}
                          >
                            <div>#{index + 1}</div>
                            <div>{p.client?.profile?.name}</div>
                            <div>{p.client?.email}</div>
                            <div>{p.client?.profile?.cellphone}</div>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </div>
                </div>
              )}

              {timeslot.cost && <h5>${timeslot.cost}</h5>}
              {timeslot.isCancelled && (
                <p className="text text-danger text-large">
                  {profileId === event.coach.id ? (
                    <span>
                      You have cancelled the event on{' '}
                      {moment(timeslot.startDate)
                        .utc()
                        .local()
                        .format('ddd, MM/DD/YYYY, h:mm a')}
                      . Please reach out to customers.
                    </span>
                  ) : (
                    'Event cancelled by coach'
                  )}
                </p>
              )}
            </div>
          ))}
        </Stack>
      </div>
      <Link to={'/training/' + event.id}>
        <Button>View Details</Button>
      </Link>
    </div>
  );
};
