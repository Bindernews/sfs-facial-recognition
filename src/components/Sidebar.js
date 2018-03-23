/* eslint react/no-children-prop: 0 */

import React, { PropTypes } from 'react';
import { Link, Route } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const ImageStyle = {
  width: '100%',
  height: 'auto',
};

const LINKS = [
  {
    name: 'Home',
    to: '/',
    exact: true,
  },
  {
    name: 'Login with facial recognition',
    to: '/login-face',
  },
  {
    name: 'Login with email',
    to: '/login-email',
  },
  {
    name: 'Register for facial recognition',
    to: '/register',
  },
];

const NavButton = ({ name, to, exact }) => (
  <Route exact={exact} path={to} children={({ match }) => (
    <Link to={to}>
      <Button fullWidth variant={(match && 'raised') || 'flat'}>{name}</Button>
    </Link>
  )} />
);

const Sidebar = () => {
  const links = LINKS.map(data => (
    <Grid key={data.name} item>
      <NavButton exact={data.exact} to={data.to} name={data.name} />
    </Grid>
  ));
  return (
    <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={16}>
      <Grid item>
        <img style={ImageStyle} src="http://partyhorse.party/images/BeachHorse.jpg" alt="A horse on a beach" />
      </Grid>
      { links }
    </Grid>
  );
};
export default Sidebar;
