import React from 'react';
import ReactLoading from 'react-loading';

const ReactLoadingWrapper = ({type, color, height, width}) => (
  <ReactLoading type={type} color={color} height={height} width={width} />
);

export default ReactLoadingWrapper;
