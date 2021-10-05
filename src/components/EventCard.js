import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import EventInfoModal from './EventInfoModal';
import EventRegisterModal from './EventRegisterModal';
import InfoDialog from './Utility/InfoDialog';
import InfoIcon from '@material-ui/icons/Info';
import {unsubscribeEvent, rejoinEvent} from '../services/challengeApi';
import Message from 'antd-message';

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

const EventCard = ({
  challenge,
  handleChallengeCardClick,
  dashboardState,
  setDashboardState,
  fetchChallenges,
  listType,
  selectedAction,
  selectedChallengeArray,
  selectedChallenge,
}) => {
  const [modalView, setModalView] = useState(false);
  const [registerModalView, setRegisterModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);

  let startDate = challenge.challengeStartDate
    ? challenge.challengeStartDate.split(' ')
    : '';
  let endDate = challenge.challengeEndDate
    ? challenge.challengeEndDate.split(' ')
    : '';
  let startDay = startDate[0].split('-')[2];
  let endDay = endDate[0].split('-')[2];
  let startMonth = monthsObject[startDate[0].split('-')[1]];
  let endMonth = monthsObject[endDate[0].split('-')[1]];
  let startTime = startDate[1];

  const renderRegisterBtn = () => {

    if (listType == 'event' && challenge.eventView !== 'LINKED') {
      if (dashboardState.challengeSwitch !== 'old') {
        if (dashboardState.challengeSwitch == 'current') {
          if (challenge?.regOpen && !challenge?.isParticipated) {
            return (
              <div className="register-button">
                <button onClick={() => setRegisterModalView(true)}>
                  Register
                </button>
              </div>
            );
          }
          if (challenge.isParticipated && challenge.isSubscribed) {
            return (
              <div className="register-button">
                <button
                  onClick={() => setUnsubModal(true)}
                  style={{background: '#F43F5E'}}
                >
                  Unsubscribe
                </button>
              </div>
            );
          }
          if (
            challenge.isParticipated &&
            !challenge.isSubscribed &&
            challenge.canRejoin
          ) {
            return (
              <div className="register-button">
                <button
                  onClick={() => {
                    rejoinEvent(challenge.id).then((res) => {
                      fetchChallenges();
                    });
                  }}
                  style={{background: '#ffa726'}}
                >
                  Rejoin
                </button>
              </div>
            );
          }
        } else {
          return (
            <div className="register-button">
              {!challenge.isParticipated && (
                <button onClick={() => setRegisterModalView(true)}>
                  Register
                </button>
              )}
              {challenge.isParticipated && challenge.isSubscribed && (
                <button
                  onClick={() => setUnsubModal(true)}
                  style={{background: '#F43F5E'}}
                >
                  Usubscribe
                </button>
              )}
              {challenge.isParticipated &&
                !challenge.isSubscribed &&
                challenge.canRejoin && (
                  <button
                    onClick={() => {
                      rejoinEvent(challenge.id).then((res) => {
                        fetchChallenges();
                      });
                    }}
                    style={{background: '#ffa726'}}
                  >
                    Rejoin
                  </button>
                )}
            </div>
          );
        }
      }
    }
  };
  return (
    <div
      className={
        selectedAction === 'Compare'
          ? selectedChallengeArray.includes(challenge.id)
            ? 'challenge-card challenge-card-first'
            : 'challenge-card'
          : selectedChallenge == challenge.id
          ? 'challenge-card challenge-card-first'
          : 'challenge-card'
      }
      key={challenge.id}
    >
      <div onClick={() => handleChallengeCardClick(challenge)}>
        <div
          style={{
            width: 230,
            height: 100,
            borderRadius: '12px 12px 0px 0px',
            background: '#fff',
            overflow: 'hidden',
          }}
        >
          <img
            src={
              challenge.eventLogo ||
              'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png'
            }
            style={{
              width: 230,
              height: 100,
              objectFit: 'cover',
              borderRadius: '12px 12px 0px 0px',
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png';
            }}
          />
        </div>
        <div className="challenge-card-details">
          <div
            className={
              selectedAction === 'Compare'
                ? selectedChallengeArray.includes(challenge.id)
                  ? 'challenge-card-details-name challenge-card-details-name-first'
                  : 'challenge-card-details-name'
                : selectedChallenge == challenge.id
                ? 'challenge-card-details-name challenge-card-details-name-first'
                : 'challenge-card-details-name'
            }
          >
            {challenge.challengeName}
          </div>
          <div
            className={
              selectedAction === 'Compare'
                ? selectedChallengeArray.includes(challenge.id)
                  ? 'challenge-card-details-start-date-time challenge-card-details-start-date-time-first'
                  : 'challenge-card-details-start-date-time'
                : selectedChallenge == challenge.id
                ? 'challenge-card-details-start-date-time challenge-card-details-start-date-time-first'
                : 'challenge-card-details-start-date-time'
            }
          >
            {/* starts at{' '}
            {startTime?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })} */}
          </div>
        </div>
        <div className="event-image-card-avatar-div">
          <div
            style={{
              fontSize: 9,
              color: '#000',
              marginRight: 3,
              marginTop: 27,
            }}
          >
            Powered by
          </div>
          <Avatar
            src={challenge.sponsorLogo}
            className="avatar-component sponser-logo"
          />
        </div>
      </div>

      {renderRegisterBtn()}
      <div className="challenge-card-start-date">
        <div className="challenge-card-start-date-month">
          {startMonth} - {endMonth}
        </div>
        <div className="challenge-card-start-date-day">
          {startDay} - {endDay}
        </div>
        <a
          onClick={() => setModalView(true)}
          style={{position: 'absolute', top: 5, right: 5}}
        >
          <InfoIcon style={{fontSize: 18, color: '#1e88e5'}} />
        </a>
      </div>
      {modalView && (
        <EventInfoModal
          challenge={challenge}
          modalView={modalView}
          setModalView={setModalView}
        />
      )}
      {registerModalView && (
        <EventRegisterModal
          challenge={challenge}
          modalView={registerModalView}
          setModalView={setRegisterModalView}
          setDashboardState={setDashboardState}
          currentViewTab={dashboardState.challengeSwitch}
          instruction_details={dashboardState?.instruction_details}
        />
      )}
      {showUnsubscribeModal && (
        <InfoDialog
          handleClose={() => setUnsubModal(false)}
          open={showUnsubscribeModal}
          title="Want to unsubscribe from the event?"
        >
          <div className="event-unsubscribe-modal">
            <button
              onClick={() => {
                window.message = Message;
                unsubscribeEvent(challenge.id)
                  .then((res) => {
                    if (res.data.response.responseCode === 0) {
                      message.success('Event unsubscribed.');
                      fetchChallenges();
                    } else {
                      message.error(res.data.response.responseMessage);
                      message.error(res.data.mhealthResponseMessage);
                    }
                    setUnsubModal(false);
                  })
                  .catch(() => {
                    message.success('Try Again.');
                    setUnsubModal(false);
                  });
              }}
            >
              Yes
            </button>
            <button onClick={() => setUnsubModal(false)}>No</button>
          </div>
        </InfoDialog>
      )}
    </div>
  );
};

export default EventCard;
