import React from 'react';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogTitle,
} from 'material-ui/Dialog';

import VideoDisplay from './VideoDisplay';
import ErrorDialog from './ErrorDialog';

// URL to send faces to
const FACE_REC_URL = '/receive';
// Timeout before we reset for the next user.
const IDENTITY_RESET_TIMEOUT = 10 * 1000;
// Set to false to not send backend data. Useful for debugging.
const HAS_BACKEND = true;

export default class LoginFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      potentialIdentity: null,
      identity: null,
      error: {},
    };
    this.videoRef = null;
    this.resetTimer = null;

    // Bind callbacks
    const callbacks = ['setError', 'closeError', 'doFaceRec', 'identityCorrect', 'identityWrong',
      'identityReset'];
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

  closeError() {
    this.setState({ error: {} });
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
          this.setState({ potentialIdentity: resp.identity });
          // Prepare timeout if they don't respond
          this.resetTimer = setTimeout(this.identityReset, IDENTITY_RESET_TIMEOUT);
        } else if (resp.error) {
          // Login failed, show the error
          this.setError(resp.error.message || JSON.stringify(resp.error));
        }
      });
    } else {
      this.setState({ potentialIdentity: 'John Smith' });
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
    if (HAS_BACKEND) {
      this.sendPost('/verify', { verify: true }, (http) => {
        this.setState({ identity: this.state.potentialIdentity });
      });
    } else {
      this.setState({ identity: this.state.potentialIdentity });
    }
  }

  /**
   * Callback to reset the identity for new people.
   */
  identityReset() {
    this.setState({ identity: null, potentialIdentity: null });
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
    this.resetTimer = null;
  }

  /**
   * Callback for when the user says the identity is wrong.
   */
  identityWrong() {
    this.setState({ potentialIdentity: null });
  }

  render() {
    const { error, potentialIdentity, identity } = this.state;

    // Create the "you logged in" dialog only if we verified their identity
    const loggedInDialog = (identity !== null) ? (
      <Dialog open>
        <DialogTitle>{`You're logged in ${identity}`}</DialogTitle>
        <DialogActions>
          <Button onClick={this.identityReset}>Ok</Button>
        </DialogActions>
      </Dialog>
    ) : null;

    // Show verification dialog
    const verifyDialog = (potentialIdentity && !identity) ? (
      <Dialog open>
        <DialogTitle>Are you {potentialIdentity}?</DialogTitle>
        <DialogActions>
          <Button onClick={this.identityCorrect}>Yes</Button>
          <Button onClick={this.identityWrong}>No</Button>
        </DialogActions>
      </Dialog>
    ) : null;

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
        { verifyDialog }
        { loggedInDialog }
        <ErrorDialog
          open={error.open}
          message={error.message}
          onClose={this.closeError}
        />
      </div>
    );
  }
}
