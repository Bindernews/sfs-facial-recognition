import React from 'react';
import { Redirect } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
} from 'material-ui/Dialog';

import { sendPost } from '../util';
import ErrorDialog, { setError, closeError } from './ErrorDialog';

// Timeout before we reset for the next user.
const IDENTITY_RESET_TIMEOUT = 10 * 1000;

const LOGIN_FLOW = {
  Normal: 0,
  LoggingIn: 1,
  LoggedIn: 2,
};

export default class LoginEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: LOGIN_FLOW.Normal,
      error: {},
      name: null,
      redirect: null,
    };
    this.resetTimer = null;

    // Bind callbacks
    this.doLogin = this.doLogin.bind(this);
    this.identityReset = this.identityReset.bind(this);
    this.closeLogin = this.closeLogin.bind(this);
    this.loginCancel = this.loginCancel.bind(this);
    this.setError = setError.bind(this);
    this.closeError = closeError.bind(this);
  }

  /**
   * Callback for when the user verifies the identity is correct.
   */
  doLogin() {
    const data = {
      verify: true,
      name: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
    };

    this.setState({ flow: LOGIN_FLOW.LoggingIn });
    if (!MOCK) {
      sendPost('/verify', data)
        .then(() => {
          this.setState({ flow: LOGIN_FLOW.LoggedIn, name: data.name  });
        }).catch((err) => {
          this.setError(err);
        });
    } else {
      // Simulate processing
      setTimeout(() => {
        this.setState({ flow: LOGIN_FLOW.LoggedIn });
      }, 1000);
    }
  }

  identityReset() {
    this.setState({ flow: LOGIN_FLOW.Normal, name: null });
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = null;
  }

  loginCancel() {
    this.identityReset();
    // TODO send message to backend to cancel the login
  }

  closeLogin() {
    this.setState({ flow: LOGIN_FLOW.Normal, redirect: '/login-face' });
  }

  render() {
    const { flow, name, error, redirect } = this.state;

    const redirectTag = (redirect && <Redirect to={redirect} />) || (null);
    // Note: Normally you DON'T do this, but we want to set state w/o re-rendering
    this.state.redirect = null;


    return (
      <div>
        {redirectTag}
        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={16}>
          <Grid item>
            Now please fill in your information.
          </Grid>
          <Grid item>
            <TextField
              id="fullName"
              label="Name"
            />
          </Grid>
          <Grid item>
            <TextField
              id="email"
              label="Email"
            />
          </Grid>
          <Grid item>
            <Button onClick={this.doLogin}>Login</Button>
          </Grid>
        </Grid>
        {/* Spinny wheel dialog */}
        <Dialog open={flow === LOGIN_FLOW.LoggingIn}>
          <DialogTitle>Logging in</DialogTitle>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.loginCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog to confirm you've logged in. */}
        <Dialog open={flow === LOGIN_FLOW.LoggedIn} onClose={this.identityReset}>
          <DialogTitle>{`You're logged in ${name}`}</DialogTitle>
          <DialogActions>
            <Button onClick={this.closeLogin}>Ok</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog for errors. */}
        <ErrorDialog
          open={error.open}
          message={error.message}
          requestClose={this.closeError}
        />
      </div>
    );
  }
}
