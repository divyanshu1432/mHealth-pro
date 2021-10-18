import React, {useState, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DatePicker from '../DatePicker';
import CancelIcon from '@material-ui/icons/Cancel';
import {checkForFalsy} from '../../utils/commonFunctions';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {PlusCircle, Copy} from 'react-feather';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {getcoach, urlPrefix, getAllCoahes} from '../../services/apicollection';
import {createOrUpdateEventSubEvent} from '../../services/challengeApi';
import InfoDialog from '../Utility/InfoDialog';

import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';

function getModalStyle() {
  const top = 65;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '90%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    outline: 'none',
    maxHeight: 1200,
    marginLeft: '195px',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const weekdaysConfig = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const reverseWeekdaysConfig = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const weekdaysArray = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const returnTransformedDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
const CreateActivityModal = ({
  visible,
  closeModal,
  setEditActivityObject,
  editActivityObject,
  eventsList,
  fetchSubEvents,
}) => {
  const [actualData, setactualData] = useState([]);

  // console.warn(actualData)

  const [loading, setLoading] = useState(false);
  const [eventObject, setEventObject] = useState({
    eventDescription: undefined,
    rules: undefined,
    reward: undefined,
    registrationStartDate: returnTransformedDate(Date.now()),
    registrationEndDate: returnTransformedDate(Date.now()),
    eventStartDate: returnTransformedDate(Date.now()),
    eventEndDate: returnTransformedDate(Date.now()),
    activationCode: undefined,
    eventModerator: 191,
    eventType: undefined,
    registrationFees: undefined,
    eventInfo: undefined,
    termAndConditions: undefined,
    subscriptionDetails: undefined,
    eventName: undefined,
    weekDays: undefined,
    linkedEvents: undefined,
    eventStartTime: '07:00:00',
    eventEndTime: '08:30:00',
    eventLink: undefined,
    subEventMode: undefined,
    paymentLink: undefined,
    coach: undefined,
    totalSeat: undefined,
    onlineType: undefined,
    coachId: 1,
    sessionDuration: undefined,
    gapBetweenSession: undefined,
    eventNature: undefined,
  });

  const [mediaObj, setMediaObj] = useState({
    eventImage: undefined,
    sponsorImage: undefined,
  });
  // console.warn(editActivityObject)
  useEffect(() => {
    if (editActivityObject) {
      setEventObject({
        eventNature: editActivityObject.eventNature,
        sessionDuration: editActivityObject.sessionDuration,
        gapBetweenSession: editActivityObject.gapBetweenSession,
        coach: editActivityObject.coachId,
        onlineType: editActivityObject.onlineType,
        coachId: editActivityObject.coachId,
        eventName: editActivityObject.eventName,
        eventDescription: editActivityObject.eventDescription,
        rules: editActivityObject.rules,
        reward: editActivityObject.reward,
        registrationStartDate:
          editActivityObject.registrationStartDate.split(' ')[0],
        registrationEndDate:
          editActivityObject.registrationEndDate.split(' ')[0],
        eventStartDate: editActivityObject.eventStartDate,
        eventEndDate: editActivityObject.eventEndDate,
        activationCode: editActivityObject.activationCode,
        eventModerator: 191,
        eventType: editActivityObject.eventType,
        registrationFees: editActivityObject.registrationFees,
        eventInfo: editActivityObject.eventInfo,
        termAndConditions: editActivityObject.termAndConditions,
        weekDays: editActivityObject.weekDays?.map(
          (item) => reverseWeekdaysConfig[item]
        ),
        linkedEvents:
          editActivityObject.linkedEvents &&
          Array.isArray(editActivityObject.linkedEvents)
            ? editActivityObject.linkedEvents?.map((item) => {
                if (eventsList.filter((elm) => elm.id == item)[0]) {
                  return eventsList.filter((elm) => elm.id == item)[0][
                    'challengeName'
                  ];
                }
              })
            : [],
        subscriptionDetails: editActivityObject.subscriptionDetails,
        eventStartTime: editActivityObject.eventStartTime,
        eventEndTime: editActivityObject.eventEndTime,
        eventLink: editActivityObject.eventLink,
        subEventMode: editActivityObject.subEventMode,
        paymentLink: editActivityObject.paymentLink,
        instructorName: 'XYZ',
        totalSeat: editActivityObject.totalSeat,
        zoomMeetingId: editActivityObject.zoomMeetingId,
        activationLink: editActivityObject.activationLink,
      });
      setMediaObj({
        eventImage: editActivityObject.eventImage,
        sponsorImage: editActivityObject.sponsorImage,
      });
    }
  }, []);
  console.warn(eventObject, editActivityObject);
  const sponsorImageInputRef = React.createRef();
  const eventImageInputRef = React.createRef();

  const handleInputChange = (name, value) => {
    setEventObject((prevState) => {
      return {...prevState, [name]: value};
    });
  };

  const [Coaches, setCoaches] = useState('');
  const [coachData, setcoachData] = useState([]);

  const getcoachData = async () => {
    const url = `${urlPrefix}${getAllCoahes}`;
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
    setcoachData(datares.response.responseData);
    // setactualData(datares.response.responseData)
  };
  // console.log(editActivityObject)
  // console.warn(eventObject);
  const [SubEvent, setSubEvent] = useState([]);
  // const getSubEventData=async()=>{
  //   const url=`${urlPrefix}`
  // }
  useEffect(() => {
    getcoachData();
  }, []);

  // console.warn('coach  id ' + editActivityObject.coachId)

  const getcoachName = (id) => {
    var marvelHeroes = coachData.filter(function (hero) {
      const x = hero.id == id;
      return x;
    });

    console.log('erfehrbjf', id);

    setCoaches(marvelHeroes[0].coachName);
  };

  const [showUnsubscribeModal, setUnsubModal] = useState(false);
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);

  const [errorObj, setErrorObj] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  const getDisableStatus = () => {
    let disabled = false;
    if (activeStep == 1) {
      let checkObject = {...eventObject};
      delete checkObject.onlineType;
      delete checkObject.activationLink;
      delete checkObject.zoomMeetingId;

      disabled =
        Object.values(checkObject).includes(undefined) ||
        Object.values(checkObject).includes(null) ||
        Object.values(checkObject).includes('');
    }

    if (activeStep == 2) {
      disabled =
        Object.values(mediaObj).includes(undefined) ||
        Object.values(mediaObj).includes('');
    }
    return disabled;
  };

  const coaches = () => {};

  const [regMessage, setRegMessage] = useState({
    type: 'error',
    msg: '',
  });
  // console.log(eventObject)
  const handleSubmit = () => {
    setCoaches('');
    setRegMessage({
      type: 'error',
      msg: '',
    });
    if (!getDisableStatus()) {
      setLoading(true);
      if (activeStep == 1) {
        let payload = {};
        payload = {
          ...eventObject,
          registrationFees: parseFloat(eventObject.registrationFees),
          id: null,
          weekDays: eventObject.weekDays.map((item) => weekdaysConfig[item]),
          linkedEvents: eventObject.linkedEvents
            .filter((check) => check)
            .map((item) => {
              return eventsList.filter(
                (elm) =>
                  elm.isActive == 1 &&
                  elm.timePeriod !== 'PAST' &&
                  elm.challengeName == item
              )[0]['id'];
            }),
          totalSeat: parseFloat(eventObject.totalSeat),
        };

        if (editActivityObject?.id) {
          payload['id'] = editActivityObject?.id;
        }
        createOrUpdateEventSubEvent(payload, 'create').then((res) => {
          setLoading(false);
          if (
            res.data.mhealthResponseMessage == 'SUCCESS' &&
            res.data.response &&
            res.data.response.responseData
          ) {
            setRegMessage({
              type: 'success',
              msg: res.data.response.responseMessage,
            });
            setActiveStep(2);
            if (!payload?.id) {
              setEditActivityObject({
                ...payload,
                id: res.data.response.responseData?.id,
                weekDays: payload.weekDays.map(
                  (item) => reverseWeekdaysConfig[item]
                ),
                linkedEvents: payload.linkedEvents.map((item) => {
                  return eventsList.filter((elm) => elm.id == item)[0][
                    'challengeName'
                  ];
                }),
              });
            }
          } else {
            setRegMessage({
              type: 'error',
              msg: res.data.response.responseMessage,
            });
          }
          fetchSubEvents();
        });
      }

      if (activeStep == 2) {
        let formData = new FormData();
        Object.entries(mediaObj).map((item) => {
          formData.append(item[0], item[1]);
        });
        createOrUpdateEventSubEvent(formData, 'image', editActivityObject?.id)
          .then((res) => {
            setLoading(false);
            setRegMessage({
              type: 'success',
              msg: res.data.response.responseMessage,
            });
            fetchSubEvents();
          })
          .catch((err) => {
            setLoading(false);
            setRegMessage({
              type: 'error',
              msg: 'Images updation failed',
            });
          });
      }
    } else {
      let newErrorObj = {};
      Object.entries(eventObject).map((item) => {
        // console.warn(item.onlineType)

        if (item[1] == undefined || item[1] == '') {
          newErrorObj[item[0]] = true;
        }
      });

      Object.entries(mediaObj).map((item) => {
        if (!item[1]) {
          newErrorObj[item[0]] = true;
        }
      });
      setErrorObj(newErrorObj);
    }
  };
  // console.log(eventObject.coach)
  // console.log(errorObj)
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div
        className="heading"
        style={{
          marginTop: 0,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Create Program {'>'}
        <Stepper activeStep={activeStep} style={{padding: 0}}>
          <Step
            key={1}
            onClick={() => setActiveStep(1)}
            style={{cursor: 'pointer'}}
          >
            <StepLabel>Details</StepLabel>
          </Step>
          <Step
            key={2}
            onClick={() => {
              if (editActivityObject?.id) {
                setActiveStep(2);
              }
            }}
            style={{cursor: 'pointer'}}
          >
            <StepLabel>Program Media</StepLabel>
          </Step>
        </Stepper>
      </div>
      <div
        className="basic-info-container"
        style={{overflow: 'auto', maxHeight: 1500}}
      >
        <div className="basic-info register-form">
          {activeStep == 1 && (
            <>
              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%', display: 'flex'}}>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Program Name</label>
                      {errorObj.eventName &&
                      eventObject.eventName === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ''
                      )}
                    </div>
                    {/* {regMessage.msg} */}
                    {/* {regMessage} */}
                    {/* {eventObject.eventName===undefined?( */}
                    <input
                      autofocus="autofocus"
                      style={{
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '85%',
                        border:
                          errorObj.eventType &&
                          eventObject.eventName === undefined
                            ? '1px solid red'
                            : 0,
                      }}
                      maxLength="30"
                      placeholder="Enter program name"
                      value={
                        checkForFalsy(eventObject.eventName)
                          ? ''
                          : eventObject.eventName
                      }
                      onChange={(e) =>
                        handleInputChange('eventName', e.target.value)
                      }
                    />
                    {console.log(handleInputChange)}
                  </div>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Program Type</label>
                      {errorObj.eventType &&
                      eventObject.eventType === undefined ? (
                        <p className="error-text">Please select</p>
                      ) : (
                        ''
                      )}
                    </div>
                    <select
                      name="type"
                      value={eventObject.eventType}
                      style={{
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '90%',
                        border:
                          errorObj.eventType &&
                          eventObject.eventType === undefined
                            ? '1px solid red'
                            : 0,
                      }}
                      onChange={(e) => {
                        handleInputChange('eventType', e.target.value);
                      }}
                    >
                      <option value={undefined}>Select program type</option>
                      <option value="YOGA">Yoga</option>
                      <option value="ZUMBA">Zumba</option>
                      <option value="FUN_DAY">Fun Day</option>
                      <option value="MEDITATION">Meditation</option>
                      <option value="HIIT">HIIT</option>
                      <option value="CONSULTATION">Consultation</option>
                      <option value="WELLNESS_CAMP"> Wellness Camp</option>
                      <option value="PLANK">Plank</option>
                      <option value="DANCE_FITNESS"> Dance Fitness</option>
                      <option value="MASTER_CLASS">Master Class</option>
                      <option value="VACCINATION_CAMP">Vaccination Camp</option>
                      <option value="DIET_NUTRITION">Diet Nutrition</option>
                      <option value="DANCE">Dance</option>
                      <option value="WALKING">Walking</option>
                      <option value="RUNNING">Running</option>
                      <option value="WELLNESS_PARTNER">Wellness Partner</option>
                      <option value="FITNESS_CLASS">Fitness Class</option>
                      <option value="AEROBICS">Aerobics</option>
                      <option value="BIKING">Biking</option>
                      <option value="HIKING">Hiking</option>
                      <option value="SWIMMING">Swimmming</option>
                      <option value="COOKING">Cooking</option>
                      <option value="ARTICLE">Article</option>
                      <option value="CYCLING">Cycling</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>
                </div>
                <div style={{width: '50%', display: 'flex'}}>
                  <div
                    style={{
                      width: '50%',
                    }}
                  >
                    <div>
                      <label style={{fontSize: 12}}>Schedule Program</label>
                    </div>
                    {errorObj.weekDays && eventObject.weekDays === undefined ? (
                      <p className="error-text">Please Select</p>
                    ) : (
                      ''
                    )}
                    <Select
                      labelId="demo-mutiple-chip-label"
                      id="demo-mutiple-chip"
                      multiple
                      value={eventObject.weekDays ? eventObject.weekDays : []}
                      onChange={(event) =>
                        setEventObject({
                          ...eventObject,
                          weekDays:
                            event.target.value.length > 0
                              ? event.target.value
                              : undefined,
                        })
                      }
                      input={<Input id="select-multiple-chip" />}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {weekdaysArray.map((day, index) => (
                        <MenuItem key={index} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{width: '100%', fontSize: 12}}>
                        Link Events
                      </label>
                      {errorObj.linkedEvents &&
                      eventObject.linkedEvents === undefined ? (
                        <p className="error-text">Please Select</p>
                      ) : (
                        ''
                      )}
                    </div>

                    <Select
                      style={{width: '100%'}}
                      labelId="demo-mutiple-chip-label"
                      id="demo-mutiple-chip"
                      multiple
                      value={
                        eventObject.linkedEvents ? eventObject.linkedEvents : []
                      }
                      onChange={(event) =>
                        setEventObject({
                          ...eventObject,
                          linkedEvents:
                            event.target.value.length > 0
                              ? event.target.value
                              : undefined,
                        })
                      }
                      input={<Input id="select-multiple-chip" />}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className={classes.chip}
                            />
                          ))}
                        </div>
                      )}
                      MenuProps={MenuProps}
                    >
                      {eventsList
                        .filter(
                          (item) =>
                            item.isActive == 1 && item.timePeriod !== 'PAST'
                        )
                        .map((currEvent, index) => (
                          <MenuItem key={index} value={currEvent.challengeName}>
                            {currEvent.challengeName}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                </div>
              </div>
              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%', display: 'flex'}}>
                  <div>
                    <div>
                      <label style={{fontSize: 12}}>
                        Registration Date (YYYY-MM-DD)
                      </label>
                      <div
                        style={{
                          display: 'flex',
                          // flexDirection: "row",
                          // width:"50%"
                        }}
                      >
                        <div style={{width: '50%'}}>
                          <span
                            style={{
                              display: 'flex',
                              // alignItems: "center",
                              width: '90%',
                            }}
                          >
                            Start:
                            <DatePicker
                              placeholder="Enter program start date"
                              disabled={false}
                              disablePast={editActivityObject ? false : true}
                              value={
                                checkForFalsy(eventObject.registrationStartDate)
                                  ? ''
                                  : eventObject.registrationStartDate
                              }
                              onChange={(e) =>
                                handleInputChange('registrationStartDate', e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                        <div style={{width: '50%'}}>
                          <span
                            style={{
                              // float:"right",
                              display: 'flex',
                              // alignItems: "center",
                              width: '90%',
                            }}
                          >
                            End:
                            <DatePicker
                              placeholder="Enter program start date"
                              disabled={false}
                              disablePast={editActivityObject ? false : true}
                              value={
                                checkForFalsy(eventObject.registrationEndDate)
                                  ? ''
                                  : eventObject.registrationEndDate
                              }
                              onChange={(e) =>
                                handleInputChange('registrationEndDate', e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{display: 'flex'}}>
                    <div style={{width: '50%'}}>
                      <div>
                        <label style={{fontSize: 12}}>Activation Code</label>
                        {errorObj.activationCode &&
                        eventObject.activationCode === undefined ? (
                          <p className="error-text">Please input</p>
                        ) : (
                          ''
                        )}
                      </div>
                      <input
                        style={{
                          border:
                            errorObj.activationCode &&
                            eventObject.activationCode === undefined
                              ? '1px solid red'
                              : 0,
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          width: '85%',
                        }}
                        placeholder="Enter activation code"
                        value={
                          checkForFalsy(eventObject.activationCode)
                            ? ''
                            : eventObject.activationCode
                        }
                        onChange={(e) =>
                          handleInputChange('activationCode', e.target.value)
                        }
                      />
                    </div>
                    <div style={{width: '50%'}}>
                      <label style={{fontSize: 12}}>Registration Fees</label>
                      {errorObj.registrationFees &&
                      eventObject.registrationFees === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ''
                      )}

                      <input
                        type="number"
                        placeholder="Enter price"
                        value={eventObject.registrationFees}
                        onChange={(e) =>
                          handleInputChange('registrationFees', e.target.value)
                        }
                        style={{
                          border:
                            errorObj.registrationFees &&
                            eventObject.registrationFees === undefined
                              ? '1px solid red'
                              : 0,
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          width: '92%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%', display: 'flex'}}>
                  <div>
                    <div>
                      <label style={{fontSize: 12}}>
                        Event Date (YYYY-MM-DD)
                      </label>
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <div style={{width: '50%'}}>
                          <span
                            style={{
                              display: 'flex',
                              width: '90%',
                            }}
                          >
                            Start:
                            <DatePicker
                              placeholder="Enter program start date"
                              disabled={false}
                              disablePast={editActivityObject ? false : true}
                              value={
                                checkForFalsy(eventObject.eventStartDate)
                                  ? ''
                                  : eventObject.eventStartDate
                              }
                              onChange={(e) =>
                                handleInputChange('eventStartDate', e)
                              }
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                        <div style={{width: '50%'}}>
                          <span
                            style={{
                              width: '90%',
                              display: 'flex',
                              // alignItems: "center"
                            }}
                          >
                            End:
                            <DatePicker
                              placeholder="Enter program start date"
                              disabled={false}
                              disablePast={editActivityObject ? false : true}
                              value={
                                checkForFalsy(eventObject.eventEndDate)
                                  ? ''
                                  : eventObject.eventEndDate
                              }
                              onChange={(e) =>
                                handleInputChange('eventEndDate', e)
                              }
                              label="End"
                              outlineVariantDisable={true}
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{width: '50%', display: 'flex'}}>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Program Link</label>
                      {errorObj.eventLink &&
                      eventObject.eventLink === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ''
                      )}
                    </div>
                    <input
                      style={{
                        border:
                          errorObj.eventLink &&
                          eventObject.eventLink === undefined
                            ? '1px solid red'
                            : 0,
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '85%',
                      }}
                      placeholder="Enter Program Link"
                      value={
                        checkForFalsy(eventObject.eventLink)
                          ? ''
                          : eventObject.eventLink
                      }
                      onChange={(e) =>
                        handleInputChange('eventLink', e.target.value)
                      }
                    />
                  </div>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>
                        Program Activation Link
                      </label>
                    </div>

                    <input
                      style={{
                        border:
                          errorObj.eventLink &&
                          eventObject.eventLink === undefined
                            ? '1px solid red'
                            : 0,
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '92%',
                      }}
                      placeholder="Enter activation Link"
                      value={
                        checkForFalsy(eventObject.activationLink)
                          ? ''
                          : eventObject.activationLink
                      }
                      onChange={(e) =>
                        handleInputChange('activationLink', e.target.value)
                      }
                      className="event-text-field"
                    />
                  </div>
                </div>
              </div>

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                  }}
                >
                  <div style={{width: '50%'}}>
                    <label style={{width: '100%', fontSize: 12}}>
                      Program Time
                    </label>
                    <div>
                      <TextField
                        id="time"
                        label="Start"
                        type="time"
                        value={eventObject.eventStartTime}
                        onChange={(event) =>
                          setEventObject({
                            ...eventObject,
                            eventStartTime: event.target.value,
                          })
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />

                      <TextField
                        style={{marginLeft: 30}}
                        id="time"
                        label="End"
                        type="time"
                        value={eventObject.eventEndTime}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                        onChange={(event) =>
                          setEventObject({
                            ...eventObject,
                            eventEndTime: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Program Mode</label>
                      {errorObj.subEventMode &&
                      eventObject.subEventMode === undefined ? (
                        <p className="error-text">Please Select</p>
                      ) : (
                        ''
                      )}
                    </div>

                    <RadioGroup
                      aria-label="subEventMode"
                      name="subEventMode"
                      value={
                        checkForFalsy(eventObject.subEventMode)
                          ? ''
                          : eventObject.subEventMode
                      }
                      onChange={(e) => {
                        handleInputChange('subEventMode', e.target.value);
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <FormControlLabel
                        value="OFFLINE"
                        control={<Radio />}
                        label="Offline"
                      />
                      <FormControlLabel
                        value="ONLINE"
                        control={<Radio />}
                        label="Online"
                      />
                    </RadioGroup>
                  </div>
                </div>
                <div style={{width: '50%', display: 'flex'}}>
                  <div style={{width: '20%'}}>
                    {eventObject.subEventMode === 'ONLINE' && (
                      <div
                        style={{
                          width: '85%',
                          marginLeft: '0',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div>
                          <label style={{fontSize: 12}}>Integration</label>
                        </div>
                        <select
                          style={{
                            background: '#f3f4f6',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            width: '100%',
                          }}
                          value={eventObject.onlineType}
                          onChange={(e) => {
                            handleInputChange('onlineType', e.target.value);
                          }}
                        >
                          <option value=""> select:- </option>
                          <option value="none"> None </option>

                          <option value="zoom"> Zoom </option>
                        </select>
                      </div>
                    )}

                    {/* set Instructor code */}

                    <InfoDialog
                      handleClose={() => setUnsubModal(false)}
                      open={showUnsubscribeModal}
                      title="Select coach"
                    >
                      <div class="main_div" style={{padding: '5px'}}>
                        <div className="event-unsubscribe-modal">
                          <button
                            className="is-success"
                            onClick={() => setUnsubModal(false)}
                            style={{
                              background: 'green',
                              width: 100,
                              height: 22,
                            }}
                          >
                            Set Coach
                          </button>
                        </div>
                      </div>
                    </InfoDialog>
                  </div>
                  <div style={{width: '20%'}}>
                    {/* {eventObject.subEventMode === "ONLINE" && ( */}
                    <div
                      style={{
                        width: '100%',
                        marginLeft: '0',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div>
                        <label style={{fontSize: 12}}>Program Type</label>
                      </div>
                      <select
                        style={{
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          width: '100%',
                        }}
                        value={eventObject.eventNature}
                        onChange={(e) => {
                          handleInputChange('eventNature', e.target.value);
                        }}
                      >
                        <option value=""> select:- </option>
                        <option value="INDIVIDUAL">Individual </option>

                        <option value="GROUP"> Group </option>
                      </select>
                    </div>
                    {/* )} */}

                    {/* set Instructor code */}
                  </div>
                  {eventObject.eventNature === 'INDIVIDUAL' && (
                    <div
                      style={{
                        width: '50%',
                        display: 'flex',
                        marginLeft: '70px',
                      }}
                    >
                      <div style={{width: '50%'}}>
                        <div>
                          <label style={{fontSize: 12}}>Duration</label>
                        </div>
                        <div
                          style={{
                            background: '#f3f4f6',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            width: '80%',
                          }}
                          // value={eventObject.onlineType}
                          // onChange={(e) => {
                          //   handleInputChange("onlineType", e.target.value);
                          // }}
                        >
                          <input
                            autofocus="autofocus"
                            style={{
                              background: '#f3f4f6',
                              padding: '6px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              width: '85%',
                            }}
                            placeholder="Enter Duration Time"
                            onChange={(e) =>
                              handleInputChange(
                                'sessionDuration',
                                e.target.value
                              )
                            }
                            value={eventObject.sessionDuration}
                          />
                        </div>
                      </div>
                      <div style={{width: '50%'}}>
                        <div>
                          <label style={{fontSize: 12}}>Gap</label>
                        </div>
                        <div
                          style={{
                            background: '#f3f4f6',
                            padding: '6px 10px',
                            borderRadius: 6,
                            fontSize: 12,
                            width: '80%',
                          }}
                          // value={eventObject.onlineType}
                          // onChange={(e) => {
                          //   handleInputChange("onlineType", e.target.value);
                          // }}
                        >
                          <input
                            autofocus="autofocus"
                            style={{
                              background: '#f3f4f6',
                              padding: '6px 10px',
                              borderRadius: 6,
                              fontSize: 12,
                              width: '85%',
                            }}
                            placeholder="Enter Gap Time"
                            onChange={(e) =>
                              handleInputChange(
                                'gapBetweenSession',
                                e.target.value
                              )
                            }
                            value={eventObject.gapBetweenSession}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%'}}>
                  <label>Description</label>
                  {errorObj.eventDescription &&
                  eventObject.eventDescription === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the description about the program"
                    style={{
                      width: '95%',
                      border:
                        errorObj.eventDescription &&
                        eventObject.eventDescription === undefined
                          ? '1px solid red'
                          : 0,
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.eventDescription)
                        ? ''
                        : eventObject.eventDescription
                    }
                    onChange={(e) =>
                      handleInputChange('eventDescription', e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>
                <div style={{width: '50%'}}>
                  <label style={{width: '100%'}}>Program Info</label>
                  {errorObj.eventInfo && eventObject.eventInfo === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the information about the program"
                    style={{
                      width: '100%',
                      border:
                        errorObj.eventInfo &&
                        eventObject.eventInfo === undefined
                          ? '1px solid red'
                          : 0,
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.eventInfo)
                        ? ''
                        : eventObject.eventInfo
                    }
                    onChange={(e) =>
                      handleInputChange('eventInfo', e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>
              </div>

              {/* ZOOM LINK ADDED HERE  */}

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%', display: 'flex'}}>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Zoom Id</label>
                    </div>
                    <input
                      type="number"
                      placeholder="Enter zoom id"
                      value={
                        checkForFalsy(eventObject.zoomMeetingId)
                          ? ''
                          : eventObject.zoomMeetingId
                      }
                      onChange={(e) =>
                        handleInputChange('zoomMeetingId', e.target.value)
                      }
                      className="event-text-field"
                      style={{
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '85%',
                      }}
                    />
                  </div>
                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Payment Link</label>
                      {errorObj.paymentLink &&
                      eventObject.paymentLink === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ''
                      )}
                    </div>
                    <input
                      style={{
                        border:
                          errorObj.paymentLink &&
                          eventObject.paymentLink === undefined
                            ? '1px solid red'
                            : 0,
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '85%',
                      }}
                      placeholder="Enter Payment Link"
                      value={
                        checkForFalsy(eventObject.paymentLink)
                          ? ''
                          : eventObject.paymentLink
                      }
                      onChange={(e) =>
                        handleInputChange('paymentLink', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div style={{width: '50%', display: 'flex'}}>
                  <div
                    style={{
                      width: '50%',
                    }}
                  >
                    <div>
                      <label style={{fontSize: 12}}>
                        Instructor Name :{Coaches}
                      </label>
                    </div>
                    {eventObject.coachId && (
                      <select
                        value={eventObject.coachId}
                        style={{
                          background: '#f3f4f6',
                          padding: '6px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          width: '92%',
                        }}
                        onChange={(e) => {
                          handleInputChange('coach', e.target.value),
                            getcoachName(e.target.value);
                          console.log(coachData);
                        }}
                      >
                        {coachData.map((currElem, index) => {
                          return (
                            <>
                              <option value={currElem.id}>
                                {' '}
                                {currElem.coachName}{' '}
                              </option>
                            </>
                          );
                        })}
                      </select>
                    )}

                    {errorObj.coach && eventObject.coach === undefined ? (
                      <p className="error-text">Please input</p>
                    ) : (
                      ''
                    )}

                    {/* <button
                        className="is-success"
                        onClick={() => setUnsubModal(true)}
                        style={{
                          marginTop: 0,
                          width: 100,
                          height: 22,
                          marginLeft: 0,
                        }}
                      >
                        set coach
                      </button> */}
                  </div>

                  <div style={{width: '50%'}}>
                    <div>
                      <label style={{fontSize: 12}}>Seat Count</label>
                      {errorObj.totalSeat &&
                      eventObject.totalSeat === undefined ? (
                        <p className="error-text">Please input</p>
                      ) : (
                        ''
                      )}
                    </div>

                    <input
                      type="number"
                      placeholder="Enter Seat Count"
                      value={
                        checkForFalsy(eventObject.totalSeat)
                          ? ''
                          : eventObject.totalSeat
                      }
                      onChange={(e) =>
                        handleInputChange('totalSeat', e.target.value)
                      }
                      style={{
                        border: 0,
                        background: '#f3f4f6',
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        width: '92%',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* ZOOM LINK CODE FINISHED */}

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%'}}>
                  <label>Rules</label>
                  {errorObj.rules && eventObject.rules === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the rules for the program"
                    style={{
                      width: '95%',
                      border:
                        errorObj.rules && eventObject.rules === undefined
                          ? '1px solid red'
                          : 0,
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.rules) ? '' : eventObject.rules
                    }
                    onChange={(e) => handleInputChange('rules', e.target.value)}
                    className="event-text-field"
                  />
                </div>
                <div style={{width: '50%'}}>
                  <label>Reward</label>
                  {errorObj.reward && eventObject.reward === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the reward for the program"
                    style={{
                      width: '100%',
                      border:
                        errorObj.reward && eventObject.reward === undefined
                          ? '1px solid red'
                          : 0,
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.reward)
                        ? ''
                        : eventObject.reward
                    }
                    onChange={(e) =>
                      handleInputChange('reward', e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>
              </div>

              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{width: '50%'}}>
                  <label>Terms and Conditions</label>
                  {errorObj.termAndConditions &&
                  eventObject.termAndConditions === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the terms and conditions for the program"
                    style={{
                      width: '95%',
                      border:
                        errorObj.termAndConditions &&
                        eventObject.termAndConditions === undefined
                          ? '1px solid red'
                          : 0,
                      border: '0px',
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.termAndConditions)
                        ? ''
                        : eventObject.termAndConditions
                    }
                    onChange={(e) =>
                      handleInputChange('termAndConditions', e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>

                <div style={{width: '50%'}}>
                  <label>Subscription Details</label>
                  {errorObj.subscriptionDetails &&
                  eventObject.subscriptionDetails === undefined ? (
                    <p className="error-text">Please input</p>
                  ) : (
                    ''
                  )}

                  <TextField
                    id="standard-basic"
                    placeholder="Enter the Subscription Details for the program"
                    style={{
                      width: '100%',
                      border:
                        errorObj.subscriptionDetails &&
                        eventObject.subscriptionDetails === undefined
                          ? '1px solid red'
                          : 0,
                      border: '0px',
                    }}
                    variant="outlined"
                    multiline
                    value={
                      checkForFalsy(eventObject.subscriptionDetails)
                        ? ''
                        : eventObject.subscriptionDetails
                    }
                    onChange={(e) =>
                      handleInputChange('subscriptionDetails', e.target.value)
                    }
                    className="event-text-field"
                  />
                </div>
              </div>
            </>
          )}

          {activeStep == 2 && (
            <>
              <div
                className="mhealth-input-box padding-025em"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginTop: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginRight: 20,
                  }}
                >
                  <label
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    Event Image{' '}
                    {mediaObj.eventImage && (
                      <span
                        style={{cursor: 'pointer', color: 'red'}}
                        onClick={() => {
                          setMediaObj({...mediaObj, eventImage: undefined});
                        }}
                      >
                        Delete
                      </span>
                    )}
                  </label>
                  {errorObj.eventImage && (
                    <p className="error-text">Please Upload</p>
                  )}

                  <div
                    className="create-event-logo"
                    style={{border: '1px solid #eee'}}
                  >
                    {mediaObj.eventImage ? (
                      <>
                        <img
                          style={{width: '100%', height: '100%'}}
                          src={
                            typeof mediaObj.eventImage == 'object'
                              ? URL.createObjectURL(mediaObj.eventImage)
                              : mediaObj.eventImage
                          }
                        />
                      </>
                    ) : (
                      <PlusCircle
                        size={30}
                        style={{marginRight: 3, cursor: 'pointer'}}
                        onClick={() => eventImageInputRef.current.click()}
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={eventImageInputRef}
                    style={{display: 'none'}}
                    onChange={(event) => {
                      setMediaObj({
                        ...mediaObj,
                        eventImage: event.target.files[0],
                      });
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <label
                    style={{display: 'flex', justifyContent: 'space-between'}}
                  >
                    Sponsor Image
                    {mediaObj.sponsorImage && (
                      <span
                        style={{cursor: 'pointer', color: 'red'}}
                        onClick={() => {
                          setMediaObj({...mediaObj, sponsorImage: undefined});
                        }}
                      >
                        Delete
                      </span>
                    )}
                  </label>
                  {errorObj.sponsorImage && (
                    <p className="error-text">Please Upload</p>
                  )}
                  <div
                    className="create-event-logo"
                    style={{border: '1px solid #eee'}}
                  >
                    {mediaObj.sponsorImage ? (
                      <>
                        <img
                          style={{width: '100%', height: '100%'}}
                          src={
                            typeof mediaObj.sponsorImage == 'object'
                              ? URL.createObjectURL(mediaObj.sponsorImage)
                              : mediaObj.sponsorImage
                          }
                        />
                      </>
                    ) : (
                      <PlusCircle
                        size={30}
                        style={{marginRight: 3, cursor: 'pointer'}}
                        onClick={() => sponsorImageInputRef.current.click()}
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={sponsorImageInputRef}
                    style={{display: 'none'}}
                    onChange={(event) => {
                      setMediaObj({
                        ...mediaObj,
                        sponsorImage: event.target.files[0],
                      });
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div
        className="submit-button"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 14,
            width: 'max-content',
            color: regMessage.type == 'success' ? '#069b3f' : '#d65151',
          }}
        >
          {regMessage.msg}
        </div>
        {loading ? (
          <span
            style={{
              marginTop: 0,
              marginBottom: 15,
              width: 100,
              height: 32,
            }}
          >
            <ReactLoadingWrapper
              color={'#518ad6'}
              height={32}
              width={32}
              type={'spin'}
            />
          </span>
        ) : (
          <button
            className="is-success"
            onClick={() => handleSubmit()}
            style={{
              marginTop: 0,
              width: 100,
              height: 32,
              marginLeft: 20,
            }}
          >
            Submit
          </button>
        )}
      </div>
      <CancelIcon
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          color: '#ef5350',
          cursor: 'pointer',
        }}
        onClick={() => closeModal()}
      />
    </div>
  );
  return (
    <Modal
      open={visible}
      style={{overflowY: 'auto'}}
      onClose={() => {
        closeModal();
        setEventObject();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

export default CreateActivityModal;
