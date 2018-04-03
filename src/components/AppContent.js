import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import LoginEmail from './LoginEmail';
import LoginFace from './LoginFace';
import RegisterFace from './RegisterFace';

const AppContent = () => (
  <Switch>
    {/* Home redirects to login-face */}
    <Route exact path="/">
      <Redirect to="/login-face" />
    </Route>
    <Route path="/login-face">
      <LoginFace />
    </Route>
    <Route path="/login-email">
      <LoginEmail />
    </Route>
    <Route path="/register">
      <RegisterFace />
    </Route>
  </Switch>
);
export default AppContent;
