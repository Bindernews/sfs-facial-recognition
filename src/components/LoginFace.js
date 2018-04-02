import React from 'react';
import Grid from 'material-ui/Grid';
import VideoDisplay from './VideoDisplay';
import ErrorDialog from './ErrorDialog';

// URL to send faces to
const FACE_REC_URL = '/api/face';
// Timeout before we give up (milliseconds)
const FACE_REC_TIMEOUT = 60 * 1000;

export default class LoginFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    http.setRequestHeader('Content-type', 'image/jpeg');
    http.onload = () => {
      if (!this.isCapturing) {
        return;
      }
      try {
        const resp = JSON.parse(http.responseText);
        if (resp.success) {
          // this is when login is successfull
          this.stopFaceRec();
          // TODO login successful
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
    http.onerror = () => {
      this.setError(`HTTP error code: ${http.status}`);
    };
    http.send(this.videoRef.captureAsJpeg());
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
    const { error } = this.state;
    return (
      <Grid container>
        <Grid item>
          <VideoDisplay
            ref={(id) => { this.videoRef = id; }}
            onLoad={() => { this.startFaceRec(); }}
            onError={(err) => { this.setError(err); }}
          />
        </Grid>
        <ErrorDialog
          open={error.open}
          message={error.message}
          onClose={() => { this.closeError(); }}
        />
      </Grid>
    );
  }
}
