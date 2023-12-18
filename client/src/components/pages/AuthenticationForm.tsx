import React, { FC } from 'react';
import { Row, Col } from 'react-bootstrap';
import SignInForm from './SignUpIn/SignInForm';
import playerImage from '../../assets/player-image.png';

const AuthenticationForm: FC = () => (
  <Row className="m-0 min-vh-100">
    <Col className="col-md-7 col-12 mh-100 bg-sky center-xy">
      <img src={playerImage} alt="player-image" className="player-image" />
    </Col>

    <Col className="col-md-5 col-12 center-xy px-4 py-5">
      <SignInForm type="signin-page" isFromPrchsEvntBtn={false} />
    </Col>
  </Row>
);

export default AuthenticationForm;
