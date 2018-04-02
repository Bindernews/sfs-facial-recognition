import React from 'react';
import Grid from 'material-ui/Grid';
import VideoDisplay from './VideoDisplay';
import ErrorDialog from './ErrorDialog';

// URL to send faces to
const FACE_REC_URL = '/receive';
// Timeout before we give up (milliseconds)
const FACE_REC_TIMEOUT = 60 * 1000;

export default class LoginFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: null,
      error: {},
    };
    this.videoRef = null;
    this.isCapturing = false;
    this.captureTimer = null;
    this.timeoutTimer = null;
  }

  setError(err) {
    console.error('Error:', err);
    this.setState({ error: { open: true, message: err.toString() } });
  }

  closeError() {
    this.setState({ error: {} });
  }

  startFaceRec() {
    this.isCapturing = true;
    // Start the capture timer on a short interval and the timeout
    this.captureTimer = setInterval(() => {
      this.doFaceRec();
    }, 100);
    // If the timeout occurs stop face rec and show an error
    this.timeoutTimer = setTimeout(() => {
      this.stopFaceRec();
      this.setState({ error: { open: true, message: 'Unable to recognize your face' } });
    }, FACE_REC_TIMEOUT);
  }

  doFaceRec() {
    const http = new XMLHttpRequest();
    http.open('POST', FACE_REC_URL, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onload = () => {
      if (!this.isCapturing) {
        return;
      }
      if (http.status != 200) {
        this.stopFaceRec();
        this.setError(`HTTP error ${http.status}`);
        return;
      }
      try {
        const resp = JSON.parse(http.responseText);
        if (resp.identity) {
          // this is when login is successfull
          this.stopFaceRec();
          this.setState({ identity: resp.identity });
        } else if (resp.error) {
          // This is when an error occurs
          this.stopFaceRec();
          this.setError(resp.error.message);
        }
      } catch (err) {
        this.stopFaceRec();
        this.setError(err);
      }
    };
    // Error callback
    http.onerror = () => {
      this.stopFaceRec();
      this.setError(`HTTP error code: ${http.status}`);
    };
    // Send the image to the backend
    http.send(JSON.stringify({
      imgBase64: this.videoRef.captureAsPng()
    }));
  }

  stopFaceRec() {
    this.isCapturing = false;
    // Stop the capture timer and the timeout
    if (this.captureTimer) {
      clearInterval(this.captureTimer);
      this.captureTimer = null;
    }
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  render() {
    const { error, identity } = this.state;

    // Conditional rendering!
    const identityComponents = (identity !== null) ? (
      <Grid item>
        <p>
          You&apos;re logged in, {identity}!
        </p>
      </Grid>
    ) : null;

    return (
      <Grid container>
        <Grid item>
          <VideoDisplay
            ref={(id) => { this.videoRef = id; }}
            onLoad={() => { this.startFaceRec(); }}
            onError={(err) => { this.setError(err); }}
          />
        </Grid>
        { identityComponents }
        <ErrorDialog
          open={error.open}
          message={error.message}
          onClose={() => { this.closeError(); }}
        />
      </Grid>
    );
  }
}
