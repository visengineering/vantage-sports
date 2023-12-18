import React from 'react';
import education from '../../assets/landingpage/education.svg';
import group from '../../assets/landingpage/group.svg';
import soccer from '../../assets/landingpage/money.svg';
import money from '../../assets/landingpage/soccer.svg';

const WhyVantage = () => {
  return (
    <section className="why-vantage-section py-5 text-center container sections">
      <h2>
        <strong>Why Vantage?</strong>
      </h2>
      <div className="row mt-5">
        <div className="col">
          <img src={money} height="80" />
          <p className="mt-4">Current Top Talent</p>
        </div>

        <div className="col">
          <img src={group} height="80" />
          <p className="mt-4">Role Models</p>
        </div>

        <div className="col">
          <img src={education} height="80" />
          <p className="mt-4">Supports Education</p>
        </div>

        <div className="col">
          <img src={soccer} height="80" />
          <p className="mt-4">Affordable</p>
        </div>
      </div>
      <a
        href="#join-us-section"
        className="btn-primary btn-lg mt-4 d-inline-block"
      >
        Join Today
      </a>
    </section>
  );
};

export default WhyVantage;
