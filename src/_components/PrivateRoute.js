import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { endpoints } from '../_services';

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    sessionStorage.getItem('pega_react_user')
      ? <Component {...props} />
      : <Redirect to={{ pathname: endpoints.use_OAuth ? `${process.env.PUBLIC_URL}/login` : `${process.env.PUBLIC_URL}/login`, state: { from: props.location } }} />
  )} />
)
