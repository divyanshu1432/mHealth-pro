import React from 'react';
import dataSource from '../assets/dataSource.svg';

const NoData = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    <img src={dataSource} width={400} height={200} />
    <span style={{margin: '1rem'}}>No Data</span>
  </div>
);

export default NoData;
