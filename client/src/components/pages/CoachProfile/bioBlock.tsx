import React, { FC, useContext } from 'react';
import { ShareOnSocial } from 'src/components/layout/ShareOnSocial';
import { useShareLink } from 'src/components/shared/hooks/use-share-link';
import voca from 'voca';
import { CoachContext } from '../../../contexts';

const BioCard: FC = () => {
  const { coach } = useContext(CoachContext);
  const shareLink = useShareLink();

  return (
    <div className="bio-block">
      <div className="d-flex justify-content-between">
        <h4 className="title">Profile Bio</h4>
        <ShareOnSocial className="coach-share" shareLink={shareLink} />
      </div>
      <div className="bio-card">
        <div className="row">
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">College:</span>{' '}
              <span className="text">{coach?.university?.name}</span>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">Sports:</span>{' '}
              <span className="text">{coach?.sport?.name}</span>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">Class:</span>{' '}
              <span className="text">{voca.titleCase(coach?.class)}</span>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">Gender:</span>{' '}
              <span className="text">{voca.titleCase(coach?.gender)}</span>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">Primary Position:</span>{' '}
              <span className="text">{coach?.primaryPosition?.name}</span>
            </div>
          </div>
          <div className="col-lg-4 col-sm-6">
            <div className="bio-item">
              <span className="lbl">Secondary Position:</span>{' '}
              <span className="text">{coach?.secondaryPosition?.name}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioCard;
