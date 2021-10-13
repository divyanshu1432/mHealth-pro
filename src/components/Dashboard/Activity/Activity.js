import React, {useEffect, useState} from 'react';
import SubEventCard from './SubEventCard';
import FallbackDiv from '../../Utility/FallbackDiv';
import useActivity from '../hooks/useActivity';
import NoData from '../../NoData';
import DateRangePickerW from './DateRangePickerW';
import TriStateToggle from './TriStateToggle';

const Activity = ({eventId, currentEventObj}) => {
  const [selval, setselval] = useState('');

  const [mystyle, setmystyle] = useState({
    display: 'flex',
    flexWrap: 'wrap',
  });
  const setcardstyle = {display: 'flex', flexWrap: 'wrap', display: 'none'};
  const agsetcardstyle = {display: 'flex', flexWrap: 'wrap', display: 'none'};
  const agcardstyle = {display: 'flex', flexWrap: 'wrap'};
  const [filterstyle, setfilterstyle] = useState({
    display: 'flex',
    flexWrap: 'wrap',
    display: 'none',
  });
  const [dataarr, setdataarr] = useState([]);
  const [uniquearr, setuniquearr] = useState([]);
  const setfiltercardstyle = {display: 'flex', flexWrap: 'wrap'};

  function sel(e) {
    setmystyle(setcardstyle), setfilterstyle(setfiltercardstyle);
    setselval(e.target.value);
  }
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredSubEvent, setFilteredSubEvent] = useState([]);
  const today = new Date();

  const [value, onChange] = useState([today, today]);
  const [subEventList, scheduledData, fetchSubEvents] = useActivity(
    eventId,
    value
  );

  const handleDateChange = (ob) => {
    onChange(ob);
  };

  const handleSubscription = () => {
    fetchSubEvents(value);
  };
  useEffect(() => {
    setSelectedFilter('all');
    setmystyle(agcardstyle), setfilterstyle(agsetcardstyle);
    setFilteredSubEvent([]);
  }, [eventId]);

  const renderSubEventList = () => {
    const data =
      selectedFilter !== 'all'
        ? selectedFilter == 'Schedule'
          ? scheduledData
          : filteredSubEvent
        : subEventList;

    useEffect(() => {
      let unique = [
        ...new Map(data.map((item) => [item['eventType'], item])).values(),
      ];
      console.log(unique.typeof);
      setdataarr(unique);
      // setuniquearr()
    }, [data]);

    // useEffect(() => {  } , [])

    // console.log(dataarr)

    if (data.length) {
      var marvelHeroes = data.filter(function (hero) {
        const x = hero.eventType == selval;
        return x;
      });

      return (
        <>
          <div style={mystyle}>
            {data.map((subEventDetail) => (
              <SubEventCard
                subEventDetail={subEventDetail}
                currentEventObj={currentEventObj}
                handleSubscription={handleSubscription}
                type="view"
              />
            ))}
          </div>

          <div style={filterstyle}>
            {marvelHeroes.map((subEventDetail) => (
              <SubEventCard
                subEventDetail={subEventDetail}
                currentEventObj={currentEventObj}
                handleSubscription={handleSubscription}
                type="view"
              />
            ))}
          </div>
        </>
      );
    }

    return (
      <FallbackDiv
        {...{
          width: '100%',
          padding: '20px',
        }}
      >
        <NoData />
      </FallbackDiv>
    );
  };
  useEffect(() => {
    if (selectedFilter.toUpperCase() !== 'SCHEDULE') {
      setselval('');
      setFilteredSubEvent(
        subEventList.filter(
          (val) =>
            val?.otherStatus?.toUpperCase() === selectedFilter.toUpperCase()
          // val?.eventType?.toUpperCase() === 'YOGA'
        )
      );
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchSubEvents(value);
  }, [value]);

  const renderFilterButton = (type) => {
    return (
      <div
        className={
          type.toUpperCase() === selectedFilter.toUpperCase()
            ? 'filter-button-program selected-filter-button'
            : 'filter-button-program'
        }
        onClick={() => {
          setSelectedFilter(type);
        }}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    );
  };

  return (
    <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{overflow: 'hidden', marginBottom: 5, marginRight: '0.5em'}}
        >
          <TriStateToggle
            values={['all', 'old', 'Subscribed', 'Available']}
            selected={selectedFilter}
            handleChange={(value) => {
              setSelectedFilter(value);
            }}
          />
        </div>
        <div style={{marginRight: '0.5em'}}>
          <DateRangePickerW {...{value, handleDateChange}} />
        </div>
        <div>{renderFilterButton('Schedule')}</div>
        <div>
          <select
            onChange={sel}
            style={{
              height: '30px',
              fontSize: '12px',
              baackground: 'transparent',
            }}
          >
            <option> select :- </option>
            {dataarr.map((curelem, index) => {
              return (
                <>
                  <option> {curelem.eventType} </option>
                </>
              );
            })}
          </select>
        </div>
      </div>
      <div style={{paddingBottom: 30}}>{renderSubEventList()}</div>
    </div>
  );
};
export default Activity;
