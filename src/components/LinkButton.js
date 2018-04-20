/* eslint arrow-parens: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'material-ui/Button';

const LinkButton = withRouter((props) => (
  <Button
    onClick={(ev) => { props.history.push(props.to); props.onClick(ev); }}
    color={props.color}
    variant={props.variant}
    disabeld={props.disabled}
    fullWidth={props.fullWidth}
    mini={props.mini}
    size={props.size}
  >
    {props.children}
  </Button>
));
LinkButton.defaultProps = {
  onClick: () => {},
};

export default LinkButton;
