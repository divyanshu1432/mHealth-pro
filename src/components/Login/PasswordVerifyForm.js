import React, {useState, useEffect} from 'react';
import OtpInput from 'react-otp-input';
import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';

const PasswordVerifyForm = ({
  userData,
  setUserData,
  loaderInfo,
  handleInput,
  handleUserLoginSubmit,
  handleOtpInputSubmit,
  OTPRequestHandler,
  handleSettingNewPassword,
}) => (
  <>
    <div className="heading user-password-heading center fadeInUp">
      Hey, <br /> Good to see you back
    </div>
    {!userData.isOtpVerified && !userData.isOtpVerifiedForReset
      ? userData.isPasswordForgotten
        ? forgotPinWrapper(
            userData,
            setUserData,
            loaderInfo,
            handleInput,
            handleUserLoginSubmit,
            handleOtpInputSubmit,
            OTPRequestHandler
          )
        : inputPasswordWrapper(
            userData,
            setUserData,
            loaderInfo,
            handleInput,
            handleUserLoginSubmit,
            handleOtpInputSubmit,
            OTPRequestHandler
          )
      : passwordResetForm(
          userData,
          setUserData,
          loaderInfo,
          handleInput,
          handleSettingNewPassword
        )}
  </>
);

export default PasswordVerifyForm;

const inputPasswordWrapper = (
  userData,
  setUserData,
  loaderInfo,
  handleInput,
  handleUserLoginSubmit,
  handleOtpInputSubmit,
  OTPRequestHandler
) => {
  return (
    <>
      <div>
        <div className="sub-heading center fadeInUp">
          <h3>Please enter your pin</h3>
        </div>
        <div
          className="input-area fadeInUp"
          style={{margin: '0em 1em'}}
          onKeyDown={(e) => {
            if (e.keyCode === 13 && userData.pin?.length === 4) {
              document.getElementById('login-btn').click();
            }
          }}
        >
          <OtpInput
            shouldAutoFocus={true}
            value={userData.pin}
            onChange={(pin) => {
              handleInput('pin', pin);
            }}
            numInputs={4}
            separator={<span>-</span>}
            isInputNum={true}
            isInputSecure={true}
          />
        </div>
      </div>

      <div className={'submit-button'} style={{marginTop: '7.25em'}}>
        {loaderInfo.loginVerification ? (
          <div className="loader">
            <ReactLoadingWrapper
              color={'#518ad6'}
              height={'10%'}
              width={'10%'}
              type={'spin'}
            />
          </div>
        ) : (
          <button
            id="login-btn"
            className={
              userData.pin?.length !== 4 ? 'is-disabled' : 'is-success'
            }
            disabled={userData.pin?.length !== 4}
            onClick={() => {
              handleUserLoginSubmit();
            }}
            onSubmit={() => {
              handleUserLoginSubmit();
            }}
          >
            {'Login'}
          </button>
        )}
      </div>
      <div className="forgot-password" style={{marginTop: '1em'}}>
        <button
          className="is-secondary"
          onClick={() => {
            setUserData({
              ...userData,
              isPasswordForgotten: true,
              otp: '',
              pin: '',
            });
          }}
        >
          forgot pin?
        </button>
      </div>
    </>
  );
};

const forgotPinWrapper = (
  userData,
  setUserData,
  loaderInfo,
  handleInput,
  handleUserLoginSubmit,
  handleOtpInputSubmit,
  OTPRequestHandler
) => {
  const [gettingOTP, setGettingOTP] = useState(false);
  useEffect(() => {
    OTPRequestHandler('FORGET_PASSWORD', setGettingOTP);
  }, []);
  useEffect(() => {
    if (gettingOTP) {
      setTimeout(() => {
        setGettingOTP(false);
      }, 30000);
    }
  }, [gettingOTP]);

  return (
    <>
      <div
        style={{
          height: '11em',
        }}
      >
        <div className="sub-heading center fadeInUp">
          <h3>
            <span>Enter OTP Code sent to &nbsp;</span>
            {`+${userData?.mobileNo?.value}`}
          </h3>
        </div>
        <div
          className="input-area fadeInUp"
          style={{
            margin: '0em 1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <OtpInput
            shouldAutoFocus={true}
            value={userData.otp}
            onChange={(otp) => handleInput('otp', otp)}
            numInputs={6}
            separator={<span>-</span>}
            isInputNum={true}
          />

          <button
            className={`get-otp-button ${
              gettingOTP ? 'get-otp-button-disabled' : ''
            }`}
            onClick={() => {
              OTPRequestHandler('FORGET_PASSWORD', setGettingOTP);
            }}
          >
            {loaderInfo.gettingOTP
              ? 'Getting OTP'
              : gettingOTP
              ? 'OTP Sent'
              : 'Get OTP'}
          </button>
          {gettingOTP && (
            <h6 className={'fadeInUp'} style={{margin: '0.75em'}}>
              Resend after 30 seconds if not received.
            </h6>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '8em',
          marginTop: '2em',
        }}
      >
        <div className="forgot-password">
          <button
            className="is-secondary"
            onClick={() => {
              setUserData({
                ...userData,
                isPasswordForgotten: false,
                otp: '',
                pin: '',
              });
            }}
          >
            Go back and enter pin
          </button>
        </div>
        <div className={'submit-button'} style={{marginTop: '1em'}}>
          {loaderInfo.otpVerification ? (
            <div className="loader">
              <ReactLoadingWrapper
                color={'#518ad6'}
                height={'10%'}
                width={'10%'}
                type={'spin'}
              />
            </div>
          ) : (
            <button
              className={
                userData.otp?.length !== 6 ? 'is-disabled' : 'is-success'
              }
              disabled={userData.otp?.length !== 6}
              onClick={() => {
                handleOtpInputSubmit('FORGET_PASSWORD');
              }}
            >
              Verify
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const passwordResetForm = (
  userData,
  setUserData,
  loaderInfo,
  handleInput,
  handleSettingNewPassword
) => (
  <>
    <div className="sub-heading center fadeInUp">
      <h2 className={'fadeInUp'}>Please provide information to reset</h2>
    </div>
    <div className="fadeInUp">
      <div className="login-form">
        <div className="mhealth-input-box padding-1em">
          <label>Pin</label>
          <OtpInput
            className={'fadeInUp user-pin'}
            value={userData.pin}
            onChange={(otp) => handleInput('pin', otp)}
            numInputs={4}
            separator={<span>-</span>}
            isInputNum={true}
            isInputSecure={true}
          />
        </div>
        <div className="mhealth-input-box padding-1em">
          <label>Confirm Pin</label>
          <OtpInput
            className={'fadeInUp user-pin'}
            value={userData.confirmPin}
            onChange={(otp) => handleInput('confirmPin', otp)}
            numInputs={4}
            separator={<span>-</span>}
            isInputNum={true}
            isInputSecure={true}
          />
        </div>
      </div>
    </div>
    <div className="submit-button fadeInUp" style={{margin: '1em 0'}}>
      {loaderInfo.userVerification ? (
        <div className="loader">
          <ReactLoadingWrapper
            color={'#518ad6'}
            height={'10%'}
            width={'10%'}
            type={'spin'}
          />
        </div>
      ) : (
        <button
          className={
            userData.pin.length === 4 &&
            userData.confirmPin.length === 4 &&
            userData.pin === userData.confirmPin
              ? 'is-success'
              : 'is-disabled'
          }
          disabled={
            userData.pin.length === 4 &&
            userData.confirmPin.length === 4 &&
            userData.pin === userData.confirmPin
              ? false
              : true
          }
          onClick={() => {
            handleSettingNewPassword();
          }}
        >
          Continue
        </button>
      )}
    </div>
  </>
);
