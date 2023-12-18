import React from 'react';

const JoinTeam = () => {
  return (
    <section className="join-team-section py-5 text-center container mx-auto img-bg my-5 rounded-lg">
      <h2 className="text-white my-4">
        <strong>Join the team</strong>
      </h2>
      <div className="mt-4">
        <a
          href="/signup"
          className="mr-2 btn-primary btn-lg my-2 d-inline-block"
        >
          Start Coaching
        </a>
        <a
          href="/signup"
          className="ml-2 btn-light btn-lg text-primary my-2 d-inline-block"
        >
          Start Training
        </a>
      </div>
    </section>
  );
};

export default JoinTeam;
