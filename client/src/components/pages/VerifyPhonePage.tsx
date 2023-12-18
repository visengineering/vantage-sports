import { Formik, useFormikContext } from 'formik';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Form as BootstrapForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { object, string, InferType } from 'yup';
import { errorToString } from '../shared/api/errorToString';
import { Stack } from '../shared/Stack';
import { Input } from '../shared/form/Input';
import { useUser } from '../shared/hooks/use-user';
import { useSendOtc } from '../shared/hooks/use-send-otc';
import { MainContext } from 'src/contexts';
import { UserTypeEnum } from 'src/types';
import { USPhoneNumberField } from '../shared/form/USPhoneNumberField';
import { mobileSchema } from './Event/event-timeslots/validation-schema';
import { useApolloClient } from '@apollo/client';
import * as yup from 'yup';
const verificationCodeSchema = yup
  .string()
  .matches(/^[0-9]+$/, 'Must be only digits')
  .min(6, 'Must be exactly 6 digits')
  .max(6, 'Must be exactly 6 digits')
  .required('Verification code is required');
const verifyCodeSchema = object({
  verificationCode: verificationCodeSchema,
}).required();

export const mobileFormSchema = object()
  .shape({
    mobile: mobileSchema,
  })
  .defined();

export type MobileValues = InferType<typeof mobileFormSchema>;

export const AutoSubmitVerificationCode: FC = () => {
  const { values, submitForm } = useFormikContext<any>();

  useEffect(() => {
    if (values.verificationCode.length === 6) {
      submitForm();
    }
  }, [values, submitForm]);

  return null;
};

export const AutoSubmitPhoneOnLoad: FC<{ mobile: string }> = ({ mobile }) => {
  const { submitForm } = useFormikContext<any>();

  useEffect(() => {
    if (mobile.toString().replace(/\D/g, '').length === 10) {
      submitForm();
    }
  }, []);

  return null;
};

const verifyMobileSchema = object()
  .shape({
    verificationCode: string().required(),
  })
  .defined();

export const VerifyPhonePage: FC = () => {
  const user = useUser();
  const history = useHistory();
  const { logout } = useContext(MainContext);
  const queryParams = useMemo(
    () => new URLSearchParams(history.location.search),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const justFinishedRegistration = useMemo(
    () => queryParams.get('reg'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (queryParams.get('reg')) {
      queryParams.set('reg', '');
    }
  }, [queryParams]);

  useEffect(() => {
    if (!user) return;
    if (user.loading) return;
    if (user.error) return;
    if (user.isPhoneVerified) {
      history.push(
        user.userType === UserTypeEnum.COACH && user.profile
          ? `/${user.profile.path || user.profile.id}`
          : '/sports-coaching'
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) {
      history.push('/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (user && user.isJwtExpired) {
      logout({ isExpiredJwt: true });
    }
  }, [user, logout]);

  if (!user) {
    return <>404 - Page not found</>;
  }

  if (user.loading) {
    return <>Loading...</>;
  }

  return (
    <section className="join-section" id="verify-phone-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-7 mx-auto">
            <div className="form-container">
              <div className="title">
                Phone Verification{' '}
                {user.userType === '1' && (
                  <span style={{ color: 'red' }}>*</span>
                )}
              </div>
              <div className="tab-content" style={{ margin: '16px 0' }}>
                {justFinishedRegistration && (
                  <div className="alert alert-info my-2" role="alert">
                    Your registration was successful. Please take a moment to
                    verify your phone.
                  </div>
                )}
                {user.error && (
                  <div className="alert alert-danger my-2" role="alert">
                    {user.error}
                  </div>
                )}
                <VerifyMobile
                  userType={user.userType ?? ''}
                  userPhone={user.cellphone ?? ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

type VerifyMobileValues = InferType<typeof verifyMobileSchema>;

export const VerifyMobile: FC<{
  userPhone: string;
  userType: string;
  onSuccess?: () => void;
}> = ({ userPhone, userType, onSuccess }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const history = useHistory();
  const [anyCodeSent, setAnyCodeSent] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>(userPhone);
  const client = useApolloClient();

  const {
    sendCode,
    verifyCode,
    isCodeVerified,
    isLoading,
    isCodeSent,
    timeRemainingForOTC,
    message: otpMessage,
    error: otcSendError,
  } = useSendOtc();

  useEffect(() => {
    if (isCodeVerified) {
      if (onSuccess) {
        // Refetch all queries especially for profile changes
        // for instance in case somebody changed phone number here,
        // and then was navigated to own profile. (example: on registration last step)
        client.refetchQueries({
          include: 'all',
        });
        onSuccess();
      } else {
        history.push('/verify-phone-confirmation');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCodeVerified]);

  useEffect(() => {
    if (isCodeSent) {
      setAnyCodeSent(true);
    }
  }, [isCodeSent]);

  return (
    <Stack gap={1.5} flow="row">
      {otpMessage && (
        <div className="alert alert-info" role="alert">
          {otpMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {otcSendError && (
        <div className="alert alert-danger" role="alert">
          {otcSendError}
        </div>
      )}

      <p>
        Please take a moment to verify your phone.
        {userType === '2' && <span> This step is optional.</span>}
      </p>
      <Formik<MobileValues>
        initialValues={{ mobile: phone }}
        validationSchema={mobileFormSchema}
        onSubmit={async (values) => {
          try {
            // One in front for USA country code, +1 to be precise, but + is omitted
            const mobileOnlyNumbers = `1${values.mobile
              .toString()
              .replace(/\D/g, '')}`;
            await sendCode(mobileOnlyNumbers);
            setPhone(mobileOnlyNumbers);
          } catch (error) {
            setErrorMessage(errorToString(error));
          }
        }}
      >
        {({ isSubmitting, handleSubmit, errors }) => (
          <BootstrapForm onSubmit={handleSubmit}>
            <AutoSubmitPhoneOnLoad mobile={userPhone} />
            <Stack flow="row" gap={1.5}>
              <div>
                <USPhoneNumberField
                  groupClassName="form-floating"
                  type="tel"
                  name="mobile"
                  label="Your Mobile Number*"
                  placeholder="Your Mobile Number*"
                  invertedLabel
                  errorOutsideGroup
                  autoComplete="off"
                  defaultValue={userPhone}
                  groupChildren={
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="mobile-field-overlay-tooltip">
                          e.g. (123) 456 7890
                        </Tooltip>
                      }
                    >
                      <button
                        type="button"
                        className="far fa-question-circle"
                        style={{ color: 'darkblue' }}
                      />
                    </OverlayTrigger>
                  }
                />
              </div>
              <Stack
                flow="column"
                templateColumns={
                  userType && userType === UserTypeEnum.TRAINEE
                    ? '1fr 1fr'
                    : '1fr'
                }
                templateRows="1fr"
                gap={1}
              >
                {userType && userType === UserTypeEnum.TRAINEE && (
                  <Button
                    type="button"
                    variant="transparent"
                    className="btn-outline-primary w-100"
                    onClick={() => {
                      if (onSuccess) {
                        onSuccess();
                      } else {
                        history.push(`/sports-coaching`);
                      }
                    }}
                  >
                    Skip for Now
                  </Button>
                )}
                <Button
                  type="submit"
                  style={{ minWidth: '150px' }}
                  className={`btn ${
                    anyCodeSent ? 'btn-secondary' : 'btn-primary'
                  } align-items-center`}
                  disabled={
                    isSubmitting ||
                    !!timeRemainingForOTC ||
                    !!(errors.mobile && errors.mobile.length)
                  }
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : anyCodeSent ? (
                    <span>
                      Resend{' '}
                      {!isLoading &&
                        timeRemainingForOTC !== 0 &&
                        timeRemainingForOTC !== null && (
                          <>({timeRemainingForOTC})</>
                        )}
                    </span>
                  ) : (
                    'Send Code'
                  )}
                </Button>
              </Stack>
            </Stack>
          </BootstrapForm>
        )}
      </Formik>
      {anyCodeSent && !otcSendError && (
        <Formik<VerifyMobileValues>
          validationSchema={verifyCodeSchema}
          initialValues={{ verificationCode: '' }}
          onSubmit={async ({ verificationCode }) => {
            try {
              await verifyCode(verificationCode, phone);
            } catch (error) {
              setErrorMessage(errorToString(error));
            }
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <BootstrapForm onSubmit={handleSubmit}>
              <Stack flow="row" gap={1.5} templateRows="1fr">
                <div>
                  <Input
                    className="form-control"
                    name="verificationCode"
                    label="6 digit verification code"
                    placeholder="6 digit verification code*"
                    groupClassName="form-floating"
                    invertedLabel
                    errorOutsideGroup
                    maxLength={6}
                    type="number"
                    autoFocus
                  />
                </div>

                <AutoSubmitVerificationCode />
                <Button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify'}
                </Button>
              </Stack>
            </BootstrapForm>
          )}
        </Formik>
      )}
    </Stack>
  );
};
