import React from 'react';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import { Route, Switch, Redirect } from 'react-router-dom';

import { sendPost } from '../util';
import LinkButton from './LinkButton';
import VideoDisplay from './VideoDisplay';
import ErrorDialog, { setError, closeError } from './ErrorDialog';


export default class RegisterFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      redirect: null,
      error: {},
    };

    this.videoRef = null;

    this.setError = setError.bind(this);
    this.closeError = closeError.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.doRegister = this.doRegister.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
  }

  componentWillMount() {
    //this.clearForm();
  }

  componentWillUnmount() {
    // Clear the current state before we unmount
    this.clearForm();
  }

  clearForm() {
    this.setState({ photo: null, redirect: null, error: {} });
    return null;
  }

  takePhoto() {
    this.setState({
      photo: this.videoRef.captureAsPng(),
    });
  }

  doRegister() {
    const data = {
      first: document.getElementById('firstName').value,
      last: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      imgBase64: this.state.photo,
    };
    if (!MOCK) {
      sendPost('/introduce', data, 2000)
        .then((http) => {
          this.setState({ redirect: '/register/4' });
        }).catch((err) => {
          this.setState({ redirect: '/register/1' });
          this.setError(err);
        });
    } else {
      setTimeout(() => {
        this.setState({ redirect: '/register/4' });
      }, 1000);
    }
  }

  render() {
    const { error, redirect } = this.state;
    const redirectTag = (redirect && <Redirect to={redirect} />) || (null);
    // Note: Normally you DON'T do this, but we want to set state w/o re-rendering
    this.state.redirect = null;

    // Show this when we're trying to get your face
    const page1 = (
      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={16}>
        <Grid item>
          <p>To register your face, begin by clicking &quot;Take Photo&quot; below.</p>
        </Grid>
        <Grid item>
          <VideoDisplay
            ref={(id) => { this.videoRef = id; }}
            onError={this.setError}
          />
        </Grid>
        <Grid item>
          <LinkButton to="/register/2" onClick={this.takePhoto}>Take Photo</LinkButton>
        </Grid>
      </Grid>
    );

    // Show this when we have your face and we need your info.
    const page2 = (
      <Grid container direction="column" justify="flex-start" alignItems="center" spacing={16}>
        <Grid item>
          Now please fill in your information.
        </Grid>
        <Grid item>
          <TextField
            id="firstName"
            label="First name"
          />
        </Grid>
        <Grid item>
          <TextField
            id="lastName"
            label="Last name"
          />
        </Grid>
        <Grid item>
          <TextField
            id="email"
            label="Email"
          />
        </Grid>
        <Grid item>
          <LinkButton to="/register/1" onClick={this.clearForm}>Back</LinkButton>
          <LinkButton to="/register/3" onClick={this.doRegister}>Register</LinkButton>
        </Grid>
      </Grid>
    );

    // This page is for showing the user that we're registering them
    const page3 = (
      <div>
        <p>Registering....</p>
        <CircularProgress />
      </div>
    );

    // Tell them they've been registered
    const page4 = (
      <div>
        <p>Registered!</p>
      </div>
    );

    return (
      <div>
        <ErrorDialog
          open={error.open}
          message={error.message}
          requestClose={this.closeError}
        />
        {redirectTag}
        <Switch>
          <Route path="/register/1">{page1}</Route>
          <Route path="/register/2">{page2}</Route>
          <Route path="/register/3">{page3}</Route>
          <Route path="/register/4">{page4}</Route>
        </Switch>
      </div>
    );
  }
}
