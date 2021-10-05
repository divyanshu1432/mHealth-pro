import React, {useState, useEffect} from 'react';
import {PlusCircle} from 'react-feather';

import {getOldEvents} from '../../services/challengeApi';
import Navbar from '../Navbar';
import TopUserDetails from '../TopUserDetails';
import ScrollableList from '../ScrollableList';
import Message from 'antd-message';
import RegisteredUserTable from './RegisteredUserTable';
import {getUserDetailsByEventID} from '../../services/challengeApi';
import TriStateToggle from '../toggle/TriStateToggle';
import EventManagementCard from './EventManagementCard';
import CreateEventModal from './CreateEventModal';
import FullScreen from '../Utility/FullScreen';

const EventManagement = () => {
  const [eventList, setEventList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [registeredUserList, setRegisteredUserList] = useState({
    data: [],
    message: '',
    loading: false,
  });
  const [currentSwitchSelection, setCurrentSwitchSelection] =
    useState('current');
  const [createEventModal, setCreateEventModal] = useState(false);
  const [editEventObject, setEditEventObject] = useState();

  const getUserDetailsWrapper = (currentEvent) => {
    setSelectedEvent(currentEvent);
    setRegisteredUserList({
      loading: true,
      message: '',
      data: [],
    });
    getUserDetailsByEventID(currentEvent)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setRegisteredUserList({
            loading: false,
            message: res.data.response.responseMessage,
            data: res.data.response.responseData,
          });
        } else {
          setRegisteredUserList({
            loading: false,
            message: res.data.response.responseMessage,
            data: [],
          });
        }
      })
      .catch((err) => {
        setRegisteredUserList({
          loading: false,
          message: '',
          data: [],
        });
      });
  };

  const handleEventEdit = (editObject) => {
    setEditEventObject(editObject);
    setCreateEventModal(true);
  };

  const initialFetchEvents = () => {
    window.message = Message;
    getOldEvents().then((res) => {
      if (res.data.response.responseCode === 0) {
        if (
          res.data.response.responseData &&
          res.data.response.responseData.events
        ) {
          setEventList(res.data.response.responseData.events);
        }
        if (
          res.data.response.responseData.events &&
          res.data.response.responseData.events[0]
        ) {
          let zerothUpcomingEvent =
            res.data.response.responseData.events.filter((item) => {
              return item.isActive == 1 && item.timePeriod === 'CURRENT';
            })[0];

          if (zerothUpcomingEvent) {
            getUserDetailsWrapper(zerothUpcomingEvent);
          }
        }
      } else {
        setEventList([]);
      }
    });
  };

  useEffect(() => {
    initialFetchEvents();
  }, []);

  const displayListOfChallenges = (type) => {
    let list = [];

    let currentEventsList =
      currentSwitchSelection === 'old'
        ? eventList.filter((item) => {
            return item.isActive == 0;
          })
        : currentSwitchSelection === 'upcoming'
        ? eventList.filter((item) => {
            return item.isActive == 1 && item.timePeriod === 'FUTURE';
          })
        : eventList.filter((item) => {
            return item.isActive == 1 && item.timePeriod === 'CURRENT';
          });

    if (currentEventsList && currentEventsList.length > 0) {
      list = currentEventsList.map((challenge) => (
        <EventManagementCard
          challenge={challenge}
          getUserDetailsWrapper={getUserDetailsWrapper}
          selectedEvent={selectedEvent}
          key={challenge.id}
          handleEventEdit={handleEventEdit}
        />
      ));
    } else {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    if (list.length === 0) {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    return list;
  };
  return (
    <>
      <div style={{minHeight: '100vh', width: '100vw', background: '#fff'}}>
        <TopUserDetails />
        <Navbar />

        <div className="Main">
          <div className="Challenges">
            <div className="event-list" id="event-list">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div className="challenges-heading" style={{marginRight: 20}}>
                  Events
                </div>
                <TriStateToggle
                  values={['old', 'current', 'upcoming']}
                  selected={currentSwitchSelection}
                  handleChange={(value) => setCurrentSwitchSelection(value)}
                />
                {localStorage.getItem('role') &&
                  localStorage.getItem('role') !== 'Customer' && (
                    <div style={{marginRight: 'auto'}}>
                      <button
                        className="create-event-button target-btn"
                        onClick={() => {
                          setCreateEventModal(true);
                          setEditEventObject();
                        }}
                        style={{width: 'max-content'}}
                      >
                        <PlusCircle size="18" style={{marginRight: 2}} />
                        Create Event
                      </button>
                    </div>
                  )}
              </div>
              <ScrollableList>{displayListOfChallenges()}</ScrollableList>
            </div>
            <div
              className="d-flex j-c-sp-btn cursor-pointer"
              style={{margin: '2em 0'}}
            >
              <div className="challenges-heading">List of Participants</div>
              <FullScreen id="event-list" />
            </div>

            <RegisteredUserTable
              defaultRegisteredUserList={registeredUserList}
              selectedEvent={selectedEvent}
            />
          </div>
        </div>
      </div>

      {createEventModal && (
        <CreateEventModal
          createEventModal={createEventModal}
          setCreateEventModal={setCreateEventModal}
          setEditEventObject={setEditEventObject}
          editEventObject={editEventObject}
          initialFetchEvents={initialFetchEvents}
          eventsList={eventList}
        />
      )}
    </>
  );
};

export default EventManagement;
