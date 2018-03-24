import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './HomePage';
import LoginEmail from './LoginEmail';
import LoginFace from './LoginFace';
import RegisterFace from './RegisterFace';

const AppContent = () => (
  <Switch>
    <Route exact path="/">
      <HomePage />
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
