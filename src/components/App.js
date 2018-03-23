import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import LoginSelector from './LoginSelector';
import AppContent from './AppContent';

export default class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <Grid container spacing={16}>
          <Grid item sm={4}>
            <LoginSelector />
          </Grid>
          <Grid item sm={6}>
            <AppContent />
          </Grid>
        </Grid>
      </BrowserRouter>
    );
  }
}
