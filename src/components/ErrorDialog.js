import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

const ErrorDialog = ({ open, message, requestClose, onClose }) => (
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
      <Button onClick={requestClose} color="primary">
        Acknowledge
      </Button>
    </DialogActions>
  </Dialog>
);
ErrorDialog.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  requestClose: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};
ErrorDialog.defaultProps = {
  open: false,
  message: '',
  onClose: () => {},
};

export function setError(err) {
  this.setState({ error: { open: true, message: err.toString() } });
}

/**
 * Close the error dialog. Keep the message due to the fade out time.
 */
export function closeError() {
  this.setState({ error: { open: false, message: this.state.error.message } });
}

export default ErrorDialog;

