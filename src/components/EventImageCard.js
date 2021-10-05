import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@material-ui/core/Popover';
import WarningIcon from '@material-ui/icons/Warning';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {useSnackbar} from 'notistack';

import {reportImage} from '../services/challengeApi';
import eventGalleryNoData from '../assets/eventGalleryNoData.jpeg';

const EventImageCard = ({data, fetchEventGallery, type}) => {
  const {enqueueSnackbar} = useSnackbar();
  const [expanStatus, setExpandStatus] = useState(false);
  const [abusiveText, setAbusiveText] = useState();
  let monthsObject = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };
  let captionText =
    type == 'program' || type == 'record'
      ? data.activityNotes
      : data.captionText;
  let uploadTime =
    type == 'program' || type == 'record'
      ? monthsObject[data.activitySubmitDate.split('-')[1]] +
        ' ' +
        data.activitySubmitDate.split('-')[2].split(' ')[0] +
        ', ' +
        data.activitySubmitDate.split('-')[2].split(' ')[1].split(':')[0] +
        ':' +
        data.activitySubmitDate.split('-')[2].split(' ')[1].split(':')[1]
      : data.submitDatetime
      ? monthsObject[data.submitDatetime.split('-')[1]] +
        ' ' +
        data.submitDatetime.split('-')[2].split(' ')[0] +
        ', ' +
        data.submitDatetime.split('-')[2].split(' ')[1].split(':')[0] +
        ':' +
        data.submitDatetime.split('-')[2].split(' ')[1].split(':')[1]
      : 'Upload Date';

  const renderExpandIcons = () => {
    if (captionText?.length > 27) {
      return (
        <div className="event-image-card-caption-icon">
          {expanStatus ? <ExpandMoreRoundedIcon /> : <ExpandLessRoundedIcon />}
        </div>
      );
    }
  };
  const [anchorElPopover, setAnchorElPopover] = useState(null);
  const handleMoreIconClick = (event) => {
    setAnchorElPopover(event.currentTarget);
  };

  const openPopover = Boolean(anchorElPopover);
  const id = openPopover ? 'simple-popover' : undefined;

  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setAbusiveText();
  };

  const renderPopover = () => {
    const handlePopoverClose = () => {
      setAnchorElPopover(null);
    };
    return (
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorElPopover}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="event-image-card-more-list">
          <div
            className="event-image-card-more-list-item"
            onClick={() => {
              handlePopoverClose();
              handleModalOpen();
            }}
          >
            <WarningIcon style={{color: '#ffa726'}} />
            Mark as Abusive
          </div>
        </div>
      </Popover>
    );
  };

  return (
    <div className="event-image-card">
      <img
        src={
          type == 'program'
            ? data.documentUrl
            : type === 'record'
            ? data.activityLink
            : data.imageUrl
        }
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = eventGalleryNoData;
        }}
        alt=""
      />

      <div
        className="event-image-card-caption"
        onClick={() => setExpandStatus(!expanStatus)}
      >
        {renderExpandIcons()}
        <div
          className={
            expanStatus
              ? 'event-image-card-caption-inner-expand'
              : 'event-image-card-caption-inner'
          }
        >
          {captionText}
        </div>

        {type == 'record' && (
          <div>
            <a
              href={data.activityLink}
              target="_blank"
              style={{
                color: '#ffff',
                fontSize: 12,
              }}
            >
              click here to access resource
            </a>
          </div>
        )}
      </div>

      <div className="event-image-card-name">
        <Avatar
          style={{width: 30, height: 30, marginRight: 3}}
          className="avatar-component"
        />
        <div className="event-image-card-name-details">
          <div className="event-image-card-name-details-date-name">
            {type == 'program' ? data.userName : data.name}
          </div>
          <div className="event-image-card-name-details-date">{uploadTime}</div>
        </div>
      </div>

      {type !== 'program' && (
        <>
          <div className="event-image-card-more-icon-wrapper">
            <MoreVertIcon
              aria-describedby={id}
              variant="contained"
              onClick={handleMoreIconClick}
            />
            {renderPopover()}
          </div>
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div
              className="event-image-card-abusive-modal"
              style={{borderRadius: 4}}
            >
              <div className="event-image-card-abusive-modal-heading">
                <h2 className="event-image-card-abusive-modal-heading-text">
                  Mark it as abusive ?
                </h2>
              </div>
              <div className="event-image-card-abusive-modal-subheading">
                <p className="event-image-card-abusive-modal-subheading-text">
                  Proceeding will remove media from the platform.
                </p>
              </div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <TextField
                  id="outlined-basic"
                  label="Message"
                  variant="outlined"
                  defaultValue={abusiveText}
                  style={{width: 292}}
                  onChange={(event) => {
                    setAbusiveText(event.target.value);
                  }}
                />
              </div>
              <div className="event-image-card-abusive-modal-button-wrapper">
                <Button color="secondary" onClick={() => handleModalClose()}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={abusiveText && abusiveText.length === 0}
                  onClick={() => {
                    handleModalClose();
                    let payload = {
                      eventStatusId: data.eventStatusId,
                      remarks:
                        abusiveText && abusiveText.length > 0
                          ? abusiveText
                          : '',
                    };
                    reportImage(payload)
                      .then((res) => {
                        if (res.data.response.responseMessage === 'SUCCESS') {
                          enqueueSnackbar('Media has been reported', {
                            variant: 'success',
                          });
                          fetchEventGallery();
                        } else {
                          enqueueSnackbar('Something went wrong', {
                            variant: 'error',
                          });
                        }
                      })
                      .catch((err) => {
                        enqueueSnackbar('Something went wrong', {
                          variant: 'error',
                        });
                      });
                  }}
                >
                  Agree
                </Button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default EventImageCard;
