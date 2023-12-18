import React, { FC, useContext, useState } from 'react';
import { Row, Col, Card, Button, Form as BootstrapForm } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { MainContext } from '../../../contexts/MainContext';
import { Loader, ShowHidePassword } from 'src/components/shared';
import { FacebookLogin, FacebookUser } from '../../shared/social/FacebookLogin';
import {
  GoogleLogin,
  GoogleUser,
  GoogleError,
} from '../../shared/social/GoogleLogin';
import { DerivedFormikProps, SocialNetworkSignupDataType } from 'src/types';
import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';
import {
  emailSchema,
  passwordSchema,
} from '../Event/event-timeslots/validation-schema';
import { Input } from 'src/components/shared/form/Input';
import { Stack } from 'src/components/shared/Stack';
import { errorToString } from 'src/components/shared/api/errorToString';
import { getSocialLoginHumanError } from 'src/components/shared/social/get-social-login-human-error';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { SignInSignUpModalState } from './SignUpInModal';
import { axiosInstance } from 'src/components/shared/api/axios';

export type SignInFormProps = {
  type: 'modal' | 'signin-page';
  // only when type 'modal':
  setModalState?: (state: SignInSignUpModalState) => void;
  isFromPrchsEvntBtn?: boolean;
};

const SignInForm: FC<SignInFormProps> = ({
  type,
  isFromPrchsEvntBtn = false,
  setModalState,
}) => {
  const { invite, login } = useContext(MainContext);
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    undefined
  );
  const notify = useNotification();
  const history = useHistory();
  const queryParams = new URLSearchParams(history.location.search);
  const playerProfileId = queryParams.get('playerProfileId');
  const eventId = queryParams.get('eventId');
  const hasSessionExpired = queryParams.get('expired');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const notifyGTM = () => {
    (window as any).dataLayer.push({
      event: 'Signup',
      action: 'Scroll To Form',
      category: 'account',
      label: 'Signup Flow',
      version: 1,
      cohort: invite,
    });
  };

  async function handleSocialLogin(
    user?: FacebookUser | GoogleUser,
    error?: any | GoogleError
  ) {
    setIsLoading(false);

    if (error) {
      setErrorMessage(
        getSocialLoginHumanError(
          error,
          'Social login failed for unknown reason. Please use standard login+password sign in or request password reset if your social profile had no password set.'
        )
      );

      return;
    }
    if (!user) {
      setErrorMessage(
        'Successful social login but insufficient data returned. Missing access to user data.'
      );
      return;
    }
    if (!user?.token?.idToken && !user?.token?.accessToken) {
      setErrorMessage(
        'Successful social login but insufficient data returned. Missing access to user token data.'
      );
      return;
    }
    if (!user.provider) {
      setErrorMessage(
        "Successful social login but couldn't determine provider (Google? Facebook?). We are sorry. Please use standard sign-in form. If you do not have password setup for social account, request password reset."
      );
      return;
    }
    if (errorMessage) setErrorMessage('');

    try {
      setIsLoading(true);
      const res = await axiosInstance.post(
        `${process.env.REACT_APP_API || ''}/rest/social-login`,
        {
          sSocialType: user.provider[0].toUpperCase(),
          sSocialToken: user.token.idToken ?? user.token.accessToken,
        },
        { timeout: 15000, withCredentials: true }
      );

      setIsLoading(false);
      setUserCredentials(res);
    } catch (err: any) {
      console.error(err?.response);
      setIsLoading(false);

      if (
        err &&
        err?.response?.status === 404 &&
        !err?.response?.data?.data?.isExist
      ) {
        if (!user.profile?.email) {
          setErrorMessage(
            'Successfully social login but insufficient data returned. Missing access to user email.'
          );
          return;
        }

        // Successful sign in try but user account is not created yet.
        // Change to signup in modal or redirect to signup page.
        notify({
          type: 'success',
          children: 'You need to sign up first.',
        });

        const socialSignUpState: SocialNetworkSignupDataType = {
          email: user.profile.email.toLocaleLowerCase(),
          name: user.profile?.name,
          socialType: user.provider[0].toUpperCase(),
          socialToken: user.token.idToken ?? user.token.accessToken,
        };

        if (type === 'modal' && setModalState) {
          history.replace({
            state: socialSignUpState,
          });
          setModalState('signup');
        } else {
          history.push({
            pathname: '/signup',
            state: socialSignUpState,
          });
        }
      } else {
        setErrorMessage(
          errorToString(
            err,
            'Social login failed. Please use standard login+password sign in or request password reset if your social profile had no password set.'
          )
        );
      }
    }
  }

  function setUserCredentials(res: {
    data?: {
      token?: string;
      user?: {
        id?: number;
        userType?: string;
        admin?: boolean;
      };
      profile?: {
        id?: number;
        name?: string;
        isPhoneVerified?: boolean;
        path?: string;
      };
    };
  }) {
    setErrorMessage(null);
    const _jwt = res?.data?.token;
    const _profileId = res?.data?.profile?.id;
    const _userType = res?.data?.user?.userType;
    const _profile = res?.data?.profile;

    login({ jwt: _jwt ?? '' });

    if (type === 'modal' && isFromPrchsEvntBtn && setModalState) {
      setModalState('purchaseBtnEvent');
    } else {
      if (type === 'modal' && setModalState) {
        setModalState('handleClose');
      }

      history.push(
        Number(_userType) === 1
          ? `/${_profile?.path || _profileId}`
          : eventId && playerProfileId
          ? `/player/${playerProfileId}/?tab=2&eventId=${eventId}`
          : `/player/${_profileId}/`
      );
    }
  }

  return (
    <Card
      className="max-w-450-px border-0 sign-in-form"
      style={{ width: '100%' }}
    >
      <Stack flow="row" gap={1} alignItems="flex-start" templateColumns="1fr">
        {isLoading && (
          <div className="loader-container">
            <Loader loaderText="Please wait....." />
          </div>
        )}
        <Formik<{ email: string; password: string }>
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={yup
            .object({
              email: emailSchema,
              password: passwordSchema,
            })
            .required()}
          onSubmit={async ({ email, password }) => {
            setIsLoading(true);

            const baseUrl = process.env.REACT_APP_API || '';
            const signinUrl = `${baseUrl}/rest/login`;
            const reqBody = {
              email: email.toLocaleLowerCase().trim(),
              password,
            };
            const config = { timeout: 10000, withCredentials: true };

            await axiosInstance
              .post(signinUrl, reqBody, config)
              .then((res) => {
                setIsLoading(false);
                setUserCredentials(res);
              })
              .catch((err) => {
                setIsLoading(false);
                setErrorMessage(errorToString(err, 'Something went wrong!'));
              });
          }}
        >
          {({ handleSubmit, values }: DerivedFormikProps<FormikValues>) => (
            <BootstrapForm onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Stack
                flow="row"
                gap={1}
                alignItems="flex-start"
                templateColumns="1fr"
              >
                <h4 className="title-signin">Log In To Vantage Sports</h4>
                {hasSessionExpired && (
                  <div className="alert alert-danger text-center" role="alert">
                    Your session has expired. Please sign in again.
                  </div>
                )}
                <div>
                  <Input
                    groupClassName="form-floating"
                    type="email"
                    name="email"
                    label="Enter Your Email*"
                    placeholder="Enter Your Email*"
                    invertedLabel
                    errorOutsideGroup
                    noErrorText
                    required
                  />
                </div>
                <div>
                  <Input
                    groupClassName="form-floating"
                    placeholder="Enter Your Password*"
                    type="password"
                    name="password"
                    label="Enter Your Password*"
                    invertedLabel
                    errorOutsideGroup
                    noErrorText
                    required
                    groupChildren={<ShowHidePassword />}
                  />
                </div>

                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="button"
                  style={{ textAlign: 'start' }}
                  className="link-info-custom bg-transparent border-0 h-db-600-9"
                  onClick={() => {
                    if (type === 'modal' && setModalState) {
                      setModalState('handleClose');
                    }
                    history.push('/request-password');
                  }}
                >
                  Forgot Password ?
                </button>

                <Stack flow="row" gap={1.5} alignItems="flex-start">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="btn-signin w-100"
                  >
                    Log in
                  </Button>

                  <Button
                    type="button"
                    className="btn-signup w-100"
                    onClick={() => {
                      if (type === 'modal' && setModalState) {
                        setModalState('signup');
                      } else history.push('/signup');
                    }}
                  >
                    Create New Account
                  </Button>
                </Stack>
              </Stack>
            </BootstrapForm>
          )}
        </Formik>
        <Row>
          <Col className="p-0 col-1"></Col>
          <Col className="col-10 d-flex align-items-center text-center">
            <span className="border-line" />
            <h4 className="px-2 or-text">or</h4>
            <span className="border-line" />
          </Col>
          <Col className="p-0 col-1"></Col>
        </Row>
        <FacebookLogin isLoading={isLoading} callback={handleSocialLogin} />
        <GoogleLogin isLoading={isLoading} callback={handleSocialLogin} />
        {type === 'signin-page' && (
          <>
            <div className="d-flex justify-content-center text-decoration-underline">
              <Button
                type="button"
                href={
                  invite
                    ? '/?invite=' + invite + '#join-us-section'
                    : '/#join-us-section'
                }
                variant="transparent"
                className="link-info-custom h-db-600-9"
                onClick={notifyGTM}
                disabled={isLoading}
              >
                Join Today
              </Button>
            </div>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default SignInForm;
