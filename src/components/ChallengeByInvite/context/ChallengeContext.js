import React, {createContext, useState} from 'react';

const initialState = {
  mobileNo: '',
  mobileDataList: [],
  selectedAction: 'request',
  challengesAccepted: [],
  scoreboard: {},
};

export const AppContext = createContext(initialState);

const ChallengeContext = ({children}) => {
  const [state, setState] = useState(initialState);

  const changeState = (value) => {
    setState({...state, ...value});
  };
  return (
    <AppContext.Provider value={{...state, changeState}}>
      {children}
    </AppContext.Provider>
  );
};

export default ChallengeContext;
