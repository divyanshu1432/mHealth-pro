import React from 'react';

const FallbackDiv = ({height, width, padding, children}) => (
  <div
    style={{
      height: `${height}`,
      width: '97%',
      padding: `${padding}`,
      border: '1px solid #D4D4D8',
      borderRadius: 12,
      color: '#27272A',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export default FallbackDiv;
