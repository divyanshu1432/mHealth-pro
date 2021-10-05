import React, { useState, useEffect } from 'react';
import Modal from '@material-ui/core/Modal';
import CancelIcon from '@material-ui/icons/Cancel';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from '@material-ui/core/styles';
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import StarRatings from 'react-star-ratings';
 import { ratingProgramByUser, urlPrefix, getSubEvent , getCoachData } from '../services/apicollection';
 import InfoDialog from './Utility/InfoDialog';


function getModalStyle() {
  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    background: '#fff',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    outline: 'none',
    padding: '15px',
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: '90vh',
    overflow: 'scroll',
  },
}));

const programTypeConfig = {
  YOGA: 'Yoga',
  ZUMBA: 'Zumba',
  FUN_DAY: 'Fun Day',
  MEDITATION: 'Meditation',
  HIIT: 'HIIT',
  CONSULTATION: 'Consultation',
  WELLNESS_CAMP: ' Wellness Camp',
  PLANK: 'Plank',
  DANCE_FITNESS: ' Dance Fitness',
  MASTER_CLASS: 'Master Class',
  VACCINATION_CAMP: 'Vaccination Camp',
  DIET_NUTRITION: 'Diet Nutrition',
  DANCE: 'Dance',
  WALKING: 'Walking',
  RUNNING: 'Running',
  WELLNESS_PARTNER: 'Wellness Partner',
  FITNESS_CLASS: 'Fitness Class',
  AEROBICS: 'Aerobics',
  BIKING: 'Biking',
  HIKING: 'Hiking',
  SWIMMING: 'Swimmming',
  COOKING: 'Cooking',
  ARTICLE: 'Article',
  CYCLING: 'Cycling',
  OTHERS: 'Others',
};

export default function EventInfoModal({
  modalView,
  setModalView,
  challenge,
  type,
  dat,
 
  setActivityModalView = () => {},
}) {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const handleClose = () => {
    setModalView(false);
  };

  const [actualData, setactualData] = useState([]);

    
  const getData = async () => {

 
    const url = `${urlPrefix}${getSubEvent}?eventId=${challenge.eventId}`;
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

    setactualData(datares.response.responseData)
  }


useEffect(() => {
 
 getData()
 
}, [])
console.log(challenge)


  const rateUs = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showUnsubscribeModal, setUnsubModal] = useState(false);


    const [rateMessage, setrateMessage] = useState('');
    const [eventId, seteventId] = useState('10');

    const feedBack = (e) => { setrateMessage(e.target.value); }
                
    // CALL API IF RATING IS <=  TWO!
    const rateDone = () => {

      setUnsubModal(false)
      const URL = `${urlPrefix}${ratingProgramByUser}?comment=${rateMessage}&rateValue=${localStorage.getItem('rating')}&subEventId=${challenge.id}`;
      return axios.put(URL, {}, {
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

      ).then(() => {
     
        getData()
        userRated()
        blankStar()
        // console.log(challenge.id);
        localStorage.setItem('rated', challenge.id)
        //  localStorage.setItem('rating', 4)
        message.success('Rated succesfully ! Thank you');

      })





    };






    const ratingChanged = (newRating) => {
      localStorage.setItem('rating', newRating);

      if (newRating <= 5 && localStorage.getItem('rated') != challenge.id) {
        setUnsubModal(true)

      }

    };

    const InputRate = () => {

      if (challenge.otherStatus == 'SUBSCRIBED' && challenge.userStatusInProgram != 'PENDING' && challenge.isRated == false) {
        return (
          <>

<div  style={{marginTop:'-5px'}}>

            <ReactStars
           
              onChange={ratingChanged}
              count={5}
              size={20}
              activeColor="#ffd700"

            /> 
            </div>
{/* 
<StarRatings
          changeRating={ratingChanged}
          starRatedColor="#ffd700"
          starDimension='15px'
          numberOfStars={5}
          name='rating'
          starSpacing='0px'
        /> */}



          </>
        );
      }
  
      
    }

    const blankStar = () => {
      if (challenge.otherStatus === 'SUBSCRIBED' && challenge.isRated == true) {
        return (
          <div style={{ marginLeft: '-5px' }}>
            {
              actualData.map((curData, ind) => {
                // console.log(curData)
                if (challenge.id == curData.id && curData.isRated == true) {

                  return (<div style={{ marginLeft: '5px', marginTop: '-5px' }}>
                    <ReactStars
                      count={(5 - curData.userStarRateValue)}
                      size={20}
                      color="#CAD3C8"
                      activeColor="#CAD3C8"

                    />
                  </div>

                  );

                }
              })
            }
          </div>
        );
      }
    }

    const userRated = () => {

      if (challenge.otherStatus === 'SUBSCRIBED' && challenge.userStatusInProgram == 'SUBSCRIBED' && challenge.isRated == true) {
        return (
          <>
            {
              actualData.map((curData, ind) => {
                // console.log(curData)
                if (challenge.id == curData.id && curData.isRated == true) {
                  const  userStar = parseFloat(curData.userStarRateValue);
                  return (<div style={{ marginTop: '-5px', border: 'none' }}>
                 <ReactStars
                      count={curData.userStarRateValue}
                      size={20}
                      color="#ffd700"

                    /> 

                  </div>



                  );

                }
              })
            }
          </>
        );

      }
    }


    const [diaplay, setdisplsy] = useState()

    // if (challenge.userStatusInProgram === 'SUBSCRIBED' ) {
    return (
      <>
        <div style={{ display: 'flex',  height: '22px', border: "none" }}>
          {

            InputRate()
          }


          {
            userRated()
          }
          {

            blankStar()
          }



      
        </div>

        <InfoDialog

          handleClose={() => setUnsubModal(false) 
         }
          open={showUnsubscribeModal}
          title=""
          style={{}}
        >
          <div style={{ paddingLeft: '100px', paddingRight: '100px' }} >
            <div class="" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: "flex", justifyContent: 'center' }}>
                <ReactStars
                  style={{ marginBottom: '15px', marginLeft: '400px' }}
                  onChange={ratingChanged}
                  count={(localStorage.getItem('rating'))}
                  size={20}
                  color="#ffd700"

                />

              </div>
              <div className="" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ marginLeft: '40px' }}>  Comment your review </p>


                <div style={{}}>
                  <input type="hidden" name='eventId' value='10' name="eventId" />
                  <input type="hidden" name="rating" value={localStorage.getItem('rating')} />
                  <input type="hidden" name='programId' value={challenge.id} />
                  <textarea rows="4" cols="30" className='form-control' onChange={feedBack} value={rateMessage} name='message' type='text' required maxLength='300' placeholder="maximum 300 words" />
                  {/* <Button variant="primary" onClick={rateDone} className="mt-3">Submit</Button> */}
                </div>
              </div>


              <div className="event-unsubscribe-modal">
                <button
                  className="is-success"
                  onClick={rateDone}
                  style={{
                    background: '#F43F5E',
                    marginTop: 10,
                    width: 100,
                    height: 25,

                  }}
                >
                  Submit
                </button>



              </div>

            </div>
          </div>
        </InfoDialog>


      </>
    );


                }








  const modalBody = (
    <div style={modalStyle} className={`${classes.paper} event-info-modal`}>
      <div style={{position: 'relative'}}>
        <div>
          <img
            src={
              challenge.eventLogo ||
              challenge.eventImage ||
              'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Background.png'
            }
            style={{
              width: '100%',
              height: 200,
              borderRadius: 4,
              border: '1px solid #f5f5f5',
              // objectFit: 'fill',
            }}
          />
          <div style={{position: 'relative'}}>
            <div>
              {type == 'program' && (
                <div
                  style={{
                    fontSize: 12,
                    color: '#fff',
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {challenge.timePeriod !== 'PAST' && (
                    <span
                      style={{
                        background: '#757575',
                        borderRadius: 4,
                        padding: '0px 4px',
                        marginRight: 5,
                        marginBottom: 3,
                      }}
                    >
                      Registrations Open till {challenge.registrationEndDate}
                    </span>
                  )}
                  {challenge.eventType && challenge.eventType != '' && (
                    <span
                      style={{
                        background: 'rgb(81, 138, 214)',
                        borderRadius: 4,
                        padding: '0px 4px',
                        marginRight: 5,
                        marginBottom: 3,
                      }}
                    >
                      {programTypeConfig[challenge.eventType]}
                    </span>
                  )}

                  <span
                    style={{
                      background: '#e91e63',
                      borderRadius: 4,
                      padding: '0px 4px',
                      marginRight: 5,
                      marginBottom: 3,
                    }}
                  >
                    Available Seats : {challenge.seatCount}
                  </span>

                  <span
                    style={{
                      background: '#66bb6a',
                      borderRadius: 4,
                      padding: '0px 4px',
                      marginBottom: 3,
                    }}
                  >
                    {challenge.subEventMode}
                  </span>

                </div>
              )}
{challenge.ratingIcon && (
              <div style={{marginBottom: 5, marginTop: '0.5em' , display:'flex'}}>
                <div style={{fontWeight: 800}}>Rating </div>
                <div style={{}}><span style={{ height: '25px' , background: 'white', border: 'none'}}> {rateUs()} </span>
</div>
              </div>
)}

              <div style={{fontWeight: 800}}>Name</div>
              <div style={{fontSize: 12}}>
                {challenge.challengeName || challenge.eventName}

                {type && type == 'program' && (
                  <div>
                    Coach: <span>{challenge?.coachName}</span>{' '}
                  </div>
                )}
              </div>
            </div>
            <div style={{marginBottom: 5, marginTop: '0.5em'}}>
              <div style={{fontWeight: 800}}>Description</div>
              <div style={{fontSize: 12}}>
                {challenge.description || challenge.eventDescription}
              </div>
            </div>

            {challenge.rules && (
              <div style={{marginBottom: 5, marginTop: '0.5em'}}>
                <div style={{fontWeight: 800}}>Rules</div>
                <div style={{fontSize: 12}}>{challenge.rules}</div>
              </div>
            )}

            {challenge.termAndCondition && (
              <div style={{marginBottom: 5, marginTop: '0.5em'}}>
                <div style={{fontWeight: 800}}>Term and Conditions</div>
                <div style={{fontSize: 12}}>{challenge.termAndCondition}</div>
              </div>
            )}

            {challenge.termAndConditions && (
              <div style={{marginBottom: 5, marginTop: '0.5em'}}>
                <div style={{fontWeight: 800}}>Term and Conditions</div>
                <div style={{fontSize: 12}}>{challenge.termAndConditions}</div>
              </div>
            )}

            {challenge.rewards && (
              <div style={{marginBottom: 5, marginTop: '0.5em'}}>
                <div style={{fontWeight: 800}}>Rewards</div>
                <div style={{fontSize: 12}}>{challenge.rewards}</div>
              </div>
            )}


         
          

            {challenge.reward && (
              <div style={{marginBottom: 5, marginTop: '0.5em'}}>
                <div style={{fontWeight: 800}}>Reward</div>
                <div style={{fontSize: 12}}>{challenge.reward}</div>
              </div>
            )}


            {challenge.userStatusInProgram === 'SUBSCRIBED' &&
              challenge.timePeriod !== 'PAST' && (
                <div
                  className="d-flex"
                  style={{
                    justifyContent: 'center',
                    width: '100%',
                    marginBottom: 10,
                  }}
                >
                  <div
                    className="register-button"
                    style={{position: 'relative', bottom: 0, marginRight: 10}}
                  >
                    <button
                      onClick={() => {
                        handleClose();
                        setActivityModalView({status: true, type: 'add'});
                      }}
                      style={{background: '#66bb6a', fontSize: 10}}
                    >
                      Add Activity
                    </button>
                  </div>

                  <div
                    className="register-button"
                    style={{position: 'relative', bottom: 0 , display:'flex'}}
                  >
                    <button
                      onClick={() => {
                        handleClose();
                        setActivityModalView({status: true, type: 'view'});
                      }}
                      style={{background: '#29b6f6', fontSize: 10}}
                    >
                      View Activity
                    </button>

                  </div>
                </div>
              )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(0,0,0,0.1)',
                paddingTop: 5,
              }}
            >
              {challenge.sponsorLink && (
                <div style={{fontSize: 10, width: 300}}>
                  <div
                    dangerouslySetInnerHTML={{__html: challenge.sponsorLink}}
                    className="info-modal-anchor-link"
                  />
                </div>
              )}

              {!type && challenge.eventLink && (
                <div style={{fontSize: 10, width: 300}}>
                  <div
                    dangerouslySetInnerHTML={{__html: challenge.eventLink}}
                    className="info-modal-anchor-link"
                  />
                </div>
              )}

              {type &&
                type == 'program' &&
                challenge.isSubscribed &&
                challenge.registrationFees == 0 && (
                  <div
                    style={{
                      width: '70%',
                    }}
                  >
                    {challenge.eventLink && (
                      <div style={{marginTop: '0.25em'}}>
                        <a
                          href={challenge.eventLink}
                          target="_blank "
                          style={{fontSize: '12px'}}
                        >
                          {challenge.eventLink}
                        </a>
                      </div>
                    )}
                    {challenge.activationCode && (
                      <div
                        style={{
                          marginTop: '0.25em',
                          fontSize: 12,
                        }}
                      >
                        Activation Code - {challenge.activationCode}
                      </div>
                    )}

                    {challenge.subscriptionDetails && (
                      <div
                        style={{
                          marginTop: '0.25em',
                          fontSize: 12,
                        }}
                      >
                        {challenge.subscriptionDetails}
                      </div>
                    )}
                  </div>
                )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  marginLeft: 'auto',
                }}
              >

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#000',
                  }}
                >
                  Powered by
                </div>
                <Avatar
                  src={challenge.sponsorLogo || challenge.sponsorImage}
                  className="avatar-component sponser-logo"
                  style={{marginLeft: 5}}
                />
              </div>
            </div>
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
      >
        <div style={{outline: 'none'}}>{modalBody}</div>
      </Modal>
    </div>
  );
}




