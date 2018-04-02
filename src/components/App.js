import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Sidebar from './Sidebar';
import AppContent from './AppContent';

export default class App extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <MemoryRouter>
        <Grid container spacing={16}>
          <Grid item sm={2}>
            <Sidebar />
          </Grid>
          <Grid item sm>
            <AppContent />
          </Grid>
        </Grid>
      </MemoryRouter>
    );
  }
}
