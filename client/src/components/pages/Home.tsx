import React, { useContext, useEffect } from 'react';
import { MainContext } from '../../contexts/MainContext';
import { VideoHeader, UpcomingEventsList } from '../shared';

const Home = () => {
  const { setLive } = useContext(MainContext);

  useEffect(() => {
    setLive(false);
  });

  return (
    <div className="landing-page">
      <div className="container hero-container">
        <VideoHeader />
      </div>

      <div className="container">
        <UpcomingEventsList
          enableSearch={true}
          title={'Available Training Sessions'}
          includeEventsWhenDisabledBookings={false}
        />
      </div>
    </div>
  );
};

export default Home;
