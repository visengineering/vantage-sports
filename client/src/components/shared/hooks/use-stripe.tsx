import { createContext, useContext, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// TODO: improve Stripe typings
type StripeObject = any;

const StripeContext = createContext<StripeObject | null>(null);
export const StripeProvider = StripeContext.Provider;

const {
  REACT_APP_STRIPE_PUBLIC_KEY:
    REACT_STRIPE_KEY = 'pk_test_51J3QwRJC0wQjbgOd5nXNjbdeR1Q1FxnhgBF6q23I0A3YWADJhEIApu6VbQQZjFIJqYXh00A9DcyAcWFUGcKZsqNa00N8zIWlHx',
} = process.env;

const asyncLoadStripe = async (
  callback: (stripeObj: StripeObject | null) => void
) => {
  if (REACT_STRIPE_KEY) {
    const stripeObj = await loadStripe(REACT_STRIPE_KEY);
    callback(stripeObj);
  } else {
    callback(null);
  }
};

// use this hook, if you need Stripe API
// and you want to easily mock it's functions (e.g. in storybook / tests)
export function useStripe(): [isLoading: boolean, stripe: StripeObject | null] {
  const value = useContext(StripeContext);
  const [stripeObj, setStripe] = useState<StripeObject | null>(null);

  useEffect(() => {
    if (!value) {
      asyncLoadStripe(setStripe);
    }
  }, []);

  if (value) {
    return [false, value];
  }

  return [stripeObj === null, stripeObj];
}
