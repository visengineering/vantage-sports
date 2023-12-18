import React from 'react';
import { Loader } from '../shared';

export const ModalLoader = () => (
  <div
    style={{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      display: 'flex',
      backgroundColor: 'transparent',
      zIndex: '1',
    }}
  >
    <Loader loaderText="Please wait..." />
  </div>
);
