import React, {useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import EventInfoModal from '../EventInfoModal';
import EventRegisterModal from '../EventRegisterModal';
import InfoIcon from '@material-ui/icons/Info';
import {useHistory} from 'react-router-dom';

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

function isLoggedIn() {
  if (localStorage.getItem('token')) {
    return true;
  }
  return false;
}

const Card = ({
  challenge,
  setUpcomingEventList,
  registerModalView,
  setRegisterModalView,
  userPastedCode,
  instruction_details,
}) => {
  useEffect(() => {
    if (userPastedCode && localStorage.token) {
      if (challenge.isParticipated) {
        window.location.replace('/#/dashboard');
      } else {
        setRegisterModalView(true);
      }
    }
  }, []);
  let history = useHistory();

  const [modalView, setModalView] = useState(false);
  // const [registerModalView, setRegisterModalView] = useState(false);
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
  return (
    <div className={'challenge-card'} key={challenge.id}>
      <div
        onClick={() => {
          if (isLoggedIn()) {
            setRegisterModalView(true);
          } else {
            localStorage.setItem('challengeIDRegister', challenge.id);
            history.push('/login');
          }
        }}
      >
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
          <div className={'challenge-card-details-name'}>
            {challenge.challengeName}
          </div>
          <div className={'challenge-card-details-start-date-time'}>
            starts at{' '}
            {startTime?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
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

      {challenge.eventView !== 'LINKED' ? (
        <div className="register-button">
          <button
            onClick={() => {
              if (isLoggedIn()) {
                setRegisterModalView(true);
              } else {
                localStorage.setItem('challengeIDRegister', challenge.id);
                history.push('/login');
              }
            }}
          >
            {challenge.isParticipated ? 'REGISTERED' : ' Register'}
          </button>
        </div>
      ) : null}

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
          setUpcomingEventList={setUpcomingEventList}
          instruction_details={instruction_details}
        />
      )}
    </div>
  );
};

export default Card;
