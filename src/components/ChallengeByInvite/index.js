import React, {useState} from 'react';
import SendChallenge from './SendChallenge';
import ActionSelector from './ActionSelector';
import AcceptedChallengeList from './AcceptedChallengeList';
import ChallengeContext from './context/ChallengeContext';

const ChallengeByInvite = ({
  eventId,
  reloadChallengeAccepted,
  setReloadChallengeAccepted,
}) => {
  return (
    <div className="Send-Challenge">
      <ChallengeContext>
        <div className="d-flex flex-column">
          <SendChallenge eventId={eventId} />
        </div>
        <div className="d-flex">
          <div style={{width: '20%'}}>
            <ActionSelector
              eventId={eventId}
              reloadChallengeAccepted={reloadChallengeAccepted}
              setReloadChallengeAccepted={setReloadChallengeAccepted}
            />
          </div>
          <div style={{width: '80%'}}>
            <AcceptedChallengeList
              eventId={eventId}
              reloadChallengeAccepted={reloadChallengeAccepted}
              setReloadChallengeAccepted={setReloadChallengeAccepted}
            />
          </div>
        </div>
      </ChallengeContext>
    </div>
  );
};

export default ChallengeByInvite;
