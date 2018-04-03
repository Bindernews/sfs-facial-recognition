import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const ErrorDialog = ({ open, message, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="error-dialog-title"
    aria-describedby="error-dialog-description"
  >
    <DialogTitle id="error-dialog-title">Error</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Acknowledge
      </Button>
    </DialogActions>
  </Dialog>
);
ErrorDialog.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};
ErrorDialog.defaultProps = {
  open: false,
  message: '',
};

export default ErrorDialog;