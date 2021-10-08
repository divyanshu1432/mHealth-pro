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

  let today = new Date().toISOString().slice(0, 10);
  console.log(Object.entries(streak).length);
  console.log(typeof today);
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
          <div>
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

            {Object.entries(streak).length !== 0 ? (
              <CardContent>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{width: '30%', marginLeft: -20}}>
                    {' '}
                    {(streakTrack &&
                      streakTrack.challengeAction === 'IGNORE') ||
                    streakTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
                      <img
                        style={{height: 100, width: 100}}
                        src={streakTrack && streakTrack.errorImage}
                      />
                    ) : streakTrack.challengeAction === 'ACCEPT' ? (
                      <img
                        style={{height: 100, width: 100}}
                        src={streakTrack.dayLogo}
                      />
                    ) : streakTrack.challengeAction === 'NO_CHALLENGE' ? (
                      <img
                        style={{height: 100, width: 100}}
                        src={
                          streak ? streak.streakLogo : streakTrack.streakLogo
                        }
                      />
                    ) : (
                      <>
                        {' '}
                        <img
                          style={{height: 100, width: 100}}
                          src={
                            streak ? streak.streakLogo : streakTrack.streakLogo
                          }
                        />{' '}
                      </>
                    )}
                  </div>
                  {streakTrack &&
                  streakTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                        Days. Achieved between{' '}
                        <strong> {streak && streak.streakToDate} </strong> and{' '}
                        <strong> {streak && streak.streakFromDate} </strong>
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{marginTop: 5, marginLeft: 20, fontSize: 12}}
                      >
                        Would you like to up the mark and accept a challenge for{' '}
                        <strong>
                          {' '}
                          {streak &&
                            streak.streakChallenge &&
                            streak.streakChallenge}{' '}
                        </strong>{' '}
                        Days?
                        <p>
                          {' '}
                          <strong>
                            {' '}
                            <span style={{color: 'red'}}>* </span>
                            Target to be achieved on or before{' '}
                            <strong>
                              {' '}
                              {streak && streak.targetedStreakDate}.{' '}
                            </strong>{' '}
                          </strong>{' '}
                        </p>
                      </Typography>
                    </div>
                  ) : (streakTrack &&
                      streakTrack.challengeAction === 'IGNORE') ||
                    streakTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
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
                        {streakTrack.errorMsg}{' '}
                      </Typography>
                    </div>
                  ) : streakTrack &&
                    streakTrack.challengeAction === 'ACCEPT' ? (
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
                        <div>
                          <div>
                            {' '}
                            Challenge Accepted On:{' '}
                            {streakTrack.challengeThrowDate}{' '}
                          </div>
                          <div> Target Date: {streakTrack.targetDate} </div>
                          {/* Progress: Streak {Current Days}/{Target Days} */}
                          {/* Percentage Progress bar. */}
                        </div>
                      </Typography>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </CardContent>
            ) : (
              <div
                style={{
                  // height: 400,
                  padding: '5px',

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
                  style={{width: 120, height: 120}}
                  src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                />
                Data is not present
              </div>
            )}

            {Object.entries(streak).length !== 0 ? (
              streakTrack &&
              streakTrack.challengeAction !== 'NO_ACTION_PERFORM' ? (
                <CardActions
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: -15,
                  }}
                >
                  {streakTrack &&
                  streakTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                  ) : streakTrack &&
                    streakTrack.challengeAction === 'IGNORE' ? (
                    ''
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
                          (
                            (parseInt(streakTrack.streakCount) * 100) /
                            streakTrack.dayChallenge
                          ).toFixed(1)}
                        %{' '}
                      </p>
                    </div>
                  )}
                </CardActions>
              ) : (
                ''
              )
            ) : (
              ''
            )}
          </div>
          {/* ) : (
            <div
              style={{
                // height: 400,
                padding: '5px',

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
                style={{width: 120, height: 120}}
                src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
              />
              Data is not present
            </div>
          )} */}
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
          {Object.entries(distance).length !== 0 ? (
            <CardContent>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%', marginLeft: -20}}>
                  {' '}
                  {(distanceTrack &&
                    distanceTrack.challengeAction === 'IGNORE') ||
                  distanceTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={distanceTrack && distanceTrack.errorImage}
                    />
                  ) : distanceTrack.challengeAction === 'ACCEPT' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                    />
                  ) : distanceTrack.challengeAction === 'NO_CHALLENGE' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                    />
                  ) : (
                    <>
                      {' '}
                      <img
                        style={{height: 100, width: 100}}
                        src={distance ? distance.kmLogo : distanceTrack.kmLogo}
                      />{' '}
                    </>
                  )}
                </div>
                {distanceTrack &&
                distanceTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                      KMs?
                      <p>
                        {' '}
                        <strong>
                          {' '}
                          <span style={{color: 'red'}}>* </span>
                          Target to be achieved on or before{' '}
                          <strong>
                            {' '}
                            {distance && distance.targetedKmDate}.{' '}
                          </strong>
                        </strong>{' '}
                      </p>
                    </Typography>
                  </div>
                ) : (distanceTrack &&
                    distanceTrack.challengeAction === 'IGNORE') ||
                  distanceTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
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
                      {distanceTrack.errorMsg}{' '}
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
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <div>
                          {' '}
                          Challenge accepted on :{' '}
                          {distanceTrack.challengeThrowDate}{' '}
                        </div>
                        <div> Target date : {distanceTrack.targetDate} </div>
                        <div> Status : {distanceTrack.kmStatus} </div>
                      </div>
                    </Typography>
                  </div>
                )}
              </div>
              {/* ) : (
              <div
                style={{
                  // height: 400,
                  padding: '5px',

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
                  style={{width: 120, height: 120}}
                  src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                />
                Data is not present
              </div>
              )} */}
            </CardContent>
          ) : (
            <div
              style={{
                // height: 400,
                padding: '5px',

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
                style={{width: 120, height: 120}}
                src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
              />
              Data is not present
            </div>
          )}
          {Object.entries(distance).length !== 0 ? (
            distanceTrack &&
            distanceTrack.challengeAction !== 'NO_ACTION_PERFORM' ? (
              <CardActions
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: -15,
                }}
              >
                {distanceTrack &&
                distanceTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                ) : distanceTrack &&
                  distanceTrack.challengeAction === 'IGNORE' ? (
                  ''
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
            )
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
          {Object.entries(distance).length !== 0 ? (
            <CardContent>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '30%', marginLeft: -20}}>
                  {' '}
                  {(averageTrack &&
                    averageTrack.challengeAction === 'IGNORE') ||
                  averageTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={averageTrack && averageTrack.errorImage}
                    />
                  ) : averageTrack.challengeAction === 'ACCEPT' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={average ? average.avgLogo : averageTrack.avgLogo}
                    />
                  ) : averageTrack.challengeAction === 'NO_CHALLENGE' ? (
                    <img
                      style={{height: 100, width: 100}}
                      src={average ? average.avgLogo : averageTrack.avgLogo}
                    />
                  ) : (
                    <>
                      {' '}
                      <img
                        style={{height: 100, width: 100}}
                        src={average ? average.avgLogo : averageTrack.avgLogo}
                      />{' '}
                    </>
                  )}
                </div>
                {averageTrack &&
                averageTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                      KMs/Week?
                      <p>
                        {' '}
                        <strong>
                          {' '}
                          <span style={{color: 'red'}}>* </span>
                          Target to be achieved on or before{' '}
                          {average && average.targetedAvgDate}.{' '}
                        </strong>{' '}
                      </p>
                    </Typography>
                  </div>
                ) : averageTrack.challengeAction === 'IGNORE' ||
                  averageTrack.challengeAction === 'NO_ACTION_PERFORM' ? (
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
                      {averageTrack.errorMsg}{' '}
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
                      {/* Challenge Accepted On: {Date} */}

                      <div style={{marginLeft: 20, fontSize: 12}}>
                        {' '}
                        <div> Target Date: {averageTrack.targetDate}</div>
                        <div>
                          {' '}
                          Progress: <b> {averageTrack.progressPercentage} %</b>
                        </div>
                        <div>
                          {' '}
                          Remaining Days : <b> {averageTrack.remainingDay} </b>
                        </div>
                        <div>
                          {' '}
                          Required Average for Remaining Days:{' '}
                          <b>
                            {' '}
                            {averageTrack.remainAvgPercentage}{' '}
                          </b> KM/Day{' '}
                        </div>
                      </div>
                      {/* You accepted challenge for{' '}
                    <strong> {distanceTrack.kmChallenge} </strong> Kms
                    <strong> {distanceTrack.remainWeekDay} </strong> Days
                    remainig to complete */}
                    </Typography>
                  </div>
                )}
              </div>
              {/* ) : (
              <div
                style={{
                  // height: 400,
                  padding: '5px',

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
                  style={{width: 120, height: 120}}
                  src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                />
                Data is not present
              </div>
              )} */}
            </CardContent>
          ) : (
            <div
              style={{
                // height: 400,
                padding: '5px',

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
                style={{width: 120, height: 120}}
                src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
              />
              Data is not present
            </div>
          )}
          {Object.entries(distance).length !== 0 ? (
            averageTrack &&
            averageTrack.challengeAction !== 'NO_ACTION_PERFORM' ? (
              <CardActions
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  marginTop: -15,
                }}
              >
                {averageTrack &&
                averageTrack.challengeAction === 'NO_CHALLENGE' ? (
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
                ) : averageTrack.challengeAction === 'IGNORE' ? (
                  ''
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        marginLeft: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 13,
                      }}
                    >
                      {' '}
                      <p style={{textAlign: 'right'}}>
                        {' '}
                        {averageTrack && averageTrack.avgWeekStatus}{' '}
                      </p>
                      <progress
                        style={{width: '300px', marginTop: -10}}
                        id="file"
                        value={averageTrack.progressPercentage}
                        max="100"
                      />
                    </div>{' '}
                  </div>
                )}
              </CardActions>
            ) : (
              ''
            )
          ) : (
            ''
          )}
        </Card>{' '}
      </div>
    </>
  );
};
export default SundayChallenge;
