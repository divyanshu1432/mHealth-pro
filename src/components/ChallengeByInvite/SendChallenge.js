import React, {useEffect, useContext, useState} from 'react';
import {AppContext} from './context/ChallengeContext';
import {getAllUserByMobile} from '../../services/challengeApi';
import Invite from './Invite';

const SendChallenge = ({eventId}) => {
  const {mobileNo, mobileDataList, changeState} = useContext(AppContext);
  const [userFound, setUserFound] = useState(undefined);
  useEffect(() => {
    getAllUserByMobile().then((res) => {
      if (res.status === 200 && res.data.response.responseCode === 0) {
        changeState({mobileDataList: res.data.response.responseData});
      }
    });
    setUserFound();
    changeState({mobileNo: ''});
  }, [eventId]);

  const handleUserSearch = () => {
    const userFound = mobileDataList.filter(
      (mobileData) => parseInt(mobileData.mobileNumber) === parseInt(mobileNo)
    );
    setUserFound(userFound);
  };
  return (
    <div className="send-challenge-box">
      <div className="input-container">
        <input
          type="number"
          name="mobile_no"
          placeholder="Search User by Mobile No"
          value={mobileNo}
          onChange={(e) => {
            if (e.target.value === '') {
              setUserFound(undefined);
            }
            if (e.target.value.length < 11) {
              changeState({mobileNo: e.target.value});
            }
          }}
        />
        <button
          name="searchUser"
          className={
            !mobileNo ? 'searchUserByMobileDisabled' : 'searchUserByMobile'
          }
          onClick={handleUserSearch}
          disabled={!mobileNo}
        >
          Search
        </button>
        {userFound && (
          <Invite userFound={userFound} mobileNo={mobileNo} eventId={eventId} />
        )}
      </div>
    </div>
  );
};

export default SendChallenge;
