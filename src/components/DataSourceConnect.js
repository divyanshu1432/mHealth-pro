import React, {useEffect, useState} from 'react';
import List from '@material-ui/core/List';
import {useHistory} from 'react-router-dom';

import {APP} from '../utils/appConfig';
import DataSourceListItem from './DataSourceListItem';
import {getAuthLink} from '../services/challengeApi';
import TopUserDetails from './TopUserDetails';
import Navbar from './Navbar';
import {getUserDetailsHandler} from '../services/userprofileApi';

export default function DataSourceConnect() {
  const [dataSourceList, setDataSourceList] = useState([]);
  let history = useHistory();

  const fetchSourceDetails = () =>
    getUserDetailsHandler().then((res) => {
      let connectedSources =
        res.data.response &&
        res.data.response.responseData &&
        res.data.response.responseData.authorizedDatasource
          ? res.data.response.responseData.authorizedDatasource
          : [];

      let sourcesWithAuthLink = [];
      Promise.all(
        connectedSources.map((item) => getAuthLink(item.dataSource))
      ).then((promiseRes) => {
        let testArray = promiseRes.map((el, index) => {
          let newObj = {};
          if (connectedSources[index]) {
            newObj = {...connectedSources[index]};
          }
          newObj['authLink'] =
            el.data.response.responseMessage === 'SUCCESS' &&
            el.data.response.responseData &&
            el.data.response.responseData.authorizationLink
              ? el.data.response.responseData.authorizationLink
              : undefined;
          return newObj;
        });
        setDataSourceList(testArray);
      });

      setDataSourceList([...sourcesWithAuthLink]);

      if (
        res.data.response &&
        res.data.response.responseData &&
        res.data.response.responseData.authorizedDatasource
      ) {
        localStorage.setItem(
          'authorizedDatasource',
          JSON.stringify(res.data.response.responseData.authorizedDatasource)
        );
      }
    });

  function isLoggedIn() {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  }
  function callme() {
    if (isLoggedIn() && history && history.location.pathname == '/source') {
      //This promise will resolve when the network call succeeds
      //Feel free to make a REST fetch using promises and assign it to networkPromise
      var networkPromise = fetchSourceDetails();

      //This promise will resolve when 2 seconds have passed
      var timeOutPromise = new Promise(function (resolve, reject) {
        // 2 Second delay
        setTimeout(resolve, 10000, 'Timeout Done');
      });

      Promise.all([networkPromise, timeOutPromise]).then(function (values) {
        //Repeat
        if (isLoggedIn() && history && history.location.pathname == '/source') {
          callme();
        }
      });
    }
  }

  useEffect(() => {
    callme();
  }, []);
  return (
    <div className="Profile">
      <TopUserDetails />
      <Navbar />
      <div className="profile-background" style={{flexDirection: 'column'}}>
        <div className="dataSourceDiv">
          <div className="heading" style={{textAlign: 'center'}}>
            Authorize Data Source
          </div>
          <List>
            {Object.entries(APP.dataSourceLogo)
              .filter((val) => val[0] !== 'NOT_REGISTERED')
              .map((val) => (
                <DataSourceListItem
                  val={val}
                  connectedSources={dataSourceList}
                />
              ))}
          </List>
        </div>
      </div>
    </div>
  );
}
