import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

const InfoDialog = (props) => {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogTitle>{props.title}</DialogTitle>
      {props.children}
    </Dialog>
  );
};

export default InfoDialog;
