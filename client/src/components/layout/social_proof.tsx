import React from 'react';
import newsJournal from '../../assets/landingpage/optimized/news-journal.jpeg';
import nyTimes from '../../assets/landingpage/optimized/nytimes.jpeg';
import pensocala from '../../assets/landingpage/optimized/pensocala.jpeg';
import sbj from '../../assets/landingpage/optimized/sbj.jpeg';
import times from '../../assets/landingpage/optimized/times.jpeg';

const SocialProof = () => {
  return (
    <section className="socialproof-section py-4 container mx-auto d-lg-flex justify-content-center justify-content-lg-between row align-items-center">
      <img className="col-4 col-lg-2 my-2" src={sbj} height="40" />
      <img className="col-4 col-lg-2 my-2" src={times} height="40" />
      <img className="col-4 col-lg-2 my-2" src={nyTimes} height="40" />
      <img className="col-lg-4 col-2 my-2" src={pensocala} height="35" />
      <img
        className="my-2"
        style={{ display: 'block', height: '70px', width: '100px' }}
        src={newsJournal}
      />
    </section>
  );
};

export default SocialProof;
