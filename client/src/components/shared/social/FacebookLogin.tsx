import React, { FC } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import facebookIcon from '../../../assets/facebook_icon.svg';
const { OldSocialLogin: SocialLogin } = require('react-social-login');

export type FacebookUser = {
  provider: 'facebook';
  profile?: {
    name: string;
    firstName: string;
    lastName: string;
    id: string;
    profilePicURL: string;
    email: string;
  };
  token?: {
    accessToken: string;
    expiresAt: number;
    idToken: undefined; // Does not exist for facebook login
  };
};

export const FacebookLogin: FC<{
  callback: (user?: FacebookUser, error?: any) => void;
  isLoading?: boolean;
}> = ({ callback, isLoading }) => (
  <SocialLogin
    provider="facebook"
    appId={process.env.REACT_APP_FACEBOOK_APP_ID ?? ''}
    callback={(user?: FacebookUser, error?: any) => {
      callback(user, error);
    }}
  >
    <Button className="btn-social w-100" disabled={isLoading}>
      <Row className="row-social">
        <Col className="col-auto px-1">
          <img src={facebookIcon} alt="Facebook" width={30} height={30} />
        </Col>
        <Col className="col-auto px-1" style={{ paddingTop: '0.15rem' }}>
          Continue With Facebook
        </Col>
      </Row>
    </Button>
  </SocialLogin>
);
