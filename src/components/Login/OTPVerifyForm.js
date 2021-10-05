import React from 'react';
import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';
import OtpInput from 'react-otp-input';

const OTPVerifyForm = ({
  userData,
  loaderInfo,
  handleInput,
  handleOtpInputSubmit,
}) => (
  <>
    <div className="heading center fadeInUp">OTP Verification</div>
    <div className="sub-heading center fadeInUp">
      <span>Enter OTP Code sent to &nbsp;</span>
      {`+${userData?.mobileNo?.value}`}
    </div>
    <div className="input-area fadeInUp">
      <OtpInput
        shouldAutoFocus={true}
        value={userData.otp}
        onChange={(otp) => handleInput('otp', otp)}
        numInputs={6}
        separator={<span>-</span>}
        isInputNum={true}
      />
    </div>
    <div className="submit-button fadeInUp" style={{margin: '4em 0 0 0'}}>
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
          className={userData.otp?.length === 6 ? 'is-success' : 'is-disabled'}
          disabled={userData.otp?.length !== 6}
          onClick={() => {
            handleOtpInputSubmit();
          }}
        >
          Continue
        </button>
      )}
    </div>
  </>
);

export default OTPVerifyForm;
