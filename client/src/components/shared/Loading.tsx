import React from 'react';

export const Loading = () => (
  <div
    style={{
      display: 'flex',
      flex: '1',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);
