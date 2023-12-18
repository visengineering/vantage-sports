import React from 'react';
import { Button } from 'react-bootstrap';

const CheckCoachesTraining = () => {
  return (
    <>
      <section className="cta-section text-center py-5 bg-banner sections">
        <h2 className="">
          <strong>College athlete training sessions for you</strong>
        </h2>
        <div className="mt-5">
          <Button
            href="/coaches"
            className="ml-2 btn-lg my-2"
            variant="primary"
          >
            Check out our Coaches
          </Button>
          <Button
            href="/sports-coaching"
            className="ml-2 btn-lg my-2"
            variant="primary"
          >
            Check out our Available Training
          </Button>
        </div>
      </section>
    </>
  );
};

export default CheckCoachesTraining;
