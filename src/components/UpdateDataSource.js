import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {updateSource, getDataCurrentSource} from '../services/challengeApi';
import Tooltip from '@material-ui/core/Tooltip';

const dataSourceMapping = {
  WHATSAPP: 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/whatsapp.svg',
  STRAVA: 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/strava.svg',
  GOOGLE_FIT:
    'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/googlefit.svg',
};

const UpdateDataSource = ({dashboardState}) => {
  let currentEvent = dashboardState.listOfChallenges.filter(
    (item) => item.id == dashboardState.selectedChallenge
  )[0];

  const [currentDataSource, setCurrentDataSource] = useState();
  const [originalSource, setOriginalSource] = useState();

  const fetchCurrentDataSource = () => {
    if (currentEvent && currentEvent.id) {
      getDataCurrentSource(currentEvent.id).then((res) => {
        if (res.data.response.responseMessage === 'SUCCESS') {
          setCurrentDataSource(res.data.response?.responseData?.datasource);
          setOriginalSource(res.data.response?.responseData?.datasource);
        }
      });
    }
  };

  useEffect(() => {
    setCurrentDataSource();
    setOriginalSource();
    fetchCurrentDataSource();
  }, [dashboardState.selectedChallenge]);

  let authorizedSources =
    localStorage.getItem('authorizedDatasource') != undefined &&
    localStorage.getItem('authorizedDatasource') != 'undefined'
      ? JSON.parse(localStorage.getItem('authorizedDatasource'))
      : [];

  const handleDataSourceChange = (value, sourceActive) => {
    if (sourceActive || value === 'WHATSAPP') {
      setCurrentDataSource(value);
    }
  };

  const updateDisable = !Object.entries(dataSourceMapping)
    .filter((item) => {
      return item[0] !== originalSource;
    })
    .map((item) => item[0])
    .includes(currentDataSource);

  const renderSources = (type) => {
    let sourcesArray = Object.entries(dataSourceMapping).filter((item) => {
      if (type == 'current') {
        return item[0] == originalSource;
      }
      if (type == 'change') {
        return item[0] !== originalSource;
      }
    });

    return sourcesArray.map((item) => {
      let currentSource = authorizedSources.filter(
        (source) => source.dataSource === item[0]
      )[0];
      let currentSourceStatus =
        currentSource && currentSource['authorized'] ? 'connected' : 'connect';
      return (
        <Tooltip
          title={
            currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
              ? 'Source not authorized. Please update it in DataSource section'
              : ''
          }
        >
          <div
            style={{
              display: 'flex',
              cursor:
                currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
                  ? 'not-allowed'
                  : 'pointer',
              background:
                currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
                  ? '#eeeeee'
                  : '#fff',
              padding: 3,
              borderRadius: 4,
              flexShrink: 0,
              alignItems: 'center ',
              margin: 10,
              cursor:
                currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
                  ? 'not-allowed'
                  : 'pointer',
              border:
                currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
                  ? 'none'
                  : '',
              userSelect: 'none',
              height: 32,
            }}
            onClick={() => {
              if (type != 'current') {
                handleDataSourceChange(
                  item[0],
                  currentSourceStatus != 'connect'
                );
              }
            }}
            key={item[0]}
            className={
              currentDataSource === item[0] && type != 'current'
                ? 'datasource-image datasource-image-active'
                : type != 'current'
                ? 'datasource-image'
                : ''
            }
          >
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{fontSize: 12}}>
                {item[0] === 'GOOGLE_FIT' ? 'GOOGLE FIT' : item[0]}
              </div>
              <div style={{fontSize: 10}}>
                {currentSourceStatus == 'connect' && item[0] !== 'WHATSAPP'
                  ? 'Not authorized'
                  : null}
              </div>
            </div>
            <img
              src={item[1]}
              key={item[0]}
              style={{
                marginLeft: 5,
                height: 25,
              }}
            />
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <>
      <div
        style={{
          minHeight: 300,
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {currentEvent && (
          <div style={{textAlign: 'center'}}>
            <div style={{fontWeight: 800, fontSize: 14}}>
              {currentEvent['challengeName']}
            </div>

            <div
              style={{
                marginTop: 30,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Current Source :
              <div style={{display: 'flex'}}>{renderSources('current')}</div>
            </div>

            <div
              style={{
                marginTop: 20,
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Change Source :
              <div style={{display: 'flex'}}>{renderSources('change')}</div>
            </div>
            <div
              style={{display: 'flex', justifyContent: 'center', marginTop: 40}}
            >
              <div style={{width: 100}}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{backgroundColor: '#518ad6'}}
                  onClick={() => {
                    let payload = {
                      eventId: currentEvent?.id,
                      datasource: currentDataSource,
                    };
                    updateSource(payload).then((res) => {
                      message.success(res.data.response.responseMessage);
                      fetchCurrentDataSource();
                    });
                  }}
                  disabled={updateDisable}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UpdateDataSource;
