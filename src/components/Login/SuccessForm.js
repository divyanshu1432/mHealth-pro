import React, {useEffect} from 'react';
import {celebrate} from '../../utils/commonFunctions';
import confetti from 'canvas-confetti';
import {useHistory} from 'react-router-dom';

const SuccessForm = () => {
  celebrate();
  const history = useHistory();
  useEffect(() => {
    setTimeout(() => {
      history.push('/dashboard');
    }, 2000);
  }, []);
  return (
    <div className="registration-success">
      <div className="heading center fadeInUp">Woo Hoo!</div>
      <div className="sub-heading center fadeInUp">
        <h2 className={'fadeInUp'}>Welcome aboard</h2>
      </div>
    </div>
  );
};

export default SuccessForm;
