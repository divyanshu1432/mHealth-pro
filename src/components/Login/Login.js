import React, {useState, useEffect} from 'react';
import login from '../../assets/login.svg';
import 'react-phone-input-2/lib/style.css';
import {useHistory} from 'react-router-dom';
import UserInfoForm from './UserInfoForm';
import MobileInputForm from './MobileInputForm';
import OTPVerifyForm from './OTPVerifyForm';
import SuccessForm from './SuccessForm';
import PasswordVerifyForm from './PasswordVerifyForm';
import Message from 'antd-message';
import logoPng from '../../assets/logo.png';
import CompnyForm from './Complog';
import {
  validateUserHandler,
  sendOTPHandler,
  verifyOTPHandler,
  registerUserHandler,
  loginUserHandler,
  forgetPasswordHandler,
} from '../../services/loginapi';
import {getUserDetailsHandler} from '../../services/userprofileApi';




const Login = () => {
  window.message = Message;
  const history = useHistory();
  const [userData, setUserData] = useState({
    mobileNo: '',
    ismobileNoVerified: false,
    otp: '',
    isOtpVerified: false,
    isOtpVerifiedForReset: false,
    firstname: '',
    displaylastName: false,
    lastname: '',
    displayPin: false,
    pin: '',
    confirmPin: '',
    isUserRegistered: false,
    isExistingUser: false,
    userToken: '',
    isPasswordForgotten: false,
    gender: '',
    city: '',
    companyName:'',
    employeeId:''
  });
  const [loaderInfo, setLoaderInfo] = useState({
    mobileVerification: false,
    otpVerification: false,
    userVerification: false,
    loginVerification: false,
    gettingOTP: false,
  });

  function isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    isLoggedIn() && history.push('/dashboard');
  }, []);

  const handleInput = (type, value) => {
    if (type === 'mobile') {
      setUserData({
        ...userData,
        mobileNo: value,
      });
    }

    if (type === 'companyName') {
      setUserData({
        ...userData,
        companyName: value,
      });
    }


    if (type === 'employeeId') {
      setUserData({
        ...userData,
        employeeId: value,
      });
    }



    if (type === 'otp') {
      setUserData({
        ...userData,
        otp: value,
      });
    }

    if (type === 'firstname') {
      setUserData({
        ...userData,
        firstname: value,
      });
    }

    if (type === 'lastname') {
      setUserData({
        ...userData,
        lastname: value,
      });
    }

    if (type === 'pin') {
      setUserData({
        ...userData,
        pin: value,
      });
    }

    if (type === 'confirmPin') {
      setUserData({
        ...userData,
        confirmPin: value,
      });
    }
    if (type === 'gender') {
      setUserData({
        ...userData,
        gender: value,
      });
    }
    if (type === 'city') {
      setUserData({
        ...userData,
        city: value,
      });
    }
  };

  const OTPRequestHandler = (type, callback = () => {}) => {
    setLoaderInfo({...loaderInfo, mobileVerification: true, gettingOTP: true});
    sendOTPHandler(userData.mobileNo, type)
      .then((res) => {
        if (type === 'FORGET_PASSWORD') {
          callback(true);
          if (res.data.response.responseMessage === 'SUCCESS') {
            setLoaderInfo({
              ...loaderInfo,
              mobileVerification: false,
              gettingOTP: false,
            });
          } else {
            callback(false);
            message.error('something went wrong!');
          }
          return;
        }

        if (res.data.response.responseMessage === 'SUCCESS') {
          setUserData({...userData, ismobileNoVerified: true});
          setLoaderInfo({
            ...loaderInfo,
            mobileVerification: false,
            gettingOTP: false,
          });
        } else {
          message.error('something went wrong!');
        }
      })
      .catch((err) => {
        message.error('something went wrong!');
        setLoaderInfo({
          ...loaderInfo,
          mobileVerification: false,
          gettingOTP: false,
        });
        if (type === 'FORGET_PASSWORD') callback(false);
      });
  };
  const handleMobileInputSubmit = () => {
    window.message = Message;
    if (userData?.mobileNo?.phoneNumber === '') {
      message.error('Please input Mobile');
      return;
    }
    setLoaderInfo({...loaderInfo, mobileVerification: true});
    validateUserHandler(userData.mobileNo)
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          // if (res.data.response.responseData.status === 'PARTIALLY_VERIFIED') {
          if (res.data.response.responseData.status !== 'ACTIVE') {
            OTPRequestHandler('REGISTRATION');
          } else {
            setUserData({
              ...userData,
              ismobileNoVerified: true,
              isExistingUser: true,
            });
            setLoaderInfo({...loaderInfo, mobileVerification: false});
          }
        } else {
          message.error(res.data.response.responseMessage);
          setLoaderInfo({...loaderInfo, mobileVerification: false});
        }
      })
      .catch((err) => {
        message.error('something went wrong!');
        setLoaderInfo({...loaderInfo, mobileVerification: false});
      });
  };

  const handleOtpInputSubmit = (type = 'REGISTRATION') => {
    setLoaderInfo({...loaderInfo, otpVerification: true});
    verifyOTPHandler({
      mobileNumber: userData?.mobileNo?.phoneNumber,
      otp: userData.otp,
      otpTxnType: type,
    })
      .then((res) => {
        if (res.data.response.responseMessage === 'SUCCESS') {
          if (type === 'FORGET_PASSWORD') {
            setUserData({
              ...userData,
              isOtpVerifiedForReset: true,
              userToken: res.data.response.responseData.userToken,
            });
            localStorage.setItem(
              'token',
              res.data.response.responseData.userToken
            );
          } else {
            setUserData({
              ...userData,
              isOtpVerified: true,
              userToken: res.data.response.responseData.userToken,
            });
            localStorage.setItem(
              'token',
              res.data.response.responseData.userToken
            );
          }
        }
        setLoaderInfo({...loaderInfo, otpVerification: false});
      })
      .catch((err) => {
        message.error('something went wrong!');
        setLoaderInfo({...loaderInfo, otpVerification: false});
      });
  };

  const handleInfoSubmit = () => {
   
    setLoaderInfo({...loaderInfo, userVerification: true});
    registerUserHandler(
      {
        firstName: userData.firstname,
        lastName: userData.lastname,
        mobileNumber: userData?.mobileNo?.phoneNumber,
        pin: userData.pin,
        password: 'pass@1',
        roleType: 1,
        gender: userData.gender,
        city: userData.city,
        companyName:userData.companyName,
        employeeId:userData.employeeId
      },
      userData.userToken
    )
      .then((res) => {
        // change
        if (res.data.response.responseData.status === 'ACTIVE') {
          setUserData({
            ...userData,
            isUserRegistered: true,
          });
          if (res.data.response.responseData.userId) {
            localStorage.setItem(
              'userId',
              res.data.response.responseData.userId
            );

            getUserDetailsHandler().then((response) => {
              if (response.data.response.responseMessage === 'SUCCESS') {
                localStorage.setItem(
                  'firstName',
                  response.data.response.responseData.firstName
                );
                localStorage.setItem(
                  'lastName',
                  response.data.response.responseData.lastName
                );
                localStorage.setItem(
                  'mobileNumber',
                  response.data.response.responseData.mobileNumber
                );
              }
            });
          }
          setLoaderInfo({...loaderInfo, userVerification: false});
        }
      })
      .catch((err) => {
        message.error('something went wrong!');
        setLoaderInfo({...loaderInfo, userVerification: false});
      });
  };

  const handleUserLoginSubmit = () => {
    setLoaderInfo({...loaderInfo, loginVerification: true});
    loginUserHandler(userData.mobileNo, userData.pin)
      .then((res) => {
        if (res.data.responseMessage === 'SUCCESS') {
          localStorage.setItem('token', res.data.responseData.authToken);
          localStorage.setItem('clientId', res.data.responseData.clientId);
          localStorage.setItem('firstName', res.data.responseData.firstName);
          localStorage.setItem('lastName', res.data.responseData.lastName);
          localStorage.setItem('userId', res.data.responseData.userId);
          localStorage.setItem('role', res.data.responseData.userType);
          if (res.data.responseData.aliasName) {
            localStorage.setItem('aliasName', res.data.responseData.aliasName);
          }
          if (res.data.responseData.avtarImg) {
            localStorage.setItem('avatarImg', res.data.responseData.avtarImg);
          }

          getUserDetailsHandler().then((response) => {
            if (response.data.response.responseMessage === 'SUCCESS') {
              localStorage.setItem(
                'gender',
                response.data.response.responseData.gender
              );
              localStorage.setItem(
                'emailId',
                response.data.response.responseData.emailId
              );
              localStorage.setItem(
                'dob',
                response.data.response.responseData.dob
              );
              localStorage.setItem(
                'city',
                response.data.response.responseData.city
              );

              localStorage.setItem(
                'authorizedDatasource',
                JSON.stringify(
                  response.data.response.responseData.authorizedDatasource
                )
              );
              localStorage.setItem(
                'state',
                response.data.response.responseData.state
              );
              localStorage.setItem(
                'pinCode',
                response.data.response.responseData.pinCode
              );

              localStorage.setItem(
                'mobileNumber',
                response.data.response.responseData.mobileNumber
              );

              localStorage.setItem(
                'dashboard_default_tab',

                response.data.response.responseData.dashboard_default_tab
              );
              localStorage.setItem(
                'dashboard_view_status',

                response.data.response.responseData.dashboard_view_status
              );
            }
          });
       
          history.push('./dashboard');
     
        } else {
          message.error(res.data.response.responseMessage);
        }
        setLoaderInfo({...loaderInfo, loginVerification: false});
      })
      .catch((err) => {
        message.error('something went wrong!');
        setLoaderInfo({...loaderInfo, loginVerification: false});
      });
  };

  const  userInfo = () => {
 
    if(window.location.href == 'https://global.mhealth.ai/#/login'){
      return(
      <CompnyForm
      {...{
        userData,
        loaderInfo,
        handleInput,
        handleInfoSubmit,
      }}
    />
      )
    }

    else{
      return(
      <UserInfoForm
      {...{
        userData,
        loaderInfo,
        handleInput,
        handleInfoSubmit,
      }}
    />
      )
    }
    
    }




  const handleSettingNewPassword = () => {
    forgetPasswordHandler(
      {
        forgetPin: {
          confirmPin: parseInt(userData.confirmPin),
          newPin: parseInt(userData.pin),
        },
      }
      /*userData.userToken*/
    )
      .then((res) => {
        if (res.data.response.responseCode === 0) {
          setUserData({
            ...userData,
            ismobileNoVerified: false,
            isExistingUser: false,
            isForgetPassSuccess: true,
            isOtpVerifiedForReset: false,
            isPasswordForgotten: false,
            otp: '',
            pin: '',
            confirmPin: '',
          });
        } else {
          message.error(res.data.response.responseMessage);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const {ismobileNoVerified, isOtpVerified, isUserRegistered, isExistingUser} =
    userData;

  return (
    <div className="Login">
      <div className="illustration">
        <img src={login} />
      </div>
      <div className="Logo">
        <img src={logoPng} />
        <div className="logo-text">mHealth.ai</div>
      </div>
      <div className="form-container">
        <div className={'form'}>
          {!ismobileNoVerified && (
            <MobileInputForm
              {...{
                userData,
                handleInput,
                loaderInfo,
                handleMobileInputSubmit,
              }}
            />
          )}
          {ismobileNoVerified && isExistingUser && (
            <PasswordVerifyForm
              {...{
                userData,
                setUserData,
                loaderInfo,
                handleInput,
                handleUserLoginSubmit,
                handleOtpInputSubmit,
                OTPRequestHandler,
                handleSettingNewPassword,
              }}
            />
          )}
          {ismobileNoVerified && !isExistingUser && !isOtpVerified && (
            <OTPVerifyForm
              {...{userData, loaderInfo, handleInput, handleOtpInputSubmit}}
            />
          )}
        
          {ismobileNoVerified && isOtpVerified && !isUserRegistered && (
           userInfo()
          )}
          {ismobileNoVerified && isOtpVerified && isUserRegistered && (
            <SuccessForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
