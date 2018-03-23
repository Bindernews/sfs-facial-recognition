/* eslint react/no-children-prop: 0 */

import React, { PropTypes } from 'react';
import { NavLink, Route } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const renderBackButton = ({ match }) => {
  if (!match) {
    return (
      <NavLink to="/">
        <Button>Back</Button>
      </NavLink>
    );
  }
  return null;
};

const LoginSelector = () => (
  <Grid container direction="column" justify="flex-start" alignItems="center">
    <NavLink to="/login-face" path="/login-face">
      <Button>Login with Face</Button>
    </NavLink>
    <NavLink to="/login-email" path="/login-email">
      <Button>Login with Email</Button>
    </NavLink>
    <NavLink to="/register" path="/register">
      <Button>Register Face</Button>
    </NavLink>
    <Route exact path="/" children={renderBackButton} />
  </Grid>
);
export default LoginSelector;
