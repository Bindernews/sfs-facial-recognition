/* eslint react/no-children-prop: 0, jsx-a11y/anchor-is-valid: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const ImageStyle = {
  width: '100%',
  height: 'auto',
};

export const NavButton = ({ name, to, exact }) => (
  <Route exact={exact} path={to} children={({ match }) => (
    <Link to={to}>
      <Button fullWidth variant={(match && 'raised') || 'flat'}>{name}</Button>
    </Link>
  )} />
);
NavButton.propTypes = {
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool,
};
NavButton.defaultProps = {
  exact: false,
};

const Sidebar = () => (
  <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={16}>
    <Grid item>
      <img style={ImageStyle} src="http://partyhorse.party/images/BeachHorse.jpg" alt="A horse on a beach" />
    </Grid>
    <Grid item>
      <NavButton exact to="/" name="Home" />
    </Grid>
    <Grid item>
      <NavButton to="/login-face" name="Login with facial recognition" />
    </Grid>
    <Grid item>
      <NavButton to="/login-email" name="Login with email" />
    </Grid>
    <Grid item>
      <NavButton to="/register" name="Register for facial recognition" />
    </Grid>
  </Grid>
);

export default Sidebar;
