import React, {useContext, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';

import ViewAllModal from './ViewAllModal';

const Scoreboard = ({challenge, index}) => {
  const [viewAll, setViewAll] = useState(false);

  const dump = challenge.scoresInTableFormat
    ? Object.entries(challenge.scoresInTableFormat)
    : [];

  const formattedData = dump.map((item) => {
    return {
      date: item[0],
      ...item[1],
    };
  });

  const scoreboardColor = {
    0: '#FFEDD5',
    1: '#FEF3C7',
    2: '#ECFCCB',
    3: '#CCFBF1',
    4: '#E0E7FF',
    5: '#FCE7F3',
    6: '#FFE4E6',
  };

  return (
    <div
      className="scoreboard"
      style={{background: scoreboardColor[index] ?? '#F5F5F4'}}
    >
      <div className="score">
        <div className="avatarcontainer">
          <Avatar
            className="avatar-component sponser-logo"
            src={challenge.receiverAvatarImage}
          />
          <div className="scorename" style={{fontWeight: 700}}>
            {challenge.receiverName || '-'}
          </div>
          <div className="scorename">
            {challenge.totalReceiverDistance ? (
              <>
                <div>Last - {challenge.lastDayReceiverScore}</div>
                <div>
                  Total -{' '}
                  {challenge.totalReceiverDistance ??
                    challenge.totalReceiverDistance.toFixed(2)}
                </div>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>

        <div className="scorecontainer">
          <div className="d-flex">
            <div className="scoreNo">{challenge.receiverPoints}</div>
            <div className="scoreNo">{'-'}</div>
            <div className="scoreNo"> {challenge.senderPoints}</div>
          </div>
          <div>
            <div className="scorename">{challenge.receiverLastActiveDay}</div>
          </div>
        </div>

        <div className="avatarcontainer">
          <Avatar
            className="avatar-component sponser-logo"
            src={challenge.senderAvatarImage}
          />
          <div className="scorename" style={{fontWeight: 700}}>
            {challenge.senderName || '-'}
          </div>
          <div className="scorename">
            {challenge.totalSenderDistance ? (
              <>
                <div>Last - {challenge.lastDaySenderScore}</div>
                <div>
                  Total -{' '}
                  {challenge.totalSenderDistance ??
                    challenge.totalSenderDistance.toFixed(2)}
                </div>
              </>
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
      {dump.length > 0 && (
        <div className="view-all-score" style={{width: '100%'}}>
          <button onClick={() => setViewAll((viewAll) => !viewAll)}>
            View Detail
          </button>
          {viewAll && (
            <ViewAllModal
              viewAll={viewAll}
              handleClose={() => {
                setViewAll(false);
              }}
              challenge={challenge}
              data={formattedData}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
