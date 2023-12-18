import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { EventType, TimeslotModel } from 'src/types';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import * as yup from 'yup';
import { Formik } from 'formik';
import { CheckboxField } from 'src/components/shared/form/CheckboxField';
import { Group } from 'src/components/shared/form/Group';
import { Stack } from 'src/components/shared/Stack';
import { useAxios } from 'src/components/shared/api/use-axios';
import { useTimezone } from 'src/components/shared/hooks/use-timezone';
import { useUser } from 'src/components/shared/hooks/use-user';
import { AxiosRequestConfig } from 'axios';
import { useStripe } from 'src/components/shared/hooks/use-stripe';
import { errorToString } from 'src/components/shared/api/errorToString';
import SignUpInModal from 'src/components/pages/SignUpIn/SignUpInModal';
import moment from 'moment';
import { MainContext } from 'src/contexts/MainContext';
import { Link } from 'src/components/shared/Link';

const asyncRedirect = async (
  stripe: any,
  sessionId: string,
  setError: (error: string) => void
) => {
  try {
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    setError(errorToString(error, 'Unknown checkout redirect error.'));
  }
};

export const BookTimeslot: FC<{
  eventId: number;
  eventType?: EventType;
  timeslot: TimeslotModel;
  onCancel: () => void;
}> = ({ eventId, eventType, timeslot, onCancel }) => {
  const timezone = useTimezone();
  const user = useUser();
  const [apiError, setError] = useState<any>(null);
  const { isSignedIn } = useContext(MainContext);
  const [stripeLoading, stripe] = useStripe();

  const [showSignUpInModal, setShowSignUpInModal] = useState('');

  const requestConfig = useMemo<AxiosRequestConfig>(() => {
    return {
      fetchOnLoad: false,
      method: 'POST',
      url: `${process.env.REACT_APP_API || ''}/rest/create-checkout-session`,
      data: {
        eventId,
        timeslotId: timeslot.id,
        userId: user?.userId ?? undefined,
        timezone,
        eventType,
      },
    };
  }, [user, eventId]);

  const {
    response,
    error: checkoutError,
    loading,
    refetch,
  } = useAxios<{
    sessionId: string;
    participantId: string;
  }>(requestConfig);

  useEffect(() => {
    if (checkoutError) {
      setError(errorToString(checkoutError, 'Unknown checkout error.'));
    }
  }, [checkoutError]);

  useEffect(() => {
    if (response && response.sessionId && response.participantId) {
      if (!stripe) {
        return;
      }

      asyncRedirect(stripe, response.sessionId, setError);
    }
  }, [response]);

  const handlePurchaseBtnClick = async () => {
    await refetch(requestConfig);
  };

  return (
    <Formik<{ waiver: boolean }>
      initialValues={{
        waiver: false,
      }}
      validationSchema={yup
        .object({
          waiver: yup
            .bool()
            .oneOf(
              [true],
              'Liability Waiver must be accepted before continuing.'
            )
            .label('University')
            .required(),
        })
        .required()}
      onSubmit={(values) => {
        if (!isSignedIn) {
          setShowSignUpInModal('signup');
          return;
        }
        refetch(requestConfig);
      }}
    >
      {({ handleSubmit, values }) => (
        <BootstrapForm onSubmit={handleSubmit}>
          <div className="form-group">
            <Group name="waiver-group" label="Liability Waiver">
              <CheckboxField
                name="waiver"
                label={
                  <>
                    Yes, I agree to the{' '}
                    <Link to="/liability" variant="blue">
                      Liability Waiver
                    </Link>
                  </>
                }
                custom
              />
            </Group>
          </div>
          <Stack flow="column" gap={1}>
            <Button
              type="submit"
              disabled={
                moment(timeslot.startDate)
                  .add(15, 'minutes')
                  .isBefore(moment()) ||
                timeslot.participantsCount >= timeslot.maxParticipantsCount ||
                !values.waiver ||
                loading ||
                !!(response && response.sessionId && !apiError)
              }
              className="btn btn-primary submit-btn"
            >
              Checkout
            </Button>
            <SignUpInModal
              showModalFor={showSignUpInModal}
              setShowModalFor={setShowSignUpInModal}
              purchaseBtnEvent={true}
              handlePurchaseBtnClick={handlePurchaseBtnClick}
            />
            <Stack
              flow="column"
              gap={1}
              alignItems="center"
              justifyContent="center"
            >
              or{' '}
              <button
                onClick={onCancel}
                className="btn btn-link"
                style={{ color: '#0000EE' }}
              >
                choose other date
              </button>
            </Stack>
          </Stack>
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}
        </BootstrapForm>
      )}
    </Formik>
  );
};
