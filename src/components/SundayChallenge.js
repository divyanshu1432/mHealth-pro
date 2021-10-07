import React, {useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import {urlPrefix} from '../services/apicollection';
import axios from 'axios';
const SundayChallenge = (props) => {
  const [streak, setstreak] = useState({});
  const [average, setaverage] = useState({});
  const [distance, setdistance] = useState({});

  const [distanceTrack, setdistanceTrack] = useState({});
  const [averageTrack, setaverageTrack] = useState({});
  const [streakTrack, setstreakTrack] = useState({});
  const getData = () => {
    const url = `${urlPrefix}v1.0/throwWeeklySundayChallenge?challengerZoneId=${props.eventId}
    `;

    return axios
      .get(url, {
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
      })
      .then((res) => {
        {
          res.data.response.responseData?.kmSundayChallenge
            ? setdistance(res.data.response.responseData?.kmSundayChallenge)
            : setdistance({});
        }
        {
          res.data.response.responseData?.weekAvgSundayChallenge
            ? setaverage(res.data.response.responseData.weekAvgSundayChallenge)
            : setaverage({});
        }
        {
          res.data.response.responseData?.streakSundayChallenge
            ? setstreak(res.data.response.responseData?.streakSundayChallenge)
            : setstreak({});
        }
      });
  };

  const acceptOrReject = (a, b, c, d) => {
    const url = `${urlPrefix}v1.0/acceptOrIgnoreSundayChallenge?challengeAction=${a}&challengeType=${b}&challengeValue=${c}&challengerZoneId=${d}`;

    return axios
      .post(
        url,
        {},
        {
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
        }
      )
      .then(() => {
        trackPerformance();
      });
  };

  const trackPerformance = () => {
    const url = `${urlPrefix}v1.0/trackPerformanceOfChallenge?challengerZoneId=${props.eventId}
`;
    return axios
      .put(
        url,
        {},
        {
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
        }
      )
      .then((res) => {
        {
          res.data.response.responseData?.kmPerformance
            ? setdistanceTrack(res.data.response.responseData.kmPerformance)
            : setdistanceTrack({});
        }
        {
          res.data.response.responseData?.avgPerformance
            ? setaverageTrack(res.data.response.responseData.avgPerformance)
            : setaverageTrack({});
        }
        {
          res.data.response.responseData?.dayPerformance
            ? setstreakTrack(res.data.response.responseData.dayPerformance)
            : setstreakTrack({});
        }
      });
  };

  // console.log(average);
  useEffect(() => {
    getData();
    trackPerformance();
  }, [props.eventId]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 25,
        }}
      >
        <Card
          style={{
            width: '370px',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <div
            style={{
              color: 'white',
              marginTop: '-10px',
              display: 'flex',
              justifyContent: 'center',
              background: '#518ad6',
              height: 45,
            }}
          >
            {' '}
            <h2 style={{}}> Streak </h2>{' '}
          </div>
          <CardContent>
            {Object.entries(streak).length !== 0 ? (
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%', marginLeft: -20}}>
                  {' '}
                  <img
                    style={{height: 100, width: 100}}
                    src={streak ? streak.streakLogo : streakTrack.dayLogo}
                  />
                </div>
                {Object.entries(streakTrack).length == 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{marginLeft: 20, fontSize: 12}}
                    >
                      Your Previous Best Streak was of{' '}
                      <strong> {streak && streak.eventHighestStreak} </strong>{' '}
                      Kms. Achieved between{' '}
                      <strong> {streak && streak.streakToDate} </strong> and{' '}
                      <strong> {streak && streak.streakFromDate} </strong>
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{marginTop: 5, marginLeft: 20, fontSize: 12}}
                    >
                      Would you like to up the mark and accept a challenge for{' '}
                      <strong> {streak && streak.streakChallenge} </strong> Kms?
                      Target to be achieved on or before{' '}
                      <strong> {streak && streak.targetedStreakDate}. </strong>
                    </Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      Remaining{' '}
                      <strong> {streakTrack.remainDayToComplete} </strong> Days
                      to Complete :{' '}
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  style={{
                    // height: 400,
                    padding: '5px',
                    marginTop: 30,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  className=""
                >
                  {' '}
                  <img
                    style={{width: 150, height: 150}}
                    src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                  />
                  No streak present
                </div>
              </>
            )}
          </CardContent>
          {Object.entries(streak).length !== 0 ? (
            <CardActions
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: -15,
              }}
            >
              {Object.entries(streakTrack).length == 0 ? (
                <div>
                  <button
                    style={{width: 130, height: 25}}
                    className="is-success"
                    onClick={() => {
                      acceptOrReject(
                        'accept',
                        'DAY',
                        streak ? streak.streakChallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      background: '#F43F5E',
                      color: 'white',
                      width: 130,
                      height: 25,
                    }}
                    onClick={() => {
                      acceptOrReject(
                        'ignore',
                        'DAY',
                        streak ? streak.streakChallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Ignore
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  {' '}
                  <div style={{marginLeft: 20}}>
                    {' '}
                    <progress
                      style={{width: '300px', height: 30}}
                      id="file"
                      value={
                        streakTrack &&
                        (parseInt(streakTrack.streakCount) * 100) /
                          streakTrack.dayChallenge
                      }
                      max="100"
                    />
                  </div>{' '}
                  <p style={{marginTop: 5}}>
                    {' '}
                    {streakTrack &&
                      (parseInt(streakTrack.streakCount) * 100) /
                        streakTrack.dayChallenge}
                    %{' '}
                  </p>
                </div>
              )}
            </CardActions>
          ) : (
            ''
          )}
        </Card>
        <Card
          style={{
            width: '370px',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <div
            style={{
              color: 'white',
              marginTop: '-10px',
              display: 'flex',
              justifyContent: 'center',
              background: '#518ad6',
              height: 45,
            }}
          >
            {' '}
            <h2 style={{}}> Distance </h2>{' '}
          </div>
          <CardContent>
            {Object.entries(distance).length !== 0 ? (
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%', marginLeft: -20}}>
                  {' '}
                  <img
                    style={{height: 100, width: 100}}
                    src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                  />
                </div>
                {Object.entries(distanceTrack).length == 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{marginLeft: 20, fontSize: 12, wordSpacing: 3}}
                    >
                      Your Previous Best Distance covered in a day was of{' '}
                      <strong> {distance && distance.eventMaxKM} </strong>
                      KMs.Achieved on
                      <strong> {distance && distance.maxKMDate} </strong>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 20,
                        fontSize: 12,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      {' '}
                      Would you like to up the mark and accept a challenge for{' '}
                      <strong> {distance && distance.kmchallenge} </strong>
                      KMs?Target to be achieved on or before{' '}
                      <strong> {distance && distance.targetedKmDate}. </strong>
                    </Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      You accepted challenge for{' '}
                      <strong> {distanceTrack.kmChallenge} </strong> Kms
                      <strong> {distanceTrack.remainWeekDay} </strong> Days
                      remainig to complete
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <>
                {' '}
                <div
                  style={{
                    // height: 400,
                    padding: '5px',
                    marginTop: 30,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  className=""
                >
                  {' '}
                  <img
                    style={{width: 150, height: 150}}
                    src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                  />
                  No Distance challenge present
                </div>
              </>
            )}
          </CardContent>
          {Object.entries(distance).length !== 0 ? (
            <CardActions
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: -15,
              }}
            >
              {Object.entries(distanceTrack).length == 0 ? (
                <div>
                  <button
                    style={{width: 130, height: 25}}
                    className="is-success"
                    onClick={() => {
                      acceptOrReject(
                        'accept',
                        'KM',
                        distance ? distance.kmchallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      background: '#F43F5E',
                      color: 'white',
                      width: 130,
                      height: 25,
                    }}
                    onClick={() => {
                      acceptOrReject(
                        'ignore',
                        'KM',
                        distance ? distance.kmchallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Ignore
                  </button>
                </div>
              ) : (
                <>
                  {' '}
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <p style={{textAlign: 'right', marginTop: -15}}>
                      {' '}
                      {distanceTrack && distanceTrack.kmStatus}{' '}
                    </p>
                    <progress style={{width: '300px'}} />{' '}
                  </div>{' '}
                </>
              )}
            </CardActions>
          ) : (
            ''
          )}
        </Card>{' '}
        <Card
          style={{
            width: '370px',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <div
            style={{
              color: 'white',
              marginTop: '-10px',
              display: 'flex',
              justifyContent: 'center',
              background: '#518ad6',
              height: 45,
            }}
          >
            {' '}
            <h2 style={{}}> Average </h2>{' '}
          </div>
          <CardContent>
            {Object.entries(average).length !== 0 ? (
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%', marginLeft: -20}}>
                  {' '}
                  <img
                    style={{height: 100, width: 100}}
                    src={average ? average.avgLogo : averageTrack.avgLogo}
                  />
                </div>
                {Object.entries(averageTrack).length == 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column'}}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{marginLeft: 20, fontSize: 12, wordSpacing: 3}}
                    >
                      Your Previous Best Weekly average was of{' '}
                      {average && average.eventMaxWeekAverage} KMs/Week.
                      Achieved from {average && average.weekAvgFromDate} to{' '}
                      {average && average.weekAvgToDate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 20,
                        marginTop: 5,
                        fontSize: 12,
                        wordSpacing: 3,
                      }}
                    >
                      Would you like to up the mark and accept a challenge for{' '}
                      {average && average.weekAvgChallenge}
                      KMs/Week? Target to be achieved on or before{' '}
                      {average && average.targetedAvgDate}.
                    </Typography>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      wordSpacing: 3,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{
                        marginLeft: 25,
                        fontSize: 15,
                        marginTop: 5,
                        wordSpacing: 3,
                      }}
                    >
                      CHALLENGE ACCEPTED{' '}
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <>
                {' '}
                <div
                  style={{
                    // height: 400,
                    padding: '5px',
                    marginTop: 30,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  className=""
                >
                  {' '}
                  <img
                    style={{width: 150, height: 150}}
                    src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                  />
                  No Average challenge present
                </div>
              </>
            )}
          </CardContent>
          {Object.entries(average).length !== 0 ? (
            <CardActions
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: -15,
              }}
            >
              {Object.entries(averageTrack).length == 0 ? (
                <div>
                  <button
                    style={{width: 130, height: 25}}
                    className="is-success"
                    onClick={() => {
                      acceptOrReject(
                        'accept',
                        'AVG',
                        average ? average.weekAvgChallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={{
                      background: '#F43F5E',
                      color: 'white',
                      width: 130,
                      height: 25,
                    }}
                    onClick={() => {
                      acceptOrReject(
                        'ignore',
                        'AVG',
                        average ? average.weekAvgChallenge : '',
                        props.eventId
                      );
                    }}
                  >
                    Ignore
                  </button>{' '}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  {' '}
                  <div style={{marginLeft: 20}}>
                    {' '}
                    <progress
                      style={{width: '300px', height: 30}}
                      id="file"
                      value={
                        averageTrack &&
                        parseFloat(averageTrack.avgWeekPercentage)
                      }
                      max="100"
                    />
                  </div>{' '}
                  <p style={{marginTop: 5}}>
                    {' '}
                    {averageTrack && parseFloat(averageTrack.avgWeekPercentage)}
                    %{' '}
                  </p>
                </div>
              )}
            </CardActions>
          ) : (
            ''
          )}
        </Card>{' '}
      </div>
    </>
  );
};
export default SundayChallenge;
