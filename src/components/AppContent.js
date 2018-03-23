import React from 'react';
import { Switch, Route } from 'react-router-dom';

const AppContent = () => (
  <Switch>
    <Route exact path="/" component={() => (<p>Welcome</p>)} />
    <Route path="/login-face" component={() => (<p>Login face</p>)} />
    <Route path="/login-email" component={() => (<p>Login email</p>)} />
    <Route path="/register" component={() => (<p>Register</p>)} />
  </Switch>
);
export default AppContent;
