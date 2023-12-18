import React, { FC, useContext } from 'react';
import { MainContext } from '../../contexts';
import {
  Hero,
  CoachSlider,
  CheckCoachesTraining,
  HowItWorks,
  WhyVantage,
  Reviews,
  JoinTeam,
  SocialProof,
} from '../layout/index';
import { Loading } from '../shared/Loading';
import SignUpForm from './SignUpIn/SignUpForm';

const LandingPage: FC = () => {
  const { loading } = useContext(MainContext);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Hero />
      <CoachSlider />
      <CheckCoachesTraining />
      <HowItWorks />
      <WhyVantage />
      <Reviews />
      <JoinTeam />
      <SocialProof />
      <div id="join-us-section" className="join-us-section">
        <SignUpForm type="landing_signup" />
      </div>
    </div>
  );
};

export default LandingPage;
