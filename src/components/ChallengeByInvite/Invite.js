import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import {APP} from '../../utils/appConfig';
import {sendInviteForChallenge} from '../../services/challengeApi';
import Message from 'antd-message';

const Invite = ({userFound, mobileNo, eventId}) => {
  const [inviteeName, setInviteeName] = useState('');
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {userFound && Array.isArray(userFound) && userFound.length > 0 ? (
          userFound.map((item) => {
            return (
              <div className="challenge-invite-card">
                <div className="challenge-invite-card-details">
                  <Avatar
                    className="avatar-component sponser-logo"
                    style={{width: 25, height: 25}}
                  />
                  <div className="challenge-invite-card-text">
                    <div style={{fontWeight: 800, fontSize: 13}}>
                      {item.firstName} {item.lastName}
                    </div>
                    <div style={{fontSize: 12}}>{item.city}</div>
                  </div>
                </div>

                <div className="challenge-invite-card-btn-div">
                  <Button
                    variant="contained"
                    color="primary"
                    className="challenge-invite-card-btn"
                    onClick={() => {
                      window.message = Message;
                      sendInviteForChallenge({
                        eventId: eventId,
                        inviteeId: parseInt(item.id),
                        mobileNumber: item.mobileNumber,
                      }).then((res) => {
                        message.success(res.data.response.responseMessage);
                      });
                    }}
                  >
                    Send Challenge
                  </Button>
                </div>
              </div>
            );
          })
        ) : mobileNo ? (
          <div
            className="challenge-invite-card"
            style={{background: '#EA580C'}}
          >
            <div className="challenge-invite-card-details">
              <Avatar
                className="avatar-component sponser-logo"
                style={{width: 25, height: 25}}
              />
              <div className="challenge-invite-card-text">
                <div style={{fontWeight: 800, fontSize: 13}}>
                  User doesn't exist
                </div>
                <div style={{fontSize: 12}}>Send Invitation</div>
              </div>
            </div>

            <div className="challenge-invite-card-btn-div">
              <input
                className="challenge-invite-card-input"
                value={inviteeName}
                onChange={(e) => {
                  setInviteeName(e.target.value);
                }}
                placeholder="Name"
              />
              <Button
                variant="contained"
                color="primary"
                className="challenge-invite-card-btn"
                onClick={() => {
                  window.message = Message;
                  sendInviteForChallenge({
                    eventId: eventId,
                    inviteeId: parseInt(localStorage.userId),
                    mobileNumber: mobileNo,
                    inviteeName: inviteeName,
                  }).then((res) => {
                    message.success(res.data.response.responseMessage);
                  });
                }}
                disabled={inviteeName === ''}
              >
                Invite via{' '}
                <img
                  style={{
                    width: 20,
                    height: 20,
                    marginLeft: 5,
                  }}
                  src={APP.dataSourceLogo['WHATSAPP']}
                />
              </Button>
            </div>
          </div>
        ) : (
          <div className="challenge-invite-card">
            <div className="challenge-invite-card-details">
              <Avatar className="avatar-component sponser-logo" />
              <div className="challenge-invite-card-text">
                <div style={{fontWeight: 800}}>Search by phone number</div>
              </div>
            </div>

            <div className="challenge-invite-card-btn-div">
              <Button
                variant="contained"
                color="primary"
                className="challenge-invite-card-btn"
                disabled={true}
              >
                Invite
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invite;
