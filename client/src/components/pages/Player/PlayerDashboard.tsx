import React, { FC, useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';
import { isDesktopMediaQuery } from 'src/components/shared/utils/responsiveness';
import CompletedTrainings from './CompletedTrainings';
import FavoriteCoachesEvents from './FavoriteCoachesEvents';
import MyTrainingSchedule from './MyTrainingSchedule';
import { YourChildren } from './YourChildren';

export enum PlayerProfileTabEnum {
  MY_TRAINING_SCHEDULE = '1',
  COMPLETED_TRAININGS = '2',
  FAVOURITE_COACHES_AVAILABILITY = '3',
  YOUR_CHILDREN = '4',
}

const PlayerDashboard: FC = () => {
  const history = useHistory();
  const isDesktop = useMediaQuery(isDesktopMediaQuery);
  const queryParams = new URLSearchParams(history.location.search);
  const [tabEventKey, setTabEventKey] = useState<PlayerProfileTabEnum>(
    PlayerProfileTabEnum.MY_TRAINING_SCHEDULE
  );
  const tab = queryParams.get('tab') ?? '';
  const eventId = queryParams.get('eventId');

  useEffect(() => {
    if (
      Object.values(PlayerProfileTabEnum)
        .map((v) => v.toString())
        .includes(tab)
    ) {
      setTabEventKey(tab as PlayerProfileTabEnum);

      if (eventId) {
        history.push(
          {
            pathname: history.location.pathname,
            search: `?tab=${PlayerProfileTabEnum.COMPLETED_TRAININGS}`,
          },
          { eventId }
        );
      }
      return;
    }

    setTabEventKey(PlayerProfileTabEnum.MY_TRAINING_SCHEDULE);
    history.push({
      pathname: history.location.pathname,
      search: `?tab=${PlayerProfileTabEnum.MY_TRAINING_SCHEDULE}`,
    });
  }, [tab, eventId]);

  return (
    <section className="profile-info-section">
      <div className="container">
        <article>
          <Tabs
            variant={isDesktop ? 'tabs' : 'pills'}
            id="controlled-tab"
            activeKey={tabEventKey}
            onSelect={(eventKey) => {
              history.push({
                pathname: history.location.pathname,
                search: `?tab=${eventKey}`,
              });
            }}
          >
            <Tab
              eventKey={PlayerProfileTabEnum.FAVOURITE_COACHES_AVAILABILITY}
              title="Favorite Coaches Availability"
            >
              <FavoriteCoachesEvents />
            </Tab>
            <Tab
              eventKey={PlayerProfileTabEnum.MY_TRAINING_SCHEDULE}
              title="My Training Schedule"
            >
              <MyTrainingSchedule />
            </Tab>
            <Tab
              eventKey={PlayerProfileTabEnum.COMPLETED_TRAININGS}
              title="Completed Trainings"
            >
              <CompletedTrainings />
            </Tab>
            <Tab
              eventKey={PlayerProfileTabEnum.YOUR_CHILDREN}
              title="Your Children"
            >
              <YourChildren />
            </Tab>
          </Tabs>
        </article>
      </div>
    </section>
  );
};

export default PlayerDashboard;
