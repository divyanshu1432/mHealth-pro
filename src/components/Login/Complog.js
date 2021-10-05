import React from 'react';
import OtpInput from 'react-otp-input';
import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';

const CompnyForm = ({
  userData,
  loaderInfo,
  handleInput,
  handleInfoSubmit,
}) => (
  <>
    <div className="user-detail-heading center fadeInUp">
      Getting started is easy
    </div>
    <div className="sub-heading center fadeInUp">
      <h2 className={'fadeInUp'}>Tell us about you</h2>
    </div>
    <div className="fadeInUp">
      <div className="login-form">
        <div
          className="mhealth-input-box padding-025em"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>Firstname</label>
            </div>
            <input
              placeholder="Enter your firstname"
              value={userData.firstname}
              autoFocus
              onChange={(e) => handleInput('firstname', e.target.value)}
              style={{width: '80%'}}
            />
          </div>
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>Lastname</label>
            </div>
            <input
              placeholder="Enter your lastname"
              value={userData.lastname}
              onChange={(e) => handleInput('lastname', e.target.value)}
              style={{width: '80%'}}
            />
          </div>
        </div>
        <div
          className="mhealth-input-box padding-025em"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>City</label>
            </div>
            <input
              placeholder="Enter your city"
              value={userData.city}
              onChange={(e) => handleInput('city', e.target.value)}
              style={{width: '80%'}}
            />
          </div>
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>Gender</label>
            </div>

            <select
              name="gender"
              value={userData.gender}
              onChange={(e) => {
                handleInput('gender', e.target.value);
              }}
              style={{fontSize: 12}}
            >
              <option value={undefined}>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>





        {/* new code from here  */}

        <div
          className="mhealth-input-box padding-025em"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>Company name</label>
            </div>
            <input
              placeholder="Enter your company name"
              value={userData.companyName}
            
              onChange={(e) => handleInput('companyName', e.target.value)}
              style={{width: '80%'}}
            />
          </div>
          <div className="registration-form-field">
            <div>
              <label style={{fontSize: 12}}>Employee id</label>
            </div>
            <input
              placeholder="Enter your Employee id"
              value={userData.employeeId}
              onChange={(e) => handleInput('employeeId', e.target.value)}
              style={{width: '80%'}}
            />
          </div>
        </div>



{/* new code end here */}










        <div className="mhealth-input-box padding-05em user-info-form-otp-wrapper">
          <div className="user-info-form-otp-boxes" >
            <label>
              Set your Login PIN <br />

            </label>
            <OtpInput
            style={{marginBottom:'10px'}}
              className={'fadeInUp user-pin mb-3'}
              value={userData.pin}
              onChange={(otp) => handleInput('pin', otp)}
              numInputs={4}
              separator={<span>-</span>}
              isInputNum={true}
              isInputSecure={true}
            />
          </div>

          <div className="user-info-form-otp-boxes" >
            <label>
              Confirm your PIN
            </label>
            <div>
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
      </div>
    </div>
    <span  style={{fontSize:'10px', color:'red', marginLeft:'20px' }}> * Firsr character of PIN must be between 1-9  </span> 

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
            userData.firstname.length !== 0 &&
            userData.lastname.length !== 0 &&
            userData.companyName.length !== 0 &&
            userData.employeeId.length !== 0 &&
            userData.city.length !== 0 &&
            userData.pin.length === 4 &&
            userData.confirmPin.length === 4 &&
            userData.pin === userData.confirmPin
              ? 'is-success'
              : 'is-disabled'
          }
          disabled={
            userData.firstname.length !== 0 &&
            userData.lastname.length !== 0 &&
            userData.companyName.length !== 0 &&
            userData.employeeId.length !== 0 &&
            userData.city.length !== 0 &&
            userData.pin.length === 4 &&
            userData.confirmPin.length === 4 &&
            userData.pin === userData.confirmPin
              ? false
              : true
          }
          onClick={() => {
            handleInfoSubmit();
          }}
        >
          Continue
        </button>
      )}
    </div>
  </>
);

export default CompnyForm;
