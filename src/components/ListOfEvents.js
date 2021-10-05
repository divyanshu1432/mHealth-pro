import React from 'react';
import ScrollableList from './ScrollableList';

import EventCard from './EventCard';

const ListOfEvents = ({
  handleChallengeCardClick,
  fetchChallenges,
  data,
  dashboardState,
  setDashboardState,
  selectedAction,
  listType,
  selectedChallengeArray,
  selectedChallenge,
}) => {
  const displayListOfChallenges = () => {
    let list = [];
    if (data && data.length > 0) {
      /** show public and private? */
      let tempList =
        selectedAction === 'Leaderboard' || listType !== 'subEvent'
          ? data
          : data.filter((item) => item.isParticipated);
      list = tempList.map((challenge) => {
        return (
          <EventCard
            challenge={challenge}
            handleChallengeCardClick={handleChallengeCardClick}
            dashboardState={dashboardState}
            key={challenge.id}
            setDashboardState={setDashboardState}
            fetchChallenges={fetchChallenges}
            listType={listType}
            selectedChallenge={selectedChallenge}
            selectedChallengeArray={selectedChallengeArray}
            selectedAction={selectedAction}
          />
        );
      });
    } else {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    if (list.length === 0) {
      for (let i = 0; i < 4; i++) {
        list.push(<div className="challenge-card" key={i}></div>);
      }
    }
    return list;
  };
  return (
    <div>
      <ScrollableList>{displayListOfChallenges()}</ScrollableList>
    </div>
  );
};

export default ListOfEvents;
