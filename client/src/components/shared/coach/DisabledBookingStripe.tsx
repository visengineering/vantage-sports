import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import { MainContext } from 'src/contexts';

export const DisabledBookingStripe = () => {
  const { profileId, profile, loading } = useContext(MainContext);
  if (loading) {
    return null;
  }
  const path = `/${profile?.path || profileId}`;
  return (
    <div className="disabled-booking-stripe">
      <div className="container justify-content-start">
        <span>You have disabled bookings of your events. </span>
        <Link to={`${path}/?showEdit=true`}>Allow bookings again.</Link>
      </div>
    </div>
  );
};
