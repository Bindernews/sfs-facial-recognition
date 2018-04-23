import React from 'react';
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
// Set to false to not send backend data. Useful for debugging.
const HAS_BACKEND = true;

const LOGIN_FLOW = {
  Normal: 0,
  Verifying: 1,
  LoggingIn: 2,
  LoggedIn: 3,
};

export default class LoginEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: LOGIN_FLOW.Normal,
      identity: null,
      error: {},
    };
    this.videoRef = null;
    this.resetTimer = null;

    // Bind callbacks
    const callbacks = ['identityCorrect', 'identityWrong', 'identityReset',
      'loginCancel', 'closeLogin'];
    for (let i = 0; i < callbacks.length; i += 1) {
      this[callbacks[i]] = Object.getPrototypeOf(this)[callbacks[i]].bind(this);
    }
    // Create setError and closeError functions for ourself
    this.setError = setError.bind(this);
    this.closeError = closeError.bind(this);
  }

  /**
   * Callback for when the user verifies the identity is correct.
   */
  identityCorrect() {
    this.setState({ flow: LOGIN_FLOW.LoggingIn });
    if (HAS_BACKEND) {
      sendPost('/verify', { verify: true })
        .then(() => {
          this.setState({ flow: LOGIN_FLOW.LoggedIn });
        }).catch((err) => {
          this.setError(err);
        });
    } else {
      // Simulate processing
      setTimeout(() => {
        this.setState({ flow: LOGIN_FLOW.LoggedIn });
      }, 2 * 1000);
    }
  }

  /**
   * Callback to reset the identity for new people.
   */
  identityReset() {
    this.setState({ flow: LOGIN_FLOW.Normal, identity: null });
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = null;
  }

  /**
   * Callback for when the user says the identity is wrong.
   */
  identityWrong() {
    this.identityReset();
  }

  loginCancel() {
    this.identityReset();
    // TODO send message to backend to cancel the login
  }

  closeLogin() {
    // Set the flow back to normal and let the identity reset once the animation is finished
    this.setState({ flow: LOGIN_FLOW.Normal });
  }

  render() {
    const { error, identity, flow } = this.state;

    return (
      <div>
        {/* Show the video and "Take a picture" button */}
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <TextField
              hintText="john.doe@rit.edu"
              floatingLabelText="Email"
              floatingLabelFixed={true}
            /><br />
          </Grid>
          <Grid item>
            <TextField
              floatingLabelText="Password"
              floatingLabelFixed={true}
            /><br />
          </Grid>
          <Grid item>
            <Button onClick={this.identityCorrect}>
              Login
            </Button>
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
          <DialogTitle>{`You're logged in ${identity}`}</DialogTitle>
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
