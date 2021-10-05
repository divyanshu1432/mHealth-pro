import React, {useEffect, useContext, useState} from 'react';
import {AppContext} from './context/ChallengeContext';
import {getChallenges, challengeActionCall} from '../../services/challengeApi';
import Message from 'antd-message';

const actionList = {
  request: 'Request',
  status: 'Status',
};
const ActionSelector = ({
  eventId,
  reloadChallengeAccepted,
  setReloadChallengeAccepted,
}) => {
  const {selectedAction, changeState, mobileDataList} = useContext(AppContext);
  const [challengeActionList, setList] = useState([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    getChallenges(selectedAction === 'request' ? 'Receiver' : 'Sender', eventId)
      .then((res) => {
        if (res.status === 200 && res.data.response.responseCode === 0) {
          if (selectedAction === 'request') {
            setList(res.data.response.responseData.Receiver);
          } else {
            setList(res.data.response.responseData.Sender);
          }
        } else {
          setList([]);
        }
        setLoadingData(false);
      })
      .catch((err) => {
        setList([]);
        setLoadingData(false);
      });
  }, [selectedAction, reload, eventId]);

  const handleAction = (action, challengeId) => {
    window.message = Message;
    setLoadingAction(true);
    challengeActionCall(action, challengeId)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          message.success(res.data.response.responseData);
        } else {
          message.error('Something went wrong!');
        }
        setLoadingAction(false);
        setReload(!reload);
        if (action === 'accept') {
          setReloadChallengeAccepted(!reloadChallengeAccepted);
        }
      })
      .catch(() => {
        setLoadingAction(false);
        setReload(!reload);
      });
  };

  const statusMapping = {
    REJECT: {borderColor: '#EF4444', background: '#FEE2E2'},
    ACCEPT: {borderColor: '#16A34A', background: '#DCFCE7'},
    PENDING: {borderColor: '#D97706', background: '#FEF3C7'},
    EXPIRE: {borderColor: '#57534E', background: '#F5F5F4'},
  };
  const ChallengeStatusCard = ({challengeDetail}) => {
    return (
      <div
        className="action-challenge-card"
        style={statusMapping[challengeDetail.challengeStatus.toUpperCase()]}
      >
        <div>
          <div className="date">{challengeDetail.date}</div>
          <div>
            {challengeDetail.challengeStatus === 'ACCEPT' ? (
              <div>
                <div className="name">
                  <span className="bold">{challengeDetail.receiverName}</span>{' '}
                  has accepted your challenge request on{' '}
                  <span className="request-date">
                    {challengeDetail.acceptedDate}
                  </span>
                  .
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : challengeDetail.challengeStatus === 'REJECT' ? (
              <div>
                <div className="name">
                  Request sent to{' '}
                  <span className="bold">{challengeDetail.receiverName}</span>{' '}
                  is rejected on{' '}
                  <span className="request-date">
                    {challengeDetail.rejectedDate}
                  </span>
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : (
              <div>
                <div className="name">
                  Request sent to{' '}
                  <span className="bold">{challengeDetail.receiverName}</span>{' '}
                  is pending
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            )}
          </div>
        </div>
        <div></div>
      </div>
    );
  };

  const ChallengeRequestCard = ({challengeDetail}) => {
    return (
      <div
        className="action-challenge-card"
        style={statusMapping[challengeDetail.challengeStatus.toUpperCase()]}
      >
        <div>
          {' '}
          <div className="date">{challengeDetail.date}</div>
          <div>
            {challengeDetail.challengeStatus.toUpperCase() === 'EXPIRE' ? (
              <div>
                <div className="name">
                  Expired request sent by{' '}
                  <span className="bold">{challengeDetail.senderName}</span> on{' '}
                  <span className="request-date">
                    {challengeDetail.expireDate}
                  </span>
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : challengeDetail.challengeStatus.toUpperCase() === 'ACCEPT' ? (
              <div>
                <div className="name">
                  Accepted request sent by{' '}
                  <span className="bold">{challengeDetail.senderName}</span> on{' '}
                  <span className="request-date">
                    {challengeDetail.acceptedDate}
                  </span>
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : challengeDetail.challengeStatus.toUpperCase() === 'PENDING' ? (
              <div>
                <div className="name">
                  Pending request sent by{' '}
                  <span className="bold">{challengeDetail.senderName}</span>
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : challengeDetail.challengeStatus.toUpperCase() === 'REJECT' ? (
              <div>
                {' '}
                <div className="name">
                  Rejected request sent by{' '}
                  <span className="bold">{challengeDetail.senderName}</span> on{' '}
                  <span className="request-date">
                    {challengeDetail.rejectedDate}
                  </span>
                </div>
                <div className="invite-date">
                  sent on {challengeDetail.invitedDate}
                </div>
              </div>
            ) : (
              <div className="name">Bad Request</div>
            )}
          </div>
        </div>
        {challengeDetail.challengeStatus.toUpperCase() === 'PENDING' && (
          <div className="action-request-container">
            <button
              onClick={() => {
                handleAction('accept', challengeDetail.challengeId);
              }}
              disabled={loadingAction}
            >
              ACCEPT
            </button>
            <button
              onClick={() => {
                handleAction('reject', challengeDetail.challengeId);
              }}
              disabled={loadingAction}
            >
              REJECT
            </button>
          </div>
        )}
      </div>
    );
  };

  const getChallengeCard = () => {
    if (selectedAction === 'status') {
      return challengeActionList.map((challengeDetail) => (
        <ChallengeStatusCard challengeDetail={challengeDetail} />
      ));
    }
    return challengeActionList.map((challengeDetail) => (
      <ChallengeRequestCard challengeDetail={challengeDetail} />
    ));
  };

  return (
    <div className="challenge-action-container">
      <div className="action-container">
        {Object.entries(actionList).map((actionType) => (
          <div
            className={
              selectedAction === actionType[0]
                ? 'selected-action-block'
                : 'action-block'
            }
            onClick={() => {
              changeState({
                selectedAction: actionType[0],
              });
            }}
          >
            {actionType[1]}
          </div>
        ))}
      </div>
      <div className="action-data-container">
        {loadingData
          ? ''
          : challengeActionList.length
          ? getChallengeCard()
          : 'No data'}
      </div>
    </div>
  );
};

export default ActionSelector;
