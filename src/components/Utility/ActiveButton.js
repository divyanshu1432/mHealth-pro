import React from 'react';
import {ToggleLeft, ToggleRight} from 'react-feather';
import Switch from 'react-switch';

const ActiveButton = ({isActive, handleActive, text}) => (
  <div
    style={{
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center ',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    <div style={{margin: '0px 10px'}}>{text ? text : 'Show All'}</div>
    <Switch
      onChange={handleActive}
      checked={!isActive}
      height={22}
      width={52}
    />
  </div>
);

export default ActiveButton;
