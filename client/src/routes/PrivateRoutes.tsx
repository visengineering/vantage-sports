import React, { FC, useContext } from 'react';
import { Route, Redirect, RouteProps, useLocation } from 'react-router-dom';
import { MainContext } from '../contexts';

export const PrivateRoute: FC<
  {
    // TODO improve types here
    component: any;
    layout: any;
  } & RouteProps<string>
> = ({ component: Component, layout: Layout, ...rest }) => {
  const { jwt } = useContext(MainContext);
  const isAuthenticated = !!jwt;
  const { pathname } = useLocation();

  return (
    <Layout {...rest}>
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/signin', state: { from: pathname } }} />
          )
        }
      />
    </Layout>
  );
};

export default PrivateRoute;
