import React, { FC } from 'react';
import { Col, Row } from 'react-bootstrap';
import SignUpForm from './SignUpIn/SignUpForm';
import { VideoHeader } from '../shared';
import { CoachSlider } from '../layout/index';
import { useMediaQuery } from 'react-responsive';
import {
  isDesktopMediaQuery,
  isMobileMediaQuery,
} from '../shared/utils/responsiveness';

const SignUp: FC = () => {
  const isDesktop = useMediaQuery(isDesktopMediaQuery);
  const isMobile = useMediaQuery(isMobileMediaQuery);

  return (
    <Row className="m-0">
      <Col className="col-xl-7 col-12 min-h-100-pct">
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <div className="container hero-container pt-5">
            <VideoHeader
              altText="Sign up to learn the game from your favorite college athlete"
              style={isMobile ? { fontSize: '24px' } : { fontSize: '32px' }}
            />
            {isDesktop && <CoachSlider />}
          </div>
        </div>
      </Col>
      <Col className="col-xl-5 col-12 justify-content-center align-items-center py-5">
        <SignUpForm type="basic_signup" />
      </Col>
    </Row>
  );
};

export default SignUp;
