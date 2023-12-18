import queryString from 'query-string';
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
const { REACT_APP_API = 'http://localhost:2017' } = process.env;
import { UserTypeEnum } from 'src/types';
import { useNotification } from 'src/components/shared/hooks/use-notifications';
import { MainContext } from 'src/contexts/MainContext';
import { axiosInstance } from 'src/components/shared/api/axios';

type PaymentCallbackStripeData = {
  sessionId: number;
  u: number; // user id
  p: number; // profile id
  ut: number; // user type
  e: number; // event id
  participantId: number;
  isGuest: boolean; // obsolete historical value, can be removed later
  success: boolean; // if was a success
  cancelled: boolean; // if was cancelled
};

const CheckoutCallback = () => {
  const { profile } = useContext(MainContext);
  const notify = useNotification();

  const history = useHistory();
  const location = useLocation();
  const [paramsReady, setParamsReady] = useState<boolean>(false);

  const parsedQueryString = queryString.parse(location.search);
  const {
    sessionId: checkoutSession,
    u,
    p: profileId,
    ut,
    e: eventId,
    participantId,
    success,
    cancelled,
  } = parsedQueryString as unknown as PaymentCallbackStripeData;
  const participationId = participantId;
  const isCoach = UserTypeEnum.COACH === ut.toString();

  useEffect(() => {
    if (success) {
      (window as any).dataLayer.push({
        event: 'Purchase',
      });
      notify({
        type: 'success',
        children:
          'Your Training Session Has Been Booked! You will receive an email confirmation soon.',
      });
    }

    if (cancelled) {
      notify({
        type: 'error',
        children:
          "Your payment has failed. You can continue to look around and checkout again when you're ready.",
      });
    }

    const isValidSession = !!checkoutSession;
    const isValidParticipant = !!participantId;
    const hasUserId = !!u;

    const isValidCheckout =
      isValidSession && isValidParticipant && hasUserId && !!eventId;

    if (isValidCheckout) {
      setParamsReady(true);
    } else {
      notify({
        type: 'error',
        children: `Something wrong with checkout session: ${checkoutSession} , eventId: ${eventId} , participationId: ${participationId} userId: ${u}`,
      });
      console.assert(
        isValidSession,
        `Session is not valid : ${checkoutSession}`
      );
      console.assert(
        isValidParticipant,
        `Participant is not valid : ${participantId}`
      );
      console.assert(hasUserId, `User id not valid ${{ u }}`);
    }
  }, [checkoutSession, u, eventId, participationId]);

  useEffect(() => {
    console.assert(!!paramsReady, 'Params are not ready yet');
    if (paramsReady === false) return;

    console.log(
      `Post Checkout: Value of params is profileId: ${profileId} userId: ${u}`
    );

    // In case the transaction is cancelled
    if (cancelled) {
      notify({
        type: 'success',
        children:
          "Your training purchase has been cancelled -- continue to shop around and checkout when you're ready.",
      });

      history.push(
        isCoach ? `/${profile?.path || profileId}` : `/player/${profileId}/`
      );
      return;
    }

    console.assert(REACT_APP_API, 'Api url is missing.');

    axiosInstance
      .post(
        `${REACT_APP_API}/rest/checkout-success`,
        {
          userId: u,
          checkoutSession,
          participationId,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        history.push(
          isCoach ? `/${profile?.path || profileId}` : `/player/${profileId}/`
        );
      })
      .catch((err) => {
        console.error('Post checkout : Server response error ', err);
        notify({
          type: 'error',
          children: `Your training purchase has failed. If the amount was deducted, it will be reverted back in 24 hours. If you do not receive a refund within 24 hours, Please contact us via email.`,
        });
        history.push('/sports-coaching');
      });
  }, [paramsReady]);

  return <></>;
};
export default CheckoutCallback;
