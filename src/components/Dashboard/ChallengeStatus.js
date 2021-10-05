import React from 'react';
import InfoDialog from '../Utility/InfoDialog';

const ChallengeStatus = ({
  challengeStatusMsg,
  setDisplayChallengeStatus,
  displayChallengeStatus,
}) => {
  return (
    <div>
      <InfoDialog
        onClose={() => {
          setDisplayChallengeStatus(false);
        }}
        open={displayChallengeStatus}
        title="Challenge Invite Request"
      >
        <div
          style={{
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p>{challengeStatusMsg}</p>
          <button
            style={{
              background: 'green',
              color: '#fff',
              width: '50%',
            }}
            onClick={() => {
              setDisplayChallengeStatus(false);
            }}
          >
            Close
          </button>
        </div>
      </InfoDialog>
    </div>
  );
};

export default ChallengeStatus;
