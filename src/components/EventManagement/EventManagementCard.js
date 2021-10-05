import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import EventInfoModal from '../EventInfoModal';
import InfoIcon from '@material-ui/icons/Info';

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

const EventManagementCard = ({
  challenge,
  getUserDetailsWrapper,
  selectedEvent,
  handleEventEdit,
}) => {
  const [modalView, setModalView] = useState(false);
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
    <div
      className={
        selectedEvent?.id == challenge.id
          ? 'challenge-card challenge-card-first'
          : 'challenge-card'
      }
      key={challenge.id}
      style={{marginBottom: 40}}
    >
      <div onClick={() => getUserDetailsWrapper(challenge)}>
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
              selectedEvent?.id == challenge.id
                ? 'challenge-card-details-name challenge-card-details-name-first'
                : 'challenge-card-details-name'
            }
          >
            {challenge.challengeName}
          </div>

          <div
            className={
              selectedEvent?.id == challenge.id
                ? 'challenge-card-details-start-date-time challenge-card-details-start-date-time-first'
                : 'challenge-card-details-start-date-time'
            }
          >
            starts at{' '}
            {startTime?.toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </div>
          {/* <div
            className={
              selectedEvent?.id == challenge.id
                ? 'challenge-card-registration-code-name-first'
                : 'challenge-card-registration-code'
            }
            style={{maxWidth: 100}}
          >
            Code:
            <span style={{fontSize: 8}}>{challenge.registrationCode}</span>
          </div> */}
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

      <div className="challenge-card-start-date" style={{bottom: '-40px'}}>
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
      {localStorage.getItem('role') &&
      localStorage.getItem('role') !== 'Customer' &&
      challenge.isActive &&
      challenge.timePeriod !== 'PAST' ? (
        <div className="register-button">
          <button onClick={() => handleEventEdit(challenge)}>Edit</button>
        </div>
      ) : null}
      {modalView && (
        <EventInfoModal
          challenge={challenge}
          modalView={modalView}
          setModalView={setModalView}
        />
      )}
    </div>
  );
};

export default EventManagementCard;
