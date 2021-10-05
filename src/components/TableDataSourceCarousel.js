import React from 'react';
import Popover from '@material-ui/core/Popover';

const TableDataSourceCarousel = ({
  id,
  open,
  anchorEl,
  handleClose,
  selectedUserData,
  children,
}) => {
  return (
    <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
      {children}
    </Popover>
  );
};

export default TableDataSourceCarousel;
