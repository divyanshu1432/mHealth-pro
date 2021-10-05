import axios from 'axios';
import {
  urlPrefix,
  getLeaderBoardByDate,
  getLeaderBoard,
  getEventGallery,
  markAsAbusive,
  pinUsers,
  getAllEvents,
  secretToken,
  getUserDataByEventId,
  updateDataSource,
  registerInEvent,
  sendSmsApi,
  getCurrentSource,
  updateDataPerformance,
  unSubscribe,
  syncDataForGFitAndStrava,
  getPersonalTarget,
  getEventTarget,
  setPersonalTarget,
  postChallenge,
  postChallengeImages,
  getSubEvent,
  subscribeSubEvent,
  unSubscribeSubEvent,
  subEventUsersList,
  postSubEvent,
  postSubEventImages,
  getAllActivities,
  getAllMobile,
  sendChallengeInvite,
  viewChallenges,
  challengeAction,
  viewChallengeScorecard,
  rejoinInEvent,
  insertOrEditPaymentOfUser,
  getCountryList,
  getProgramWiseActivity,
  addProgramActivity,
  viewOldRecording,
} from './apicollection';

export const getChallengesByDate = (challengeIds) => {
  let challengesCombinedString = Array.isArray(challengeIds)
    ? challengeIds.join(',')
    : challengeIds;
  const URL = `${urlPrefix}${getLeaderBoardByDate}?challengerZoneIds=${challengesCombinedString}`;
  return axios.get(URL, {
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
};

export const getLeaderBoardData = (challengeId) => {
  const URL = `${urlPrefix}${getLeaderBoard}?challengerZoneId=${challengeId}`;
  return axios.get(URL, {
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
};

export const getEventGalleryData = (challengeId) => {
  const URL = `${urlPrefix}${getEventGallery}?eventId=${challengeId}`;
  return axios.get(URL, {
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
};

export const reportImage = (payload) => {
  const URL = `${urlPrefix}${markAsAbusive}`;
  return axios.put(URL, payload, {
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
};

export const pinUsersAction = (payload) => {
  const URL = `${urlPrefix}${pinUsers}`;
  return axios.put(URL, payload, {
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
};

function isLoggedIn() {
  if (localStorage.getItem('token')) {
    return true;
  }
  return false;
}



export const getAchievements = () => {

const URL  = `${urlPrefix}clients/getAchievementIcons`
return axios.get(URL, {
  headers: {
    Authorization: `Bearer ${secretToken}`,
    timeStamp: 'timestamp',
    accept: '*/*',
    'Access-Control-Allow-Origin': '*',
    withCredentials: true,
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':
      'accept, content-type, x-access-token, x-requested-with',
  },
});


}


export const getOldEvents = () => {

  let str = window.location.href;
let link = str.length;
let final_link = str.substr(8, link-31)


let bannerLink = window.location.href;
let a_link = bannerLink.length;
let banner = bannerLink.substr(8, a_link-22)


  const URL = isLoggedIn()
  ? `${urlPrefix}${getAllEvents}?others=${final_link}&userId=${localStorage.getItem(
    "userId"
  )}`
: `${urlPrefix}${getAllEvents}?others=${banner}&userId=559`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${secretToken}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      withCredentials: true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'accept, content-type, x-access-token, x-requested-with',
    },
  });
};

export const getUserDetailsByEventID = (selectedEvent, selectedDataSource) => {
  const URL = `${urlPrefix}${getUserDataByEventId}?event=${selectedEvent.id}`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      withCredentials: true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'accept, content-type, x-access-token, x-requested-with',
    },
  });
};

export const registerEvent = (payload) => {
  const URL = `${urlPrefix}${registerInEvent}`;
  return axios.post(URL, payload, {
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
};

export const rejoinEvent = (eventId) => {
  const URL = `${urlPrefix}${rejoinInEvent}?eventId=${eventId}`;
  return axios.put(
    URL,
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
  );
};

export const updateSource = (payload) => {
  const URL = `${urlPrefix}${updateDataSource}?eventId=${payload.eventId}&datasource=${payload.datasource}`;
  return axios.put(
    URL,
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
  );
};

export const getAuthLink = (datasource) => {
  const URL = `${urlPrefix}v1.0/getAuthLinkByDatasource?datasource=${datasource}`;
  return axios.get(URL, {
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
};

export const sendSms = (smsObj) => {
  const URL = `${urlPrefix}${sendSmsApi}`;
    let message = `Congratulations! You have successfully registered in ${smsObj.eventName}. You may subscribe to any of ongoing programs. Team mHealth`;

  let payload = {
    message: message,
    mobileNumber: smsObj.mobileNumber,
  };
  return axios.post(URL, payload, {
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
};

export const getDataCurrentSource = (eventId) => {
  const URL = `${urlPrefix}${getCurrentSource}?eventId=${eventId}`;
  return axios.get(URL, {
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
};

export const addSupportingDoc = (payload) => {
  const URL = `${urlPrefix}${updateDataPerformance}`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Content-type': 'multipart/form-data; boundary=???',
    },
  });
};

export const unsubscribeEvent = (eventID) => {
  const URL = `${urlPrefix}${unSubscribe}?eventId=${eventID}`;
  return axios.post(
    URL,
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
  );
};

export const syncGFitAndStrava = (action, eventId) => {
  const URL = `${urlPrefix}${syncDataForGFitAndStrava}?action=${action}&eventId=${eventId}`;
  return axios.put(
    URL,
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
  );
};

export const getPersonalTargetData = (id) => {
  const URL = `${urlPrefix}${getPersonalTarget}?event=${id}`;
  return axios.get(URL, {
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
};

export const getEventTargetData = (id) => {
  const URL = `${urlPrefix}${getEventTarget}?event=${id}`;
  return axios.get(URL, {
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
};

export const setPersonalTargetData = (payload) => {
  const URL = `${urlPrefix}${setPersonalTarget}?eventId=${payload.eventId}&date=${payload.date}&distance=${payload.distance}`;
  return axios.post(
    URL,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        timeStamp: 'timestamp',
        accept: '*/*',
        'Content-type': 'multipart/form-data; boundary=???',
      },
    }
  );
};

export const createOrUpdateEvent = (payload) => {
  const URL = `${urlPrefix}${postChallenge}`;
  return axios.post(URL, payload, {
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
};

export const postEventImages = (payload, id) => {
  const URL = `${urlPrefix}${postChallengeImages}?eventId=${id}`;
  return axios.post(URL, payload, {
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
};

export const getActivitySubEvent = (id, payload) => {
  let URL = `${urlPrefix}${getSubEvent}?eventId=${id}`;
  if (payload.length > 0) {
    URL = `${URL}&startDate=${payload[0]}&endDate=${payload[1]}`;
  }

  return axios.get(URL, {
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
};

export const getAllSubActivities = () => {
  const URL = `${urlPrefix}${getAllActivities}`;
  return axios.get(URL, {
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
};

export const subscribeSubEventCall = (payload) => {
  let URL = `${urlPrefix}${subscribeSubEvent}?eventId=${payload.eventId}&subEventId=${payload.subEventId}&dataSource=WEB`;
  if (payload.rejoin) {
    URL = URL + '&rejoin';
  }
  return axios.post(
    URL,
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
  );
};

export const unSubcribeSubEventCall = (payload) => {
  const URL = `${urlPrefix}${unSubscribeSubEvent}?eventId=${payload.eventId}&subEventId=${payload.subEventId}`;
  return axios.put(
    URL,
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
  );
};

export const getSubEventUsersList = (id, source) => {
  const URL = `${urlPrefix}${subEventUsersList}?subEvent=${id}&dataSource=${source}`;
  return axios.get(URL, {
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
};

export const createOrUpdateEventSubEvent = (payload, type, subEventId) => {
  const URL = `${urlPrefix}${
    type == 'image'
      ? postSubEventImages + `?subEventId=${subEventId}`
      : postSubEvent
  }`;
  return type == 'image'
    ? axios.put(URL, payload, {
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
    : axios.post(URL, payload, {
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
};

export const getAllUserByMobile = () => {
  const URL = `${urlPrefix}${getAllMobile}`;
  return axios.get(URL, {
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
};

export const sendInviteForChallenge = (payload) => {
  let URL = `${urlPrefix}${sendChallengeInvite}?eventId=${payload.eventId}&mobileNumber=${payload.mobileNumber}`; /*&inviteeId=${payload.inviteeId}`*/
  if (payload.inviteeName) {
    URL += `&inviteeName=${decodeURIComponent(payload.inviteeName)}`;
  }

  return axios.post(
    URL,
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
  );
};

export const getChallenges = (action, eventId) => {
  /**
   * action : Sender/Receiver
   * eventId: 1
   */
  let URL = `${urlPrefix}${viewChallenges}?eventId=${eventId}&action=${action}`;

  return axios.get(URL, {
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
};

export const challengeActionCall = (action, challengeId) => {
  /**
   * action : accept/reject
   * challengeId: 1
   */
  const URL = `${urlPrefix}${challengeAction}?action=${action}&challengeId=${challengeId}`;
  return axios.put(
    URL,
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
  );
};

export const viewScorecard = (challengeId, eventId) => {
  /**
   * action : 1
   * eventId: 1
   */
  const URL = `${urlPrefix}${viewChallengeScorecard}?eventId=${eventId}`;
  return axios.get(URL, {
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
};

export const editUserProgramPaymentDetails = (userId, payload) => {
  const URL = `${urlPrefix}${insertOrEditPaymentOfUser}?userId=${userId}`;
  return axios.put(URL, payload, {
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
};

export const getCountryListData = () => {
  const URL = `${urlPrefix}${getCountryList}`;
  return axios.get(URL, {
    headers: {
      Authorization: `Bearer ${secretToken}`,
      accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      withCredentials: true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'accept, content-type, x-access-token, x-requested-with',
    },
  });
};

export const getProgramActivity = (subEventId) => {
  const URL = `${urlPrefix}${getProgramWiseActivity}?subEventId=${subEventId}`;
  return axios.get(URL, {
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
};

export const addProgramActivityData = (payload, id) => {
  let URL = `${urlPrefix}${addProgramActivity}?subEventId=${id}`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Content-type': 'multipart/form-data; boundary=???',
    },
  });
};

export const getOldRecordingByProgram = (subEventId) => {
  const URL = `${urlPrefix}${viewOldRecording}?subEventId=${subEventId}`;
  return axios.get(URL, {
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
};
