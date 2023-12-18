import React, { FC } from 'react';
import { Spinner } from 'react-bootstrap';

const Loader: FC<{
  loaderText?: string;
  loaderWidth?: string;
  loaderHeight?: string;
}> = ({ loaderText = '', loaderWidth = '50px', loaderHeight = '50px' }) => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: loaderWidth,
        height: loaderHeight,
        margin: 'auto',
        display: 'block',
      }}
    >
      {loaderText && (
        <span
          className="sr-only"
          style={{ color: 'blue', fontWeight: 700, textAlign: 'center' }}
        >
          {loaderText}
        </span>
      )}
    </Spinner>
  );
};

export default Loader;
