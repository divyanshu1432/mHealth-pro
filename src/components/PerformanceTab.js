import React, {useEffect} from 'react';
import PerformanceTable from './PerformanceTable';

const PerformanceTab = ({
  data,
  eventId,
  handlePerformanceClick,
  challengeSwitch,
}) => {
  useEffect(() => {
    handlePerformanceClick();
  }, []);
  return (
    <>
      <PerformanceTable
        data={data}
        eventId={eventId}
        handlePerformanceClick={handlePerformanceClick}
        challengeSwitch={challengeSwitch}
      />
    </>
  );
};

export default PerformanceTab;
