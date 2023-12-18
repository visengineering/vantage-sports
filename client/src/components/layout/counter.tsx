import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import video from '../../assets/VantageSportsPromo_V4.mp4';
import athlete from '../../assets/athlete.svg';
import play from '../../assets/play.svg';
import sport from '../../assets/sport.svg';
import university from '../../assets/university.svg';
import video_poster from '../../assets/optimized/video-poster.jpeg';

const Counter = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="counter-section">
      <div className="container">
        <h1 className="title">Welcome to Vantage Sports!</h1>
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="text">
              Vantage Sports is the marketplace where current college athletes
              host private training sessions for aspiring college athletes and
              post instructional videos
            </div>
          </div>

          <div className="col-lg-9 mx-auto">
            <div className="counter-container">
              <div className="counter-content">
                <div className="icon">
                  <img src={athlete} alt="icon" />
                </div>

                <div className="content">
                  <div className="count">156</div>
                  <div className="lbl">Athletes</div>
                </div>
              </div>

              <div className="counter-content">
                <div className="icon">
                  <img src={university} alt="icon" />
                </div>

                <div className="content">
                  <div className="count">48</div>
                  <div className="lbl">Universities</div>
                </div>
              </div>

              <div className="counter-content">
                <div className="icon">
                  <img src={sport} alt="icon" />
                </div>

                <div className="content">
                  <div className="count">8</div>
                  <div className="lbl">Sports</div>
                </div>
              </div>
            </div>
            <div className="row d-flex justify-content-center flex-nowrap">
              <Button
                href={'/sports-coaching'}
                className="join-button"
                variant="light"
              >
                Available Training
              </Button>
            </div>

            <div className="video-presentation">
              <br />
              <video
                id="video"
                ref={videoRef}
                width="100%"
                height="auto"
                onEnded={() => {
                  if (playButtonRef && playButtonRef.current) {
                    playButtonRef.current!.style.display = 'inline';
                  }
                  if (videoRef && videoRef.current) {
                    videoRef.current!.currentTime = 0;
                    videoRef.current!.load();
                  }
                }}
                poster={video_poster}
                src={video}
              />

              <button
                type="button"
                ref={playButtonRef}
                className="btn btn-play"
              >
                <img
                  src={play}
                  className="img-fluid"
                  alt="play icon"
                  onClick={() => {
                    if (videoRef && videoRef.current) {
                      videoRef.current.play();
                    }
                    if (playButtonRef && playButtonRef.current) {
                      playButtonRef.current.style.display = 'none';
                    }
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
