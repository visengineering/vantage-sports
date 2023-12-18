import React, { useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './styles/App.scss';
import 'font-awesome/css/font-awesome.min.css';
import * as Layout from './components/Layout';
import {
  AuthenticationForm,
  Admin,
  Blog,
  BlogPost,
  Home,
  Inflcr,
  LandingPage,
  CoachProfile,
  SignUp,
  ViewEvent,
  DeleteEvent,
  PrivacyPolicy,
  CheckoutCallback,
  PlayerDashboard,
  Faq,
  Coaches,
  Liability,
  News,
  KeysToCoaching,
  Charity,
  ChangePassword,
  RequestPasswordChange,
  Testimonials,
  TermsOfService,
  RecruitingGuide,
  Soccer,
  SportsPartner,
  AddChildPage,
  EditChildPage,
} from './components/pages';

import PrivateRoute from './routes/PrivateRoutes';
import PublicRoute from './routes/PublicRoutes';
import { CreateEventForm } from './components/pages/Event/event-timeslots/create/CreateEventForm';
import { SetAvailabilityForm } from './components/pages/Event/availability/create/SetAvailabilityForm';
import { EditEventFormPage } from './components/pages/Event/event-timeslots/edit/EditEventForm';
import { VerifyPhonePage } from './components/pages/VerifyPhonePage';
import { VerifyPhoneConfirmationPage } from './components/pages/VerifyPhoneConfirmationPage';
import FavoriteCoaches from './components/pages/Player/FavoriteCoaches';

/* eslint-disable */
function RouteWrapper({ component: Component, layout: Layout, ...rest }: any) {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        <Layout {...props}>
          <Component {...props} />
        </Layout>
      )}
    />
  );
}
/* eslint-enable */

function App() {
  return (
    <Switch>
      <RouteWrapper
        path="/blog"
        component={Blog}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/blog/:page"
        component={Blog}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/blog/posts/:post"
        component={BlogPost}
        layout={Layout.Landing}
        exact
      />
      <PublicRoute
        path="/signin"
        component={AuthenticationForm}
        layout={Layout.Default1}
        exact
      />
      <PublicRoute
        path="/signup"
        component={SignUp}
        layout={Layout.Default1}
        exact
      />
      <RouteWrapper
        path="/inflcr"
        component={Inflcr}
        layout={Layout.Default1}
        exact
      />
      <RouteWrapper
        path="/coach-signup"
        component={SignUp}
        layout={Layout.Default1}
        exact
      />
      <RouteWrapper
        path="/"
        component={LandingPage}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper path="/faq" component={Faq} layout={Layout.Landing} exact />
      <RouteWrapper
        path="/liability"
        component={Liability}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/terms-of-service"
        component={TermsOfService}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/testimonials"
        component={Testimonials}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/news"
        component={News}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/keys-to-coaching"
        component={KeysToCoaching}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/sports-partner"
        component={SportsPartner}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/soccer"
        component={Soccer}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/charity"
        component={Charity}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/coach/:id"
        component={CoachProfile}
        layout={Layout.Default}
      />
      <PrivateRoute
        path="/edit-training/:id"
        component={EditEventFormPage}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/create-event"
        component={CreateEventForm}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/set-availability"
        component={SetAvailabilityForm}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/training/:id"
        component={ViewEvent}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/training/:id/delete"
        component={DeleteEvent}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/checkout_callback"
        component={CheckoutCallback}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/player/:id/favorite-coaches"
        component={FavoriteCoaches}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/player/:id"
        component={PlayerDashboard}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/add-child"
        component={AddChildPage}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/update-child-information/:id"
        component={EditChildPage}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/privacy-policy"
        component={PrivacyPolicy}
        layout={Layout.Landing}
        exact
      />
      <RouteWrapper
        path="/coaches"
        component={Coaches}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/sports-coaching"
        component={Home}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/trainings/:sport/:state?"
        component={Home}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/request-password"
        component={RequestPasswordChange}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/change-password/:key"
        component={ChangePassword}
        layout={Layout.Default}
        exact
      />
      <PrivateRoute
        path="/admin"
        component={Admin}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/recruiting-guide"
        component={RecruitingGuide}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/verify-phone-confirmation"
        component={VerifyPhoneConfirmationPage}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/verify-phone"
        component={VerifyPhonePage}
        layout={Layout.Default}
        exact
      />
      <RouteWrapper
        path="/:path"
        component={CoachProfile}
        layout={Layout.Default}
        exact
      />
      <Redirect to="/sports-coaching" />
    </Switch>
  );
}

export default App;
