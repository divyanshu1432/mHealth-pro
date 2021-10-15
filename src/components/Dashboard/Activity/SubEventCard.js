import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import EventInfoModal from '../../EventInfoModal';
import InfoIcon from '@material-ui/icons/Info';
import eventGalleryNoData from '../../../assets/eventGalleryNoData.jpeg';
import {getWeekDayByNumber} from '../../../utils/commonFunctions';
import InfoDialog from '../../Utility/InfoDialog';
import Message from 'antd-message';
import {CheckCircle} from 'react-feather';
import ReactStars from 'react-rating-stars-component';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar, facebook} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import StarRatings from 'react-star-ratings';

import CancelIcon from '@material-ui/icons/Cancel';

import {
  ratingProgramByUser,
  urlPrefix,
  getSubEvent,
} from '../../../services/apicollection';
import 'react-responsive-modal/styles.css';
import {Modal} from 'react-responsive-modal';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import {
  subscribeSubEventCall,
  unSubcribeSubEventCall,
} from '../../../services/challengeApi';
import message from 'antd-message';
import AddActivityModal from './AddActivityModal';
import getcoach from '../../../services/apicollection';
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

const SubEventCard = ({
  subEventDetail,
  currentEventObj,
  handleSubscription,
  type,
  handleSubEventSelection = () => {},
  selectedSubEvent,
  handleSubEventEdit,
}) => {
  const [modalView, setModalView] = useState(false);
  const [showUnsubscribeModal, setUnsubModal] = useState(false);
  const [activityModalView, setActivityModalView] = useState();

  let startDate = subEventDetail.eventStartDate
    ? subEventDetail.eventStartDate.split(' ')
    : '';
  let endDate = subEventDetail.eventEndDate
    ? subEventDetail.eventEndDate.split(' ')
    : '';
  let startDay = startDate[0].split('-')[2];
  let endDay = endDate[0].split('-')[2];
  let startMonth = monthsObject[startDate[0].split('-')[1]];
  let endMonth = monthsObject[endDate[0].split('-')[1]];

  console.log(subEventDetail);
  //NEW CODE ADDED FOR RATING

  //GET API CALLING

  const [actualData, setactualData] = useState([]);
  const [coach, setcoach] = useState({});

  // console.log(subEventDetail)

  // const xx = currentEventObj.id;
  // const alert = useAlert();
  // console.warn(currentEventObj)

  const avg = () => {
    var str = window.location.href;
    var getval = '/#/activities';
    var result = str.match(getval);

    if (result != '/#/activities') {
      return (
        <>
          <span style={{display: 'flex'}}>
            <StarRatings
              rating={parseFloat(subEventDetail.programRating)}
              starRatedColor="#ffd700"
              starDimension="15px"
              numberOfStars={5}
              name="rating"
              starSpacing="0px"
            />{' '}
            <span
              style={{
                fontSize: 12,
                marginTop: '2px',
                fontWeight: 'bolder',
                marginLeft: '5px',
              }}
            >
              {' '}
              {subEventDetail.programRating.toFixed(1)}{' '}
            </span>
          </span>
        </>
      );
    }
  };

  const renderRegisterBtn = () => {
    if (subEventDetail.timePeriod == 'PAST') {
      return (
        <div className="register-button">
          <button style={{background: '#9e9e9e'}}>Expired</button>
        </div>
      );
    } else {
      if (!subEventDetail?.participated) {
        if (subEventDetail?.regOpen) {
          return (
            <div className="register-button">
              <button
                style={{marginBottom: '10px'}}
                onClick={() =>
                  subscribeSubEventCall({
                    dataSource:
                      currentEventObj.dataSource === 'WHATSAPP'
                        ? 'WEB'
                        : currentEventObj.dataSource,
                    eventId: currentEventObj.id,
                    subEventId: subEventDetail.id,
                  }).then((res) => {
                    message.success('Program Subscribed');
                    handleSubscription();
                  })
                }
              >
                Subscribe
              </button>
            </div>
          );
        }
      } else {
        if (subEventDetail.userStatusInProgram === 'SUBSCRIBED') {
          return (
            <>
              {subEventDetail.eventNature === null ||
              subEventDetail.eventNature === 'GROUP' ? (
                <div className="register-button">
                  <button
                    onClick={() => setUnsubModal(true)}
                    style={{background: '#F43F5E', marginBottom: '10px'}}
                  >
                    Unsubscribe
                  </button>
                </div>
              ) : (
                <div className="register-button">
                  <button style={{background: 'green', marginBottom: '10px'}}>
                    Book
                  </button>
                </div>
              )}
            </>
          );
        }
        if (subEventDetail.userStatusInProgram === 'PENDING') {
          return (
            <div className="register-button">
              <button style={{background: '#ff9800', marginBottom: '10px'}}>
                Pending
              </button>
            </div>
          );
        }

        if (
          subEventDetail.userStatusInProgram == 'UNSUBSCRIBED' &&
          subEventDetail.canRejoin
        ) {
          return (
            <div className="register-button">
              <button
                onClick={() =>
                  subscribeSubEventCall({
                    dataSource:
                      currentEventObj.dataSource === 'WHATSAPP'
                        ? 'WEB'
                        : currentEventObj.dataSource,
                    eventId: currentEventObj.id,
                    subEventId: subEventDetail.id,
                    rejoin: true,
                  }).then((res) => {
                    message.success(res?.data?.response?.responseMessage);
                    handleSubscription();
                  })
                }
                style={{background: '#ffa726', marginBottom: '10px'}}
              >
                Rejoin
              </button>
            </div>
          );
        }
      }
    }
  };

  const renderJoinBtn = () => {
    if (subEventDetail.timePeriod == 'PAST') {
      return;
    }

    if (subEventDetail.registrationFees == 0) {
      if (
        subEventDetail.userStatusInProgram === 'SUBSCRIBED' &&
        subEventDetail.eventLink
      ) {
        return (
          <div
            style={{width: 'fit-content', fontSize: 12, marginBottom: '10px'}}
          >
            <a
              target="_blank"
              href={subEventDetail.eventLink}
              style={{
                color: '#fff',
                background: '#518ad6',
                borderRadius: 4,
                padding: '0px 4px',
              }}
            >
              Join
            </a>
          </div>
        );
      }
    } else {
      if (subEventDetail.userStatusInProgram === 'SUBSCRIBED') {
        return (
          <div
            style={{width: 'fit-content', fontSize: 12, marginBottom: '10px'}}
          >
            <a
              target="_blank"
              href={subEventDetail.eventLink}
              style={{
                color: '#fff',
                background: '#518ad6',
                borderRadius: 4,
                padding: '0px 4px',
              }}
            >
              Join
            </a>
          </div>
        );
      } else {
        if (subEventDetail.userStatusInProgram === 'PENDING') {
          return (
            <div
              style={{width: 'fit-content', fontSize: 12, marginBottom: '10px'}}
            >
              <a
                target="_blank"
                href={subEventDetail.paymentLink}
                style={{
                  color: '#fff',
                  background: '#518ad6',
                  borderRadius: 4,
                  padding: '0px 4px',
                }}
              >
                Pay Here
              </a>
            </div>
          );
        }
      }
    }
  };
  const getTime = (time) => {
    return (time && time.substr(0, 5)) || '';
  };

  // NEW CODE ENDED

  const closeIcon = (
    <svg fill="white" viewBox="0 0 20 20" width={28} height={28}>
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  const [open, setOpen] = useState(false);

  const onOpenModal = () => {
    setOpen(true);

    const getcdata = async () => {
      const url = `${urlPrefix}v1.0/searchAndViewCoachProfile?phoneNumber=${subEventDetail.coachPhoneNumber}`;
      const x = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          timeStamp: 'timestamp',
          accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          withCredentials: true,
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'accept, content-type, x-access-token, x-requested-with',
        },
      });
      const datares = await x.json();
      //  const len = (datares.response.responseData.length - 1 );
      console.log(datares);
      setcoach(datares.response.responseData);
    };

    getcdata();
  };
  const onCloseModal = () => setOpen(false);

  return (
    <div
      className="challenge-card"
      style={
        type == 'view'
          ? {margin: '25px 5px', height: 'auto', cursor: 'default'}
          : {height: 'auto'}
      }
    >
      {/* <div className="rate_us text-center" style={{ height: '22px', background: 'white', border: 'none' }}>
        {rateUs()}
      </div> */}

      {subEventDetail.id == selectedSubEvent && type == 'manage' && (
        <CheckCircle
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
            color: '#518ad6',
          }}
        />
      )}
      <div key={subEventDetail.id}>
        <div onClick={() => handleSubEventSelection(subEventDetail)}>
          <div
            style={{
              width: 230,
              height: 100,
              borderRadius: '12px 12px 0px 0px',
              background: '#fff',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={subEventDetail.eventImage || eventGalleryNoData}
              style={{
                width: 230,
                height: 100,
                objectFit: 'cover',
                borderRadius: '12px 12px 0px 0px',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = eventGalleryNoData;
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 5,
                fontSize: 12,
                color: '#fff',
                left: 5,
              }}
            >
              <span
                style={{
                  background: '#43a047',
                  borderRadius: 4,
                  padding: '0px 4px',
                  marginLeft: 5,
                }}
              >
                {subEventDetail.registrationFees == 0
                  ? 'Free'
                  : `Fees : ${subEventDetail.registrationFees}`}
              </span>
            </div>
          </div>
          <div className="challenge-card-details">
            <div className={'challenge-card-details-name'}>
              {subEventDetail.eventName}
            </div>

            <div className="d-flex" style={{fontSize: 12}}>
              <span>
                {' '}
                Coach:{' '}
                <span
                  onClick={() => {
                    onOpenModal(), (window.value = subEventDetail.id);
                  }}
                  style={{cursor: 'pointer', textDecoration: 'underline'}}
                >
                  {' '}
                  {subEventDetail.coach}
                </span>{' '}
              </span>
              <Modal
                open={open}
                styles={{modal: {borderRadius: '10px', maxWidth: '600px'}}}
                onClose={onCloseModal}
                center
                closeIcon={closeIcon}
              >
                <CancelIcon
                  style={{
                    position: 'absolute',
                    top: 15,
                    right: 5,
                    color: '#ef5350',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    padding: '20px',
                    paddingLeft: '5px',
                    paddingBottom: '0px',
                    paddingTop: '10px',
                  }}
                >
                  <div
                    className="header"
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    <img
                      src={coach.coachImage}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: '100%',
                        marginTop: '20px',
                      }}
                    />

                    <h1
                      style={{
                        marginLeft: '100px',
                        marginTop: '50px',
                        lineHeight: '0px',
                      }}
                    >
                      {' '}
                      {coach.coachName}
                      <h6 style={{fontWeight: 'lighter'}}>
                        {' '}
                        Experience : {coach.totalExperience}{' '}
                      </h6>
                    </h1>
                  </div>
                </div>
                <hr />
                <div style={{marginBottom: '20px'}}>
                  <div
                    className="specialization"
                    style={{lineHeight: '5px', marginTop: '20px'}}
                  >
                    <h4 style={{fontSize: '10px'}}> Specialization </h4>
                    <h5 style={{fontWeight: 'lighter'}}>
                      {' '}
                      {coach.specialization}{' '}
                    </h5>
                  </div>

                  <div
                    className="specialization"
                    style={{lineHeight: '5px', marginTop: '20px'}}
                  >
                    {/* <h4> Total Experience </h4>
                  <h4 style={{fontWeight:'lighter' }}> {coach.totalExperience} </h4>
                  </div>  */}

                    <div
                      className="specialization"
                      style={{lineHeight: '5px', marginTop: '20px'}}
                    >
                      <h4> Language Known </h4>
                      <h4 style={{fontWeight: '200'}}>
                        {' '}
                        {coach.languagesKnow}{' '}
                      </h4>
                    </div>
                    <div
                      className="bio"
                      style={{
                        lineHeight: '5px',
                        marginTop: '20px',
                        maxWidth: '500px',
                      }}
                    >
                      <h4> Bio </h4>
                      <div style={{fontWeight: 'lighter', lineHeight: '22px'}}>
                        {' '}
                        {coach.shortBio}{' '}
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </Modal>
            </div>

            <div className="d-flex" style={{fontSize: 12, fontWeight: 700}}>
              {subEventDetail.weekDays && Array.isArray(subEventDetail.weekDays)
                ? subEventDetail.weekDays.map((val, index) => (
                    <div
                      style={{
                        marginRight: '0.25em',
                      }}
                      key={index}
                    >
                      {getWeekDayByNumber(val)}
                      {index !== subEventDetail.weekDays.length - 1 && ','}
                    </div>
                  ))
                : null}
            </div>

            <div className="d-flex">
              <div
                className={'challenge-card-details-start-date-time'}
                style={{color: '#000', fontWeight: 700}}
              >
                {getTime(subEventDetail.eventStartTime)}-
                {getTime(subEventDetail.eventEndTime)}
              </div>
            </div>
            {avg()}
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
              src={subEventDetail.sponsorImage}
              className="avatar-component sponser-logo"
            />
          </div>
        </div>

        {type == 'view' && renderRegisterBtn()}

        {localStorage.getItem('role') &&
        localStorage.getItem('role') !== 'Customer' &&
        type !== 'view' ? (
          <div className="register-button">
            <button onClick={() => handleSubEventEdit(subEventDetail)}>
              Edit
            </button>
          </div>
        ) : null}

        <div className="challenge-card-start-date">
          <div
            className="challenge-card-start-date-month"
            style={{color: '#000'}}
          >
            {startMonth} - {endMonth}
          </div>
          <div className="challenge-card-start-date-day">
            {startDay} - {endDay}
          </div>
          <a
            onClick={() => setModalView(true)}
            style={{position: 'absolute', top: 0, right: 0}}
          >
            <InfoIcon style={{fontSize: 18, color: '#1e88e5'}} />
          </a>

          {renderJoinBtn()}
        </div>

        {modalView && (
          <EventInfoModal
            challenge={subEventDetail}
            type="program"
            modalView={modalView}
            setModalView={setModalView}
            setActivityModalView={setActivityModalView}
            actualData={actualData}
          />
        )}

        {activityModalView?.status && (
          <AddActivityModal
            challenge={subEventDetail}
            type={activityModalView?.type}
            modalView={activityModalView?.status}
            setModalView={setActivityModalView}
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
                  unSubcribeSubEventCall({
                    eventId: currentEventObj.id,
                    subEventId: subEventDetail.id,
                  }).then((res) => {
                    handleSubscription();
                    message.success('Program Unsubscribed.');
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
    </div>
  );
};

export default SubEventCard;
