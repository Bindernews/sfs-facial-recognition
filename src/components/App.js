import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Sidebar from './Sidebar';
import AppContent from './AppContent';

export default class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <Grid container spacing={16}>
          <Grid item md={2}>
            <Sidebar />
          </Grid>
          <Grid item md>
            <AppContent />
          </Grid>
        </Grid>
      </BrowserRouter>
    );
  }
}
