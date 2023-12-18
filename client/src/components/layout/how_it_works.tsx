import React from 'react';
import BaseballLeft from '../../assets/landingpage/optimized/baseball-left.jpeg';
import BaseballRight from '../../assets/landingpage/optimized/baseball-right.jpeg';
import BaseballTop from '../../assets/landingpage/optimized/baseball-top.jpeg';
import calendar from '../../assets/landingpage/calendar.svg';
import chat from '../../assets/landingpage/chat.svg';
import football from '../../assets/landingpage/football.svg';
import lens from '../../assets/landingpage/lens.svg';

const HowItWorks = () => {
  return (
    <section className="how-it-work-section bg-primary text-white padding-section">
      <div className="container d-flex justify-content-between mx-auto">
        <div className="mt-3 d-none d-lg-block">
          <div className="mb-4">
            <img
              className="rounded img rounded-lg"
              src={BaseballTop}
              height="280"
            />
          </div>
          <div className="row">
            <div className="col-6">
              <img className="rounded img" src={BaseballLeft} height="275" />
            </div>
            <div className="col-6">
              <img className="rounded img" src={BaseballRight} height="275" />
            </div>
          </div>
        </div>

        <div className="col-1"></div>
        <div className="col-lg-6">
          <h2 className="mb-5">
            <strong>How It Works</strong>
          </h2>
          <div className="mt-5 border-bottom border-secondary pb-3">
            <img className="position-absolute ml-n5" src={football} />
            <h4>Pick your sports</h4>
            <p>Filter and Browse by one of our 8 available sports</p>
          </div>
          <div className="mt-4 border-bottom border-secondary pb-3">
            <img className="position-absolute ml-n5" src={lens} />
            <h4>Find the perfect coaching and training </h4>
            <p>
              Browse upcoming training sessions and our top college athletes to
              find your perfect coach.
            </p>
          </div>
          <div className="mt-4 border-bottom border-secondary pb-3">
            <img className="position-absolute ml-n5" src={calendar} />
            <h4>Book and pay</h4>
            <p>Schedule, book and pay with just a few clicks</p>
          </div>
          <div className="mt-4">
            <img className="position-absolute ml-n5" src={chat} />
            <h4>Easy communication</h4>
            <p>
              Ask athletes questions, receive feedback from your training
              session or request additional workout or drills
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
