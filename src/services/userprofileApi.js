import axios from 'axios';
import {
  urlPrefix,
  getUserDetails,
  updateUserDetails,
  updateAvatarAndAlias,
  validateAlias,
  dashboardTabs,
} from './apicollection';

export const getUserDetailsHandler = (payload) => {
  const URL = `${urlPrefix}${getUserDetails}`;
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

export const updateUserDetailsHandler = (payload) => {
  const URL = `${urlPrefix}${updateUserDetails}`;
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

export const updateAvatarAndAliasHandler = (aliasName, formData) => {
  let URL = `${urlPrefix}${updateAvatarAndAlias}?aliasName=${aliasName}`;
  // if (aliasName) {
  //   URL += `?aliasName=${aliasName}`;
  // }
  return axios.post(URL, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Content-type': 'multipart/form-data; boundary=???',
    },
  });
};

export const validateAliasName = (name) => {
  const URL = `${urlPrefix}${validateAlias}?aliasName=${name}`;
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

export const getDashboardTabs = () => {
  const URL = `${urlPrefix}${dashboardTabs}`;
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
