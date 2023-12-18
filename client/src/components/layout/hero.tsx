import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import video from '../../assets/VantageSportsPromo_V4.mp4';
import videoPoster from '../../assets/optimized/video-poster.jpeg';
import SignUpInModal from '../pages/SignUpIn/SignUpInModal';

const Hero = () => {
  const [showSignUpInModal, setShowSignUpInModal] = useState<string>('');

  return (
    <>
      {showSignUpInModal && (
        <SignUpInModal
          showModalFor={showSignUpInModal}
          setShowModalFor={setShowSignUpInModal}
          handlePurchaseBtnClick={() => {}}
        />
      )}
      <section className="hero-section text-lg-left text-center">
        <div className="container col-xxl-8 px-4 py-5">
          <div className="row flex-lg-row align-items-center g-5 py-5 justify-content-between">
            <div className="col-lg-6">
              <h1 className="title text-dark lh-1 mb-3">
                Elevate your game by training with a current college athlete
              </h1>
              <p className="fs-3 mt-4 font-weight-medium">
                Private coaching and recruiting advice from current college
                athletes
              </p>
              <Button
                className="btn-primary btn-lg font-weight-medium mt-3 d-inline-block px-5"
                onClick={() => setShowSignUpInModal('signup')}
              >
                Join Today
              </Button>
            </div>
            <video
              className="rounded-lg shadow mx-auto mx-lg-0 mt-5 mt-lg-0 mw-100"
              style={{ objectFit: 'cover' }}
              width="450"
              src={video}
              poster={videoPoster}
              controls
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
