import React, {useState, useEffect} from 'react';

import {Star, TrendingUp, TrendingDown} from 'react-feather';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import {
  getPersonalTargetData,
  getEventTargetData,
  setPersonalTargetData,
} from '../services/challengeApi';

import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Message from 'antd-message';

function getModalStyle() {
  const top = 50;
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
    width: '400px',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    outline: 'none',
  },
}));

const TargetSetting = ({dashboardState}) => {
  const [eventData, setEventData] = useState({});
  const [personalData, setPersonalData] = useState({});
  const [payload, setPayload] = useState({
    eventId: dashboardState.selectedChallenge,
    date: '',
    distance: undefined,
  });

  function formatDate(date) {
    if (!date) return '';
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }

  const handlePayloadChange = (type, value) => {
    let payloadValue = value;
    if (type == 'date') {
      payloadValue = formatDate(value);
    }
    setPayload({...payload, [type]: payloadValue});
  };

  const fetchTargetData = () => {
    if (dashboardState.selectedChallenge) {
      getPersonalTargetData(dashboardState.selectedChallenge)
        .then((res) => {
          if (
            res.data.mhealthResponseMessage == 'SUCCESS' &&
            res.data.response &&
            res.data.response.responseMessage == 'SUCCESS' &&
            res.data.response.responseData
          ) {
            setPersonalData(res.data.response.responseData);
          } else {
            setPersonalData({});
          }
        })
        .catch((err) => {
          setPersonalData({});
        });
      getEventTargetData(dashboardState.selectedChallenge)
        .then((res) => {
          if (
            res.data.mhealthResponseMessage == 'SUCCESS' &&
            res.data.response &&
            res.data.response.responseMessage == 'SUCCESS' &&
            res.data.response.responseData
          ) {
            setEventData(res.data.response.responseData);
          } else {
            setEventData({});
          }
        })
        .catch((err) => {
          setEventData({});
        });
    }
  };

  useEffect(() => {
    setPersonalData({});
    setEventData({});
    setPayload({
      eventId: dashboardState.selectedChallenge,
      date: '',
      distance: undefined,
    });
    fetchTargetData();
  }, [dashboardState.selectedChallenge]);

  const [targetModal, setTargetModal] = useState(false);
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div
        className="heading"
        style={{
          marginTop: 0,
          fontSize: 14,
          marginLeft: 0,
          paddingLeft: 0,
          marginBottom: 10,
        }}
      >
        Set personal target
      </div>
      <div className="mhealth-input-box padding-025em">
        <div>
          <label>Distance (KM)</label>
        </div>
        <input
          type="number"
          placeholder="Enter your target in KM"
          value={payload.distance}
          onChange={(e) => handlePayloadChange('distance', e.target.value)}
        />
      </div>

      <div
        className="mhealth-input-box padding-025em"
        style={{marginBottom: 10}}
      >
        <div>
          <label>Enter your target start date</label>
        </div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            margin="normal"
            id="date-picker-inline"
            onChange={(date) => handlePayloadChange('date', date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
            autoOk
            format="yyyy/MM/dd"
            value={payload.date ?? ''}
            InputAdornmentProps={{position: 'start'}}
          />
        </MuiPickersUtilsProvider>
      </div>

      <button
        className="create-event-button"
        type="primary"
        disabled={
          !payload.distance ||
          payload.distance == '' ||
          !payload.date ||
          payload.date == null ||
          payload.date == ''
        }
        style={{background: '#29b6f6', color: '#fff'}}
        onClick={() => {
          window.message = Message;
          setPersonalTargetData(payload)
            .then((res) => {
              fetchTargetData();
              if (
                res.data.mhealthResponseMessage == 'SUCCESS' &&
                res.data.response &&
                res.data.response.responseMessage == 'SUCCESS' &&
                res.data.response.responseData
              ) {
                message.success(res.data.response.responseData);
              } else {
                message.error('Failed to set personal target');
              }
            })
            .catch((err) => {
              message.error('Failed to set personal target');
            });
          setTargetModal(false);
          setPayload({
            eventId: dashboardState.selectedChallenge,
            date: '',
            distance: undefined,
          });
        }}
      >
        Submit
      </button>
    </div>
  );
  return (
    <div className="target-container">
      <div className="target-btn-container">
        <button
          className="create-event-button target-btn"
          onClick={() => {
            setTargetModal(true);
            setPayload({
              eventId: dashboardState.selectedChallenge,
              date: personalData?.startDate,
              distance: personalData?.totalKMRequired,
            });
          }}
        >
          Set Personal Target
        </button>
      </div>

      <div
        className="target-table-row"
        style={{
          borderTop: '1px solid #eee',
        }}
      >
        <div className="target-metric-column">
          <div style={{fontWeight: 800}}>Performance Metrics</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">Event Target</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 10,
                color: '#f9a825',
              }}
            >
              {eventData?.message}
            </div>
          </div>
          <div className="target-data-inner-column">
            <div className="target-data-bold">Personal Target</div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 10,
                color: '#f9a825',
              }}
            >
              {personalData?.message}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Actual Vs Target </div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column ">
            <div className="target-data-bold">
              {eventData?.kmTilldate || eventData?.kmTilldate == 0
                ? parseFloat(eventData?.kmTilldate)?.toFixed(2) + ' KM'
                : '-'}

              {eventData?.totalKMRequired
                ? '/ ' + eventData?.totalKMRequired + ' KM'
                : null}
            </div>
            <div className="target-data-muted">
              {eventData?.remainingKm
                ? 'Remaining KM : ' +
                  parseFloat(eventData?.remainingKm)?.toFixed(2)
                : null}
            </div>
          </div>

          <div className="target-data-inner-column ">
            <div className="target-data-bold">
              {personalData?.kmTilldate
                ? parseFloat(personalData?.kmTilldate)?.toFixed(2) + ' KM'
                : '-'}

              {personalData?.totalKMRequired
                ? '/ ' + personalData?.totalKMRequired + ' KM'
                : null}
            </div>
            <div className="target-data-muted">
              {personalData?.remainingKm
                ? 'Remaining KM : ' +
                  parseFloat(personalData?.remainingKm)?.toFixed(2)
                : null}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Percentage Achieved</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.targetAchieved ? (
                <CircularProgressWithLabel value={eventData?.targetAchieved} />
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.targetAchieved ? (
                <CircularProgressWithLabel
                  value={personalData?.targetAchieved}
                />
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Total Tournament Days</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.totalDays || eventData?.totalDays == 0
                ? eventData?.totalDays
                : '-'}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 5,
                flexWrap: 'wrap',
              }}
            >
              {eventData?.startDate && (
                <div
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888888',
                    borderRight: '1px solid rgba(0,0,0,0.2)',
                    padding: '0px 5px',
                  }}
                >
                  Start : {eventData?.startDate}
                </div>
              )}

              {eventData?.endDate && (
                <div
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888888',
                    padding: '0px 5px',
                  }}
                >
                  End : {eventData?.endDate}
                </div>
              )}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.totalDays || personalData?.totalDays == 0
                ? personalData?.totalDays
                : '-'}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 5,
                flexWrap: 'wrap',
              }}
            >
              {personalData?.startDate && (
                <div
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888888',
                    borderRight: '1px solid rgba(0,0,0,0.2)',
                    padding: '0px 5px',
                  }}
                >
                  Start : {personalData?.startDate}
                </div>
              )}
              {personalData?.endDate && (
                <div
                  style={{
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888888',
                    padding: '0px 5px',
                  }}
                >
                  End : {personalData?.endDate}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Qualifying Days</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.qualifyingDays || eventData?.qualifyingDays == 0
                ? eventData?.qualifyingDays
                : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.qualifyingDays || personalData?.qualifyingDays == 0
                ? personalData?.qualifyingDays
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Tournament Average Required</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.requiredAverage
                ? parseFloat(eventData?.requiredAverage)?.toFixed(2) + ' KM/Day'
                : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.requiredAverage
                ? parseFloat(personalData?.requiredAverage)?.toFixed(2) +
                  ' KM/Day'
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Active Days</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.totalActiveDays || eventData?.totalActiveDays == 0
                ? eventData?.totalActiveDays
                : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.totalActiveDays ||
              personalData?.totalActiveDays == 0
                ? personalData?.totalActiveDays
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Average KM (Active Days)</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.activeAverage ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {eventData?.nowRequired - eventData?.activeAverage > 0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {eventData?.activeAverage
                    ? parseFloat(eventData?.activeAverage)?.toFixed(2) +
                      ' KM/Day'
                    : '-'}
                </span>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.activeAverage ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {personalData?.nowRequired - personalData?.activeAverage >
                  0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {personalData?.activeAverage
                    ? parseFloat(personalData?.activeAverage)?.toFixed(2) +
                      ' KM/Day'
                    : '-'}
                </span>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Average KM (Total Days)</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.currentAverage ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {eventData?.nowRequired - eventData?.currentAverage > 0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {eventData?.currentAverage
                    ? parseFloat(eventData?.currentAverage)?.toFixed(2) +
                      ' KM/Day'
                    : '-'}
                </span>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.currentAverage ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {personalData?.nowRequired - personalData?.currentAverage >
                  0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {personalData?.currentAverage
                    ? parseFloat(personalData?.currentAverage)?.toFixed(2) +
                      ' KM/Day'
                    : '-'}
                </span>
              ) : (
                '-'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Your Best Performance</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.bestPerformance || eventData?.bestPerformance == 0 ? (
                <Star style={{marginRight: 5, color: '#FFD700'}} />
              ) : null}
              {eventData?.bestPerformance || eventData?.bestPerformance == 0
                ? parseFloat(eventData?.bestPerformance)?.toFixed(2) + ' KM'
                : '-'}
            </div>
            <div className="target-data-muted">
              {eventData?.bestPerformanceDate && eventData?.bestPerformanceDate}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.bestPerformance ||
              personalData?.bestPerformance == 0 ? (
                <Star style={{marginRight: 5, color: '#FFD700'}} />
              ) : null}
              {personalData?.bestPerformance ||
              personalData?.bestPerformance == 0
                ? parseFloat(personalData?.bestPerformance)?.toFixed(2) + ' KM'
                : '-'}
            </div>
            <div className="target-data-muted">
              {personalData?.bestPerformanceDate &&
                personalData?.bestPerformanceDate}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Your Shortest Performance</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {' '}
              {eventData?.lowestPerformance ||
              eventData?.lowestPerformance == 0 ? (
                <Star style={{marginRight: 5, color: '#ef5350'}} />
              ) : null}
              {eventData?.lowestPerformance || eventData?.lowestPerformance == 0
                ? parseFloat(eventData?.lowestPerformance)?.toFixed(2) + ' KM'
                : '-'}
            </div>
            <div className="target-data-muted">
              {eventData?.lowestPerformanceDate &&
                eventData?.lowestPerformanceDate}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {' '}
              {personalData?.lowestPerformance ||
              personalData?.lowestPerformance == 0 ? (
                <Star style={{marginRight: 5, color: '#ef5350'}} />
              ) : null}
              {personalData?.lowestPerformance
                ? parseFloat(personalData?.lowestPerformance)?.toFixed(2) +
                  ' KM'
                : '-'}
            </div>
            <div className="target-data-muted">
              {personalData?.lowestPerformanceDate &&
                personalData?.lowestPerformanceDate}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Remaining Days (Tournament)</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.remainingDays || eventData?.remainingDays == 0
                ? eventData?.remainingDays
                : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.remainingDays || personalData?.remainingDays == 0
                ? personalData?.remainingDays
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Remaining Days (Qualifying)</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.remainingQualifyingDays ||
              eventData?.remainingQualifyingDays == 0
                ? eventData?.remainingQualifyingDays
                : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.remainingQualifyingDays ||
              personalData?.remainingQualifyingDays == 0
                ? personalData?.remainingQualifyingDays
                : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Now Required Average</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.nowRequired && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {eventData?.requiredAverage - eventData?.nowRequired > 0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {eventData?.nowRequired
                    ? parseFloat(eventData?.nowRequired)?.toFixed(2) + ' KM/Day'
                    : '-'}
                </span>
              )}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.nowRequired && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {personalData?.requiredAverage - personalData?.nowRequired >
                  0 ? (
                    <TrendingDown style={{marginRight: 5, color: '#ef5350'}} />
                  ) : (
                    <TrendingUp style={{marginRight: 5, color: '#66bb6a'}} />
                  )}
                  {personalData?.nowRequired
                    ? parseFloat(personalData?.nowRequired)?.toFixed(2) +
                      ' KM/Day'
                    : '-'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="target-table-row">
        <div className="target-metric-column">
          <div>Tentative Completion Date</div>
        </div>
        <div className="target-data-column">
          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {eventData?.predictedDate ? eventData?.predictedDate : '-'}
            </div>
          </div>

          <div className="target-data-inner-column">
            <div className="target-data-bold">
              {personalData?.predictedDate ? personalData?.predictedDate : '-'}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={targetModal}
        onClose={() => {
          setTargetModal(false);
          setPayload({
            eventId: dashboardState.selectedChallenge,
            date: '',
            distance: undefined,
          });
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default TargetSetting;
