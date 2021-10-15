import React, {useState, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import CancelIcon from '@material-ui/icons/Cancel';
import ReactLoadingWrapper from './loaders/ReactLoadingWrapper';
import Message from 'antd-message';
import DatePicker from './DatePicker';
import {useHistory} from 'react-router-dom';
import SubEventCard from './Dashboard/Activity/SubEventCard';
import {
  getActivitySubEvent,
  registerEvent,
  getOldEvents,
  sendSms,
  getAuthLink,
} from '../services/challengeApi';
import {checkForFalsy} from '../utils/commonFunctions';
import success from '../assets/success.svg';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorDialog from './ErrorDialog';
import {RefreshCcw} from 'react-feather';

import {getUserDetailsHandler} from '../services/userprofileApi';

const dataSourceMapping = {
  WHATSAPP: 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/whatsapp.svg',
  STRAVA: 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/strava.svg',
  GOOGLE_FIT:
    'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/googlefit.svg',
};

function getModalStyle() {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: '#fff',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    outline: 'none',
  };
}

export default function EventInfoModal({
  modalView,
  setModalView,
  challenge,
  setDashboardState,
  setUpcomingEventList,
  currentViewTab,
  instruction_details,
}) {
  const [modalStyle] = React.useState(getModalStyle);
  const [registerDetails, setRegisterDetails] = useState({
    eventId: '',
    dataSource: '',
    healthGoal: '',
    registrationSource: '',
    dob: undefined,
    gender: '',
    city: '',
    pinCode: '',
    emailId: '',
    state: '',
  });

  const [errorObj, setErrorObj] = useState({
    // emailId: false,
    dataSource: false,
    // healthGoal: false,
    // state: false,
    // city: false,
    // pinCode: false,
    // gender: false,
    // dob: false,
  });

  const [dataSourceList, setDataSourceList] = useState([]);

  const checkAuthorizedSources = () =>
    getUserDetailsHandler().then((res) => {
      let connectedSources =
        res.data.response &&
        res.data.response.responseData &&
        res.data.response.responseData.authorizedDatasource
          ? res.data.response.responseData.authorizedDatasource
          : [];

      Promise.all(
        connectedSources.map((item) => getAuthLink(item.dataSource))
      ).then((promiseRes) => {
        let testArray = promiseRes.map((el, index) => {
          let newObj = {};
          if (connectedSources[index]) {
            newObj = {...connectedSources[index]};
          }
          if (newObj['dataSource'] == 'WHATSAPP') {
            newObj['authorized'] = true;
          }
          newObj['authLink'] =
            el.data.response.responseMessage === 'SUCCESS' &&
            el.data.response.responseData &&
            el.data.response.responseData.authorizationLink
              ? el.data.response.responseData.authorizationLink
              : undefined;
          return newObj;
        });
        setDataSourceList(testArray);
      });
    });

  useEffect(() => {
    setRegisterDetails({
      eventId: undefined,
      dataSource: 'WHATSAPP',
      healthGoal: undefined,
      registrationSource: 'WEB',
      dob: checkForFalsy(localStorage.dob) ? undefined : localStorage.dob,
      gender: checkForFalsy(localStorage.gender)
        ? undefined
        : localStorage.gender,
      city: checkForFalsy(localStorage.city) ? undefined : localStorage.city,
      pinCode: checkForFalsy(localStorage.pinCode)
        ? undefined
        : localStorage.pinCode,
      emailId: checkForFalsy(localStorage.emailId)
        ? undefined
        : localStorage.emailId,
      state: checkForFalsy(localStorage.state) ? undefined : localStorage.state,
    });

    checkAuthorizedSources();
  }, [localStorage]);

  const [isRegisteredLoader, setRegisteredLoader] = useState(false);
  const [successLinkStatus, setSuccessLinkStatus] = useState(
    challenge.isParticipated ?? false
  );

  const [showDialog, setShowDialog] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => {
    getOldEvents().then((res) => {
      if (res.data.response.responseMessage === 'SUCCESS') {
        let event = res.data.response.responseData?.keyword.eventId;
        let allChallengeData = res.data.response.responseData.events;

        if (setDashboardState) {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              listOfChallenges: allChallengeData.filter((item) => {
                if (
                  challenge.timePeriod.toUpperCase() === 'CURRENT' ||
                  currentViewTab == 'current'
                ) {
                  return item.isActive == 1 &&
                    item.timePeriod !== 'FUTURE' &&
                    item.isParticipated
                    ? true
                    : event !== null
                    ? (item.eventView !== 'LINKED' &&
                        item.eventView !== 'PRIVATE') ||
                      (item.id == event && item.timePeriod === 'FUTURE') ||
                      (item.id == event && item.timePeriod === 'CURRENT')
                    : item.eventView !== 'PRIVATE' &&
                      item.timePeriod !== 'FUTURE';
                } else {
                  return item.isActive == 1 &&
                    item.timePeriod === 'FUTURE' &&
                    item.isParticipated
                    ? true
                    : event !== null
                    ? (item.eventView !== 'LINKED' &&
                        item.eventView !== 'PRIVATE') ||
                      (item.id == event && item.timePeriod === 'FUTURE') ||
                      (item.id == event && item.timePeriod === 'CURRENT')
                    : item.eventView !== 'PRIVATE' &&
                      item.timePeriod === 'FUTURE';
                }
              }),
            };
          });
        }
        if (setUpcomingEventList) {
          setUpcomingEventList(
            allChallengeData.filter((item) => {
              return item.isActive == 1 && item?.regOpen;
            })
          );
        }
      }
    });

    setModalView(false);
  };

  const validateFields = () => {
    const errorObj = {
      emailId: false,
      dataSource: false,
      healthGoal: false,
      state: false,
      city: false,
      pinCode: false,
      gender: false,
      dob: false,
    };
    [
      // 'emailId',
      'dataSource',
      // 'healthGoal',
      // 'state',
      // 'city',
      // 'pinCode',
      // 'gender',
      // 'dob',
    ].forEach((type) => {
      if (checkForFalsy(registerDetails[type])) errorObj[type] = true;
    });
    setErrorObj(errorObj);

    return !Object.values(errorObj).filter((v) => v).length > 0;
  };

  // alert(window.location.href)

  // NEW CODE FROM HERE

  const handel = () => {
    const str = window.location.href;
    const link = str.substring(0, 22);
    if (link == 'https://global.mhealth') {
      console.log('whegdwdh  ' + challenge.id);
      const arr = [challenge.id];
      console.log(arr);
      window.message = Message;
      const payload = {
        eventId: parseInt(challenge.id),
        dataSource: 'WHATSAPP',
        // healthGoal: registerDetails.healthGoal,

        registrationSource: 'WEB',
        // dob: registerDetails.dob,
        // gender: registerDetails.gender,
        // city: registerDetails.city,
        // pinCode: parseInt(registerDetails.pinCode),
        // emailId: registerDetails.emailId,
        // state: registerDetails.state,
      };
      if (!validateFields()) {
        return;
      }
      // setRegisteredLoader(true);
      registerEvent(payload)
        .then((res) => {
          if (res.data.response.responseCode === 0) {
            sendSms({
              eventName: challenge.challengeName,
              mobileNumber: localStorage.mobileNumber,
            });

            setSuccessLinkStatus(true);
            getActivitySubEvent(challenge.id, payload);
            location.reload();
          } else {
            // setErrorMsg(res.data.response.responseMessage);
            // setShowDialog(true);
          }
          setRegisteredLoader(false);
        })

        .catch((err) => {
          message.error('Something went wrong!');
          setRegisteredLoader(false);
        });
      //   getActivitySubEvent(challenge.id  , payload)
      //  window.open('http://localhost:3000/#/dashboard')
    }
  };

  // NEW CODE END FROM HERE

  const render = () => {};

  const handleSubmit = () => {
    console.log(registerDetails.dataSource);

    window.message = Message;
    const payload = {
      eventId: parseInt(challenge.id),
      dataSource: registerDetails.dataSource,
      // healthGoal: registerDetails.healthGoal,

      registrationSource: 'WEB',
      // dob: registerDetails.dob,
      // gender: registerDetails.gender,
      // city: registerDetails.city,
      // pinCode: parseInt(registerDetails.pinCode),
      // emailId: registerDetails.emailId,
      // state: registerDetails.state,
    };
    if (!validateFields()) {
      return;
    }
    setRegisteredLoader(true);

    registerEvent(payload)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          message.success('Successfully Registered!');
          localStorage.removeItem('challengeIDRegister');

          sendSms({
            eventName: challenge.challengeName,
            mobileNumber: localStorage.mobileNumber,
          });

          setSuccessLinkStatus(true);
          getActivitySubEvent(challenge.id, payload);
          // location.reload()
        } else {
          setErrorMsg(res.data.response.responseMessage);
          setShowDialog(true);
        }
        setRegisteredLoader(false);
      })
      .catch((err) => {
        message.error('Something went wrong!');
        setRegisteredLoader(false);
      });
  };

  const handleInputChange = (type, value) => {
    setRegisterDetails({
      ...registerDetails,
      [type]: value,
    });
  };

  const handleDataSourceChange = (type, value, sourceActive) => {
    if (sourceActive || value === 'WHATSAPP') {
      setRegisterDetails({
        ...registerDetails,
        [type]: value,
      });
    }
  };

  const modalBody = (
    <div
      style={modalStyle}
      className={'registration-modal'}
      onLoad={() => handel()}
    >
      <div className="heading">Register Challenge</div>
      <div className="basic-info-container">
        <div className="basic-info register-form">
          {/* <div className="mhealth-input-box padding-025em">
            <div>
              <label>Email ID</label>
              {errorObj.emailId && <p className="error-text">Please input</p>}
            </div>
            <input
              style={{border: errorObj.emailId ? '1px solid red' : 0}}
              placeholder="Enter email id"
              value={
                checkForFalsy(registerDetails.emailId)
                  ? ''
                  : registerDetails.emailId
              }
              onChange={(e) => handleInputChange('emailId', e.target.value)}
              disabled={
                localStorage.getItem('emailId') != null &&
                localStorage.getItem('emailId') != undefined &&
                localStorage.getItem('emailId') != 'null' &&
                localStorage.getItem('emailId') != 'undefined'
              }
            />
          </div> */}
          <div className="mhealth-input-box padding-025em">
            <div>
              <label style={{display: 'flex', justifyContent: 'space-between'}}>
                Data Source
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  onClick={() => checkAuthorizedSources()}
                >
                  <RefreshCcw size={12} style={{marginRight: 3}} />
                  Refresh
                </div>
              </label>
              {errorObj.dataSource && (
                <p className="error-text">Please select</p>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 5,
                flexWrap: 'wrap',
              }}
            >
              {Object.entries(dataSourceMapping).map((item) => {
                let currentSource = dataSourceList.filter(
                  (source) => source.dataSource === item[0]
                )[0];
                let currentSourceStatus =
                  currentSource && currentSource['authorized']
                    ? 'connected'
                    : 'connect';
                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: 10,
                    }}
                  >
                    <Tooltip
                      title={
                        currentSourceStatus == 'connect' &&
                        item[0] !== 'WHATSAPP'
                          ? 'Source not authorized. Please click Authorize'
                          : ''
                      }
                    >
                      <div
                        style={{
                          display: 'flex',
                          cursor:
                            currentSourceStatus == 'connect' &&
                            item[0] !== 'WHATSAPP'
                              ? 'not-allowed'
                              : 'pointer',
                          background:
                            currentSourceStatus == 'connect' &&
                            item[0] !== 'WHATSAPP'
                              ? '#eeeeee'
                              : '#fff',
                          padding: 3,
                          borderRadius: 4,
                          flexShrink: 0,
                          alignItems: 'center ',
                          cursor:
                            currentSourceStatus == 'connect' &&
                            item[0] !== 'WHATSAPP'
                              ? 'not-allowed'
                              : 'pointer',
                          border:
                            currentSourceStatus == 'connect' &&
                            item[0] !== 'WHATSAPP'
                              ? 'none'
                              : '',
                          userSelect: 'none',
                        }}
                        onClick={() =>
                          handleDataSourceChange(
                            'dataSource',
                            item[0],
                            currentSourceStatus != 'connect'
                          )
                        }
                        key={item[0]}
                        className={
                          registerDetails.dataSource === item[0]
                            ? 'datasource-image datasource-image-active'
                            : 'datasource-image'
                        }
                      >
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                          <div style={{fontSize: 12}}>
                            {item[0] === 'GOOGLE_FIT' ? 'GOOGLE FIT' : item[0]}
                          </div>
                        </div>
                        <img
                          src={item[1]}
                          key={item[0]}
                          style={{
                            marginLeft: 5,
                            height: 25,
                          }}
                        />
                      </div>
                    </Tooltip>
                    <div style={{fontSize: 10, cursor: 'pointer'}}>
                      {currentSourceStatus == 'connect' &&
                      item[0] !== 'WHATSAPP' ? (
                        <a href={currentSource?.authLink} target={'_blank'}>
                          {' '}
                          Authorize
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* <div className="mhealth-input-box padding-025em">
            <div>
              <label>
                What motivates you to join this Challenge/ Community ?
              </label>
              {errorObj.healthGoal && (
                <p className="error-text">Please input</p>
              )}
            </div>
            <input
              placeholder="Enter here"
              value={registerDetails.healthGoal}
              onChange={(e) => handleInputChange('healthGoal', e.target.value)}
              style={{border: errorObj.healthGoal ? '1px solid red' : 0}}
            />
          </div> */}
          {/* <div
            className="mhealth-input-box padding-025em"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{width: '50%'}}>
              <div>
                <label style={{fontSize: 14}}>State</label>
                {errorObj.state && <p className="error-text">Please input</p>}
              </div>
              <input
                placeholder="Enter state"
                value={registerDetails.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={
                  localStorage.getItem('state') != null &&
                  localStorage.getItem('state') != undefined &&
                  localStorage.getItem('state') != 'null' &&
                  localStorage.getItem('state') != 'undefined'
                }
                style={{border: errorObj.state ? '1px solid red' : 0}}
              />
            </div>
            <div style={{width: '50%', marginLeft: '2em'}}>
              <div>
                <label style={{fontSize: 14}}>City</label>
                {errorObj.city && <p className="error-text">Please input</p>}
              </div>
              <input
                placeholder="Enter city"
                value={registerDetails.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={
                  localStorage.getItem('city') != null &&
                  localStorage.getItem('city') != undefined &&
                  localStorage.getItem('city') != 'null' &&
                  localStorage.getItem('city') != 'undefined'
                }
                style={{border: errorObj.city ? '1px solid red' : 0}}
              />
            </div>
          </div> */}

          {/* <div
            className="mhealth-input-box padding-025em"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{width: '50%'}}>
              <div>
                <label style={{fontSize: 14}}>PinCode</label>
                {errorObj.pinCode && <p className="error-text">Please input</p>}
              </div>
              <input
                placeholder="Enter PinCode"
                value={registerDetails.pinCode}
                onChange={(e) => handleInputChange('pinCode', e.target.value)}
                disabled={
                  localStorage.getItem('pinCode') != null &&
                  localStorage.getItem('pinCode') != undefined &&
                  localStorage.getItem('pinCode') != 'null' &&
                  localStorage.getItem('pinCode') != 'undefined'
                }
                style={{border: errorObj.pinCode ? '1px solid red' : 0}}
              />
            </div>
            <div style={{width: '50%', marginLeft: '2em'}}>
              <div>
                <label style={{fontSize: 14}}>Gender</label>
                {errorObj.gender && <p className="error-text">Please select</p>}
              </div>
              <select
                name="gender"
                value={registerDetails.gender}
                style={{border: errorObj.gender ? '1px solid red' : 0}}
                disabled={
                  localStorage.getItem('gender') != null &&
                  localStorage.getItem('gender') != undefined &&
                  localStorage.getItem('gender') != 'null' &&
                  localStorage.getItem('gender') != 'undefined'
                }
                onChange={(e) => {
                  handleInputChange('gender', e.target.value);
                }}
              >
                <option value={undefined}>--Select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div> */}
          {/* <div
            className="mhealth-input-box padding-025em"
            style={
              localStorage.getItem('dob') != null &&
              localStorage.getItem('dob') != undefined &&
              localStorage.getItem('dob') != 'null' &&
              localStorage.getItem('dob') != 'undefined'
                ? {pointerEvents: 'none'}
                : {}
            }
          >
            <label>Date of birth (YYYY-MM-DD)</label>

            <DatePicker
              placeholder="Enter your Date of birth"
              value={registerDetails.dob}
              onChange={(e) => handleInputChange('dob', e)}
              disabled={
                localStorage.getItem('dob') != null &&
                localStorage.getItem('dob') != undefined &&
                localStorage.getItem('dob') != 'null' &&
                localStorage.getItem('dob') != 'undefined'
              }
            />
          </div> */}
          <div className="submit-button">
            {isRegisteredLoader ? (
              <div className="loader">
                <ReactLoadingWrapper
                  color={'#518ad6'}
                  height={'10%'}
                  width={'10%'}
                  type={'spin'}
                />
              </div>
            ) : (
              <button
                className="is-success"
                onClick={() => handleSubmit()}
                style={{marginBottom: 15}}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      <CancelIcon
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          color: '#ef5350',
          cursor: 'pointer',
        }}
        onClick={() => handleClose()}
      />
    </div>
  );

  const getMessage = () => {
    const str = window.location.href;
    const link = str.substring(0, 22);
    if (link != 'https://global.mhealth') {
      if (instruction_details) {
        return (
          <div
            style={{padding: 10}}
            dangerouslySetInnerHTML={{
              __html: instruction_details[registerDetails.dataSource],
            }}
          ></div>
        );
      }
    }
  };

  const registrationLinkModalBody = (
    <div style={modalStyle} className={'registration-modal '}>
      <div style={{position: 'relative'}}>
        <div
          className="heading"
          style={{textAlign: 'center', marginTop: '1em', fontSize: 16}}
        >
          Successfully Registered
        </div>
        <div
          className="basic-info-container"
          style={{paddingBottom: 40, flexDirection: 'column'}}
        >
          <div className="display-column" style={{alignItems: 'center'}}>
            <img src={success} width={300} />
          </div>
          {getMessage(challenge.dataSource)}
        </div>
      </div>
      <CancelIcon
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          color: '#ef5350',
          cursor: 'pointer',
        }}
        onClick={() => handleClose()}
      />
    </div>
  );

  // const rend = () => {
  //   const str = window.location.href;
  //   const link = str.substring(0, 21);
  //   if(link != 'http://localhost:3000'){
  return (
    <div>
      <Modal
        open={modalView}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        disableAutoFocus
        disableBackdropClick={true}
      >
        {!successLinkStatus ? (
          <div className="invisible"> {modalBody}</div>
        ) : (
          <div style={{outline: 'none'}}> {registrationLinkModalBody}</div>
        )}
      </Modal>
      {showDialog && (
        <ErrorDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          message={errorMsg}
        />
      )}
    </div>
  );
  // }
  // }
  // useEffect(() => {
  //   rend();
  // } , [])
}
