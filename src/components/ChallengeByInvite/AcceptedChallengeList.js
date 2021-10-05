import React, {useEffect, useContext, useState} from 'react';
import {Grid, List} from 'react-feather';

import {viewScorecard, getChallenges} from '../../services/challengeApi';
import Scoreboard from './Scoreboard';
import NoData from '../NoData';
import ListView from './ListView';

const AcceptedChallengeList = ({eventId, reloadChallengeAccepted}) => {
  useEffect(() => {
    getChallenges('', eventId)
      .then((res) => {
        if (res.status == 200 && res.data.response.responseCode == 0) {
          const acceptedChallengeId = res.data.response.responseData.Receiver
            ? res.data.response.responseData.Receiver.filter(
                (ch) => ch.challengeStatus.toUpperCase() === 'ACCEPT'
              ).map((ch) => ch.challengerId)
            : [];

          if (acceptedChallengeId.length === 0) {
            setScoreboardData([]);
          }
          viewScorecard('', eventId)
            .then((res) => {
              if (res.status === 200 && res.data.response.responseCode === 0) {
                setScoreboardData(res.data.response.responseData);
              } else {
                setScoreboardData([]);
              }
            })
            .catch(() => {
              setScoreboardData([]);
            });
        } else {
          setScoreboardData([]);
        }
      })
      .catch((err) => {
        setScoreboardData([]);
      });
  }, [eventId, reloadChallengeAccepted]);

  const [scoreboardData, setScoreboardData] = useState([]);
  const [scoreCardView, setScoreCardView] = useState('grid');

  return (
    <div className="challenge-scoreboard">
      <div className="headingScoreboard">
        <span style={{paddingLeft: 10}}>Scorecard</span>
        <span
          style={{
            paddingRight: 10,
            fontSize: 14,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {scoreCardView === 'grid' ? (
            <span
              style={{display: 'flex', alignItems: 'center'}}
              onClick={() => setScoreCardView('list')}
            >
              <List size={14} style={{marginRight: 3}} /> List
            </span>
          ) : (
            <span
              style={{display: 'flex', alignItems: 'center'}}
              onClick={() => setScoreCardView('grid')}
            >
              <Grid size={14} style={{marginRight: 3}} /> Grid
            </span>
          )}
        </span>
      </div>
      <div className="challenges-list-container">
        {'acceptedChallenge' in scoreboardData ? (
          scoreCardView == 'grid' ? (
            scoreboardData.acceptedChallenge.length > 0 ? (
              scoreboardData.acceptedChallenge.map((challenge, index) => (
                <div key={challenge.challengeId}>
                  <Scoreboard challenge={challenge} index={index} />
                </div>
              ))
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  padding: '80px 20px',
                }}
              >
                <NoData />
              </div>
            )
          ) : (
            <ListView data={scoreboardData.acceptedChallenge} />
          )
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              padding: '80px 20px',
            }}
          >
            <NoData />
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptedChallengeList;
