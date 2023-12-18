import React, { FC, useContext } from 'react';
import { Route, useLocation, useHistory, RouteProps } from 'react-router-dom';
import { MainContext } from '../contexts';

const PublicRoute: FC<
  {
    // TODO improve types here
    component: any;
    layout: any;
  } & RouteProps<string>
> = ({ component: Component, layout: Layout, ...rest }) => {
  let { jwt } = useContext(MainContext);
  let history = useHistory();
  let isAuthenticated = !!jwt;
  let requestedURL = useLocation()?.state;

  return (
    <Layout {...rest}>
      <Route
        {...rest}
        render={function renderPublicRoute(props) {
          if (isAuthenticated) {
            if (requestedURL) {
              history.goBack();
            } else {
              history.push('/sports-coaching');
            }
          }
          return <Component {...props} />;
        }}
      />
    </Layout>
  );
};

export default PublicRoute;
