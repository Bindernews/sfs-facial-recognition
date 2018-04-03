import React from 'react';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogTitle,
  DialogContent,
} from 'material-ui/Dialog';

import VideoDisplay from './VideoDisplay';
import ErrorDialog from './ErrorDialog';

// URL to send faces to
const FACE_REC_URL = '/receive';
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
    const callbacks = ['setError', 'closeError', 'doFaceRec', 'identityCorrect', 'identityWrong',
      'identityReset', 'loginCancel', 'closeLogin'];
    for (let i = 0; i < callbacks.length; i += 1) {
      this[callbacks[i]] = Object.getPrototypeOf(this)[callbacks[i]].bind(this);
    }
  }

  componentWillUnmount() {
    this.videoRef = null;
  }

  setError(err) {
    console.error('Error:', err);
    this.setState({ error: { open: true, message: err.toString() } });
  }

  /**
   * Close the error dialog. Keep the message due to the fade out time.
   */
  closeError() {
    this.setState({ error: { open: false, message: this.state.error.message } });
  }

  doFaceRec() {
    const data = {
      imgBase64: this.videoRef.captureAsPng(),
    };
    // Reset the UI if they take more than 2 minutes
    this.resetTimer = setTimeout(this.identityReset, IDENTITY_RESET_TIMEOUT);

    if (HAS_BACKEND) {
      // Send the image to the backend
      this.sendPost(FACE_REC_URL, data, (http) => {
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
      });
    } else {
      this.setState({ flow: LOGIN_FLOW.Verifying, identity: 'John Smith' });
    }
  }

  sendPost(url, data, cb) {
    const http = new XMLHttpRequest();
    http.open('POST', FACE_REC_URL, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onload = () => {
      if (http.status !== 200) {
        this.setError(`HTTP error ${http.status}`);
      } else {
        // If no error, run the callback
        try {
          cb();
        } catch (err) {
          this.setError(err);
        }
      }
    };
    // Error callback
    http.onerror = () => {
      this.setError(`HTTP error code: ${http.status}`);
    };
    // Send the request
    http.send(JSON.stringify(data));
    return http;
  }

  /**
   * Callback for when the user verifies the identity is correct.
   */
  identityCorrect() {
    // Say that we're logging in then tell the backend to actually do it
    this.setState({ flow: LOGIN_FLOW.LoggingIn });
    if (HAS_BACKEND) {
      this.sendPost('/verify', { verify: true }, (http) => {
        this.setState({ flow: LOGIN_FLOW.LoggedIn });
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
        {/* Dialog to ask if you are who the face rec thinks you are. */}
        <Dialog open={flow === LOGIN_FLOW.Verifying}>
          <DialogTitle>Are you {identity}?</DialogTitle>
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
