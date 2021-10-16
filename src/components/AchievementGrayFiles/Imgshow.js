import React, {useEffect, useState} from 'react';
import {Img, WeekImg, kmImg, LeaderboardImg} from './streakImages';
// import Image from "./WeekImages";
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import {urlPrefix} from '../../services/apicollection';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';

const Imgshow = (props) => {
  const [colorevent, setcolorevent] = useState([]);
  const [colorMiles, setcolorMiles] = useState([]);
  console.warn(props.logo.MILESTONE, 'props');
  const getColorAchievements = () => {
    const URL = `${urlPrefix}v1.0/getUserChallengeAchivement?challengerZoneId=${props.event}`;
    return axios
      .get(URL, {
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
          res.data.response.responseData
            ? setcolorevent(res.data.response.responseData)
            : setcolorevent([]);
        }
      });
  };

  const getMilestones = () => {
    const URL = `${urlPrefix}v1.0/getLeaderBoardAchievement?challengerZoneId=${props.event}`;
    return axios
      .get(URL, {
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
        console.log(res); //
        {
          res.data.response.responseData
            ? setcolorMiles(res.data.response.responseData)
            : setcolorMiles([]);
        }
      });
  };

  // console.log(colorMiles._50_M, 'hfhifeegf');
  useEffect(() => {
    getColorAchievements();
    getMilestones();
  }, [props.event]);

  const [distance, setdistance] = useState({});
  const [streak, setstreak] = useState({});

  const [week, setweek] = useState({});
  const [mileStone, setmileStone] = useState({});

  const set = () => {
    {
      props.logo.DISTANCE && setdistance(props.logo.DISTANCE);
    }
    {
      props.logo.STREAK && setstreak(props.logo.STREAK);
    }
    {
      props.logo.AVERAGE && setweek(props.logo.AVERAGE);
    }
    {
      props.logo.MILESTONE && setmileStone(props.logo.MILESTONE);
    }
  };
  useEffect(() => {
    set();
  });
  //WEEK FUNCTION
  console.log(props.logo.STREAK, 'streak');
  const _1_A = colorevent.filter(function (hero) {
    const x = hero.key == '_1_A';
    return x;
  });

  const _2_A = colorevent.filter(function (hero) {
    const x = hero.key == '_2_A';
    return x;
  });

  const _3_A = colorevent.filter(function (hero) {
    const x = hero.key == '_3_A';
    return x;
  });

  const _5_A = colorevent.filter(function (hero) {
    const x = hero.key == '_5_A';
    return x;
  });

  const _7_A = colorevent.filter(function (hero) {
    const x = hero.key == '_7_A';
    return x;
  });

  const _10_A = colorevent.filter(function (hero) {
    const x = hero.key == '_10_A';
    return x;
  });

  const _14_A = colorevent.filter(function (hero) {
    const x = hero.key == '_14_A';
    return x;
  });

  const _17_A = colorevent.filter(function (hero) {
    const x = hero.key == '_17_A';
    return x;
  });

  const _21_A = colorevent.filter(function (hero) {
    const x = hero.key == '_21_A';
    return x;
  });

  //DISTANCE FUNCTIONS

  const _10_D = colorevent.filter(function (hero) {
    const x = hero.key == '_10_D';
    return x;
  });

  const _5_D = colorevent.filter(function (hero) {
    const x = hero.key == '_5_D';
    return x;
  });

  const _3_D = colorevent.filter(function (hero) {
    const x = hero.key == '_3_D';
    return x;
  });

  const _7_D = colorevent.filter(function (hero) {
    const x = hero.key == '_7_D';
    return x;
  });

  const _14_D = colorevent.filter(function (hero) {
    const x = hero.key == '_14_D';
    return x;
  });

  const _17_D = colorevent.filter(function (hero) {
    const x = hero.key == '_17_D';
    return x;
  });

  const _21_D = colorevent.filter(function (hero) {
    const x = hero.key == '_21_D';
    return x;
  });

  const _28_D = colorevent.filter(function (hero) {
    const x = hero.key == '_28_D';
    return x;
  });

  const _30_D = colorevent.filter(function (hero) {
    const x = hero.key == '_30_D';
    return x;
  });

  //DISTANCE FUNCTIONS
  var _5_K = colorevent.filter(function (hero) {
    const x = hero.key == '_5_K';
    return x;
  });

  console.log();

  var _1_K = colorevent.filter(function (hero) {
    const x = hero.key == '_1_K';
    return x;
  });

  var _2_K = colorevent.filter(function (hero) {
    const x = hero.key == '_2_K';
    return x;
  });

  var _3_K = colorevent.filter(function (hero) {
    const x = hero.key == '_3_K';
    return x;
  });

  var _5_K = colorevent.filter(function (hero) {
    const x = hero.key == '_5_K';
    return x;
  });

  var _7_K = colorevent.filter(function (hero) {
    const x = hero.key == '_7_K';
    return x;
  });

  var _10_K = colorevent.filter(function (hero) {
    const x = hero.key == '_10_K';
    return x;
  });

  var _14_K = colorevent.filter(function (hero) {
    const x = hero.key == '_14_K';
    return x;
  });

  var _17_K = colorevent.filter(function (hero) {
    const x = hero.key == '_17_K';
    return x;
  });

  var _21_K = colorevent.filter(function (hero) {
    const x = hero.key == '_21_K';
    return x;
  });

  console.warn();

  // console.warn( 'logodd4rf ',distance._1_K);
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      borderRadius: '1rem',
    },
    bullet: {
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 18,
      display: 'block',
      width: '100%',
      color: '#f6f6f6',
      textAlign: 'center',
      background: '#00b894',
      paddingTop: 5,
    },
    pos: {
      marginBottom: 12,
    },
    media: {
      height: 100,
    },
  });

  const classes = useStyles();
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginTop: 25,
        }}
      >
        <Card
          className={classes.root}
          style={{maxWidth: '350px'}}
          variant="outlined"
        >
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
            style={{background: '#518ad6'}}
          >
            Streak
          </Typography>
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              // fontSize: "15px"
            }}
          >
            {/* {Img.map((elem) => {
              return (
                <> */}
            <img
              data-tip={_3_D[0]?.achievedDate ? _3_D[0]?.achievedDate : ''}
              src={
                _3_D[0]?.achievementIcon
                  ? _3_D[0]?.achievementIcon
                  : streak._3_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <ReactTooltip />
            <img
              data-tip={_5_D[0]?.achievedDate ? _5_D[0]?.achievedDate : ''}
              src={
                _5_D[0]?.achievementIcon
                  ? _5_D[0]?.achievementIcon
                  : streak._5_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_7_D[0]?.achievedDate ? _7_D[0]?.achievedDate : ''}
              src={
                _7_D[0]?.achievementIcon
                  ? _7_D[0]?.achievementIcon
                  : streak._7_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_10_D[0]?.achievedDate ? _10_D[0]?.achievedDate : ''}
              src={
                _10_D[0]?.achievementIcon
                  ? _10_D[0]?.achievementIcon
                  : streak._10_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_14_D[0]?.achievedDate ? _14_D[0]?.achievedDate : ''}
              src={
                _14_D[0]?.achievementIcon
                  ? _14_D[0]?.achievementIcon
                  : streak._14_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_17_D[0]?.achievedDate ? _17_D[0]?.achievedDate : ''}
              src={
                _17_D[0]?.achievementIcon
                  ? _17_D[0]?.achievementIcon
                  : streak._17_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_21_D[0]?.achievedDate ? _21_D[0]?.achievedDate : ''}
              src={
                _21_D[0]?.achievementIcon
                  ? _21_D[0]?.achievementIcon
                  : streak._21_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_28_D[0]?.achievedDate ? _28_D[0]?.achievedDate : ''}
              src={
                _28_D[0]?.achievementIcon
                  ? _28_D[0]?.achievementIcon
                  : streak._28_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_30_D[0]?.achievedDate ? _30_D[0]?.achievedDate : ''}
              src={
                _30_D[0]?.achievementIcon
                  ? _30_D[0]?.achievementIcon
                  : streak._30_D
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            {/* </>
              );
            })} */}
          </CardContent>
        </Card>

        <Card
          className={classes.root}
          style={{maxWidth: '350px'}}
          variant="outlined"
        >
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
            style={{background: '#518ad6'}}
          >
            Distance
          </Typography>
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              // fontSize: "15px"
            }}
          >
            {/* {kmImg.map((elem) => {
              return (
                <> */}
            <img
              data-tip={_1_K[0]?.achievedDate ? _1_K[0]?.achievedDate : ''}
              src={
                _1_K[0]?.achievementIcon
                  ? _1_K[0]?.achievementIcon
                  : distance._1_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_2_K[0]?.achievedDate ? _2_K[0]?.achievedDate : ''}
              src={
                _2_K[0]?.achievementIcon
                  ? _2_K[0]?.achievementIcon
                  : distance._2_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_3_K[0]?.achievedDate ? _3_K[0]?.achievedDate : ''}
              src={
                _3_K[0]?.achievementIcon
                  ? _3_K[0]?.achievementIcon
                  : distance._3_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_5_K[0]?.achievedDate ? _5_K[0]?.achievedDate : ''}
              src={
                _5_K[0]?.achievementIcon
                  ? _5_K[0]?.achievementIcon
                  : distance._5_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_7_K[0]?.achievedDate ? _7_K[0]?.achievedDate : ''}
              src={
                _7_K[0]?.achievementIcon
                  ? _7_K[0]?.achievementIcon
                  : distance._7_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_10_K[0]?.achievedDate ? _10_K[0]?.achievedDate : ''}
              src={
                _10_K[0]?.achievementIcon
                  ? _10_K[0]?.achievementIcon
                  : distance._10_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_14_K[0]?.achievedDate ? _14_K[0]?.achievedDate : ''}
              src={
                _14_K[0]?.achievementIcon
                  ? _14_K[0]?.achievementIcon
                  : distance._14_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_17_K[0]?.achievedDate ? _17_K[0]?.achievedDate : ''}
              src={
                _17_K[0]?.achievementIcon
                  ? _17_K[0]?.achievementIcon
                  : distance._17_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_21_K[0]?.achievedDate ? _21_K[0]?.achievedDate : ''}
              src={
                _21_K[0]?.achievementIcon
                  ? _21_K[0]?.achievementIcon
                  : distance._21_K
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            {/* </>
              );
            })} */}
          </CardContent>
        </Card>

        <Card
          className={classes.root}
          style={{maxWidth: '350px'}}
          variant="outlined"
        >
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
            style={{background: '#518ad6'}}
          >
            Average
          </Typography>
          <CardContent
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              // fontSize: "15px"
            }}
          >
            <img
              data-tip={_1_A[0]?.achievedDate ? _1_A[0]?.achievedDate : ''}
              src={
                _1_A[0]?.achievementIcon ? _1_A[0]?.achievementIcon : week._1_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_2_A[0]?.achievedDate ? _2_A[0]?.achievedDate : ''}
              src={
                _2_A[0]?.achievementIcon ? _2_A[0]?.achievementIcon : week._2_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_3_A[0]?.achievedDate ? _3_A[0]?.achievedDate : ''}
              src={
                _3_A[0]?.achievementIcon ? _3_A[0]?.achievementIcon : week._3_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />
            <img
              data-tip={_5_A[0]?.achievedDate ? _5_A[0]?.achievedDate : ''}
              src={
                _5_A[0]?.achievementIcon ? _5_A[0]?.achievementIcon : week._5_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_7_A[0]?.achievedDate ? _7_A[0]?.achievedDate : ''}
              src={
                _7_A[0]?.achievementIcon ? _7_A[0]?.achievementIcon : week._7_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_10_A[0]?.achievedDate ? _10_A[0]?.achievedDate : ''}
              src={
                _10_A[0]?.achievementIcon
                  ? _10_A[0]?.achievementIcon
                  : week._10_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_14_A[0]?.achievedDate ? _14_A[0]?.achievedDate : ''}
              src={
                _14_A[0]?.achievementIcon
                  ? _14_A[0]?.achievementIcon
                  : week._14_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_17_A[0]?.achievedDate ? _17_A[0]?.achievedDate : ''}
              src={
                _17_A[0]?.achievementIcon
                  ? _17_A[0]?.achievementIcon
                  : week._17_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
            <img
              data-tip={_21_A[0]?.achievedDate ? _21_A[0]?.achievedDate : ''}
              src={
                _21_A[0]?.achievementIcon
                  ? _21_A[0]?.achievementIcon
                  : week._21_A
              }
              style={{width: 80, height: 80, marginTop: 10}}
            />{' '}
          </CardContent>
        </Card>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h4> Milestones : </h4>
        <div>
          {/* {LeaderboardImg.map((elem) => {
            return ( */}
          {/* <> */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {/* <ReactTooltip /> */}
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._50_M?.achievementIcon
                      ? colorMiles._50_M?.achievementIcon
                      : mileStone._50_M
                  }
                  style={{width: 130, height: 130}}
                />{' '}
              </Paper>{' '}
            </Box>
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._100_M?.achievementIcon
                      ? colorMiles._100_M?.achievementIcon
                      : mileStone._100_M
                  }
                  style={{width: 130, height: 130}}
                />{' '}
              </Paper>
            </Box>
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._200_M?.achievementIcon
                      ? colorMiles._200_M?.achievementIcon
                      : mileStone._200_M
                  }
                  style={{width: 130, height: 130}}
                />{' '}
              </Paper>
            </Box>
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._300_M?.achievementIcon
                      ? colorMiles._300_M?.achievementIcon
                      : mileStone._300_M
                  }
                  style={{width: 130, height: 130}}
                />{' '}
              </Paper>
            </Box>
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._400_M?.achievementIcon
                      ? colorMiles._400_M?.achievementIcon
                      : mileStone._400_M
                  }
                  style={{width: 130, height: 130, marginLeft: 20}}
                />{' '}
              </Paper>
            </Box>
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._500_M?.achievementIcon
                      ? colorMiles._500_M?.achievementIcon
                      : mileStone._500_M
                  }
                  style={{width: 130, height: 130, marginLeft: 30}}
                />{' '}
              </Paper>
            </Box>
            .
            <Box
              style={{
                width: 130,
                height: 130,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Paper elevation={0}>
                <img
                  src={
                    colorMiles._600_M?.achievementIcon
                      ? colorMiles._600_M?.achievementIcon
                      : mileStone._600_M
                  }
                  style={{width: 130, height: 130}}
                />{' '}
              </Paper>
            </Box>
          </div>
          {/* </>
           );
         })} */}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._50_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>

          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._100_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>
          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._200_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>

          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._300_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>

          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._400_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>

          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 1300}}>
              {colorMiles._500_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>

          <Box
            style={{
              width: 130,
              paddingBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              textAlign: 'center',
              fontSize: 12,
            }}
          >
            {' '}
            <Paper elevation={2} style={{width: 130}}>
              {colorMiles._600_M?.date?.map((item, index) => {
                console.log(item, 'item');
                return (
                  <>
                    {' '}
                    <div> {item}</div>
                  </>
                );
              })}{' '}
            </Paper>{' '}
          </Box>
        </div>
      </div>
    </>
  );
};
export default Imgshow;
