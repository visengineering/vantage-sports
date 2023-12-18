import React, { FC } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { EventModel, TimeslotModel } from 'src/types';
import * as assets from '../../../assets';

const ParticipantDetailCardItem: FC<{
  event: EventModel;
  timeslot: TimeslotModel;
}> = ({
  event: { coach, id, title, location },
  timeslot: { startDate: date, duration, maxParticipantsCount },
}) => (
  <div className="event-details">
    <div className="details-card">
      <div className="row">
        <div className="col-md-3 gutter">
          <div className="lbl"> Coach</div>
          <div className="info">
            <Link className="text" to={`/${coach.path || coach.id}`}>
              {coach.name}
            </Link>
          </div>
        </div>

        <div className="col-md-6 gutter">
          <div className="lbl">Title</div>
          <div className="info">
            <Link className="text" to={'/training/' + id}>
              {title}
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="lbl">Date</div>
          <div className="info">
            <span className="icon">
              <img src={assets.calendarBlue} alt="icon" />
            </span>
            <span className="text">
              {moment.utc(date).local().format('ddd, MM/DD/YY, h:mm a')}
            </span>
          </div>
        </div>

        <div className="col-md-2">
          <div className="lbl">Duration</div>
          <div className="info">
            <span className="icon">
              <img src={assets.clock} alt="icon" />
            </span>
            <span className="text">{duration}</span>
          </div>
        </div>

        <div className="col-md-2">
          <div className="lbl">Participants</div>
          <div className="info">
            <span className="icon">
              <img src={assets.peoples} alt="icon" />
            </span>
            <span className="text">{maxParticipantsCount}</span>
          </div>
        </div>
        <div className="col-md-2">
          <div className="lbl">Location</div>
          <div className="info">
            <span className="icon">
              <img src={assets.location} alt="icon" />
            </span>
            <span className="text">{location}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ParticipantDetailCardItem;
