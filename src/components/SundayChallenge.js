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
const SundayChallenge = () => {
  const [streak, setstreak] = useState({});
  const [average, setaverage] = useState({});
  const [distance, setdistance] = useState({});

  const getData = () => {
    const url = `${urlPrefix}/v1.0/throwWeeklySundayChallenge?challengerZoneId=10
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
        console.log(res);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 15,
        }}
      >
        <Card
          style={{
            maxWidth: 370,
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
            <h2 style={{}}> KM challenge </h2>{' '}
          </div>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            {/* <Button size="small">Share</Button>
          <Button size="small">Learn More</Button> */}
          </CardActions>
        </Card>{' '}
        <Card
          style={{
            maxWidth: 370,
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
            <h2 style={{}}> KM challenge </h2>{' '}
          </div>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            {/* <Button size="small">Share</Button>
          <Button size="small">Learn More</Button> */}
          </CardActions>
        </Card>{' '}
        <Card
          style={{
            maxWidth: 370,
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
            <h2 style={{}}> KM challenge </h2>{' '}
          </div>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            {/* <Button size="small">Share</Button>
          <Button size="small">Learn More</Button> */}
          </CardActions>
        </Card>{' '}
      </div>
    </>
  );
};
export default SundayChallenge;
