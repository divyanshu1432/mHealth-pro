import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import {Carousel} from 'react-responsive-carousel';
import TextField from '@material-ui/core/TextField';

import {getOldEvents} from '../../services/challengeApi';
import ScrollableList from '../ScrollableList';
import Card from './Card';
import LogoPng from '../../assets/logo.png';
import HomePageCarousel from '../HomePageCarousel';

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

  const hyperlink = window.location.href;
  const uplink = hyperlink.substring(0, 22);

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
      <div className="upcoming-event-intro">
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
      </div>
    </div>
  );
};

export default UpcomingEvents;
