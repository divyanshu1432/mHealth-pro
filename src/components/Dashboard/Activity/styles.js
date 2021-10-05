import styled from 'styled-components';

export const Switch = styled.div`
  font-family: 'Nunito, Lucida Grande', Tahoma, Verdana, sans-serif;
  position: relative;
  height: 26px;
  width: 260px;
  background-color: #fff;
  border: 1px solid lightgray;
  border-radius: 3px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
`;

export const SwitchRadio = styled.input`
  display: none;
`;

export const SwitchSelection = styled.span`
  display: block;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  width: 25%;
  height: 26px;
  background: #216ba5;
  border-radius: 3px;
  transition: left 0.25s ease-out;
`;

export const SwitchLabel = styled.label`
  position: relative;
  z-index: 2;
  float: left;
  width: 60px;
  line-height: 26px;
  font-size: 11px;
  color: rgb(0, 0, 0);
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;

  ${SwitchRadio}:checked + & {
    transition: 0.15s ease-out;
  }
`;
