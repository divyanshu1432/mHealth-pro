import React, {useEffect, useState} from 'react';
import PhoneInput from 'react-phone-input-2';
import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';
import {getCountryListData} from '../../services/challengeApi';

const MobileInputForm = ({
  userData,
  handleInput,
  loaderInfo,
  handleMobileInputSubmit,
}) => {
  const [countryList, setCountryList] = useState([]);

  useEffect(() => {
    getCountryListData().then((res) => {
      setCountryList(
        res?.data.response?.responseData ? res?.data.response?.responseData : []
      );
    });
  }, []);
  return (
    <>
      {userData.isForgetPassSuccess && (
        <div className={'success-message fadeInUp'}>
          <h2>
            <div>Your Pin has been updated</div>
          </h2>
        </div>
      )}
      <div className="heading">
        Enter Your <br />
        Mobile Number
      </div>
      <div className="sub-heading">We will send you a confirmation code</div>
      <div className="input-area input-mobile fadeInUp">
        {countryList.length > 0 ? (
          <PhoneInput
            country={'in'}
            autoFormat={true}
            value={userData.mobileNo.value}
            onChange={(value, country) => {
              let dialCode = country.dialCode;
              let phoneNumber = value.substring(dialCode.length);
              let currLocalCountryObj = countryList.filter(
                (ctrItem) => ctrItem.shortName == country.countryCode
              )[0];

              if (
                userData?.mobileNo?.dialCode &&
                userData?.mobileNo?.dialCode != currLocalCountryObj.countryId
              ) {
                //clear data on switching country
                handleInput('mobile', {
                  dialCode: dialCode,
                  phoneNumber: '',
                  value: dialCode,
                });
              }

              if (
                currLocalCountryObj &&
                phoneNumber.length <= currLocalCountryObj.mobileNumberLength
              ) {
                handleInput('mobile', {
                  dialCode: dialCode,
                  phoneNumber: phoneNumber,
                  value: value,
                });
              }
            }}
            onEnterKeyPress={() => {
              handleMobileInputSubmit();
            }}
            onlyCountries={countryList?.map((item) => item.shortName)}
            countryCodeEditable={false}
          />
        ) : (
          <ReactLoadingWrapper
            color={'#518ad6'}
            height={'10%'}
            width={'10%'}
            type={'spin'}
          />
        )}
      </div>
      <div className={'submit-button'}>
        {loaderInfo.mobileVerification ? (
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
            className={'is-success'}
            onClick={() => {
              handleMobileInputSubmit();
            }}
          >
            Verify
          </button>
        )}
      </div>
    </>
  );
};

export default MobileInputForm;
