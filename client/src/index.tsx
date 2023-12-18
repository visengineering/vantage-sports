import { onError } from '@apollo/client/link/error';
import React, { Suspense } from 'react';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import TagManager from 'react-gtm-module';
import ReactGA from 'react-ga';
import App from './App';
import {
  MainContextProvider,
  CoachContextProvider,
  CriteriaContextProvider,
} from './contexts';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  defaultDataIdFromObject,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';
import { signOut } from './components/shared/hooks/use-sign-out';
import { NotificationsProvider } from './components/shared/hooks/use-notifications';
import { Notifications } from './components/Notifications';
import { Loading } from './components/shared/Loading';

const { CloudinaryContext } = require('cloudinary-react');

const googleAnalyticsId = process.env.REACT_APP_GA || 'UA-193475284-1';
const tagManagerArgs = {
  gtmId: `${process.env.REACT_APP_GTM || 'GTM-PWJXP49'}`,
};

ReactGA.initialize(googleAnalyticsId);
TagManager.initialize(tagManagerArgs);

// Terminating link
const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_API || ''}/graphql`,
  credentials: 'include',
});

const authLink = setContext((_, { headers }) => {
  const getCookie = (input: string) => {
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const name = cookies[i].split('=')[0].toLowerCase();
        const value = cookies[i].split('=')[1].toLowerCase();
        if (name === input) {
          return value;
        } else if (value === input) {
          return name;
        }
      }
    } catch (error) {
      console.log(`Error reading cookies: ${error}`);
    }
    return '';
  };
  const token = getCookie('jwt');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, response }) => {
    // =============================================================================
    // Operations in given array wont be retried on failure.
    // =============================================================================
    const ignoreErrorOperationsArray = [
      'updateCoach',
      'updateEvent',
      'createMedia',
      'cancelEvent',
      'createReview',
      'updateReview',
      'Participant',
      'Review', // this is not being used currently
    ];

    const hideAlertOperationsArray = [
      'deleteEvent',
      'createEventWithTimeslots',
    ];
    try {
      const { operationName = null } = operation;
      let showAlert = true;
      if (operationName && ignoreErrorOperationsArray.includes(operationName)) {
        if (response && response.errors) {
          response.errors = undefined;
        }
      }

      if (operationName && hideAlertOperationsArray.includes(operationName)) {
        showAlert = false;
      }

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (extensions && extensions.code === 'UNAUTHENTICATED') {
            signOut();
          }
          console.log(
            `Error Message: ${message.toString()} ; Extension code: ${
              extensions?.code
            }`
          );
        });
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    } catch (error) {
      console.log('error on client', error);
    }
  }
);

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    dataIdFromObject: (object) => {
      if (object.id) {
        // eslint-disable-next-line no-underscore-dangle
        return `${object.__typename}-${object.id}`;
      }
      if (object.cursor) {
        // Cursor edge instead, fixes invalid duplicate
        // eslint-disable-next-line no-underscore-dangle
        return `${object.__typename}-${object.cursor}`;
      }
      // Use a fallback to default handling if neither id nor cursor
      return defaultDataIdFromObject(object);
    },
    typePolicies: {
      Query: {
        fields: {
          event: relayStylePagination([
            'id',
            'upcoming',
            'completed',
            'coachProfileId',
            'playerProfileId',
          ]),
          timeslot: relayStylePagination([
            'id',
            'upcoming',
            'completed',
            'coachProfileId',
            'playerProfileId',
          ]),
          coach: relayStylePagination(['id', 'universityId', 'sportId']),
          participant: relayStylePagination(['id', 'playerId', 'coachId']),
        },
      },
    },
  }),
  link: from([errorLink, authLink, httpLink]),
});

ReactDOM.render(
  <CookiesProvider>
    <ApolloProvider client={client}>
      <MainContextProvider>
        <CoachContextProvider>
          <CriteriaContextProvider>
            <CloudinaryContext cloudName="vantagesports">
              <BrowserRouter>
                <NotificationsProvider>
                  <Notifications />
                  <Suspense fallback={<Loading />}>
                    <App />
                  </Suspense>
                </NotificationsProvider>
              </BrowserRouter>
            </CloudinaryContext>
          </CriteriaContextProvider>
        </CoachContextProvider>
      </MainContextProvider>
    </ApolloProvider>
  </CookiesProvider>,
  document.getElementById('root')
);

window.React = React;
