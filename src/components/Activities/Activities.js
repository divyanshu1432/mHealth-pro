import React, {useEffect, useState} from 'react';
import Message from 'antd-message';
import {PlusCircle} from 'react-feather';
import TopUserDetails from '../TopUserDetails';
import Navbar from '../Navbar';
import TriStateToggle from '../toggle/TriStateToggle';
import ScrollableList from '../ScrollableList';
import FallbackDiv from '../Utility/FallbackDiv';
import SubEventCard from '../Dashboard/Activity/SubEventCard';
import RegisteredUsers from './RegisteredUsers';
import ActivityModal from './ActivityModal';
import FullScreen from '../Utility/FullScreen';
import EditPaymentDetailsModal from './EditPaymentDetailsModal';
import AdInstructor from './AddinstructorModal';







import {
  getOldEvents,
  getSubEventUsersList,
  getAllSubActivities,
} from '../../services/challengeApi';







const Activities = () => {
  const [activityState, setActivityState] = useState({
    listOfEventsData: [],
    listOfSubEventsData: [],
    selectedToggle: 'current',
    selectedSubEvent: undefined,
    currentSubEventObj: {},
    listOfSubEventUsers: {data: []},
  });
  const [createActivityModal, setCreateActivityModal] = useState(false);
  const [editActivityObject, setEditActivityObject] = useState();

  const [paymentModalStatus, setPaymentModalStatus] = useState(false);
  const [editPaymentObject, setEditPaymentObject] = useState();
  const [tabSelection, setTabSelection] = useState('current');

  const getSubEventsByTabSelection = (data) => {
    let tempData = data.filter((item) => {
      if (tabSelection == 'current') {
        return item.timePeriod == tabSelection.toUpperCase();
      }
      if (tabSelection == 'old') {
        return item.timePeriod == 'PAST';
      }
      if (tabSelection == 'upcoming') {
        return item.timePeriod == 'FUTURE';
      }
    });
    return tempData;
  };





  const fetchAllActivities = () => {
    setActivityState({
      listOfEventsData: [],
      listOfSubEventsData: [],
      selectedToggle: 'current',
      selectedSubEvent: undefined,
      currentSubEventObj: {},
      listOfSubEventUsers: {data: []},
    });
    window.message = Message;

    getOldEvents().then((res) => {
      if (res.data.response.responseMessage === 'SUCCESS') {
        let currentPresentEvents = res.data.response.responseData.events.filter(
          (item) => {
            return item.isActive == 1;
          }
        );
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfEventsData: currentPresentEvents,
          };
        });
      }
    });

    getAllSubActivities().then((res) => {
      if (res.data.response.responseMessage === 'SUCCESS') {
        let subEventData = res.data.response.responseData;

        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventsData: subEventData,
            selectedSubEvent:
              getSubEventsByTabSelection(subEventData).length > 0
                ? getSubEventsByTabSelection(subEventData)[0]['id']
                : undefined,
            currentSubEventObj:
              getSubEventsByTabSelection(subEventData).length > 0
                ? getSubEventsByTabSelection(subEventData)[0]
                : {},
          };
        });

        if (
          getSubEventsByTabSelection(subEventData).length > 0 &&
          getSubEventsByTabSelection(subEventData)[0]
        ) {
          getSubEventUsersList(
            getSubEventsByTabSelection(subEventData)[0]['id'],
            'WEB'
          ).then((subEventResponse) => {
            if (
              subEventResponse.data.mhealthResponseMessage == 'SUCCESS' &&
              subEventResponse.data.response &&
              subEventResponse.data.response.responseMessage == 'SUCCESS' &&
              subEventResponse.data.response.responseData
            ) {
              setActivityState((prevState) => {
                return {
                  ...prevState,
                  listOfSubEventUsers: {
                    data: subEventResponse.data.response.responseData,
                  },
                };
              });
            } else {
              setActivityState((prevState) => {
                return {
                  ...prevState,
                  listOfSubEventUsers: {
                    data: [],
                  },
                };
              });
            }
          });
        }
      }
    });
  };

  const fetchSubEvents = () => {
    getAllSubActivities()
      .then((res) => {
        if (res.data.response.responseMessage === 'SUCCESS') {
          let subEventData = res.data.response.responseData;

          setActivityState((prevState) => {
            return {
              ...prevState,
              listOfSubEventsData: subEventData,
              selectedSubEvent:
                subEventData.length > 0 ? subEventData[0]['id'] : undefined,
              currentSubEventObj:
                subEventData.length > 0 ? subEventData[0] : {},
            };
          });
          if (subEventData.length > 0 && subEventData[0]) {
            getSubEventUsersList(subEventData[0]['id'], 'WEB').then(
              (subEventResponse) => {
                if (
                  subEventResponse.data.mhealthResponseMessage == 'SUCCESS' &&
                  subEventResponse.data.response &&
                  subEventResponse.data.response.responseMessage == 'SUCCESS' &&
                  subEventResponse.data.response.responseData
                ) {
                  setActivityState((prevState) => {
                    return {
                      ...prevState,
                      listOfSubEventUsers: {
                        data: subEventResponse.data.response.responseData,
                      },
                    };
                  });
                } else {
                  setActivityState((prevState) => {
                    return {
                      ...prevState,
                      listOfSubEventUsers: {
                        data: [],
                      },
                    };
                  });
                }
              }
            );
          }
        } else {
          setActivityState((prevState) => {
            return {
              ...prevState,
              listOfSubEventsData: [],
              selectedSubEvent: undefined,
              currentSubEventObj: {},
            };
          });
        }
      })
      .catch((err) => {
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventsData: [],
            selectedSubEvent: undefined,
            currentSubEventObj: {},
          };
        });
      });
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const handleSubEventEdit = (subEvntObj) => {
    setEditActivityObject(subEvntObj);
    setCreateActivityModal(true);
  };

  const handleSubEventSelection = (currActivityObj) => {
    setActivityState((prevState) => {
      return {
        ...prevState,
        selectedSubEvent: currActivityObj.id,
        currentSubEventObj: currActivityObj,
      };
    });
    getSubEventUsersList(currActivityObj.id, 'WEB').then((subEventResponse) => {
      if (
        subEventResponse.data.mhealthResponseMessage == 'SUCCESS' &&
        subEventResponse.data.response &&
        subEventResponse.data.response.responseMessage == 'SUCCESS' &&
        subEventResponse.data.response.responseData
      ) {
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventUsers: {
              data: subEventResponse.data.response.responseData,
            },
          };
        });
      } else {
        setActivityState((prevState) => {
          return {
            ...prevState,
            listOfSubEventUsers: {
              data: [],
            },
          };
        });
      }
    });
  };




  const handleModalClose = () => {
    setEditPaymentObject();
    setPaymentModalStatus(false);

    if (activityState?.selectedSubEvent) {
      getSubEventUsersList(activityState?.selectedSubEvent, 'WEB').then(
        (subEventResponse) => {
          if (
            subEventResponse.data.mhealthResponseMessage == 'SUCCESS' &&
            subEventResponse.data.response &&
            subEventResponse.data.response.responseMessage == 'SUCCESS' &&
            subEventResponse.data.response.responseData
          ) {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: subEventResponse.data.response.responseData,
                },
              };
            });
          } else {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: [],
                },
              };
            });
          }
        }
      );
    }
  };

  const renderSubEventList = () => {
    let subEventByTabSelection = getSubEventsByTabSelection(
      activityState.listOfSubEventsData
    );
    if (subEventByTabSelection.length > 0) {
      return (
        <>
          <ScrollableList>
            {subEventByTabSelection.map((subEventDetail) => (
              <SubEventCard
                subEventDetail={subEventDetail}
                type="manage"
                handleSubEventSelection={handleSubEventSelection}
                selectedSubEvent={activityState.selectedSubEvent}
                handleSubEventEdit={handleSubEventEdit}
              />
            ))}
          </ScrollableList>
        </>
      );
    } else {
      let list = [];
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
      return <ScrollableList>{list}</ScrollableList>;
    }
  };

  const handleToggleChange = (currTab) => {
    setTabSelection(currTab);
    let subEventByTabSelection = activityState.listOfSubEventsData.filter(
      (item) => {
        if (currTab == 'current') {
          return item.timePeriod == currTab.toUpperCase();
        }
        if (currTab == 'old') {
          return item.timePeriod == 'PAST';
        }
        if (currTab == 'upcoming') {
          return item.timePeriod == 'FUTURE';
        }
      }
    );
    if (subEventByTabSelection.length > 0 && subEventByTabSelection[0]) {
      getSubEventUsersList(subEventByTabSelection[0]['id'], 'WEB').then(
        (subEventResponse) => {
          if (
            subEventResponse.data.mhealthResponseMessage == 'SUCCESS' &&
            subEventResponse.data.response &&
            subEventResponse.data.response.responseMessage == 'SUCCESS' &&
            subEventResponse.data.response.responseData
          ) {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: subEventResponse.data.response.responseData,
                },
                selectedSubEvent:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]['id']
                    : undefined,
                currentSubEventObj:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]
                    : {},
              };
            });
          } else {
            setActivityState((prevState) => {
              return {
                ...prevState,
                listOfSubEventUsers: {
                  data: [],
                },
                selectedSubEvent:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]['id']
                    : undefined,
                currentSubEventObj:
                  subEventByTabSelection.length > 0
                    ? subEventByTabSelection[0]
                    : {},
              };
            });
          }
        }
      );
    }
  };

  return (
    <div className="Dasboard">
      <TopUserDetails />
      <Navbar />
      <div className="Main">
        <div
          className="Challenges"
          id="activities-management"
          style={{marginBottom: '-30px'}}
        >
          <div className="display-row">
            <div className="challenges-heading" style={{marginRight: 20}}>
              Activities
            </div>
            <TriStateToggle
              values={['old', 'current', 'upcoming']}
              selected={tabSelection}
              handleChange={(item) => handleToggleChange(item)}
            />

            {localStorage.getItem('role') &&
              localStorage.getItem('role') !== 'Customer' && (
                <div style={{marginRight: 'auto' , display:'flex'}}>
                  <button
                    className="create-event-button target-btn"
                    onClick={() => {
                      setCreateActivityModal(true);
                      setEditActivityObject();
                    }}
                    style={{width: 'max-content'}}
                  >
                    <PlusCircle size="18" style={{marginRight: 2}} />
                    Create Program
                  </button>

                  
                   <AdInstructor
                    />
                </div>
              )}
          </div>
          <div style={{width: '100%'}}>{renderSubEventList()}</div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 40,
            height: 32,
          }}
        >
          <FullScreen id="activities-management" />
        </div>
        {activityState.selectedSubEvent &&
          activityState.listOfSubEventsData.length > 0 && (
            <RegisteredUsers
              defaultRegisteredUserList={activityState.listOfSubEventUsers}
              selectedSubEvent={activityState.currentSubEventObj}
              setEditPaymentObject={setEditPaymentObject}
              setPaymentModalStatus={setPaymentModalStatus}
            />
          )}
      </div>

      {createActivityModal && (
        <ActivityModal
          visible={createActivityModal}
          closeModal={() => {
            setCreateActivityModal(false);
            setEditActivityObject();
          }}
          editActivityObject={editActivityObject}
          setEditActivityObject={setEditActivityObject}
          fetchSubEvents={fetchSubEvents}
          eventsList={activityState.listOfEventsData}
        />
      )}

      {paymentModalStatus && (
        <EditPaymentDetailsModal
          visible={paymentModalStatus}
          closeModal={handleModalClose}
          editPaymentObject={editPaymentObject}
          setEditPaymentObject={setEditPaymentObject}
        />
      )}
    </div>
  );
};

export default Activities;
