import React, { FC } from 'react';
import { Footer, Header } from './layout/index';

const Landing: FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
const Default: FC = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
const Default1: FC = ({ children }) => {
  return <>{children}</>;
};

export { Landing, Default, Default1 };
