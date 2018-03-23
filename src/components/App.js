import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import LoginSelector from './LoginSelector';

export default class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <LoginSelector />
          <Switch>
            <Route exact path="/" component={() => (<p>Welcome</p>)} />
            <Route path="/login-face" component={() => (<p>Login face</p>)} />
            <Route path="/login-email" component={() => (<p>Login email</p>)} />
            <Route path="/register" component={() => (<p>Register</p>)} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
