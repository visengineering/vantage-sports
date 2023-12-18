import moment from 'moment';
import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EventModel, EventSessionTypeEnum } from '../../types';
import * as assets from '../../assets';
const { Image } = require('cloudinary-react');
const v = require('voca');

const EventCard: FC<{ event: EventModel }> = ({ event }) => (
  <div className="card">
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
      <div className="location-info">
        <span className="location-icon">
          <img src={assets.location} alt="icon" />
        </span>
        <span className="text">
          {`${v.titleCase(event.sessionType)}${
            event.sessionType === EventSessionTypeEnum.In_Person
              ? ` - ${event.location}`
              : ''
          }`}
        </span>
      </div>
      {event.timeslots.map((timeslot) => (
        <div key={timeslot.id} className="date-price-block">
          {timeslot.startDate && (
            <div className="date">
              <span className="icon">
                <img src={assets.calendarBlue} alt="icon" />
              </span>

              <span className="lbl">
                {moment(timeslot.startDate)
                  .utc()
                  .local()
                  .format('ddd, MM/DD/YYYY, h:mm a')}
              </span>
            </div>
          )}

          {timeslot.cost && <div className="price">${timeslot.cost}</div>}
          {timeslot.isCancelled && (
            <p className="text text-danger text-large">
              Event cancelled by coach
            </p>
          )}
        </div>
      ))}
    </div>
    <Link to={'/training/' + event.id}>
      <Button>View Details</Button>
    </Link>
  </div>
);

export default EventCard;
