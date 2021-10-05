import React from 'react';
import {Switch, SwitchLabel, SwitchRadio, SwitchSelection} from './styles2.js';

const titleCase = (str) =>
  str
    .split(/\s+/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const ClickableLabel = ({title, onChange, id, selected}) => (
  <SwitchLabel
    onClick={() => onChange(title)}
    className={id}
    style={selected == title ? {color: '#fff'} : {}}
  >
    {titleCase(title)}
  </SwitchLabel>
);

const ConcealedRadio = ({value, selected}) => (
  <SwitchRadio type="radio" name="switch" defaultChecked={selected === value} />
);

const ToggleSwitch = ({selected, handleChange, values}) => {
  const selectionStyle = () => {
    return {
      left: `${(values.indexOf(selected) / 2) * 100}%`,
    };
  };
  return (
    <Switch>
      {values.map((val) => {
        return (
          <span key={val}>
            <ConcealedRadio value={val} selected={selected} />
            <ClickableLabel
              title={val}
              onChange={handleChange}
              selected={selected}
            />
          </span>
        );
      })}
      <SwitchSelection style={selectionStyle()} />
    </Switch>
  );
};

export default ToggleSwitch;
