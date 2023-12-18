import React, { FC, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { EventModel } from '../../../../../types';
import * as assets from '../../../../../assets';
import { MainContext } from '../../../../../contexts';
import moment from 'moment';
import { DeleteEventCard } from './DeleteEventCard';

export const DeleteEventDetail: FC<{
  event: EventModel;
}> = ({ event }) => {
  const history = useHistory();
  const { profileId, isSignedIn } = useContext(MainContext);

  let [alertMessage, setAlertMessage] = useState('');

  const training = event;

  const isEventCancelled =
    training.timeslots.every((t) => t.isCancelled) || training.isEventCancelled;
  const hasParticipants = training.timeslots.some(
    (t) =>
      t.participantsCount > 0 ||
      (Array.isArray(t.participants) && t.participants.length) > 0
  );
  const isEventSoldOut = training.timeslots.every(
    (t) => t.participantsCount >= t.maxParticipantsCount
  );
  const isEventComplete = training.timeslots.every((t) =>
    moment(t.startDate).isBefore(moment(new Date().toJSON()))
  );
  const isEventInactive = isEventCancelled || isEventComplete || isEventSoldOut;

  const isMyEvent = profileId && training.coach.id == profileId && isSignedIn;

  if (!isMyEvent || isEventInactive) {
    history.push(`/training/${training.id}`);
  }

  return (
    <section className="event-details-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <Link
              to="#"
              className="btn btn-back"
              onClick={function onEventBackArrowClick(event) {
                event.preventDefault();
                if (!window.document.referrer) {
                  history.push('/sports-coaching');
                } else {
                  if (history.length > 1) {
                    history.goBack();
                  } else {
                    history.push('/sports-coaching');
                  }
                }
              }}
            >
              <div className="go-back">
                <img
                  src={
                    window.document.referrer ? assets.backArrow : assets.home
                  }
                  alt={window.document.referrer ? 'Back Arrow' : 'Home Icon'}
                />
              </div>
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 gutter">
            <DeleteEventCard
              training={training}
              hasParticipants={hasParticipants}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeleteEventDetail;
