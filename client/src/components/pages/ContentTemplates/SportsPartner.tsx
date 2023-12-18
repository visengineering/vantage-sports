import React, { FC, useState } from 'react';
import * as assets from '../../../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const ReadandLess: FC = ({ children }) => {
  const [isReadMoreShown, setIsReadMoreShow] = useState(false);
  const toggleBtn = () => {
    setIsReadMoreShow((prevState) => !prevState);
  };

  return (
    <>
      {isReadMoreShown ? children : `${children}`.slice(0, 121)}
      <span className="read-more" onClick={toggleBtn}>
        {!isReadMoreShown ? ' ...Read More' : ' Read Less'}
      </span>
    </>
  );
};

const SportPartner = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container position-relative">
          <div className="content-img">
            <h1 className="heading">Vantage Sports Partnerships</h1>
          </div>
        </div>
      </section>
      <section className="card-section">
        <div className="container">
          <div className="row">
            <div className="title">
              <h1>College Athlete Partners</h1>
            </div>
          </div>
          <div className="testimonial-block">
            <div className="testimonial">
              <div className="img-container">
                <img src={assets.athloAgncy} alt="Athlo Agency" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Athlo Agency</h2>

                <p className="article">
                  Athlo agncy combines purpose + performance to create authentic
                  likeability for more impactful NIL alignment
                </p>
                <a
                  className="learn-btn"
                  href="https://www.athloagncy.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.athliance} alt="Athliance" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Athliance</h2>

                <p className="article">
                  <ReadandLess>
                    Athliance’s proprietary NIL education and opportunity
                    management software empowers compliance departments to
                    operate more efficiently in the new world of college
                    athletics. Their tools and resources allow Universities to
                    maintain current staff levels by automating the
                    communication and workflow of every single opportunity
                    presented to student-athletes, start-to-finish. Their
                    solution mitigates NIL risks and protects scholarships,
                    sponsorships, and post-season appearances. Furthermore,
                    their real-time reporting provides valuable data and
                    insights for marketing and recruiting purposes.
                  </ReadandLess>
                </p>

                <a
                  className="learn-btn"
                  href="https://athliance.co/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.inflcr2} alt="Inflcr" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Inflcr</h2>

                <p className="article">
                  The leading NIL compliance and education platform used by
                  67,000 college athletes including major power conference
                  schools.
                </p>

                <a
                  className="learn-btn"
                  href="https://www.inflcr.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="card-section">
        <div className="container">
          <div className="row">
            <div className="title">
              <h1>Parents, Youth and High School Athletes</h1>
            </div>
          </div>
          <div className="testimonial-block">
            <div className="testimonial">
              <div className="img-container">
                <img src={assets.captainUstatsports} alt="Captain U" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Captain U</h2>

                <p className="article">
                  <ReadandLess>
                    CaptainU is a recruiting database which customizes
                    athlete&apos;s profiles and gives them the access to contact
                    100% of collegiate coaches. CaptainU lets YOU be in control
                    of your recruiting process.
                  </ReadandLess>
                </p>
                <a
                  className="learn-btn"
                  href="https://stacksports.captainu.com/homepage/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.qwikCut} alt="Qwik Cuts" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Qwik Cuts</h2>

                <p className="article">
                  <ReadandLess>
                    QwikCut is the fastest-growing sports video management
                    solution in the country. Coaches, trainers, and athletes
                    utilize our cloud-based software to facilitate film review,
                    video storage, game analytics, highlight editing, and
                    recruiting support for any sport. Use a browser or the
                    mobile app, for anywhere, anytime access. Take a few minutes
                    to check out QwikCut and see why more users are switching to
                    QwikCut than ever before. Get a better platform, better
                    customer service, and a better price, guaranteed. For more
                    information visit their website at&nbsp;
                    <a
                      href="https://www.qwikcut.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary"
                    >
                      QwikCut.com
                    </a>
                    &nbsp;or call&nbsp;
                    <a className="text-primary" href="tel:+407-768-2011">
                      407-768-2011
                    </a>
                    .
                  </ReadandLess>
                </p>

                <a
                  className="learn-btn"
                  href="https://www.qwikcut.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>

            <div className="testimonial">
              <div className="img-container">
                <img src={assets.bb} alt="Baseball Blue Books" />
              </div>
              <div className="card-text-body">
                <h2 className="card-title">Baseball Blue Books</h2>

                <p className="article">
                  <ReadandLess>
                    The Baseball Bluebook App is a baseball-only network for
                    Players, Coaches, and the baseball community. Build your
                    profile, find contacts, connect, network, and find your next
                    playing opportunity. <br /> Since 1909, we have been
                    providing contact and baseball information to scouts,
                    coaches, MLB personnel, and players. We are now ready to
                    promote and connect Vantage Sports players everywhere!
                  </ReadandLess>
                </p>

                <a
                  className="learn-btn"
                  href="https://www.baseballbluebook.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="learn-more">learn more</span>
                  <FontAwesomeIcon
                    className="arrow"
                    icon={faArrowRight as any}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SportPartner;
