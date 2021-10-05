import React, {useState, useEffect} from 'react';
import {Maximize2, Minimize2} from 'react-feather';

const FullScreen = ({id}) => {
  const [isMax, setMax] = useState(
    localStorage.getItem('dashboard_view_status') == 0 ? true : false
  );
  useEffect(() => {
    let defElem = document.getElementById(id);
    if (isMax) {
      defElem.classList.add('d-none');
    } else {
      defElem.classList.remove('d-none');
    }
  }, []);
  return (
    <div
      className="full-screen-button"
      onClick={() => {
        let Element = document.getElementById(id);

        if (!Element.classList.contains('d-none')) {
          setMax(true);
          Element.classList.add('d-none');
        } else {
          setMax(false);
          Element.classList.remove('d-none');
        }
      }}
    >
      {isMax ? (
        <Minimize2 color="#0369A1" size={15} />
      ) : (
        <Maximize2 color="#0369A1" size={15} />
      )}
    </div>
  );
};

export default FullScreen;
