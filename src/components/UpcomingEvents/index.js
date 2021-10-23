import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
// import Stack from '@material-ui/core/Stack';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Carousel} from 'react-responsive-carousel';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import FacebookOutlinedIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';
import {getOldEvents} from '../../services/challengeApi';
import ScrollableList from '../ScrollableList';

import LogoPng from '../../assets/logo.png';
import HomePageCarousel from '../HomePageCarousel';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';

const UpcomingEvents = (props) => {
  const link = window.location.href;
  const f_link = link.substring(0, 22);

  useEffect(() => {
    if (f_link === 'https://global.mhealth') {
      setCode('GLOBAL');
    }
  }, []);

  const [code, setCode] = useState('');
  const history = useHistory();
  const [upcomingEventListLoader, setUpcomingEventListLoader] = useState(false);
  const [upcomingEventList, setUpcomingEventList] = useState([]);
  const [registerModalView, setRegisterModalView] = useState(false);
  const [instructionDetails, setInstructionDetails] = useState();

  useEffect(() => {
    getOldEvents()
      .then((res) => {
        setUpcomingEventListLoader(true);
        if (res.data.response.responseMessage === 'SUCCESS') {
          window.banner = res.data.response.responseData?.keyword.banner;
          const data = res.data.response.responseData.events.filter((item) => {
            return item.isActive == 1 && item.regOpen;
          });
          setUpcomingEventList(data);
          setInstructionDetails(
            res?.data?.response?.responseData?.instruction_details
          );
        }
        setUpcomingEventListLoader(false);
      })
      .catch((err) => {
        setUpcomingEventList([]);
        setUpcomingEventListLoader(false);
      });
  }, []);
  console.warn(window.banner, 'banner');
  useEffect(() => {
    if (history.location.search) {
      let params = new URLSearchParams(history.location.search.substring(1));
      let token = params.get('token');
      setCode(window.atob(token));

      /** challenge accept/reject */
      if (params.get('cid') && params.get('time') && params.get('status')) {
        localStorage.setItem('cid', params.get('cid'));
        localStorage.setItem('time', params.get('time'));
        localStorage.setItem('status', params.get('status'));
        if (!localStorage.token) {
          window.location.replace('/#/login');
        } else {
          window.location.replace('/#/dashboard');
        }
      }
    }
  }, [history.location.search]);

  const handleChange = (event) => {
    localStorage.removeItem('b64_registration_in_url');
    setCode(event.target.value);
  };

  let heroImageArray = upcomingEventList
    .filter((item) => item.challegeBanner)
    .map((item) => item.challegeBanner);

  console.log(upcomingEventList, 'ARRAY');

  const getUpcomingEventList = () => {
    if (code == '') {
      return upcomingEventList
        .filter((item) => item.eventView === 'PUBLIC')
        .map((eventDetail, index) => (
          <Card
            challenge={eventDetail}
            key={index}
            setUpcomingEventList={setUpcomingEventList}
            registerModalView={registerModalView}
            setRegisterModalView={setRegisterModalView}
            userPastedCode={false}
            instruction_details={instructionDetails}
          />
        ));
    } else {
      const eventSearched = upcomingEventList.filter(
        (item) => item.registrationCode === code
      );
      const userPastedCode =
        history.location.search &&
        history.location.search.indexOf('?token=') !== -1;

      return eventSearched.length > 0 ? (
        upcomingEventList
          .filter((item) => item.registrationCode === code)
          .map((eventDetail, index) => (
            <Card
              challenge={eventDetail}
              key={index}
              setUpcomingEventList={setUpcomingEventList}
              registerModalView={registerModalView}
              setRegisterModalView={setRegisterModalView}
              userPastedCode={userPastedCode}
              instruction_details={instructionDetails}
            />
          ))
      ) : (
        <div className="event-search-fallback">No event</div>
      );
    }
  };
  return (
    <div className="upcoming-event-container">
      <header className="upcoming-event-navbar">
        <span>
          <img src={LogoPng} width={40} height={40} />
        </span>
        <div className="right">
          <TextField
            id="outlined-basic"
            label="Search by code"
            variant="outlined"
            margin="dense"
            onChange={handleChange}
          />
          <button
            onClick={() => {
              history.push('/login');
            }}
          >
            {localStorage.getItem('token') ? 'Dashboard' : 'Sign In | Sign up'}
          </button>
        </div>
      </header>
      <div className="upcoming-event-hero">
        {
          // console.log(heroImageArray , 'image')
          window.banner != null ? (
            <div style={{width: '100%'}}>
              <img src={window.banner} style={{width: '100%'}} />
            </div>
          ) : heroImageArray && heroImageArray.length > 0 ? (
            <Carousel
              showThumbs={false}
              style={{width: '100%'}}
              autoPlay={true}
              swipeable={true}
              dynamicHeight={true}
              infiniteLoop={true}
              showArrows={false}
              interval={3000}
            >
              {heroImageArray.map((item) => {
                return (
                  <div style={{width: '100%'}}>
                    <img src={item} style={{width: '100%'}} />
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <div style={{width: '100%'}}>
              <img
                src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/W21Banner.jpeg"
                style={{width: '100%'}}
              />
            </div>
          )
        }
      </div>
      {/* <div className="upcoming-event-intro">
        <div className="upcoming-event-heading"></div>
      </div>
      <div className="upcoming-event-list">
        {upcomingEventListLoader ? (
          <ScrollableList source="home-page">
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
            <div className="challenge-card"></div>
          </ScrollableList>
        ) : (
          <ScrollableList>
            {upcomingEventList.length > 0 ? (
              getUpcomingEventList()
            ) : (
              <div className="event-search-fallback">No event</div>
            )}
          </ScrollableList>
        )}
      </div> */}
      {window.location.href == 'https://monika.mhealth.ai/#/' ||
      window.location.href == 'https://w21.mhealth.ai/#/' ||
      window.location.href == 'http://localhost:3000/#/' ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 30,
          }}
        >
          <div style={{width: '400px'}}>
            <ScrollableList
              style={{
                width: '400px',
              }}
              source="home-page"
            >
              <div>
                <Card
                  style={{width: '400px', maxHeight: 300, overflow: 'scroll'}}
                >
                  <div>
                    {' '}
                    <img
                      style={{height: 140, width: '100%', objectFit: 'contain'}}
                      src="images/Testimonials/shikha_kothari.jpeg"
                    />{' '}
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Shikha kothari
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{fontSize: 12}}
                    >
                      <q>
                        {' '}
                        I am shikha kothari attached with NutriExpert from last
                        6months. I am having great experience with community,
                        very friendly atmosphere. I got good exposure to show my
                        potential on this platform. They are very helpful and
                        transparent and most important is, we get a chance to
                        work on our ideas and we can inculcate our ideas, which
                        really makes me comfortable.
                      </q>
                    </Typography>
                  </CardContent>
                  {/* <CardActions>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
              </CardActions> */}
                </Card>{' '}
              </div>{' '}
              <div>
                <Card
                  style={{
                    width: '400px',
                    marginLeft: 10,
                    maxHeight: 300,
                    overflow: 'scroll',
                  }}
                >
                  <div>
                    {' '}
                    <img
                      style={{height: 140, width: '100%', objectFit: 'contain'}}
                      src="images/Testimonials/Prasanna.jpeg"
                    />{' '}
                  </div>
                  <CardContent style={{}}>
                    <Typography gutterBottom variant="h5" component="div">
                      Prasanna Arun
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{fontSize: 12}}
                    >
                      <q>
                        {' '}
                        I am so privileged to be associated with mHealth for the
                        last 1yr and 6 months. So many learnings especially
                        technology I learned CRM, and social media, I use to get
                        a lot of opportunities continuously in Diabetes reversal
                        programs, and so many challenges conducted by mHealth.
                        Got social media exposure through live stream Facebook
                        and youtube. I myself got confident and I can fly more
                        with the support of mHealth. Wonderful team and great
                        support.
                      </q>
                    </Typography>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card
                  style={{width: '400px', maxHeight: 300, overflow: 'scroll'}}
                >
                  <div>
                    {' '}
                    <img
                      style={{height: 140, width: '100%', objectFit: 'contain'}}
                      src="images/Testimonials/Daniyah.jpeg"
                    />{' '}
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Daniyah
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{fontSize: 12}}
                    >
                      <q>
                        {' '}
                        With NutriExpert, I have expanded my practice. I'm happy
                        that I'm on this platform as it is giving me
                        opportunities to grow and make a difference in people's
                        lives{' '}
                      </q>
                    </Typography>
                  </CardContent>
                </Card>
              </div>{' '}
              <div>
                <Card
                  style={{width: '400px', maxHeight: 300, overflow: 'scroll'}}
                >
                  <div>
                    {' '}
                    <img
                      style={{height: 140, width: '100%', objectFit: 'contain'}}
                      src="images/Testimonials/Shilpa_Mundada.jpeg"
                    />{' '}
                  </div>

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Shilpa Mundada
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      style={{fontSize: 12}}
                    >
                      <q>
                        {' '}
                        NutriExpert, this platform has given me a different
                        array to nurture my expertise. It’s a perfect combo of
                        all the elements for smooth startup as a Nutritionist so
                        that I can focus on my expertise rather than trial and
                        error for my own clinic. Thank you for providing this
                        platform 😊{' '}
                      </q>
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            </ScrollableList>{' '}
          </div>

          <div style={{width: '400px', height: '450px'}}>
            {/* <Carousel
            showThumbs={false}
            autoPlay={true}
            swipeable={true}
            dynamicHeight={true}
            infiniteLoop={true}
            showArrows={false}
            interval={2000}
          > */}

            <ScrollableList
              style={{
                width: '400px',
              }}
              source="home-page"
            >
              {' '}
              <div
                style={{width: '400px', height: '300px', objectFit: 'cover'}}
              >
                <img
                  style={{height: 300, width: 400, objectFit: 'contain'}}
                  src="images/Testimonials/prog_1.png"
                  // style={{maxWidth: '100%', height: '300px', objectFit: 'co'}}
                />
              </div>
              <div
                style={{maxWidth: '100%', height: '300px', objectFit: 'cover'}}
              >
                <img
                  style={{height: 300, width: 400, objectFit: 'contain'}}
                  src="images/Testimonials/prog_2.png"
                  // style={{width: '100%', height: '300px', objectFit: 'cover'}}
                />
              </div>{' '}
              <div
                style={{maxWidth: '100%', height: '300px', objectFit: 'cover'}}
              >
                <img
                  style={{height: 300, width: 400, objectFit: 'contain'}}
                  // style={{height: 300}}
                  src="images/Testimonials/prog_3.png"
                  // style={{width: '100%', height: '300px', objectFit: 'cover'}}
                />
              </div>
            </ScrollableList>
            {/* <img
              src="images/Testimonials/Daniyah.jpeg"
              style={{width: '300px', height: '300px', objectFit: 'cover'}}
            /> */}
            {/* </Carousel> */}
          </div>

          <div style={{height: '300px'}}>
            <Card
              style={{
                width: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '300px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#d1d0cd',
                  fontWeight: 'bolder',
                }}
              >
                {' '}
                <h2> Blogs </h2>{' '}
              </div>
              <CardContent
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  lineHeight: '50px',
                }}
              >
                <a href="https://www.nutriexpert.io/post/eating-disorders">
                  {' '}
                  <Chip
                    style={{maxWidth: '200px'}}
                    label="Eating Disorder"
                    variant="outlined"
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src="https://previews.123rf.com/images/fokaspokas/fokaspokas1812/fokaspokas181200287/114275830-hamburger-icon-fast-food-black-symbol-on-transparent-background.jpg"
                      />
                    }
                  />
                </a>
                <a href="https://www.nutriexpert.io/post/not-every-tear-is-a-bad-tear">
                  {' '}
                  <Chip
                    label="Not every tear is bad"
                    variant="outlined"
                    style={{maxWidth: '200px'}}
                  />
                </a>
                <a href="https://www.nutriexpert.io/post/the-art-of-mindful-eating">
                  {' '}
                  <Chip
                    style={{maxWidth: '200px'}}
                    label="The art of mindful eating"
                    variant="outlined"
                  />
                </a>
                {/* <a href="">
                {' '}
                <Chip
                  style={{maxWidth: '200px'}}
                  label="Chip Outlined"
                  variant="outlined"
                />
              </a> */}
                {/* <Chip label="Chip Outlined" variant="outlined" /> */}
                {/* </Stack> */}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '300px',
              }}
            >
              <a href="https://www.facebook.com/mhealthaiconnect">
                {' '}
                <FacebookOutlinedIcon
                  style={{color: '#2747a8', height: 25, width: 25}}
                />
              </a>
              <a href="https://www.linkedin.com/in/mhealthai/">
                <LinkedInIcon
                  style={{
                    color: '#29549e',
                    height: 25,
                    width: 25,
                    marginTop: 20,
                  }}
                />
              </a>
              <a href="https://www.instagram.com/mhealth.ai/">
                {' '}
                <InstagramIcon
                  style={{height: 25, width: 25, marginTop: 20}}
                />{' '}
              </a>
              <TwitterIcon
                style={{
                  color: 'lightblue',
                  height: 25,
                  width: 25,
                  marginTop: 20,
                }}
              />
              <a href="https://www.youtube.com/channel/UC5jND1Fsjia05qY9xizJ4wg">
                {' '}
                <YouTubeIcon
                  style={{color: 'red', height: 25, width: 25, marginTop: 20}}
                />
              </a>
              <PinterestIcon
                style={{color: 'red', height: 25, width: 25, marginTop: 20}}
              />
            </Card>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default UpcomingEvents;
