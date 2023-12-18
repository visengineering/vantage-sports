import React, { FC, useContext, useEffect, useState } from 'react';
import { Formik, FormikValues } from 'formik';
import * as yup from 'yup';
import { Input } from 'src/components/shared/form/Input';
import { emailSchema } from '../../Event/event-timeslots/validation-schema';
import { Row, Col, Button, Form as BootstrapForm } from 'react-bootstrap';
import {
  DerivedFormikProps,
  SocialNetworkSignupDataType,
  UserTypeEnum,
} from 'src/types';
import { Stack } from 'src/components/shared/Stack';
import { MainContext } from 'src/contexts';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { errorToString } from 'src/components/shared/api/errorToString';
import {
  FacebookLogin,
  FacebookUser,
} from 'src/components/shared/social/FacebookLogin';
import {
  GoogleError,
  GoogleLogin,
  GoogleUser,
} from 'src/components/shared/social/GoogleLogin';
import { useHistory } from 'react-router-dom';
import { getSocialLoginHumanError } from 'src/components/shared/social/get-social-login-human-error';
import { SignInSignUpModalState } from '../SignUpInModal';
import { useLocation } from 'react-router-dom';
import { ModalLoader } from '../../ModalLoader';
import { axiosInstance } from 'src/components/shared/api/axios';

type SignUpStep1Data = {
  email: string;
  name?: string;
  socialType?: string;
  socialToken?: string;
};

type SignUpStepOneProps = {
  type: 'modal' | 'landing_signup' | 'basic_signup' | 'inflcr_signup';
  successCb: (data: SignUpStep1Data) => void;
  isInfluencerProgram: boolean;
  // Only with modal type:
  setModalState?: (state: SignInSignUpModalState) => void;
  isTriggeredByCheckout?: boolean;
};

export const StepOneEmail: FC<SignUpStepOneProps> = ({
  type,
  successCb,
  isInfluencerProgram,
  ...other
}) => {
  const isTriggeredByCheckout =
    type === 'modal' ? other?.isTriggeredByCheckout : undefined;
  const setModalState = type === 'modal' ? other?.setModalState : undefined;
  const { login } = useContext(MainContext);
  const notify = useNotification();
  const { detectBrowser, signedIn } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    undefined
  );
  const history = useHistory();
  const { state: socialNetworkSignupData } =
    useLocation<SocialNetworkSignupDataType>();

  useEffect(() => {
    // This might come from other places in the app on redirect
    // or from login email that failed because account does not exist yet
    // Since the social integration worked and we obtained some information
    // we can directly fast forward to step 2 of registration.
    if (
      !!socialNetworkSignupData &&
      !!socialNetworkSignupData.email &&
      !!socialNetworkSignupData.socialType &&
      !!socialNetworkSignupData.socialToken
    ) {
      successCb(socialNetworkSignupData);
    }
  }, [socialNetworkSignupData]);

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

    if (type === 'modal' && setModalState && isTriggeredByCheckout) {
      setModalState('purchaseBtnEvent');
    } else {
      if (type === 'modal' && setModalState) {
        setModalState('handleClose');
      }

      history.push(
        _userType?.toString() === UserTypeEnum.COACH
          ? `/${_profile?.path || _profileId}`
          : `/player/${_profileId}/`
      );
    }
  }

  async function handleSocialSignup(
    user?: FacebookUser | GoogleUser,
    error?: any | GoogleError
  ) {
    if (error) {
      setErrorMessage(
        getSocialLoginHumanError(
          error,
          'Social signup failed for unknown reason. Please use standard email registration form.',
          'sign up'
        )
      );

      return;
    }

    if (!user) {
      setErrorMessage(
        'Successfully connected but insufficient data returned. Missing access to user data.'
      );
      return;
    }
    if (!user?.token?.idToken && !user?.token?.accessToken) {
      setErrorMessage(
        'Successfully connected but insufficient data returned. Missing access to user token data.'
      );
      return;
    }
    if (!user.provider) {
      setErrorMessage(
        "Successfully connected but couldn't determine provider (Google? Facebook?). We are sorry. Please use standard sign-up with email.s"
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
      if (
        err &&
        err?.response?.status === 404 &&
        !err?.response?.data?.data?.isExist
      ) {
        if (!user.profile?.email) {
          setErrorMessage(
            'Successfully connected but insufficient data returned. Missing access to user email.'
          );
          return;
        }

        // Successful sign in try but user account is not created yet so we navigate to step 2
        notify({
          type: 'success',
          children: 'Successful sign-in, please finish registration.',
        });

        const socialSignUpState: SocialNetworkSignupDataType = {
          email: user.profile.email.toLocaleLowerCase(),
          name: user.profile?.name,
          socialType: user.provider[0].toUpperCase(),
          socialToken: user.token.idToken ?? user.token.accessToken,
        };

        try {
          await axiosInstance.post(
            `${process.env.REACT_APP_API || ''}/rest/signup-started`,
            { email: socialSignUpState.email },
            { withCredentials: true }
          );
          setIsLoading(false);
          successCb(socialSignUpState);
        } catch (err: any) {
          setIsLoading(false);
          console.error(err?.response);

          if (!err?.response?.data?.isUserExists) {
            notify({
              type: 'error',
              children:
                err?.response?.data?.message ||
                'Social signup started went wrong.',
            });
          }
          return;
        }
      } else {
        setIsLoading(false);
        setErrorMessage(
          errorToString(
            err,
            'Social login failed. Please use standard login+password sign in or request password reset if your social profile had no password set.'
          )
        );
      }
    }
  }

  return (
    <>
      {isLoading && <ModalLoader />}
      <Formik<{ email: string }>
        initialValues={{ email: '' }}
        validationSchema={yup
          .object({
            email: emailSchema,
          })
          .required()}
        onSubmit={async ({ email }) => {
          setIsLoading(true);
          axiosInstance
            .post(
              `${process.env.REACT_APP_API || ''}/rest/signup-started`,
              { email },
              { withCredentials: true }
            )
            .then((res) => {
              setIsLoading(false);
              successCb({ email });
            })
            .catch((err) => {
              console.error(err);
              setIsLoading(false);

              setErrorMessage(
                errorToString(
                  err,
                  err?.response?.data?.isUserExists
                    ? 'User with this email already exists'
                    : 'Something went wrong'
                )
              );
            });
        }}
      >
        {({ handleSubmit, values }: DerivedFormikProps<FormikValues>) => (
          <BootstrapForm onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack
              flow="row"
              gap={2}
              alignItems="flex-start"
              templateColumns="1fr"
            >
              <h4 className="fw-600 signup-heading">
                Getting Started with Vantage
              </h4>
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

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {isInfluencerProgram && (
                <div>
                  <p className="m-2 mt-1">
                    <small className="text-info">
                      Please use your @edu.com email when signing-up to ensure
                      you get enrolled in INFLCR integration.
                    </small>
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="btn-signin w-100"
                disabled={isLoading}
              >
                Continue
              </Button>

              <Button
                type="button"
                className="btn-signup w-100"
                onClick={() =>
                  type === 'modal' && setModalState
                    ? setModalState('signin')
                    : history.push('/signin')
                }
                disabled={isLoading}
              >
                Already have an account
              </Button>

              {detectBrowser() !== 'Unknown' && (
                <>
                  <Row>
                    <Col className="p-0 col-1"></Col>
                    <Col className="col-10 d-flex align-items-center text-center">
                      <span className="border-line" />
                      <h4 className="px-2 or-text">or</h4>
                      <span className="border-line" />
                    </Col>
                    <Col className="p-0 col-1"></Col>
                  </Row>

                  {!signedIn() && (
                    <FacebookLogin
                      isLoading={isLoading}
                      callback={handleSocialSignup}
                    />
                  )}

                  {!signedIn() && (
                    <GoogleLogin
                      isLoading={isLoading}
                      callback={handleSocialSignup}
                    />
                  )}

                  {!(type === 'modal' || isInfluencerProgram) && (
                    <p className="alert alert-info my-4 p-2" role="alert">
                      If you are at an INFLCR Partner School
                      <a style={{ color: '#0000EE' }} href="/inflcr">
                        signup here
                      </a>
                    </p>
                  )}
                </>
              )}
            </Stack>
          </BootstrapForm>
        )}
      </Formik>
    </>
  );
};
