/* eslint react/no-children-prop: 0 */

import React from 'react';
import { NavLink, Route } from 'react-router-dom';

const LoginSelector = () => (
  <div className="method-navbar">
    <ul>
      <li><NavLink to="/login-face" path="/login-face">Login with Face</NavLink></li>
      <li><NavLink to="/login-email" path="/login-email">Login with Email</NavLink></li>
      <li><NavLink to="/register" path="/register">Register Face</NavLink></li>
      <Route exact path="/" children={({ match }) => (
        !match && <li><NavLink to="/">Back</NavLink></li>
      )} />
    </ul>
  </div>
);
export default LoginSelector;
