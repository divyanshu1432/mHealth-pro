import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
const SundayChallenge = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 15,
        }}
      >
        <Card style={{maxWidth: 370}}>
          <CardHeader
            style={{
              background: '#518ad6',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
          >
            {' '}
          </CardHeader>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
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
        <Card style={{maxWidth: 370}}>
          <CardHeader style={{background: '#518ad6', borderRadius: '10px'}}>
            {' '}
          </CardHeader>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
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
        <Card style={{maxWidth: 370}}>
          <CardHeader style={{background: '#518ad6', borderRadius: '10px'}}>
            {' '}
          </CardHeader>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
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
