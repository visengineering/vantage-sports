import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { CoachContext, MainContext } from '../../../contexts';
import UpcomingEventsList from '../../shared/UpcomingEventsList';
import BioBlock from './bioBlock';
import Earnings from './earnings';
import { CoachReviews } from './CoachReviews';
import { useQuery } from '@apollo/client';
import { GraphQLUserProfile } from 'src/types';
import { reviewQuery } from 'src/components/queries/review';
import BookedTrainings from 'src/components/shared/coach/BookedTrainings';

export enum CoachProfileTabEnum {
  REVIEWS = '7',
  EARNINGS = '6',
  TRAININGS = '4',
  ABOUT = '2',
  GENERAL = '1',
}

const ProfileInfoSection = () => {
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const tab = queryParams.get('tab') ?? '';
  const { coach } = useContext(CoachContext);
  const { isCoach, profileId } = useContext(MainContext);
  const isLoggedInUserProfile = isCoach && profileId === coach?.id;
  const [tabKey, setTabKey] = useState(
    tab && Number.isFinite(Number(tab)) ? tab : '1'
  );
  const { loading, error, data } = useQuery<{
    review: {
      comment: string;
      rating: number;
      player: GraphQLUserProfile;
    }[];
  }>(reviewQuery, {
    variables: { coachId: coach?.id },
  });

  useEffect(() => {
    if (tab) {
      setTabKey(Number.isFinite(Number(tab)) ? tab : '1');
    }
  }, [tab]);

  return (
    <section className="profile-info-section">
      <div className="container">
        <Tabs
          variant="pills"
          id="controlled-tab"
          activeKey={tabKey}
          onSelect={(eventKey) => {
            queryParams.set('tab', eventKey ?? '1');
            history.push({
              pathname: history.location.pathname,
              search: queryParams.toString(),
            });
          }}
        >
          <Tab eventKey={CoachProfileTabEnum.GENERAL} title="General">
            {tabKey === CoachProfileTabEnum.GENERAL && (
              <>
                <BioBlock />
                {isLoggedInUserProfile && <BookedTrainings />}
                {!isLoggedInUserProfile && (
                  <UpcomingEventsList
                    coachId={coach?.id}
                    title="Upcoming Training"
                    notFoundText="No upcoming trainings available."
                  />
                )}
              </>
            )}
          </Tab>
          <Tab eventKey={CoachProfileTabEnum.ABOUT} title="About">
            {tabKey === CoachProfileTabEnum.ABOUT && (
              <>
                <div className="bio-block pb-md-4">
                  <h4 className="title">Information</h4>

                  <div className="bio-card">
                    <div className="row">
                      <div className="col-lg-4 col-sm-6">
                        <div className="bio-item">
                          <span className="lbl">Hometown:</span>{' '}
                          <span className="text">{coach?.hometown}</span>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6">
                        <div className="bio-item">
                          <span className="lbl">Height:</span>{' '}
                          <span className="text">{coach?.height}</span>
                        </div>
                      </div>
                      <div className="col-lg-4 col-sm-6">
                        <div className="bio-item">
                          <span className="lbl">Weight:</span>{' '}
                          <span className="text">{coach?.weight}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bio-block pb-md-4">
                  <h4 className="title">Bio</h4>
                  <div className="bio-card">
                    <div className="row">
                      <div className="col-12">
                        <div className="text">{coach?.bio} </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Tab>

          <Tab eventKey={CoachProfileTabEnum.TRAININGS} title="Trainings">
            {tabKey === CoachProfileTabEnum.TRAININGS && (
              <UpcomingEventsList
                coachId={coach?.id}
                notFoundText="No upcoming trainings scheduled."
              />
            )}
          </Tab>

          {isLoggedInUserProfile && (
            <Tab eventKey={CoachProfileTabEnum.EARNINGS} title="Earnings">
              {tabKey === CoachProfileTabEnum.EARNINGS && <Earnings />}
            </Tab>
          )}

          <Tab eventKey={CoachProfileTabEnum.REVIEWS} title="Review">
            {tabKey === CoachProfileTabEnum.REVIEWS && (
              <>
                {loading && <div>Loading...</div>}
                {!loading && data && (
                  <CoachReviews reviewsArray={data.review} />
                )}
                {error && (
                  <p className="text text-danger text-small m-2">
                    Failed to load reviews.
                  </p>
                )}
              </>
            )}
          </Tab>
        </Tabs>
      </div>
    </section>
  );
};

export default ProfileInfoSection;
