import axios from 'axios';
import {
  urlPrefix,
  validateUser,
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
  forgotPin,
  resetPin,
  clientSecret,
  secretToken,
  clientID,
} from './apicollection';

export const validateUserHandler = (payload) => {
  const URL = `${urlPrefix}${validateUser}?mobileNumber=${payload.phoneNumber}&countryCode=${payload.dialCode}`;
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

export const sendOTPHandler = (mobileNumberObj, otpTnxType) => {
  const URL = `${urlPrefix}${sendOtp}?mobileNumber=${mobileNumberObj?.phoneNumber}&otpTxnType=${otpTnxType}&countryCode=${mobileNumberObj.dialCode}`;
  return axios.post(
    URL,
    {},
    {
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
    }
  );
};

export const verifyOTPHandler = (payload) => {
  const URL = `${urlPrefix}${verifyOtp}`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${secretToken}`,
      timeStamp: 'timestamp',
      accept: '*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      withCredentials: true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'accept, content-type, x-access-token, x-requested-with',
    },
  });
};

export const registerUserHandler = (payload, token) => {
  const URL = `${urlPrefix}${registerUser}`;
  return axios.post(URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      accept: '*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      withCredentials: true,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':
        'accept, content-type, x-access-token, x-requested-with',
    },
  });
};

export const loginUserHandler = (mobileObj, pin) => {
  const URL = `${urlPrefix}${loginUser}`;
  return axios.get(URL, {
    headers: {
      mobileNumber: mobileObj.phoneNumber,
      clientId: clientID,
      clientSecret: clientSecret,
      password: pin,
    },
  });
};

export const forgetPasswordHandler = (payload) => {
  const URL = `${urlPrefix}${forgotPin}`;
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

export const resetPasswordHandler = (payload) => {
  const URL = `${urlPrefix}${resetPin}`;
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
