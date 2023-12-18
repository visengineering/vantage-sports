import React, { FC } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import googleIcon from '../../../assets/google_icon.svg';
const { OldSocialLogin: SocialLogin } = require('react-social-login');

type GoogleSignInError =
  // https://developers.google.com/identity/sign-in/web/reference
  // Failed to initialize a required iframe from Google, for instance, due to an unsupported environment.
  // A details property will give more information on the error raised.
  | 'idpiframe_initialization_failed'
  // The user closed the popup before finishing the sign in flow.
  | 'popup_closed_by_user'
  // The user denied the permission to the scopes required.
  | 'access_denied'
  // No user could be automatically selected without prompting the consent flow.
  // Error raised when using signIn with prompt: 'none' option.
  // This option should not be required to use, as gapi.auth2.init will
  // automatically sign in the user if previously signed in during a previous session.
  | 'immediate_failed';

export type GoogleError = {
  error: GoogleSignInError;
};

export type GoogleUser = {
  provider: 'google';
  profile?: {
    name: string;
    firstName: string;
    lastName: string;
    id: string;
    profilePicURL: string;
    email: string;
  };
  token?: {
    idToken: string;
    accessToken: string;
    expiresAt: number;
    expiresIn: number;
    firstIssued_at: number;
    scope: string;
  };
};

export const GoogleLogin: FC<{
  callback: (user?: GoogleUser, error?: any | GoogleError) => void;
  isLoading?: boolean;
}> = ({ callback, isLoading }) => (
  <SocialLogin
    provider="google"
    appId={process.env.REACT_APP_GOOGLE_APP_ID ?? ''}
    callback={(user?: GoogleUser, error?: any | GoogleError) => {
      callback(user, error);
    }}
  >
    <Button className="btn-social w-100" disabled={isLoading}>
      <Row className="row-social">
        <Col className="col-auto px-1">
          <img src={googleIcon} alt="Google" width={25} height={25} />
        </Col>
        <Col className="col-auto px-1" style={{ paddingTop: '0.15rem' }}>
          Continue With Google
        </Col>
      </Row>
    </Button>
  </SocialLogin>
);
