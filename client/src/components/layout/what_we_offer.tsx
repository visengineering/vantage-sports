import React from 'react';

const WhatWeOffer = () => {
  return (
    <section className="what-we-offer-section text-center container padding-section">
      <h2>
        <strong>What we offer</strong>
      </h2>
      <div className="row align-items-center justify-content-center text-primary mt-5">
        <div className="col-12 col-md-3 bg-light rounded-lg p-4">
          Current top talent
        </div>
        <div className="col-12 col-md-3 bg-light rounded-lg mx-0 my-4 my-lg-0 mx-lg-4 p-3">
          Top-Tier Instruction and Drills to drive improvement
        </div>
        <div className="col-12 col-md-3 bg-light rounded-lg p-3">
          The most up to date insight on the recruiting process
        </div>
      </div>
    </section>
  );
};

export default WhatWeOffer;
