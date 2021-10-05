import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import Chart from 'react-apexcharts';
import Message from 'antd-message';
import TriStateToggle from './toggle/TriStateToggle';

import EventGallery from './EventGallery';
import Navbar from './Navbar';
import LeaderboardTable from './LeaderBoardTable';
import ListOfEvents from './ListOfEvents';
import UpdateDataSource from './UpdateDataSource';
import ChallengeList from './ChallengeList';
import ChallengeByInvite from './ChallengeByInvite';
import PerformanceTab from './PerformanceTab';
import CreateTeam from './TeamForEvents/CreateOrUpdateTeam';
import {Achievments} from './Achievments';
import SubdayChallenge from './SundayChallenge';
import {getLeaderBoardHeading} from '../utils/commonFunctions';
import {
  getLeaderBoardData,
  getChallengesByDate,
  getEventGalleryData,
  getOldEvents,
  getAchievements,
  challengeActionCall,
  getChallenges,
} from '../services/challengeApi';
import TopUserDetails from './TopUserDetails';
import EventRegisterModal from './EventRegisterModal';
import TargetSetting from './TargetSetting';
import Activity from './Dashboard/Activity/Activity';
import FullScreen from './Utility/FullScreen';

import ChallengeStatus from './Dashboard/ChallengeStatus';
import Badge from '@material-ui/core/Badge';
import SundayChallenge from './SundayChallenge';

const Dashboard = () => {
  const getDefaultTab = () => {
    if (!localStorage.dashboard_default_tab) {
      return 'Activities';
    }

    if (
      localStorage.getItem('dashboard_default_tab') !== undefined &&
      localStorage.getItem('dashboard_default_tab') !== null
    ) {
      switch (localStorage.getItem('dashboard_default_tab')) {
        case 'leaderboard':
          return 'Leaderboard';
        case 'event_gallery':
          return 'Gallery';
        case 'invite':
          return 'Challenge';
        case 'program':
          return 'Activities';
        case 'performance':
          return 'Performance';
        case 'target':
          return 'Target';
        case 'source':
          return 'Source';
        case 'compare':
          return 'Compare';
        case 'team':
          return 'team';
        case 'achievement':
          return 'achievement';
        case 'challenge':
          return 'challenge';
        default:
          return 'Activities';
      }
    }
  };

  const [dashboardState, setDashboardState] = useState({
    listOfChallenges: [],
    leaderBoardData: {
      data: {},
      loading: true,
      message: '',
    },
    selectedAction: getDefaultTab(),
    selectedChallenge: '',
    selectedChallengeObject: {},
    selectedChallengeArray: [],
    compareData: {data: [], categories: []},
    performanceData: {
      name: '',
      data: [],
      categories: [],
    },
    performanceTableData: {
      data: [],
      loading: true,
      message: '',
    },
    barToggle: false,
    eventGalleryData: {
      data: [],
      loading: true,
      message: '',
    },
    challengeSwitch: 'current',
    allChallenge: [],
    instruction_details: undefined,
  });

  useEffect(() => {
    if (
      localStorage.getItem('dashboard_default_tab') !== undefined &&
      localStorage.getItem('dashboard_default_tab') !== null
    ) {
      setDashboardState((prevState) => {
        return {
          ...prevState,
          selectedAction: getDefaultTab(),
        };
      });
    }
  }, [localStorage.getItem('dashboard_default_tab')]);

  const [showRegisterModal, setShowRegisterModal] = useState(
    localStorage.challengeIDRegister ? true : false
  );

  const [challengeStatusMsg, setChallengeStatusMsg] = useState('');
  const [displayChallengeStatus, setDisplayChallengeStatus] = useState(false);
  const [pendingInviteCount, setPendingCount] = useState(null);
  const [reloadChallengeAccepted, setReloadChallengeAccepted] = useState(false);
  const [eventId, seteventId] = useState();

  const [distancelogo, setdistancelogo] = useState({});
  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (localStorage.cid && localStorage.time && localStorage.status) {
      const action = window.atob(localStorage.status);
      const challengeId = window.atob(localStorage.cid);
      challengeActionCall(action, challengeId)
        .then((res) => {
          setChallengeStatusMsg(res.data.response.responseMessage);
          setDisplayChallengeStatus(true);
        })
        .catch(() => {
          setChallengeStatusMsg('Something went wrong!');
          setDisplayChallengeStatus(true);
        });

      localStorage.removeItem('cid');
      localStorage.removeItem('time');
      localStorage.removeItem('status');
    }
  }, []);

  useEffect(() => {
    if (dashboardState.selectedChallenge) {
      getChallenges('Receiver', dashboardState.selectedChallenge)
        .then((res) => {
          if (res.status === 200 && res.data.response.responseCode === 0) {
            setPendingCount(
              res.data.response.responseData.Receiver.filter(
                (rqs) => rqs.challengeStatus.toUpperCase() === 'PENDING'
              ).length
            );
          } else {
            setPendingCount(null);
          }
        })
        .catch((err) => {
          setPendingCount(null);
        });
    } else {
      setPendingCount(null);
    }
  }, [dashboardState.selectedChallenge, reloadChallengeAccepted]);

  const fetchChallenges = (eventTypeSwitch) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        listOfChallenges: [],
        leaderBoardData: {
          data: {rankWiseBoard: []},
          loading: true,
          message: '',
        },
        selectedAction: !eventTypeSwitch
          ? getDefaultTab()
          : prevState.selectedAction,
        selectedChallenge: '',
        selectedChallengeObject: {},
        selectedChallengeArray: [],
        compareData: {data: [], categories: []},
        performanceData: {
          name: '',
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: '',
        },
        barToggle: false,
        eventGalleryData: {
          data: [],
          loading: true,
          message: '',
        },
        challengeSwitch: 'current',
        allChallenge: [],
      };
    });
    window.message = Message;

    getAchievements().then((res) => {
      setdistancelogo(res.data.response.responseData?.achievementIcons);
    });

    getOldEvents().then((res) => {
      if (res.data.response.responseMessage === 'SUCCESS') {
        let event = res.data.response.responseData?.keyword.eventId;
        seteventId(event);
        let selectedEventFromMainPage =
          res.data.response.responseData?.events?.filter(
            (item) => item.id == localStorage.challengeIDRegister
          )[0];
        let allChallengeData = res.data.response.responseData?.events?.filter(
          (item) => {
            if (
              !eventTypeSwitch &&
              selectedEventFromMainPage &&
              selectedEventFromMainPage['timePeriod'] == 'FUTURE'
            ) {
              return item.isActive == 1 &&
                item.timePeriod === 'FUTURE' &&
                item.isParticipated
                ? true
                : event != null
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id == event && item.timePeriod !== 'FUTURE')
                : item.eventView !== 'PRIVATE' &&
                  item.eventView !== 'LINKED' &&
                  item.timePeriod === 'FUTURE';
            } else {
              //
              return item.isActive == 1 &&
                item.timePeriod !== 'FUTURE' &&
                item.isParticipated
                ? true
                : event != null
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id == event && item.timePeriod !== 'FUTURE')
                : item.eventView !== 'PRIVATE' &&
                  item.eventView !== 'LINKED' &&
                  item.timePeriod !== 'FUTURE';
            }
          }
        );

        setDashboardState((prevState) => {
          return {
            ...prevState,
            allChallenge: res.data.response.responseData.events,
            challengeSwitch:
              !eventTypeSwitch && selectedEventFromMainPage
                ? selectedEventFromMainPage['timePeriod'] == 'CURRENT'
                  ? 'current'
                  : 'upcoming'
                : 'current',
            selectedChallenge:
              !eventTypeSwitch && localStorage.challengeIDRegister
                ? localStorage.challengeIDRegister
                : allChallengeData[0]
                ? allChallengeData[0]['id']
                : '',
            selectedChallengeObject:
              !eventTypeSwitch && localStorage.challengeIDRegister
                ? selectedEventFromMainPage
                : allChallengeData[0]
                ? allChallengeData[0]
                : {},
            listOfChallenges: allChallengeData,
            instruction_details:
              res?.data?.response?.responseData?.instruction_details,
          };
        });

        if (allChallengeData.length > 0 && allChallengeData[0]) {
          getLeaderBoardData(
            localStorage.challengeIDRegister && !eventTypeSwitch
              ? localStorage.challengeIDRegister
              : allChallengeData[0]['id']
          )
            .then((res) => {
              if (
                res.data &&
                res.data.response &&
                res.data.response.responseMessage === 'SUCCESS'
              ) {
                let data =
                  res.data.response.responseData.challengerWiseLeaderBoard;
                if (data && data[0]) {
                  setDashboardState((prevState) => {
                    return {
                      ...prevState,
                      leaderBoardData: {
                        data: data[0],
                        loading: false,
                        message: res.data.response.responseMessage,
                      },
                    };
                  });
                }
              } else {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    leaderBoardData: {
                      data: {rankWiseBoard: []},
                      loading: false,
                      message:
                        res.data &&
                        res.data.response &&
                        res.data.response.responseMessage
                          ? res.data.response.responseMessage
                          : 'No Data',
                    },
                  };
                });
              }
            })
            .catch((err) => {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  leaderBoardData: {
                    data: {rankWiseBoard: []},
                    loading: false,
                    message:
                      res.data &&
                      res.data.response &&
                      res.data.response.responseMessage
                        ? res.data.response.responseMessage
                        : 'No Data',
                  },
                };
              });
            });
          getEventGalleryData(
            !eventTypeSwitch && localStorage.challengeIDRegister
              ? localStorage.challengeIDRegister
              : allChallengeData[0]['id']
          ).then((galleryResponse) => {
            if (galleryResponse.data.response.responseMessage === 'SUCCESS') {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  eventGalleryData: {
                    data: galleryResponse.data.response.responseData,
                    loading: false,
                    message: galleryResponse.data.response.responseMessage,
                  },
                };
              });
            } else {
              setDashboardState((prevState) => {
                return {
                  ...prevState,
                  eventGalleryData: {
                    data: [],
                    loading: false,
                    message: galleryResponse.data.response.responseMessage,
                  },
                };
              });
            }
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: 'No Data',
              },
              listOfChallenges: [],
              leaderBoardData: {
                data: {rankWiseBoard: []},
                loading: false,
                message: 'No Data',
              },
            };
          });
        }
      }
    });
  };

  const fetchEventGallery = () => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        eventGalleryData: {
          data: [],
          loading: true,
          message: '',
        },
      };
    });
    getEventGalleryData(dashboardState.selectedChallenge).then(
      (galleryResponse) => {
        if (galleryResponse.data.response.responseMessage === 'SUCCESS') {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: galleryResponse.data.response.responseData,
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        }
      }
    );
  };

  const displayChart = () => {
    let linechartOptions = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        type: 'datetime',
        categories:
          dashboardState.selectedAction === 'Performance'
            ? dashboardState.performanceData['categories']
              ? dashboardState.performanceData['categories']
              : []
            : dashboardState.compareData['categories']
            ? dashboardState.compareData['categories']
            : [],
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
    };
    let barChartOptions = {
      chart: {
        height: 350,
        type: 'bar',
      },
      toolbar: {
        show: false,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
      },
      xaxis: {
        type: 'datetime',
        categories:
          dashboardState.selectedAction === 'Performance'
            ? dashboardState.performanceData['categories']
              ? dashboardState.performanceData['categories']
              : []
            : dashboardState.compareData['categories']
            ? dashboardState.compareData['categories']
            : [],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
      },

      fill: {
        opacity: 1,
      },
    };
    let lineState = {
      series:
        dashboardState.selectedAction === 'Compare'
          ? dashboardState.compareData.data
            ? dashboardState.compareData.data
            : []
          : [
              {
                name: dashboardState.performanceData.name,
                data: dashboardState.performanceData.data
                  ? dashboardState.performanceData.data
                  : [],
              },
            ],
    };

    return (
      <div id="chart" className="performance-chart-container">
        <Chart
          options={barChartOptions}
          series={lineState.series}
          type={'bar'}
          height={350}
          style={{
            boxShadow:
              '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            borderRadius: 12,
          }}
          className="performance-charts"
        />
        <Chart
          options={linechartOptions}
          series={lineState.series}
          type="line"
          height={350}
          style={{
            boxShadow:
              '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
            borderRadius: 12,
          }}
          className="performance-charts"
        />
      </div>
    );
  };

  const fetchCompareAndPerformaceData = (type, compareIds) => {
    if (type == 'Performance') {
      getChallengesByDate(compareIds).then((res) => {
        let performanceData = {
          name: '',
          data: [],
          categories: [],
        };
        let performanceTableData = {
          data: [],
          loading: false,
          message: res.data.response.responseMessage,
        };
        if (
          res.data.response &&
          res.data.response.responseMessage === 'SUCCESS' &&
          res.data.response.responseData
        ) {
          let responseData = res.data.response.responseData;
          if (
            responseData.challengerWiseLeaderBoard &&
            responseData.challengerWiseLeaderBoard.length > 0
          ) {
            let respDateWiseBoard =
              responseData.challengerWiseLeaderBoard[0].dateWiseBoard &&
              responseData.challengerWiseLeaderBoard[0].dateWiseBoard.length > 0
                ? responseData.challengerWiseLeaderBoard[0].dateWiseBoard.sort(
                    function (a, b) {
                      return (
                        new Date(b.valueTillDate) - new Date(a.valueTillDate)
                      );
                    }
                  )
                : [];

            performanceData['name'] =
              responseData.challengerWiseLeaderBoard[0]['challengerZoneName'];
            performanceData['data'] = respDateWiseBoard.map(
              (item) => item.value
            );
            performanceData['categories'] = respDateWiseBoard.map(
              (item) => item.valueTillDate
            );
            performanceTableData = {
              loading: false,
              data: respDateWiseBoard.map((item, index) => {
                return {
                  ...item,
                  index: index,
                };
              }),
              message: res.data.response.responseMessage,
            };
          }
        }
        setDashboardState((prevState) => {
          return {
            ...prevState,
            selectedChallengeArray: [],
            performanceData: performanceData,
            performanceTableData: performanceTableData,
          };
        });
      });
    } else {
      if (compareIds.length > 0) {
        getChallengesByDate(compareIds).then((res) => {
          let respp = res.data.response;
          if (respp && respp.responseMessage === 'SUCCESS') {
            let compareData = {data: [], categories: []};
            let compareDataEntries = [];
            let compareCategories = [];
            if (respp.responseData) {
              let responseData = respp.responseData;
              if (
                responseData['challengerWiseLeaderBoard'] &&
                responseData['challengerWiseLeaderBoard'].length > 0
              ) {
                responseData['challengerWiseLeaderBoard'].map((item) => {
                  let data = [];
                  if (item.dateWiseBoard && item.dateWiseBoard.length > 0) {
                    item.dateWiseBoard
                      .sort(function (a, b) {
                        return (
                          new Date(b.valueTillDate) - new Date(a.valueTillDate)
                        );
                      })
                      .map((el) => {
                        data.push(el.value);
                        compareCategories.push(el.valueTillDate);
                      });
                  }
                  let name = item['challengerZoneName'];
                  compareDataEntries.push({
                    name: name,
                    data: data,
                  });
                });
              }
            }
            compareData['data'] = compareDataEntries;
            compareData['categories'] = [...new Set(compareCategories)];
            setDashboardState((prevState) => {
              return {
                ...prevState,
                compareData: compareData,
              };
            });
          }
        });
      }
    }
  };

  const handlePerformanceClick = () => {
    window.message = Message;
    setDashboardState((prevState) => {
      return {
        ...prevState,
        selectedAction: 'Performance',
        selectedChallengeArray: [],
        compareData: {data: [], categories: []},
        performanceData: {
          name: '',
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: '',
        },
        listOfChallenges: getCurrentAllEvents(),
      };
    });
    fetchCompareAndPerformaceData(
      'Performance',
      dashboardState.selectedChallenge
    );
  };

  const handleToggleStateChange = (value) => {
    setDashboardState((prevState) => {
      return {
        ...prevState,
        challengeSwitch: value,
        listOfChallenges: [],
        leaderBoardData: {
          data: {rankWiseBoard: []},
          loading: true,
          message: '',
        },
        eventGalleryData: {
          data: [],
          loading: true,
          message: '',
        },
        compareData: {data: [], categories: []},
        performanceData: {
          name: '',
          data: [],
          categories: [],
        },
        performanceTableData: {
          data: [],
          loading: true,
          message: '',
        },
        selectedAction: value === 'upcoming' ? 'Leaderboard' : getDefaultTab(),
        selectedChallengeObject: {},
      };
    });
    if (value === 'current') {
      fetchChallenges(true);
    } else if (value === 'old' || value === 'upcoming') {
      getOldEvents().then((res) => {
        if (res.data.response.responseMessage === 'SUCCESS') {
          let allChallengeData = res.data.response.responseData.events.filter(
            (item) => {
              return value === 'old'
                ? item.isActive == 0 && item.isParticipated
                : item.isActive == 1 &&
                  item.timePeriod === 'FUTURE' &&
                  item.isParticipated
                ? true
                : window.location.href ==
                  'https://global.mhealth.ai/#/dashboard'
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id == 38 && item.timePeriod === 'FUTURE')
                : eventI != null
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id === eventId && item.timePeriod !== 'FUTURE')
                : window.location.href ==
                  'https://vanderlande.mhealth.ai/#/dashboard'
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id === 43 && item.timePeriod == 'FUTURE')
                : window.location.href == 'https://osv.mhealth.ai/#/dashboard'
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id === 45 && item.timePeriod == 'FUTURE')
                : window.location.href ==
                  'https://thecrest.mhealth.ai/#/dashboard'
                ? (item.eventView !== 'LINKED' &&
                    item.eventView !== 'PRIVATE') ||
                  (item.id == 44 && item.timePeriod !== 'FUTURE')
                : item.eventView !== 'PRIVATE' &&
                  item.eventView !== 'LINKED' &&
                  item.timePeriod === 'FUTURE';
            }
          );

          setDashboardState((prevState) => {
            return {
              ...prevState,
              listOfChallenges: allChallengeData,
            };
          });

          if (allChallengeData.length > 0 && allChallengeData[0]) {
            getLeaderBoardData(allChallengeData[0]['id']).then((res) => {
              if (res.data.response.responseMessage === 'SUCCESS') {
                let data =
                  res.data.response.responseData.challengerWiseLeaderBoard;
                if (data && data[0]) {
                  setDashboardState((prevState) => {
                    return {
                      ...prevState,
                      leaderBoardData: {
                        data: data[0],
                        loading: false,
                        message: res.data.response.responseMessage,
                      },
                      selectedChallenge: allChallengeData[0]['id'],
                      selectedChallengeObject: allChallengeData[0],
                    };
                  });
                }
              } else {
                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    leaderBoardData: {
                      data: {rankWiseBoard: []},
                      loading: false,
                      message: res.data.response.responseMessage,
                    },
                    selectedChallenge: allChallengeData[0]['id'],
                    selectedChallengeObject: allChallengeData[0],
                  };
                });
              }
            });
            getEventGalleryData(allChallengeData[0]['id']).then(
              (galleryResponse) => {
                const status = galleryResponse.data.response.responseMessage;

                setDashboardState((prevState) => {
                  return {
                    ...prevState,
                    eventGalleryData: {
                      data:
                        status === 'SUCCESS'
                          ? galleryResponse.data.response.responseData
                          : [],
                      loading: false,
                      message: galleryResponse.data.response.responseMessage,
                    },
                  };
                });
              }
            );
          } else {
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: {
                    rankWiseBoard: [],
                  },
                  loading: false,
                  message: 'Data Not Found',
                },
                eventGalleryData: {
                  data: [],
                  loading: false,
                  message: 'Data Not Found',
                },
              };
            });
          }
        }
      });
    }
  };

  const getCurrentAllEvents = () => {
    let allChallengeData = dashboardState.allChallenge.filter((item) => {
      if (dashboardState.challengeSwitch == 'current') {
        return item.isActive == 1 &&
          item.timePeriod !== 'FUTURE' &&
          item.isParticipated
          ? true
          : window.location.href == 'https://global.mhealth.ai/#/dashboard'
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == 38 && item.timePeriod !== 'FUTURE')
          : eventId != null
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == eventId && item.timePeriod !== 'FUTURE')
          : window.location.href == 'https://thecrest.mhealth.ai/#/dashboard'
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == 44 && item.timePeriod !== 'FUTURE')
          : item.eventView !== 'PRIVATE' &&
            item.eventView !== 'LINKED' &&
            item.timePeriod !== 'FUTURE';
      } else {
        return dashboardState.challengeSwitch === 'old'
          ? item.isActive == 0 && item.isParticipated
          : item.isActive == 1 &&
            item.timePeriod === 'FUTURE' &&
            item.isParticipated
          ? true
          : window.location.href == 'https://global.mhealth.ai/#/dashboard'
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == 38 && item.timePeriod !== 'FUTURE')
          : eventId != null
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == eventId && item.timePeriod !== 'FUTURE')
          : window.location.href == 'https://thecrest.mhealth.ai/#/dashboard'
          ? (item.eventView !== 'LINKED' && item.eventView !== 'PRIVATE') ||
            (item.id == 44 && item.timePeriod !== 'FUTURE')
          : item.eventView !== 'PRIVATE' &&
            item.eventView !== 'LINKED' &&
            item.timePeriod === 'FUTURE';
      }
    });

    return allChallengeData;
  };

  const handleChallengeCardClick = async (eventObj) => {
    window.message = Message;

    let updatedObj = {
      ...dashboardState,
      moderatorDetails: {
        moderatorName: eventObj['moderatorName']
          ? eventObj['moderatorName']
          : '',
        moderatorMobileNumber: eventObj['moderatorMobileNumber']
          ? eventObj['moderatorMobileNumber']
          : '',
      },
    };
    if (dashboardState.selectedAction !== 'Compare') {
      updatedObj['selectedChallengeObject'] =
        dashboardState.listOfChallenges.filter(
          (val) => val.id === eventObj.id
        )[0];
    }
    let existingChallendIds = [...dashboardState.selectedChallengeArray];
    let updatedSelectedChallenges = existingChallendIds.includes(eventObj.id)
      ? existingChallendIds.filter((item) => item != eventObj.id)
      : [
          ...existingChallendIds.filter((item) => item != eventObj.id),
          eventObj.id,
        ];
    if (dashboardState.selectedAction === 'Compare') {
      updatedObj['selectedChallengeArray'] = updatedSelectedChallenges;
    } else {
      updatedObj['selectedChallenge'] = eventObj.id;
    }

    if (
      dashboardState.selectedAction === 'Leaderboard' ||
      dashboardState.selectedAction === 'Gallery' ||
      dashboardState.selectedAction === 'Source' ||
      dashboardState.selectedAction === 'Target' ||
      dashboardState.selectedAction === 'Activities' ||
      dashboardState.selectedAction === 'Challenge' ||
      dashboardState.selectedAction === 'team' ||
      dashboardState.selectedAction === 'achievement' ||
      dashboardState.selectedAction === 'challenge'
    ) {
      setDashboardState({
        ...updatedObj,
        eventGalleryData: {data: [], loading: true, message: ''},
        leaderBoardData: {
          data: {rankWiseBoard: []},
          loading: true,
          message: '',
        },
      });
      await getLeaderBoardData(eventObj.id)
        .then((res) => {
          if (res.data.response.responseMessage === 'SUCCESS') {
            let data = res.data.response.responseData.challengerWiseLeaderBoard;
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: data[0],
                  loading: false,
                  message: res.data.response.responseMessage,
                },
              };
            });
          } else {
            setDashboardState((prevState) => {
              return {
                ...prevState,
                leaderBoardData: {
                  data: {rankWiseBoard: []},
                  loading: false,
                  message: res.data.response.responseMessage,
                },
              };
            });
          }
        })
        .catch((err) => {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              leaderBoardData: {
                data: {rankWiseBoard: []},
                loading: false,
                message: 'No Data',
              },
            };
          });
        });
      console.log(dashboardState.selectedChallenge, 'event');
      await getEventGalleryData(eventObj.id).then((galleryResponse) => {
        if (galleryResponse.data.response.responseMessage === 'SUCCESS') {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: galleryResponse.data.response.responseData,
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        } else {
          setDashboardState((prevState) => {
            return {
              ...prevState,
              eventGalleryData: {
                data: [],
                loading: false,
                message: galleryResponse.data.response.responseMessage,
              },
            };
          });
        }
      });
    } else if (dashboardState.selectedAction === 'Performance') {
      updatedObj['performanceData'] = {
        name: '',
        data: [],
        categories: [],
      };
      updatedObj['performanceTableData'] = {
        data: [],
        loading: true,
        message: '',
      };
      setDashboardState(updatedObj);
      fetchCompareAndPerformaceData('Performance', eventObj.id);
    } else if (dashboardState.selectedAction === 'Compare') {
      updatedObj['compareData'] = {data: [], categories: []};
      setDashboardState(updatedObj);
      if (updatedSelectedChallenges && updatedSelectedChallenges.length > 0) {
        fetchCompareAndPerformaceData('Compare', updatedSelectedChallenges);
      } else {
        setDashboardState({
          ...updatedObj,
          compareData: {data: [], categories: []},
        });
      }
    }
  };
  console.log(distancelogo, ' logo');
  return (
    <div className="Dasboard">
      <TopUserDetails />
      <Navbar />
      <div className="Main">
        <ChallengeList>
          <div className="display-row">
            <div className="challenges-heading" style={{marginRight: 20}}>
              Challenges
            </div>
            <TriStateToggle
              values={['old', 'current', 'upcoming']}
              selected={dashboardState.challengeSwitch}
              handleChange={handleToggleStateChange}
            />
          </div>

          <ListOfEvents
            handleChallengeCardClick={handleChallengeCardClick}
            fetchChallenges={fetchChallenges}
            data={dashboardState.listOfChallenges}
            dashboardState={dashboardState}
            setDashboardState={setDashboardState}
            selectedAction={dashboardState.selectedAction}
            listType="event"
            selectedChallengeArray={dashboardState.selectedChallengeArray}
            selectedChallenge={dashboardState.selectedChallenge}
          />
        </ChallengeList>

        <div className="Leaderboard" id="Leaderboard">
          <div className="leaderboard-header">
            <div className="challenges-heading">
              {dashboardState.selectedAction !== 'Compare' &&
                dashboardState.selectedAction !== 'Gallery' &&
                dashboardState.selectedAction !== 'Source' &&
                getLeaderBoardHeading(
                  dashboardState.selectedChallengeObject,
                  dashboardState.selectedAction
                )}
            </div>

            <div
              className="d-flex j-c-sp-btn a-i-center cursor-pointer"
              style={{justifyContent: 'flex-end'}}
            >
              <div className="leaderboard-actions">
                {dashboardState.challengeSwitch !== 'upcoming' &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected: dashboardState.selectedAction === 'challenge',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'challenge',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Challenge{' '}
                    </button>
                  )}

                {dashboardState.challengeSwitch !== 'upcoming' &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected:
                          dashboardState.selectedAction === 'achievement',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'achievement',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Achievement{' '}
                    </button>
                  )}

                {dashboardState.challengeSwitch !== 'upcoming' &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected: dashboardState.selectedAction === 'team',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'team',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Team{' '}
                    </button>
                  )}

                {dashboardState.listOfChallenges.length > 0 && (
                  <button
                    className={classnames({
                      selected: dashboardState.selectedAction === 'Challenge',
                    })}
                    onClick={() => {
                      setDashboardState((prevState) => {
                        return {
                          ...prevState,
                          selectedAction: 'Challenge',
                          listOfChallenges: getCurrentAllEvents(),
                        };
                      });
                    }}
                  >
                    <div className="badge-invite">
                      {pendingInviteCount ? (
                        <Badge badgeContent={pendingInviteCount} color="error">
                          Invite
                        </Badge>
                      ) : (
                        'Invite'
                      )}
                    </div>
                  </button>
                )}

                {dashboardState.challengeSwitch !== 'upcoming' &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected:
                          dashboardState.selectedAction === 'Activities',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'Activities',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Programs
                    </button>
                  )}

                {dashboardState.challengeSwitch !== 'upcoming' &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected: dashboardState.selectedAction === 'Target',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'Target',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Target
                    </button>
                  )}

                {(dashboardState.challengeSwitch === 'current' ||
                  dashboardState.challengeSwitch === 'upcoming') &&
                  dashboardState.listOfChallenges.length > 0 && (
                    <button
                      className={classnames({
                        selected: dashboardState.selectedAction === 'Source',
                      })}
                      onClick={() => {
                        setDashboardState((prevState) => {
                          return {
                            ...prevState,
                            selectedAction: 'Source',
                            listOfChallenges: getCurrentAllEvents(),
                          };
                        });
                      }}
                    >
                      Source
                    </button>
                  )}

                {dashboardState.challengeSwitch !== 'upcoming' && (
                  <>
                    {dashboardState.listOfChallenges.length > 0 && (
                      <button
                        className={classnames({
                          selected: dashboardState.selectedAction === 'Gallery',
                        })}
                        onClick={() => {
                          setDashboardState((prevState) => {
                            return {
                              ...prevState,
                              selectedAction: 'Gallery',
                              listOfChallenges: getCurrentAllEvents(),
                            };
                          });
                        }}
                      >
                        Event Gallery
                      </button>
                    )}
                    <button
                      className={classnames({
                        selected: dashboardState.selectedAction === 'Compare',
                      })}
                      onClick={() =>
                        setDashboardState((prevState) => {
                          let comparableEvents = dashboardState.allChallenge
                            ? dashboardState.allChallenge.filter(
                                (item) => item.isParticipated
                              )
                            : [];
                          return {
                            ...prevState,
                            selectedAction: 'Compare',
                            listOfChallenges: comparableEvents,
                          };
                        })
                      }
                    >
                      Compare
                    </button>
                    <button
                      className={classnames({
                        selected:
                          dashboardState.selectedAction === 'Performance',
                      })}
                      onClick={() => handlePerformanceClick()}
                    >
                      Performance
                    </button>
                  </>
                )}
                <button
                  className={classnames({
                    selected: dashboardState.selectedAction === 'Leaderboard',
                  })}
                  onClick={() =>
                    setDashboardState((prevState) => {
                      return {
                        ...prevState,
                        selectedAction: 'Leaderboard',
                        selectedChallengeArray: [],
                        compareData: {data: [], categories: []},
                        listOfChallenges: getCurrentAllEvents(),
                      };
                    })
                  }
                >
                  Leaderboard
                </button>
                <div style={{marginLeft: '1em'}}>
                  <FullScreen id="Challenges" />
                </div>
              </div>
            </div>
          </div>
          {dashboardState.selectedAction === 'Challenge' && (
            <ChallengeByInvite
              eventId={dashboardState.selectedChallenge}
              {...{reloadChallengeAccepted, setReloadChallengeAccepted}}
            />
          )}
          {dashboardState.selectedAction === 'Leaderboard' && (
            <LeaderboardTable
              leaderBoardData={dashboardState.leaderBoardData}
              currentEvent={dashboardState.selectedChallengeObject}
              challengeSwitch={dashboardState.challengeSwitch}
            />
          )}

          {dashboardState.selectedAction === 'team' && (
            <CreateTeam eventId={dashboardState.selectedChallenge} />
          )}
          {dashboardState.selectedAction === 'achievement' && (
            <Achievments
              eventId={dashboardState.selectedChallenge}
              logos={distancelogo}
            />
          )}

          {dashboardState.selectedAction === 'challenge' && (
            <SundayChallenge eventId={dashboardState.selectedChallenge} />
          )}

          {dashboardState.selectedAction === 'Performance' && (
            <PerformanceTab
              data={dashboardState.performanceTableData}
              eventId={dashboardState.selectedChallenge}
              handlePerformanceClick={handlePerformanceClick}
              challengeSwitch={dashboardState.challengeSwitch}
            />
          )}

          {dashboardState.selectedAction === 'Performance' && displayChart()}
          {dashboardState.selectedAction === 'Compare' && displayChart()}
        </div>
        {dashboardState.selectedAction === 'Gallery' && (
          <EventGallery
            eventGalleryData={dashboardState.eventGalleryData}
            fetchEventGallery={fetchEventGallery}
          />
        )}
        {dashboardState.selectedAction === 'Source' &&
          (dashboardState.challengeSwitch === 'current' ||
            dashboardState.challengeSwitch === 'upcoming') && (
            <UpdateDataSource dashboardState={dashboardState} />
          )}

        {dashboardState.selectedAction === 'Target' && (
          <TargetSetting dashboardState={dashboardState} />
        )}

        {dashboardState.selectedAction === 'Activities' && (
          <Activity
            eventId={dashboardState.selectedChallenge}
            currentEventObj={dashboardState.selectedChallengeObject}
          />
        )}
      </div>

      {localStorage.challengeIDRegister &&
        localStorage.mobileNumber &&
        dashboardState.allChallenge.length > 0 && (
          <EventRegisterModal
            challenge={
              dashboardState.allChallenge.filter(
                (ch) => ch.id === parseInt(localStorage.challengeIDRegister)
              )[0] ?? {}
            }
            modalView={showRegisterModal}
            setModalView={() => {
              localStorage.removeItem('challengeIDRegister');
              setShowRegisterModal(false);
            }}
            setDashboardState={setDashboardState}
            instruction_details={dashboardState?.instruction_details}
          />
        )}
      {displayChallengeStatus && (
        <ChallengeStatus
          {...{
            challengeStatusMsg,
            setDisplayChallengeStatus,
            displayChallengeStatus,
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
