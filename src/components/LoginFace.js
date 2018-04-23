import React from 'react';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
} from 'material-ui/Dialog';

import { sendPost } from '../util';
import VideoDisplay from './VideoDisplay';
import ErrorDialog, { setError, closeError } from './ErrorDialog';

// URL to send faces to
const FACE_REC_URL = '/identify';
// Timeout before we reset for the next user.
const IDENTITY_RESET_TIMEOUT = 10 * 1000;

const LOGIN_FLOW = {
  Normal: 0,
  Identifying: 1,
  Verifying: 2,
  LoggingIn: 3,
  LoggedIn: 4,
};

export default class LoginFace extends React.Component {
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
    const callbacks = ['doFaceRec', 'identityCorrect', 'identityWrong', 'identityReset',
      'loginCancel', 'closeLogin'];
    for (let i = 0; i < callbacks.length; i += 1) {
      this[callbacks[i]] = Object.getPrototypeOf(this)[callbacks[i]].bind(this);
    }
    // Create setError and closeError functions for ourself
    this.setError = setError.bind(this);
    this.closeError = closeError.bind(this);
  }

  componentWillUnmount() {
    this.videoRef = null;
    this.identityReset();
  }

  doFaceRec() {
    const data = {
      imgBase64: this.videoRef.captureAsPng(),
    };
    // Reset the UI if they take more than 2 minutes
    this.resetTimer = setTimeout(this.identityReset, IDENTITY_RESET_TIMEOUT);

    if (!MOCK) {
      // Send the image to the backend
      sendPost(FACE_REC_URL, data)
        .then((http) => {
          const resp = JSON.parse(http.responseText);
          if (resp.identity) {
            // Login successful, verify with user
            this.setState({ flow: LOGIN_FLOW.Verifying, identity: resp.identity });
            // Prepare timeout if they don't respond
            this.resetTimer = setTimeout(this.identityReset, IDENTITY_RESET_TIMEOUT);
          } else if (resp.error) {
            // Login failed, show the error
            this.setError(resp.error.message || JSON.stringify(resp.error));
          }
        }).catch((err) => {
          this.setError(err);
        });
    } else {
      setTimeout(() => {
        this.setState({ flow: LOGIN_FLOW.Verifying, identity: 'John Smith' });
      }, 1000);
    }
  }

  /**
   * Callback for when the user verifies the identity is correct.
   */
  identityCorrect() {
    // Say that we're logging in then tell the backend to actually do it
    this.setState({ flow: LOGIN_FLOW.LoggingIn });
    if (!MOCK) {
      sendPost('/verify', { verify: true, identity: this.state.identity })
        .then(() => {
          this.setState({ flow: LOGIN_FLOW.LoggedIn });
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
            <VideoDisplay
              ref={(id) => { this.videoRef = id; }}
              onError={this.setError}
            />
          </Grid>
          <Grid item>
            <Button onClick={this.doFaceRec}>
              Take picture
            </Button>
          </Grid>
        </Grid>
        <Dialog open={flow === LOGIN_FLOW.Identifying}>
          <DialogTitle>Identifying you</DialogTitle>
          <DialogContent>
            <CircularProgress />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.loginCancel}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/* Dialog to ask if you are who the face rec thinks you are. */}
        <Dialog open={flow === LOGIN_FLOW.Verifying}>
          <DialogTitle>Is your name {identity}?</DialogTitle>
          <DialogActions>
            <Button onClick={this.identityCorrect}>Yes</Button>
            <Button onClick={this.identityWrong}>No</Button>
          </DialogActions>
        </Dialog>
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
